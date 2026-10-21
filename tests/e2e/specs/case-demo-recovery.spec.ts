import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('Flow Redo invalidates a pending lunch proposal without reverting the restored review', async ({ page }) => {
  await page.goto('/work/flow#try');
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  const demo = page.locator('#demo');
  const review = demo.locator('.ev[data-id="review"]');
  const lunch = demo.locator('.ev[data-id="lunch0"]');
  const yes = demo.getByRole('button', { name: 'Yes', exact: true });
  const moveReview = demo.getByRole('button', { name: 'Clean: Move design review to 1:30pm.', exact: true });
  const moveLunch = demo.getByRole('button', { name: 'Correction: Move lunch to 1:30pm.', exact: true });

  await moveReview.click();
  await yes.click();
  await expect(review).toHaveAttribute('aria-label', 'Design review, 13:30-14:30');
  await demo.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(review).toHaveAttribute('aria-label', 'Design review, 10:00-11:00');
  await moveLunch.click();
  await expect(yes).toBeEnabled();
  await expect(demo.locator('.ghost')).toContainText('Lunch');
  await demo.getByRole('button', { name: 'Redo', exact: true }).click();

  await expect(review).toHaveAttribute('aria-label', 'Design review, 13:30-14:30');
  await expect(lunch).toHaveAttribute('aria-label', 'Lunch, 12:30-13:15');
  await expect(yes).toHaveCount(0);
  await expect(demo.locator('.ghost')).toHaveCount(0);
  await expect(demo.locator('#log')).toContainText('dropped because Redo changed the calendar');

  // Resubmission must validate against the redone review, not the obsolete draft.
  await moveLunch.click();
  await expect(demo.locator('#log')).toContainText('would overlap Design review');
  await expect(demo.getByRole('button', { name: 'Leave it', exact: true })).toBeEnabled();
  await expect(yes).toHaveCount(0);
  await expect(review).toHaveAttribute('aria-label', 'Design review, 13:30-14:30');
  await expect(lunch).toHaveAttribute('aria-label', 'Lunch, 12:30-13:15');
});

test('Second Voice consumes the next-request failure and Retry restores the submitted rewrite', async ({ page }) => {
  await page.goto('/work/second-voice#try');
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase','idle');
  const workspace = page.getByRole('region', { name: 'Rewrite workspace' });
  const result = workspace.locator('#mv');
  const accessibleResult = result.locator('.diff-accessible');
  const originalRewrite = await accessibleResult.innerText();
  const failure = workspace.getByRole('checkbox', { name: 'Make the next request fail' });

  await workspace.getByRole('radio', { name: 'Spare', exact: true }).click();
  await workspace.getByRole('radio', { name: 'Light', exact: true }).click();
  await failure.check();
  await workspace.getByRole('button', { name: 'Rewrite', exact: true }).click();
  await expect(workspace.locator('#notice')).toContainText("The request didn't complete.");
  await expect(failure).not.toBeChecked();
  await expect(accessibleResult).toHaveText(originalRewrite);
  await expect(workspace.locator('#runTag')).toHaveText('Run 1');

  // Retry uses the failed request's settings even if the controls have changed.
  await workspace.getByRole('radio', { name: 'Lyrical', exact: true }).click();
  await workspace.getByRole('radio', { name: 'Strong', exact: true }).click();
  await workspace.getByRole('button', { name: 'Retry Spare, light', exact: true }).click();
  await expect(workspace.locator('#runTag')).toHaveText('Run 3');
  await expect(workspace.locator('#resultTag')).toHaveText('Spare, light');
  await expect(workspace.locator('#retry')).toHaveCount(0);
  await workspace.getByRole('radio', { name: 'Rewrite', exact: true }).click();
  await expect(accessibleResult).toHaveText('The street was empty when she got there. She waited by the door and checked her phone.');
});
