module.exports = {
  presets: ["next/babel"],
  plugins: [[require.resolve("babel-plugin-macros")]],
  env: {
    test: {
      plugins: ["istanbul"],
    },
  },
}
