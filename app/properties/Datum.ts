import * as z from "zod"

const itemId = z.number()

const baseDatum = {
  name: z.string(),
  text: z.string(),
  fileId: z.string().optional().nullable(),
  itemId,
  featured: z.boolean().optional(),
  position: z.number().optional().nullable(),
  global: z.boolean().optional(),
  dynamic: z.boolean().optional(),
  group: z.string().optional(),
  digitsAfterDecimal: z.number().optional().nullable(),
  prefix: z.string().optional(),
  postfix: z.string().optional(),
  url: z.string().optional(),
  indexerId: z.number().or(z.string()).optional().nullable(),
}

export const CreateDatum = z.object(baseDatum)

const id = z.bigint().or(z.string())

export const UpdateDatum = z.object({ ...baseDatum, id })

export const DeleteDatum = z.object({ id, itemId })
