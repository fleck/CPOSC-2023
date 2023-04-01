process.env.__NEXT_REACT_ROOT = "true"

process.chdir(__dirname)

import "./patches/allowBigintAndDateProps"
import "./patches/immutableImages"
import NextServer, { NodeRequestHandler } from "next/dist/server/next-server"
import http from "http"
import path from "path"

import { setupWebSocket } from "./patches/setupWebSocket"

// Make sure commands gracefully respect termination signals (e.g. from Docker)
process.on("SIGTERM", () => process.exit(0))
process.on("SIGINT", () => process.exit(0))

export let handler: NodeRequestHandler

const server = http.createServer(async (req, res) => {
  try {
    await handler(req, res)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end("internal server error")
  }
})

const currentPort = Number(process.env.PORT) || 3000

server.listen(currentPort, () => {
  const nextServer = new NextServer({
    hostname: "localhost",
    port: currentPort,
    dir: path.join(__dirname),
    dev: false,
    conf: {
      env: {},
      webpackDevMiddleware: null,
      eslint: { ignoreDuringBuilds: false },
      typescript: { ignoreBuildErrors: false, tsconfigPath: "tsconfig.json" },
      distDir: "./.next",
      cleanDistDir: true,
      assetPrefix: "",
      configOrigin: "next.config.js",
      useFileSystemPublicRoutes: true,
      generateEtags: true,
      pageExtensions: ["tsx", "ts", "jsx", "js"],
      target: "server",
      poweredByHeader: true,
      compress: true,
      analyticsId: "",
      images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: "/_next/image",
        loader: "default",
        domains: [],
        disableStaticImages: false,
        minimumCacheTTL: 31536000,
        formats: ["image/avif", "image/webp"],
        dangerouslyAllowSVG: false,
        contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
      },
      devIndicators: {
        buildActivity: true,
        buildActivityPosition: "bottom-right",
      },
      onDemandEntries: { maxInactiveAge: 15000, pagesBufferLength: 2 },
      amp: { canonicalBase: "" },
      basePath: "",
      sassOptions: {},
      trailingSlash: false,
      i18n: null,
      productionBrowserSourceMaps: false,
      optimizeFonts: true,
      excludeDefaultMomentLocales: true,
      serverRuntimeConfig: {},
      publicRuntimeConfig: {},
      reactStrictMode: false,
      httpAgentOptions: { keepAlive: true },
      outputFileTracing: true,
      staticPageGenerationTimeout: 60,
      swcMinify: false,
      output: "standalone",
      experimental: {
        optimisticClientCache: true,
        manualClientBasePath: false,
        legacyBrowsers: true,
        browsersListForSwc: false,
        newNextLinkBehavior: false,
        cpus: 9,
        sharedPool: true,
        profiling: false,
        isrFlushToDisk: true,
        workerThreads: false,
        pageEnv: false,
        optimizeCss: false,
        nextScriptWorkers: false,
        scrollRestoration: false,
        externalDir: false,
        disableOptimizedLoading: false,
        gzipSize: true,
        swcFileReading: true,
        craCompat: false,
        esmExternals: true,
        appDir: false,
        isrMemoryCacheSize: 52428800,
        serverComponents: false,
        fullySpecified: false,
        outputFileTracingRoot: "",
        images: { remotePatterns: [] },
        swcTraceProfiling: false,
        forceSwcTransforms: false,
        largePageDataBytes: 128000,
        // @ts-expect-error This is in the generated server file, so we'll keep it even though it's not in the TS definition.
        trustHostHeader: false,
      },
      configFileName: "next.config.js",
    },
  })
  handler = nextServer.getRequestHandler()

  setupWebSocket(server, handler)

  console.log("Listening on port", currentPort)
})
