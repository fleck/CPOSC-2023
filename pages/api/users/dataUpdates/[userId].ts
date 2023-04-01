import type { WebSocketResponse } from "app/KeepAliveWebSocket"
import { users } from "app/sockets"
import type { NextApiRequest } from "next"

export default async function addWebSocketConnectionEvent(
  request: NextApiRequest,
  { webSocket }: WebSocketResponse,
) {
  if (!webSocket) {
    throw new Error("websocket not found, are you using the correct path?")
  }

  const userId = request.url?.split("/").at(-1)

  if (!userId) return

  users.set(userId, webSocket)

  webSocket.onclose = () => {
    users.delete(userId)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
