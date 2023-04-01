const { withBlitz } = require("@blitzjs/next")
const withRoutes = require("nextjs-routes/config")()

module.exports = withRoutes(
  withBlitz({
    webpack: (config) => {
      config.module.rules.push({
        test: require.resolve("next/dist/shared/lib/router/router.js"),
        loader: "exports-loader",
        options: {
          exports: "fetchNextData",
        },
      })

      return config
    },
    output: "standalone",
    images: {
      minimumCacheTTL: 31536000,
      formats: ["image/avif", "image/webp"],
    },
  }),
)
