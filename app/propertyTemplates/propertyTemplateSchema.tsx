import { z } from "zod"
import { bigint } from "./bigint"

export const propertyTemplateSchema = z.object({
  id: bigint,
  name: z.string(),
  hostnames: z.array(z.string()),
  properties: z.array(
    z.object({
      id: bigint,
      featured: z.coerce.boolean(),
      position: z.coerce.number().optional(),
      datum: z.object({
        id: z.coerce.number(),
        name: z.string(),
        text: z.string(),
        group: z.string(),
        dynamic: z.coerce.boolean(),
        digitsAfterDecimal: z
          .string()
          .or(z.number())
          .optional()
          .transform((value) => (value ? Number(value) : undefined)),
        prefix: z.string().optional(),
        postfix: z.string().optional(),
        global: z.coerce.boolean(),
        indexerId: z.coerce
          .number()
          .optional()
          .transform((value) => (Number(value) > 0 ? value : undefined)),
      }),
    }),
  ),
})
