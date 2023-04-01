import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const DeleteChild = z.object({
  id: z.number(),
  item_id: z.number().or(z.string()),
})

export default resolver.pipe(
  resolver.zod(DeleteChild),
  resolver.authorize(),
  async ({ id, item_id }) => {
    await findItemByIdAndClearCache(Number(item_id))

    const child = await db.child.deleteMany({ where: { id } })

    return child
  },
)
