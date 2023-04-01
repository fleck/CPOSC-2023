import type { WebSocketResponse } from "app/KeepAliveWebSocket"
import type { Result } from "packages/indexer/src/types"
import { updateDataFromResults } from "app/properties/updateDataFromResult"
import { browsers } from "app/sockets"
import indexerConfig from "packages/indexer/config"
import { NextApiRequest } from "next"

export default async function addWebSocketConnectionEvent(
  request: NextApiRequest,
  { webSocket }: WebSocketResponse,
) {
  if (!webSocket) {
    throw new Error("websocket not found, are you using the correct path?")
  }

  const { token, clientId } = request.query

  // shouldn't use token in address, should probably be in header as seen
  // here: https://nuvalence.io/blog/websocket-token-based-authentication
  if (token !== indexerConfig.token) {
    return webSocket.terminate()
  }

  if (typeof clientId !== "string") return

  browsers.set(clientId, webSocket)

  webSocket.onmessage = async function incoming({ data }) {
    const message = JSON.parse(data.toString()) as { data: string }

    const result = JSON.parse(message.data) as Result

    await updateDataFromResults(result)
  }

  webSocket.onclose = () => {
    browsers.delete(clientId)
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
