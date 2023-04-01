import { test, expect } from "./baseFixtures"
import { fillInLoginFormSubmitAndWaitForHomePage } from "./fillInLoginFormSubmitAndWaitForHomePage"

test("search", async ({ page }) => {
  await page.goto("http://localhost:8080/")

  const search = page.locator(`[placeholder="Search"]`)

  await search.fill("change oil")

  const navigation = page.waitForNavigation()

  await page.keyboard.down("Enter")

  await navigation

  expect(await page.$('text="Change Oil in a Prius"')).toBeTruthy()
})

test("search and create new item", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/")

  await page.locator(`[placeholder="Search"]`).fill("best snowboard")

  await Promise.all([page.waitForNavigation(), page.keyboard.down("Enter")])

  await page.click('text="Create Item"')

  await Promise.all([
    page.click('[aria-label="Save best snowboard"]'),
    page.waitForResponse(
      (resp) => resp.url().includes("upsertItem") && resp.status() === 200,
    ),
    page.waitForNavigation(),
  ])

  await page.waitForSelector('h1:has-text("best snowboard")')

  // Should be able to perform search for item, ran into a bug where new items weren't set to not be standalone and couldn't be found via search
  await page.locator(`[placeholder="Search"]`).fill("best snowboard")

  await Promise.all([page.waitForNavigation(), page.keyboard.down("Enter")])

  // next JS local cache may have the search page cached in memory, a refresh is needed to clear the cache
  await page.reload()

  await page.waitForSelector('h3:has-text("best snowboard")')
})
