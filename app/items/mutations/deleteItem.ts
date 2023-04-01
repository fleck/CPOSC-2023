import { resolver } from "@blitzjs/rpc"

import db from "db"
import * as z from "zod"
import { findItemByIdAndClearCache } from "./upsertItem"

const DeleteItem = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteItem),
  resolver.authorize(),
  async ({ id }) => {
    const deletedStuff = await db.item.deleteMany({ where: { id } })

    await findItemByIdAndClearCache(id)

    return deletedStuff
  },
)
