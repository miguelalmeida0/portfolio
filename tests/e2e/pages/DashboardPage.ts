import { expect, type Locator, type Page } from '@playwright/test';

import { homeHeroHeading, selectedWork, visitorFlows } from '../fixtures/testData';

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
    return this.page.locator('[data-project-tile]').nth(index);
  }

  visitorOption(option: keyof typeof visitorFlows): Locator {
    return this.page.getByTestId(`visitor-option-${option}`);
  }

  async expectLandingContent() {
    await expect(this.page.getByRole('heading', { name: homeHeroHeading })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Explore my work' })).toBeVisible();

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
