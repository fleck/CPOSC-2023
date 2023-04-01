import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const CreateDatum = z.object({
  key: z.string(),
  value: z.number().array(),
})

export default resolver.pipe(
  resolver.zod(CreateDatum),
  resolver.authorize(),
  async (input) => {
    const { key, value } = input

    const setting = await db.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })

    return setting
  },
)
