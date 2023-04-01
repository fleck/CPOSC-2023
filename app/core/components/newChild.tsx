import { ChildItem } from "app/items/queries/getRootItem"

let childIdSequence = 0
export const newChild = (parentId: number, item: ChildItem) =>
  ({
    id: childIdSequence--,
    parent_id: parentId,
    item_id: item.id,
    titleType: "SPECIFIC",
    hidden: false,
    preview: null,
    copy_item: null,
    copy_sort_by: null,
    copy_position: 0,
    position: null,
    item,
  } as const)
