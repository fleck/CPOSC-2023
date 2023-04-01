import { browsers } from "app/sockets"
import { NextApiResponse } from "next"

/**
 * Find out how many indexers are currently connected.
 */
export default function handler(_req: unknown, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")

  if (browsers.size) {
    return res.status(200).send(browsers.size)
  }

  res.status(404).send("")
}
