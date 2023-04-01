import type { IndexerType } from "../../../db"
import * as z from "zod"

/**
 * The literal and type IndexerType is used in the main repo and this package.
 * But, including the literal in both projects is a bit of a pain. So we are
 * duplicating the literal here, but checking that it matches in the IIFE
 * below to prevent drift.
 */
const IndexerLiteral = {
  CSS: "CSS",
  XPATH: "XPATH",
  JSON: "JSON",
  TEXT: "TEXT",
} as const

;(function checkIfIndexerTypesMatch(_: typeof IndexerType) {})(IndexerLiteral)

export const selectorsSchema = z.array(z.object({ selector: z.string() }))

export const replacementsSchema = z.array(
  z.object({ search: z.string(), replacement: z.string().optional() }),
)

const IndexerBase = {
  name: z.string(),
  hostname: z.string(),
  pathExtension: z.string().optional(),
  decimalPlaces: z.number().nullable().optional(),
  selector: z.string().optional(),
  cookie: z.string().optional(),
  indexType: z.enum(Object.keys(IndexerLiteral) as [IndexerType]),
  apiId: z.number().nullable().optional(),
  postProcessor: z.string().optional(),
  nextIndexerId: z.number().or(z.string()).nullable().optional(),
  selectorToClick: z.string().optional(),
  searchParams: z.any({}).optional(),
  decodeUrl: z.boolean().optional(),
  keepOldValue: z.boolean().optional(),
  secondsBetweenUpdates: z.number().optional(),
  requestHeaders: z.any({}).optional(),
  selectors: selectorsSchema.optional(),
  replacements: replacementsSchema.optional(),
}

export const IndexerCreate = z.object(IndexerBase)

export const ClientSideIndexer = z.object({
  ...IndexerBase,
  id: z.number().optional(),
})

export const UpdateIndexer = z.object({ ...IndexerBase, id: z.number() })
