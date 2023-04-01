import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"

import db from "db"
import { DeleteDatum } from "../Datum"
import { resolver } from "@blitzjs/rpc"

export default resolver.pipe(
  resolver.zod(DeleteDatum),
  resolver.authorize(),
  async (input) => {
    const { itemId, id } = input

    const datum = await db.datum.findFirst({
      where: { properties: { some: { id: BigInt(id) } } },
      select: { properties: { select: { id: true } }, id: true },
    })

    const deleted = await db.$transaction([
      db.property.delete({ where: { id: BigInt(id) } }),
      ...(datum && Number(datum?.properties?.length) === 1
        ? [db.datum.delete({ where: { id: datum.id } })]
        : []),
    ])

    await findItemByIdAndClearCache(itemId)

    return deleted
  },
)
