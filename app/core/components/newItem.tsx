import { ChildItem } from "app/items/queries/getRootItem"

let itemIdSequence = 0

export const newItem: () => ChildItem = () => ({
  id: itemIdSequence--,
  name: "",
  url: "",
  content: "",
  contentState: { type: "doc", content: [{ type: "paragraph" }] },
  genericName: "",
  type: "PAGE",
  standalone: true,
  domain_id: 1,
  properties: [],
  created_at: null,
  updated_at: null,
  comparisonColumns: [],
  importedItems: [],
  children: [],
})
