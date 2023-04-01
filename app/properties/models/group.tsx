import { ChildItem } from "../../items/queries/getRootItem"

export const group = (props: ChildItem["properties"]) => {
  const properties = new Map<string, ChildItem["properties"]>()

  for (const property of props) {
    const existingGroup = properties.get(property.datum.group)

    properties.set(property.datum.group, [...(existingGroup || []), property])
  }

  return [...properties]
}

export type PropertiesInGroups = ReturnType<typeof group>
