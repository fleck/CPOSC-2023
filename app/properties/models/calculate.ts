import lodashSum from "lodash/sum"
import lodashMin from "lodash/min"
import lodashMax from "lodash/max"
import lodashSortBy from "lodash/sortBy"
import { ChildItem } from "../../items/queries/getRootItem"

/**
 * Arguments passed to this function may be used by eval.
 */
const noopToPreventTypeScriptErrorsAndDeadCodeElimination = (
  ..._args: any[]
) => {}

const propertyWrapper = (item: ChildItem) => {
  const memP = (
    ...args: string[]
  ): string[] | (string | number | undefined) => {
    const propertiesMatchingArguments = item.properties.filter((property) =>
      args.includes(property.datum.name),
    )

    const flatProperties = propertiesMatchingArguments.flatMap((p) =>
      p.datum.dynamic ? calculatePrivate(p.datum.text, item) : p.datum.text,
    )

    if (args.length > 1) {
      return flatProperties
    }

    const asNumber = Number(flatProperties[0])

    return Number.isNaN(asNumber) ? flatProperties[0] : asNumber
  }

  return memP
}

const groupWrapper = (item: ChildItem) => {
  const memG = (...args: string[]): (string | number)[] => {
    const propertiesMatchingArguments = item.properties.filter((property) =>
      args.includes(property.datum.group),
    )

    const flatProperties = propertiesMatchingArguments.flatMap((p) =>
      p.datum.dynamic ? calculatePrivate(p.datum.text, item) : p.datum.text,
    )

    return flatProperties.map((property) => {
      const asNumber = Number(property)

      return Number.isNaN(asNumber) ? property : asNumber
    })
  }

  memG.toString = () => " g requires at least one group name as an argument "

  return memG
}

type Children = NonNullable<ChildItem["children"]>

const search = (
  item: ChildItem,
  idToFind: ChildItem["id"] | string,
): Children => {
  if (BigInt(item.id) === BigInt(idToFind)) {
    return item.children || []
  }

  for (const child of item.children || []) {
    const subChildren = search(child.item, idToFind)

    if (subChildren.length > 0) {
      return subChildren
    }
  }

  return []
}

const childrenOfWrapper = (item: ChildItem) => {
  const childrenOf = (id: number | string) => {
    const children = search(item, id)

    if (children.length === 0) {
      throw new Error(`No children found for id ${id}`)
    }

    return children.flatMap((child) => child.item)
  }

  return childrenOf
}

type PossibleValues = ReturnType<typeof propertyWrapper>

const min = (...args: PossibleValues[]) => lodashMin(args.flat())

const max = (...args: PossibleValues[]) => lodashMax(args.flat())

const sum = (...args: PossibleValues[]) =>
  lodashSum(args.flat().map((arg) => Number(arg)))

const sort = (by: string, items: ChildItem[], at: number) => {
  const properties = items.flatMap(
    (item) =>
      item.properties.find((property) => property.datum.name === by) || [],
  )

  const property = lodashSortBy(properties, (property) => Number(property)).at(
    at,
  )

  const item = items.find((item) => item.id === property?.item_id)

  return property?.datum.dynamic && item
    ? calculatePrivate(property.datum.text, item)
    : property?.datum.text
}

const high = (by: string, items: ChildItem[]) => sort(by, items, 0)

const low = (by: string, items: ChildItem[]) => sort(by, items, -1)

function calculatePrivate(text: string | null, item: ChildItem) {
  const p = propertyWrapper(item)

  const g = groupWrapper(item)

  const co = childrenOfWrapper(item)

  try {
    return String(eval(text || ""))
  } catch (e) {
    noopToPreventTypeScriptErrorsAndDeadCodeElimination(
      low,
      high,
      min,
      max,
      sum,
      p,
      g,
      co,
    )
    return "Error"
  }
}

export default function calculate(equation: string | null, item: ChildItem) {
  const p = propertyWrapper(item)

  const g = groupWrapper(item)

  const co = childrenOfWrapper(item)

  try {
    return { value: String(eval(equation || "")) }
  } catch (e) {
    if (e instanceof Error) {
      return { error: e, value: "Error" }
    } else {
      noopToPreventTypeScriptErrorsAndDeadCodeElimination(p, g, co)
      throw e
    }
  }
}
