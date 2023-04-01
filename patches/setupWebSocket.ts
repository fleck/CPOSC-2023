import http, { ServerResponse } from "http"
import WebSocket from "ws"
import type {
  KeepAliveWebSocket,
  WebSocketResponse,
} from "app/KeepAliveWebSocket"
import { RequestHandler } from "next/dist/server/next"
import config from "../packages/indexer/config"

export function setupWebSocket(server: http.Server, handler: RequestHandler) {
  const wss = new WebSocket.Server({ noServer: true })

  server.on("upgrade", async function (req, socket, head) {
    if (!req.url) return

    const { pathname } = new URL(req.url, `http://${req.headers.host}`)

    if (!pathname) {
      return socket.end()
    }

    if (pathname.includes("/_next/webpack-hmr")) {
      return
    }

    wss.handleUpgrade(req, socket, head, function done(ws) {
      wss.emit("connection", ws, req)
    })
  })

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws: KeepAliveWebSocket) {
      if (ws.isAlive === false) return ws.terminate()

      ws.isAlive = false
      ws.ping()
    })
  }, config.heartbeat)

  wss.on("close", function close() {
    clearInterval(interval)
  })

  wss.on("connection", async (webSocket: KeepAliveWebSocket, req) => {
    webSocket.isAlive = true

    webSocket.on("pong", heartbeat)

    const res: WebSocketResponse = new ServerResponse(req)

    res.webSocket = webSocket

    await handler(req, res)
  })

  function heartbeat(this: KeepAliveWebSocket) {
    this.isAlive = true
  }
}
