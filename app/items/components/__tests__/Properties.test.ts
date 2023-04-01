import { fillInLoginFormSubmitAndWaitForHomePage } from "../../../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { test, expect } from "../../../../test/baseFixtures"

test("computed properties", async ({ page }) => {
  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await expect(page.locator(':text("Total Price 13.98")')).toBeVisible()

  await expect(page.locator("text=Oil Price $10")).toBeVisible()

  await expect(page.locator(':text("Total time 25 minutes")')).toBeVisible()
})

test("auto updating properties", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit Property rating"]')

  // Wait for websocket to open
  await page.waitForTimeout(1000)

  await page.click('text="Update"')

  expect(await page.waitForSelector(':text("8.4")')).toBeTruthy()
})
