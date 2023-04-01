/**
  Description: Conforms an object to a default object
  Example: conformObject({ a: 1, b: "2", c: true }, { a: "1", b: 2, c: "true" }) // { a: 1, b: "2", c: true }
  Note: the values of b and c are strings because they were strings in the default object
  Example of adding missing properties: conformObject({ a: 1, b: "2", c: true }, { a: "1" }) // { a: 1, b: "2", c: true }
 * @param defaultObj
 * @param unknownObj
 * @returns
 */
export function conformObject<T extends unknown>(
  defaultObj: T,
  unknownObj: { [P in keyof T]?: unknown },
): { data: T } {
  if (typeof unknownObj === "undefined") {
    return { data: defaultObj }
  }

  const conformedObj: { [key: string]: unknown } = {}

  for (const key in defaultObj) {
    const defaultValue = defaultObj[key]
    const unknownValue = unknownObj[key]

    if (unknownObj.hasOwnProperty?.(key)) {
      if (typeof unknownValue === typeof defaultValue) {
        if (
          typeof unknownValue === "object" &&
          !Array.isArray(unknownValue) &&
          unknownValue != null
        ) {
          conformedObj[key] = conformObject(defaultValue, unknownValue).data
        } else if (Array.isArray(unknownValue) && Array.isArray(defaultValue)) {
          if (typeof defaultValue[0] !== "undefined") {
            conformedObj[key] = unknownValue.map(
              (item: typeof defaultValue[0]) => {
                if (typeof item === typeof defaultValue[0]) {
                  if (
                    typeof item === "object" &&
                    !Array.isArray(item) &&
                    item != null
                  ) {
                    return conformObject(defaultValue[0], item).data
                  } else {
                    return item
                  }
                } else {
                  return defaultValue[0]
                }
              },
            )
          } else {
            conformedObj[key] = []
          }
        } else {
          conformedObj[key] = unknownValue
        }
      } else if (
        typeof defaultValue === "number" &&
        typeof unknownValue === "string"
      ) {
        conformedObj[key] = Number(unknownValue)
      } else if (
        typeof defaultValue === "boolean" &&
        typeof unknownValue === "string"
      ) {
        conformedObj[key] = unknownValue === "true"
      } else {
        conformedObj[key] = defaultValue
      }
    } else {
      conformedObj[key] = defaultValue
    }
  }

  return { data: conformedObj as T }
}
