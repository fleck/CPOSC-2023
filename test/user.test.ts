import { test, expect } from "./baseFixtures"
import { fillInLoginFormSubmitAndWaitForHomePage } from "./fillInLoginFormSubmitAndWaitForHomePage"

test("navigate to account page and login", async ({ page }) => {
  await page.goto("http://localhost:8080/")

  await page.locator('text="Account"').click()

  await page.locator('text="Login"').click()

  expect(await fillInLoginFormSubmitAndWaitForHomePage(page)).toBeTruthy()
})
