process.env.__NEXT_REACT_ROOT = "true"

import { createServer } from "http"
import { parse } from "url"
import next from "next"
import { setupWebSocket } from "./patches/setupWebSocket"
import "./patches/allowBigintAndDateProps"
import "./patches/immutableImages"

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      const { url } = req
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        if (typeof url !== "string") throw new Error("req.url must be a string")
        const parsedUrl = parse(url, true)

        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error("Error occurred handling", req.url, err)
        res.statusCode = 500
        res.end("internal server error")
      }
    }).listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })

    setupWebSocket(server, handle)
  })
  .catch(() => {})
