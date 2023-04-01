import { useMutation } from "@blitzjs/rpc"
import React, { useState } from "react"
import ct from "class-types.macro"
import Form from "app/core/components/Form"
import upsertComparisonColumn from "app/comparisonColumns/mutations/upsertComparisonColumn"
import { comparisonColumnSchema } from "app/comparisonColumns/schema"
import LabeledCheckbox from "app/core/components/LabeledCheckbox"
import capitalize from "lodash/capitalize"
import { Align, ComparisonColumn } from "@prisma/client"
import { Field, FieldRenderProps, FormSpy } from "react-final-form"
import { ChildItem } from "../queries/getRootItem"
import Downshift from "downshift"
import { matchSorter } from "match-sorter"
import LabeledTextField from "app/core/components/LabeledTextField"
import * as z from "zod"
import EditButton from "app/core/components/EditButton"
import {
  PencilIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@heroicons/react/solid"
import Button from "app/core/components/Button"
import deleteComparisonColumn from "app/comparisonColumns/mutations/deleteComparisonColumn"
import updateOrder from "app/comparisonColumns/mutations/updateOrder"
import { UseMutationFunction } from "../TypeUtilities"

export type Props = {
  item: ChildItem
  comparisonColumn: ChildItem["comparisonColumns"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

export default function EditComparisonHeader({
  comparisonColumn,
  item,
  setItem,
}: Props) {
  const [editingColumn, setEditingColumn] = useState(
    BigInt(comparisonColumn.id) < 0 && !comparisonColumn.subject,
  )

  const [upsertColumnMutation] = useMutation(upsertComparisonColumn)

  const [deleteColumnMutation] = useMutation(deleteComparisonColumn)

  const [updateOrderMutation, { error: orderError }] = useMutation(updateOrder)

  if (!editingColumn) {
    return (
      <>
        <EditButton
          className={ct("mx-auto", "my-2")}
          onClick={() => setEditingColumn((prevEditing) => !prevEditing)}
          color="amber"
          title="Add new column"
          aria-label="Add new column"
        >
          <PencilIcon className={ct("h-4", "w-4")} />
        </EditButton>
      </>
    )
  }

  return (
    <>
      <EditButton
        className={ct("mx-auto", "my-2")}
        onClick={() => setEditingColumn((prevEditing) => !prevEditing)}
        color="gray"
        title="Cancel Edit"
        aria-label="Cancel Edit"
      >
        <PencilIcon className={ct("h-4", "w-4")} />
      </EditButton>

      {item.comparisonColumns[0] !== comparisonColumn && (
        <button
          className={ct(
            "inline-block",
            "w-[1.125rem]",
            "cursor-pointer",
            "border-none",
            "py-0.5",
          )}
          onClick={() =>
            moveColumn({
              item,
              comparisonColumn,
              setItem,
              position: -1,
              updateOrderMutation,
            })
          }
        >
          <ArrowLeftIcon />
        </button>
      )}

      {item.comparisonColumns.at(-1) !== comparisonColumn && (
        <button
          className={ct(
            "inline-block",
            "w-[1.125rem]",
            "cursor-pointer",
            "border-none",
            "py-0.5",
          )}
          onClick={() =>
            moveColumn({
              item,
              comparisonColumn,
              setItem,
              position: 1,
              updateOrderMutation,
            })
          }
        >
          <ArrowRightIcon />
        </button>
      )}

      {orderError instanceof Error && <div>{orderError.message}</div>}

      <Form<typeof comparisonColumnSchema>
        onSubmit={async (values) => {
          const latestColumn = await upsertColumnMutation({
            ...values,
            itemId: item.id,
          })

          updateComparisonColumn({
            setItem,
            comparisonColumn,
            values: latestColumn,
          })
        }}
        submitText={comparisonColumn.id ? "Update Column" : "Create Column"}
        initialValues={comparisonColumn}
      >
        <FormSpy<z.infer<typeof comparisonColumnSchema>>
          onChange={({ dirty, values }) => {
            // working around a bug until fix lands: https://github.com/final-form/react-final-form/pull/965
            if (!dirty) return

            updateComparisonColumn({ setItem, comparisonColumn, values })
          }}
        />

        <Field
          name="name"
          item={item}
          placeholder="column name"
          component={DownshiftInput}
        ></Field>

        <Field
          defaultValue={comparisonColumn.align}
          className={ct(
            "inline-block",
            "rounded-md",
            "border-gray-300",
            "py-0.5",
            "pr-10",
            "pl-1",
            "text-base",
            "focus:border-indigo-500",
            "focus:outline-none",
            "focus:ring-indigo-500",
            "sm:text-sm",
          )}
          name="align"
          component="select"
        >
          {Object.keys(Align).map((itemType) => (
            <option value={itemType} key={itemType}>
              {capitalize(itemType)}
            </option>
          ))}
        </Field>

        <fieldset className="space-y-5">
          <LabeledCheckbox name="subject" />
        </fieldset>
      </Form>

      {comparisonColumn.id && (
        <Button
          onClick={async () => {
            setItem((prevItem) => ({
              ...prevItem,
              comparisonColumns: [
                ...prevItem.comparisonColumns.filter(
                  (comparisonColumnSibling) =>
                    comparisonColumnSibling.id !== comparisonColumn.id,
                ),
              ],
            }))

            await deleteColumnMutation(comparisonColumn)
          }}
          type="submit"
          color="red"
        >
          Delete
        </Button>
      )}
    </>
  )
}

async function moveColumn({
  item,
  comparisonColumn,
  setItem,
  position,
  updateOrderMutation,
}: Props & {
  position: -1 | 1
  updateOrderMutation: UseMutationFunction<typeof updateOrder>
}) {
  const { comparisonColumns } = item

  const currentIndexOfColumn = comparisonColumns.indexOf(comparisonColumn)

  const columnsInNewOrder = comparisonColumns.filter(
    (column) => column.id !== comparisonColumn.id,
  )

  columnsInNewOrder.splice(currentIndexOfColumn + position, 0, comparisonColumn)

  const columnsWithNewPosition = columnsInNewOrder.map((column, index) => ({
    ...column,
    position: index,
    itemId: item.id,
  }))

  setItem((item) => ({ ...item, comparisonColumns: columnsWithNewPosition }))

  return updateOrderMutation(columnsWithNewPosition)
}

function updateComparisonColumn({
  setItem,
  comparisonColumn,
  values: { id, ...values },
}: {
  values: ComparisonColumn | z.infer<typeof comparisonColumnSchema>
  comparisonColumn: ChildItem["comparisonColumns"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}) {
  setItem((prevItem) => ({
    ...prevItem,
    comparisonColumns: [
      ...prevItem.comparisonColumns.map((comparisonColumnSibling) =>
        comparisonColumnSibling.id === comparisonColumn.id
          ? {
              ...comparisonColumnSibling,
              ...values,
              id: id ? BigInt(id) : comparisonColumnSibling.id,
            }
          : comparisonColumnSibling,
      ),
    ],
  }))
}

const DownshiftInput = ({
  input,
  placeholder,
  item,
}: { item: ChildItem } & FieldRenderProps<string>) => (
  <Downshift<string>
    {...input}
    selectedItem={input.value}
    onInputValueChange={(inputValue) => {
      input.onChange(inputValue)
    }}
  >
    {({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => {
      const uniquePropertyNames = new Set(
        item.children
          ?.flatMap((child) => child.item.properties)
          .map((property) => property.datum.name),
      )

      const filteredItems = matchSorter(
        [...uniquePropertyNames],
        inputValue || "",
      )

      return (
        <div className="downshift" style={{ position: "relative" }}>
          <LabeledTextField
            {...getInputProps({
              name: input.name,
              placeholder,
            })}
            ref={undefined}
            type="text"
          />
          {isOpen && !!filteredItems.length && (
            <div
              className={ct("divide-y")}
              style={{
                background: "white",
                position: "absolute",
                top: "100%",
                left: 15,
                right: 0,
                zIndex: 4,
              }}
            >
              {filteredItems.map((item, index) => (
                <div
                  key={item}
                  {...getItemProps({
                    index,
                    item: item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? "lightgray" : "white",
                      fontWeight: selectedItem === item ? "bold" : "normal",
                    },
                  })}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }}
  </Downshift>
)
