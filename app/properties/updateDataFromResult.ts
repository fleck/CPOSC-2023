import type { Result } from "packages/indexer/src/types"
import { users } from "app/sockets"
import db from "db"

export const updateDataFromResults = async (result: Result) => {
  if (!("response" in result)) return

  const updatedData = await Promise.all(
    (result.response || []).map(({ id, value, error }) => {
      return db.datum.update({
        where: { id },
        data: { text: value, indexError: error },
      })
    }),
  )

  result.notify?.forEach((userId) => {
    const user = users.get(userId.toString())

    user?.send(JSON.stringify({ updatedData }))
  })
}
