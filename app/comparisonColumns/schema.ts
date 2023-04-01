import { Align } from "db"
import * as z from "zod"

export const comparisonColumnSchema = z.object({
  id: z.bigint().or(z.string()).optional(),
  itemId: z.number(),
  name: z.string(),
  position: z.number().nullable().optional(),
  subject: z.boolean().optional(),
  align: z.enum(Object.keys(Align) as [Align]),
})
