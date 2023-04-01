import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"
import { resolver } from "@blitzjs/rpc"
import db from "db"

import { comparisonColumnSchema } from "../schema"

export default resolver.pipe(
  resolver.zod(comparisonColumnSchema),
  resolver.authorize(),
  async ({ id, ...input }) => {
    const comparisonColumn = await db.comparisonColumn.delete({
      where: { id: typeof id === "string" ? BigInt(id) : id },
    })

    await findItemByIdAndClearCache(input.itemId)

    return comparisonColumn
  },
)
