import { test, expect } from "../test/baseFixtures"

test("navigate to item page with no properties", async ({ page }) => {
  await page.goto("http://localhost:8080/jack-up-prius")

  expect(
    await page.waitForSelector('h1:has-text("Jack Up Prius")'),
  ).toBeTruthy()

  expect(await page.$('text="Properties"')).toBeNull()
})

test("content displays correctly", async ({ page }) => {
  await page.goto("http://localhost:8080/Change-Oil-in-a-Prius")

  expect(
    await page.$(
      'p:has-text("All the steps and supplies needed to change the oil in a Prius. This is for a second generation Prius 2005-2010.")',
    ),
  ).toBeTruthy()

  expect(await page.$('strong:has-text("Prius")')).toBeTruthy()
})

test("non standalone pages should not display unless logged in", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/a-non-standalone-step")

  expect(
    await page.$(`text="We can't find the page you're looking for"`),
  ).toBeTruthy()
})

test("should redirect to new URL", async ({ page }) => {
  const response = await page.goto("http://localhost:8080/oldUrl")

  const redirect = await response?.request()?.redirectedFrom()?.response()

  expect(redirect?.status()).toBe(301)

  expect(response?.url()).toBe("http://localhost:8080/Change-Oil-in-a-Prius")
})

test("should redirect wrong case URL to proper case", async ({ page }) => {
  const response = await page.goto(
    "http://localhost:8080/change-oil-in-a-prius",
  )

  const redirect = await response?.request()?.redirectedFrom()?.response()

  expect(redirect?.status()).toBe(301)

  expect(response?.url()).toBe("http://localhost:8080/Change-Oil-in-a-Prius")
})

test("min function in calculated properties should return lowest value", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/change-oil-in-a-prius")

  expect(
    await page
      .locator('dt:has-text("Filter Price") + dd:has-text("3.98")')
      .textContent(),
  ).toBe("3.98")
})
