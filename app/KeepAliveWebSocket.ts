import { ServerResponse } from "http"
import WebSocket from "ws"

export type KeepAliveWebSocket = WebSocket & { isAlive?: boolean }

export type WebSocketResponse = ServerResponse & {
  webSocket?: KeepAliveWebSocket
}
