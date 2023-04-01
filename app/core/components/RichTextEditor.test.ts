import { fillInLoginFormSubmitAndWaitForHomePage } from "../../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { test, expect } from "../../../test/baseFixtures"

test("editing item", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit Chock Wheels"]')

  await Promise.all([
    page.waitForResponse("**/updateChildrenOrder"),
    await page.click('[aria-label="Move Down"]'),
  ])

  await page.waitForTimeout(1000)

  await page.reload()

  const [, secondElement] = await page.$$(
    'h2:has-text("Chock Wheels"), h2:has-text("Gather Tools")',
  )

  expect(await secondElement?.textContent()).toBe("Chock Wheels")
})

test("adding child item", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/how-to-trim-hedges")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit How to Trim Hedges"]')

  /**
   * Keep a delay here to accurately simulate a real user. Hit a bug where the
   * modal closed immediately after opening, but the test passed because the
   * next step happened before the modal auto closed itself
   */
  await page.click('[aria-label="Add child to How to Trim Hedges"]', {
    delay: 300,
  })

  await page.click(':text("Create New Item")')

  // suspect modal animation may be causing this to fail without the timeout
  await page.waitForTimeout(300)

  await page.type(
    '[aria-label="Title for new item"]',
    "Cut them with a Trimmer",
  )

  await Promise.all([
    page.click('[aria-label="Save Cut them with a Trimmer"]'),
    page.waitForResponse(
      (resp) => resp.url().includes("createChild") && resp.status() === 200,
    ),
  ])

  await page.reload()

  expect(
    await page.waitForSelector(':text("Cut them with a Trimmer")'),
  ).toBeTruthy()
})
