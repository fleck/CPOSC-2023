import { browsers } from "app/sockets"
import { NextApiResponse } from "next"
import WebSocket from "ws"

/**
 * Add this to ensure ws gets input traced!
 */
export default function handler(_req: unknown, res: NextApiResponse) {
  console.log(WebSocket)
  return res.status(200).send(browsers.size)
}
