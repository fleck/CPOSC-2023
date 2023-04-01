import { fillInLoginFormSubmitAndWaitForHomePage } from "../../../../test/fillInLoginFormSubmitAndWaitForHomePage"
import { test, expect } from "../../../../test/baseFixtures"

test("editing property", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit Property Oil Price"]')

  await Promise.all([
    page.click('text="Move Down"'),
    page.waitForResponse(
      (resp) =>
        resp.url().includes("updatePropertyOrder") && resp.status() === 200,
    ),
  ])

  await page.reload()

  const [, secondElement] = await page.$$(
    'dt:has-text("Oil Price"), dt:has-text("Filter Price")',
  )

  expect((await secondElement?.textContent())?.trim()).toBe("Oil Price")
})

test("adding image", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.locator('[aria-label="Add Featured Properties"]').click()

  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator('text="Upload a file"').click(),
  ])

  await fileChooser.setFiles(__dirname + "/Dish_of_blueberries.jpeg")

  await page.click('label:has-text("name")')

  await page.keyboard.type("Blueberries")

  await page.waitForSelector('text="done uploading"')

  await page.click('button:has-text("Update")')

  await page.waitForSelector('h2:has-text("Blueberries")')

  await page.goto("http://localhost:8080")

  await page.waitForSelector('img[alt="Dish_of_blueberries.jpeg"]')
})

test("deleting property", async ({ page }) => {
  await page.goto("http://localhost:8080/user/login")

  await fillInLoginFormSubmitAndWaitForHomePage(page)

  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  await page.click('text="Edit"')

  await page.click('[aria-label="Edit Property Outdated thing"]')

  await page.click('text="Delete"')

  await Promise.all([
    page.click('text="Delete property"'),
    page.waitForResponse(
      (resp) => resp.url().includes("deleteProperty") && resp.status() === 200,
    ),
  ])

  await page.reload()

  await expect(page.locator('text="NaN"')).toHaveCount(0)
})
