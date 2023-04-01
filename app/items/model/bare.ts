import { ChildOrRootItem } from "../queries/getRootItem"

export const bare = ({
  children,
  properties,
  comparisonColumns,
  importedItems,
  ...item
}: ChildOrRootItem) => ({
  ...item,
})

export type BareItem = ReturnType<typeof bare>
