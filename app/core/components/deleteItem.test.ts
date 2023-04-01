import { fillInLoginFormSubmitAndWaitForHomePage } from "../../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { test, expect } from "../../../test/baseFixtures"

test("editing item", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/test-cascade")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit test cascade"]')

  await page.click('[aria-label="Delete test cascade"]')

  await Promise.all([
    page.waitForResponse("**/deleteItem"),
    page.click('text="Delete item"'),
  ])

  await page.waitForTimeout(2000)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  expect(await page.$('h2:has-text("test cascade")')).toBeNull()
})
