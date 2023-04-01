import { Page } from "@playwright/test"

export async function fillInLoginFormSubmitAndWaitForHomePage(page: Page) {
  await page.locator(`[placeholder="Email"]`).fill("jay@test.co")

  await page.locator(`[placeholder="Password"]`).fill("letsTest10")

  await page.locator('button:has-text("Sign in")').click()

  return page.waitForSelector('text="The Best Comparisons and Guides"')
}
