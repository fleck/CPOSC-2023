const baseConfig = require("@blitzjs/next/eslint")

module.exports = {
  ...baseConfig,
  plugins: ["class-types"],
  rules: {
    "class-types/class-order": 2,
    "class-types/single-class-per-arg": 2,
    ...baseConfig.rules,
  },
  ignorePatterns: ["packages/indexer/src/index.ts"],
}
