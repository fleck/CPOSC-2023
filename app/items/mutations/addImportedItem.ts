import { resolver } from "@blitzjs/rpc"

import db from "db"
import * as z from "zod"
import { findItemByIdAndClearCache } from "./upsertItem"

export default resolver.pipe(
  resolver.zod(
    z.object({
      id: z.number(),
      itemIdToImport: z.number(),
    }),
  ),
  resolver.authorize(),
  async ({ id, itemIdToImport }) => {
    const updatedItem = await db.item.update({
      where: { id },
      data: { importedItems: { connect: [{ id: itemIdToImport }] } },
    })

    await findItemByIdAndClearCache(id)

    return updatedItem
  },
)
