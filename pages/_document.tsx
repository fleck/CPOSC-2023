import Document, {
  Html,
  Head,
  Main,
  NextScript /*DocumentContext*/,
} from "next/document"
import ct from "class-types.macro"

export default class MyDocument extends Document {
  // Only uncomment if you need to customize this behavior
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html className={ct("font-sans", "antialiased")} lang="en">
        <Head />
        <body className={ct("bg-gray-50")}>
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
