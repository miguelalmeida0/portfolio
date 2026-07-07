import { expect, type Locator, type Page } from '@playwright/test';

import { selectedWork, visitorFlows } from '../fixtures/testData';

export class DashboardPage {
  constructor(readonly page: Page) {}

  get visitorInput() {
    return this.page.getByLabel('Choose visitor path');
  }

  get visitorHelp() {
    return this.page.locator('#visitor-input-help');
  }

  get visitorFlow() {
    return this.page.getByTestId('visitor-flow');
  }

  get resetVisitorFlowButton() {
    return this.page.getByTestId('visitor-flow-reset');
  }

  selectedWorkCard(index: number): Locator {
    return this.page.getByTestId(`selected-work-card-${index}`);
  }

  visitorOption(option: keyof typeof visitorFlows): Locator {
    return this.page.getByTestId(`visitor-option-${option}`);
  }

  async expectLandingContent() {
    await expect(this.page.getByText('Berlin-based Frontend Engineer')).toBeVisible();
    await expect(this.page.getByAltText('Miguel Almeida in red studio light against a black background')).toBeVisible();
    await expect(this.page.getByText('3+')).toBeVisible();
    await expect(this.page.getByText('1000s')).toBeVisible();

    for (const [index, cardTitle] of selectedWork.entries()) {
      await expect(this.selectedWorkCard(index)).toContainText(cardTitle);
    }
  }

  async chooseVisitor(option: keyof typeof visitorFlows) {
    await this.visitorOption(option).click();
  }

  async expectVisitorFlow(option: keyof typeof visitorFlows) {
    const flow = visitorFlows[option];
    await expect(this.visitorFlow).toBeVisible();
    await expect(this.visitorFlow).toContainText(flow.greeting);

    for (const cta of flow.ctas) {
      await expect(this.visitorFlow.getByRole('link', { name: cta })).toBeVisible();
    }
  }

  async submitVisitorInput(value: string) {
    await this.visitorInput.fill(value);
    await this.visitorInput.press('Enter');
  }
}
