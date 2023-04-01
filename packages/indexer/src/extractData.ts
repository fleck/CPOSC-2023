import type { Page } from "puppeteer"
import type { DataToIndex } from "app/properties/getData"
import { replacementsSchema, selectorsSchema } from "./IndexerSchema"
import { parse } from "@babel/parser"
import { Indexer } from "db"
import get from "lodash/get"

const extractDataFromPage = async (
  page: Page,
  { indexer, id }: DataToIndex[number],
) => {
  const parsedSelectors = selectorsSchema.safeParse(indexer?.selectors)

  if (!parsedSelectors.success) {
    return {
      id,
      value: "",
      error: `No selectors could be found for indexer ${indexer?.id}`,
    }
  }

  for (const { selector } of parsedSelectors.data) {
    const element = await page.waitForSelector(selector)

    const textContent = await element?.evaluate((el) => el.textContent)

    if (!textContent) continue

    return { id, value: textContent, error: "" }
  }

  return { id, value: "", error: "no value could be found" }
}

const processData = async (
  indexer: DataToIndex[number]["indexer"],
  extractedDatum: ExtractedDatum,
) => {
  let { value } = extractedDatum

  const replacements = replacementsSchema.safeParse(indexer?.replacements)

  replacements.success &&
    replacements.data.forEach(({ search, replacement = "" }) => {
      try {
        const statement = parse(search).program.body[0]
        if (
          statement?.type === "ExpressionStatement" &&
          statement.expression.type === "RegExpLiteral"
        ) {
          value = value.replace(
            new RegExp(
              statement.expression.pattern,
              statement.expression.flags,
            ),
            replacement,
          )
        } else {
          throw new Error("string doesn't parse to regex")
        }
      } catch (e) {
        value = value.replace(search, replacement)
      }
    })

  if (indexer?.slice) {
    const [start, end] = indexer.slice.split(",").map(Number)
    value = value.slice(start, end)
  }

  return { ...extractedDatum, value }
}

const extractDataFromString = async (
  datum: ExtractedDatum,
  indexer: Indexer & {
    nextIndexer: Indexer | null
  },
) => {
  try {
    if (indexer.indexType === "JSON") {
      const parsedSelectors = selectorsSchema.safeParse(indexer.selectors)
      if (!parsedSelectors.success) {
        return {
          ...datum,
          error: `No selectors could be found for indexer ${indexer.id}`,
        }
      }

      const r = JSON.parse(datum.value)

      for (const { selector } of parsedSelectors.data) {
        const result = get(r, selector)

        if (!result) continue

        return { ...datum, value: String(result) }
      }

      return { ...datum, error: "no value could be found" }
    }

    return { ...datum, error: "next indexer indexType may only be 'JSON'" }
  } catch (error) {
    if (error instanceof Error) {
      return { ...datum, error: error.message }
    } else {
      console.error(error)
      return { ...datum, error: "unknown error, check indexer logs" }
    }
  }
}

export const extractAndProcessData = (page: Page, dataToIndex: DataToIndex) =>
  Promise.all(
    dataToIndex.map(async (datumToIndex) => {
      const extractedDatum = await extractDataFromPage(page, datumToIndex)

      let refinedDatum = await processData(datumToIndex.indexer, extractedDatum)

      if (datumToIndex.indexer?.nextIndexer) {
        refinedDatum = await extractDataFromString(
          refinedDatum,
          datumToIndex.indexer.nextIndexer,
        )

        refinedDatum = await processData(datumToIndex.indexer, refinedDatum)
      }

      return refinedDatum
    }),
  )

type ExtractedDatum = Awaited<ReturnType<typeof extractDataFromPage>>

export type ExtractedData = Awaited<ReturnType<typeof extractAndProcessData>>
