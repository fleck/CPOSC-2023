import { fillInLoginFormSubmitAndWaitForHomePage } from "../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { expect, test } from "../../test/baseFixtures"

test("edit indexer page", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/indexers")

  await page.click('text="Edit"')

  await expect(page.locator('text="Update Indexer"')).toBeVisible()
})
