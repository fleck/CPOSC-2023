import { findItemByIdAndClearCache } from "app/items/mutations/upsertItem"

import db from "db"
import { UpdateDatum } from "../Datum"
import { browsers } from "app/sockets"
import sample from "lodash/sample"
import type { Job } from "packages/indexer/src/types"
import { getData } from "../getData"
import { resolver } from "@blitzjs/rpc"
import { ChildItem } from "app/items/queries/getRootItem"

export default resolver.pipe(
  resolver.zod(UpdateDatum),
  resolver.authorize(),
  async (input, ctx) => {
    const { itemId, featured, position, id, ...otherInputs } = input

    const property = await db.property.update({
      data: {
        datum: {
          update: {
            ...otherInputs,
            indexerId: otherInputs.indexerId
              ? Number(otherInputs.indexerId)
              : null,
            fileId: otherInputs.fileId ? Number(otherInputs.fileId) : null,
          },
        },
        item: { connect: { id: itemId } },
        featured,
        position,
      },
      include: {
        datum: { include: { image: true, indexer: true } },
      },
      where: { id: BigInt(id) },
    })

    await findItemByIdAndClearCache(itemId)

    await reIndex(property, ctx.session.userId)

    return property
  },
)

async function reIndex(
  property: ChildItem["properties"][number],
  userId: number,
) {
  if (property.datum.indexer && property.datum.url) {
    const browser = sample([...browsers.values()])

    if (!browser) {
      throw new Error("No Browsers available to perform index")
    }

    const job: Job = {
      url: property.datum.url,
      queue: "single",
      notify: [userId],
      dataToIndex: await getData(property),
    }

    browser.send(JSON.stringify(job))
  }
}
