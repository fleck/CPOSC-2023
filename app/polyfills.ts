import "core-js/es/string/replace-all"
// @ts-ignore
import { shim } from "array.prototype.at"

shim()

/**
 * https://github.com/prisma/studio/issues/614#issuecomment-795213237
 */
declare global {
  interface BigInt {
    toJSON: () => string
  }
}
// eslint-disable-next-line no-extend-native
BigInt.prototype.toJSON = function () {
  return this.toString()
}
