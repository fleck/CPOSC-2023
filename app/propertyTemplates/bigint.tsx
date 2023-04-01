import { z } from "zod"

export const bigint = z
  .any()
  .transform((value) => {
    try {
      return BigInt(value)
    } catch (error) {
      return value
    }
  })
  .pipe(z.bigint())
