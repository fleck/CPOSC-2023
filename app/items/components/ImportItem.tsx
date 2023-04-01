import ct from "class-types.macro"
import React, { useState } from "react"
import { invoke, useMutation } from "@blitzjs/rpc"
import Button from "app/core/components/Button"
import { AddItemModal } from "app/core/components/AddItemModal"
import getRootItem, { ChildOrRootItem } from "../queries/getRootItem"
import addImportedItemRaw from "../mutations/addImportedItem"

type Props = { setItem: React.Dispatch<React.SetStateAction<ChildOrRootItem>> }

export default function ImportItem({ setItem }: Props) {
  const [addingItem, setAddingItem] = useState(false)

  const [error, setError] = useState("")

  const [addImportedItem] = useMutation(addImportedItemRaw)

  return (
    <>
      <Button onClick={() => setAddingItem(true)} color="lime">
        Import item
      </Button>

      {!!error && <div className={ct("text-red-600")}>{error}</div>}

      {addingItem && (
        <AddItemModal
          title="Import item"
          open={addingItem}
          setOpen={setAddingItem}
          onItemAdd={async (existingItem) => {
            if (!existingItem) return

            const fullItem = await invoke(getRootItem, {
              id: existingItem.id,
            }).catch((caughtError?: Error) => {
              setError(caughtError?.message || "Unknown error")
            })

            if (!fullItem) return

            setItem((rootItem) => {
              addImportedItem({
                id: rootItem.id,
                itemIdToImport: fullItem.id,
              }).catch((caughtError?: Error) => {
                setError(caughtError?.message || "Unknown error")

                setItem((prevItem) => ({
                  ...prevItem,
                  importedItems:
                    prevItem.importedItems?.filter(
                      (item) => item.id !== fullItem.id,
                    ) || [],
                }))
              })

              return {
                ...rootItem,
                importedItems: [...(rootItem.importedItems || []), fullItem],
              }
            })
          }}
        />
      )}
    </>
  )
}
