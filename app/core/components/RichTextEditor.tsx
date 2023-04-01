import React, { Suspense, useRef } from "react"
import { schema } from "prosemirror-schema-basic"
import { toggleMark } from "prosemirror-commands"
import { MarkType } from "prosemirror-model"
import { ProseMirror } from "use-prosemirror"
import { EditorState, Transaction } from "prosemirror-state"
import ct from "class-types.macro"
import { DocumentAddIcon, ExclamationIcon } from "@heroicons/react/solid"
import { ArrowUpIcon, ArrowDownIcon, TrashIcon } from "@heroicons/react/outline"
import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { invoke, useMutation, usePaginatedQuery, useQuery } from "@blitzjs/rpc"
import { BlockProps, mapContent } from "app/items/components/Content"
import { Item, ItemType, TitleType } from "@prisma/client"
import getItems from "app/items/queries/getItems"
import LabeledTextField from "./LabeledTextField"
import Form from "./Form"
import getRootItem, { ChildItem } from "app/items/queries/getRootItem"
import updateChildrenOrder from "app/children/mutations/updateChildrenOrder"
import { UseMutationFunction } from "app/items/TypeUtilities"
import capitalize from "lodash/capitalize"
import deleteChild from "app/children/mutations/deleteChild"
import deleteItem from "app/items/mutations/deleteItem"
import getParents from "app/children/queries/getParents"
import ButtonStandard from "./Button"
import { AddItemModal } from "./AddItemModal"
import { newItem } from "./newItem"
import { newChild } from "./newChild"

export const toggleBold = toggleMarkCommand(schema.marks.strong)
export const toggleItalic = toggleMarkCommand(schema.marks.em)
const toggleCode = toggleMarkCommand(schema.marks.code)

function toggleMarkCommand(mark: MarkType) {
  return (
    state: EditorState,
    dispatch: ((tr: Transaction) => void) | undefined,
  ) => toggleMark(mark)(state, dispatch)
}

function isBold(state: EditorState) {
  return isMarkActive(state, schema.marks.strong)
}

function isItalic(state: EditorState) {
  return isMarkActive(state, schema.marks.em)
}

function isCode(state: EditorState) {
  return isMarkActive(state, schema.marks.code)
}

// https://github.com/ProseMirror/prosemirror-example-setup/blob/afbc42a68803a57af3f29dd93c3c522c30ea3ed6/src/menu.js#L57-L61
function isMarkActive(state: EditorState, mark: MarkType) {
  const { from, $from, to, empty } = state.selection
  return empty
    ? !!mark.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, mark)
}

export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    isActive?: boolean
    className?: ClassTypes
  },
) {
  const { children, isActive, className = "", onClick, ...restProps } = props

  return (
    <button
      className={ct(
        "inline-block",
        "w-[1.125rem]",
        "cursor-pointer",
        "border-none",
        "py-0.5",
        className,
      )}
      style={{
        backgroundColor: isActive ? "#efeeef" : "#fff",
        color: isActive ? "blue" : "black",
      }}
      type="button"
      onMouseDown={(e) => {
        // Prevent editor losing focus
        e.preventDefault()
        // Prevent form submission
        e.stopPropagation()
        onClick?.(e)
      }}
      {...restProps}
    >
      {children}
    </button>
  )
}

const ITEMS_PER_PAGE = 100

type ExistingItemProps = {
  items: Item[]
  onClick: (item: Item) => void
}

// https://tailwindui.com/components/application-ui/lists/grid-lists#component-ce021f02f586e0e6a5f8de2ca2ee537b
function ExistingItems({ items, onClick }: ExistingItemProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <button
            onClick={() => onClick(item)}
            className="w-full flex items-center justify-between p-6 space-x-6"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-gray-900 text-sm font-medium truncate">
                  {item.name}
                </h3>
              </div>
              <div className="mt-1 text-gray-500 text-sm line-clamp-3">
                {mapContent(item.contentState as BlockProps)}
              </div>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

export const ExistingItemsContainer = ({
  query = "",
  onItemClick,
}: {
  query: string
  onItemClick: (item: Item) => void
}) => {
  const [page, setPage] = useState(0)

  const [{ items, hasMore }] = usePaginatedQuery(getItems, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
  })

  return (
    <>
      <ExistingItems items={items} onClick={onItemClick} />
      <nav
        className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        aria-label="Pagination"
      >
        <div className="flex-1 flex justify-between sm:justify-end">
          {page > 0 && (
            <button
              onClick={() => setPage((previousPage) => previousPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {hasMore && (
            <button
              onClick={() => setPage((nextPage) => nextPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          )}
        </div>
      </nav>
    </>
  )
}

export const ItemsList = ({
  onItemClick,
}: {
  onItemClick: (item: Item) => void
}) => {
  const [query, setQuery] = useState("")

  return (
    <>
      <Form onSubmit={() => {}}>
        <LabeledTextField
          name="Find an existing item"
          value={query}
          onChange={({ target }) => setQuery(target.value.trimLeft())}
        />
      </Form>

      {Boolean(query) && (
        <Suspense fallback={<div>loading</div>}>
          <ExistingItemsContainer {...{ query, onItemClick }} />
        </Suspense>
      )}
    </>
  )
}

type Props = {
  setState: (state: EditorState<any>) => void
  state: EditorState<any>
  dirty: boolean
  onSave: () => void
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  item: ChildItem
  child?: Exclude<ChildItem["children"], undefined>[number]
  setParentItem?: React.Dispatch<React.SetStateAction<ChildItem>>
  parentItem?: ChildItem
}

export default function RichTextEditor({
  setState,
  state,
  dirty,
  onSave,
  setItem,
  item,
  child,
  setParentItem,
  parentItem,
}: Props) {
  const [open, setOpen] = useState(false)

  const [position, setPosition] = useState(child?.position)

  const container = useRef<HTMLDivElement>(null)

  const [updateChildren] = useMutation(updateChildrenOrder)

  const [deleteChildMutation] = useMutation(deleteChild)

  if (position !== child?.position) {
    /**
     * When we move an item it can jump off screen so we want to scroll to it
     * when changing its position.
     */
    container.current?.scrollIntoView({ block: "center" })
    setPosition(child?.position)
  }

  return (
    <div ref={container} className="bg-white focus-within:default no-js:hidden">
      <div
        className={ct(
          "flex",
          "items-center",
          "space-x-2",
          "rounded-t",
          "border",
          "border-solid",
          "border-gray-300",
          "p-2",
        )}
        data-items-edit-target="editorToolbar"
      >
        <Button aria-label={`Save ${item.name}`} onClick={onSave}>
          <SaveIcon dirty={dirty} />
        </Button>
        <Button
          isActive={isBold(state)}
          onClick={() => toggleBold(state, (tr) => setState(state.apply(tr)))}
        >
          <BoldIcon />
        </Button>
        <Button
          isActive={isItalic(state)}
          onClick={() => toggleItalic(state, (tr) => setState(state.apply(tr)))}
        >
          <ItalicIcon />
        </Button>
        <Button
          isActive={isCode(state)}
          onClick={() => toggleCode(state, (tr) => setState(state.apply(tr)))}
        >
          <CodeIcon />
        </Button>
        <Button
          aria-label={`Add child to ${item.name}`}
          onClick={() => setOpen((previous) => !previous)}
        >
          <DocumentAddIcon />
        </Button>
        <select
          id="location"
          name="location"
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
          defaultValue={item.type}
          onChange={({ target: { value } }) => {
            const itemTypeKeys = Object.keys(
              ItemType,
            ) as ReadonlyArray<ItemType>

            if (itemTypeKeys.includes(value)) {
              setItem((prevItem) => ({ ...prevItem, type: value }))
            } else {
              throw new Error("Invalid item type")
            }
          }}
        >
          {Object.keys(ItemType).map((itemType) => (
            <option value={itemType} key={itemType}>
              {capitalize(itemType)}
            </option>
          ))}
        </select>
        {child && (
          <select
            id="location"
            name="location"
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
            onChange={({ target: { value } }) => {
              const titleTypeKeys = Object.keys(
                TitleType,
              ) as ReadonlyArray<TitleType>

              if (titleTypeKeys.includes(value)) {
                setParentItem?.((prevItem) => ({
                  ...prevItem,
                  children: prevItem.children.map((sibling) =>
                    sibling === child
                      ? { ...sibling, titleType: value }
                      : sibling,
                  ),
                }))
              } else {
                throw new Error("Invalid title type")
              }
            }}
            defaultValue={child.titleType}
          >
            {Object.keys(TitleType).map((titleType) => (
              <option value={titleType} key={titleType}>
                {capitalize(titleType)}
              </option>
            ))}
          </select>
        )}

        {child && (
          <Button
            aria-label={`Delete ${item.name}`}
            onClick={async () => {
              setParentItem?.((prevItem) => ({
                ...prevItem,
                children: prevItem.children.filter(
                  (sibling) => sibling !== child,
                ),
              }))
              await deleteChildMutation(child)
            }}
          >
            <TrashIcon />
          </Button>
        )}

        {!child && <DeleteItem {...{ item, setItem }} />}

        <div className="relative flex items-start py-4 ml-2">
          <div className="min-w-0 flex-1 text-sm">
            <label
              htmlFor={`person-`}
              className="font-medium text-gray-700 select-none"
            >
              Standalone
            </label>
          </div>
          <div className="ml-2 flex items-center h-5">
            <input
              id={`person-`}
              name={`person-`}
              type="checkbox"
              checked={item.standalone}
              onChange={() =>
                setItem((prevItem) => ({
                  ...prevItem,
                  standalone: !prevItem.standalone,
                }))
              }
              className="focus:ring-lime-500 h-4 w-4 text-lime-600 border-gray-300 rounded"
            />
          </div>
        </div>
        {parentItem?.children[0] !== child && (
          <Button
            aria-label="Move Up"
            onClick={() =>
              move({ position: -1, child, setParentItem, updateChildren })
            }
          >
            <ArrowUpIcon />
          </Button>
        )}
        {parentItem?.children.at(-1) !== child && (
          <Button
            aria-label="Move Down"
            onClick={() =>
              move({ position: 1, child, setParentItem, updateChildren })
            }
          >
            <ArrowDownIcon />
          </Button>
        )}
      </div>

      <AddItemModal
        title="Add child"
        {...{ open, setOpen }}
        onItemAdd={async (existingItem) => {
          const fullItem = await invoke(getRootItem, { id: existingItem?.id })

          if (!fullItem) return

          setItem((prevItem) => ({
            ...prevItem,
            children: [
              ...(prevItem.children || []),
              newChild(prevItem.id, fullItem),
            ],
          }))
        }}
      >
        <>
          <button
            type="button"
            className={ct(
              "inline-flex",
              "w-full",
              "justify-center",
              "rounded-md",
              "border",
              "border-transparent",
              "bg-indigo-600",
              "px-4",
              "py-2",
              "text-base",
              "font-medium",
              "text-white",
              "shadow-sm",
              "hover:bg-indigo-700",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-indigo-500",
              "focus:ring-offset-2",
              "sm:text-sm",
            )}
            onClick={() => {
              setOpen(false)

              setItem((prevItem) => ({
                ...prevItem,
                children: [
                  ...(prevItem.children || []),
                  newChild(prevItem.id, newItem()),
                ],
              }))
            }}
          >
            Create New Item
          </button>
          or
        </>
      </AddItemModal>

      <ProseMirror
        // Old content is in HTML form via the .content property. If the updated contentState isn't set yet we use that.
        ref={(handle) => {
          setTimeout(() => {
            if (handle?.view && !item.contentState) {
              handle.view.dom.innerHTML = item.content
            }
          })
        }}
        className={ct(
          "flex",
          "h-full",
          "cursor-text",
          "whitespace-pre-wrap",
          "rounded-b",
          "border",
          "border-t-0",
          "border-solid",
          "border-gray-300",
        )}
        state={state}
        onChange={(editorState) => setState(editorState)}
        attributes={{ class: ct("w-full", "p-1") }}
      />
    </div>
  )
}

type DeleteProps = {
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
  item: ChildItem
}

function DeleteItem({ item }: DeleteProps) {
  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const [deleteMutation] = useMutation(deleteItem)

  const [parents] = useQuery(getParents, { itemId: item.id })

  return (
    <>
      <Button aria-label={`Delete ${item.name}`} onClick={() => setOpen(true)}>
        <TrashIcon />
      </Button>

      {/* https://tailwindui.com/components/application-ui/overlays/modals#component-47a5888a08838ad98779d50878d359b3 */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg leading-6 font-medium text-gray-900"
                        >
                          Delete
                        </Dialog.Title>
                        <div className={ct("mt-2", "text-sm", "text-gray-500")}>
                          <p>
                            Are you sure you want to delete this item? This
                            action cannot be undone.
                          </p>
                          <p>
                            {parents?.length > 0 && (
                              <>
                                Deleting this item will affect the following
                                item
                                {parents.length > 1 ? "s" : ""}:
                              </>
                            )}
                          </p>
                          <ul>
                            {parents.map((parent) => (
                              <li key={parent.id}>{parent.parent.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <ButtonStandard
                      type="button"
                      color="red"
                      onClick={() => {
                        deleteMutation({ id: item.id }).catch(console.error)

                        // setItem((prevItem) => ({
                        //   ...prevItem,
                        //   properties: prevItem.properties.filter((p) => BigInt(p.id) !== id),
                        // }))

                        setOpen(false)
                      }}
                    >
                      Delete item
                    </ButtonStandard>
                    <ButtonStandard
                      type="button"
                      color="gray"
                      className={ct("mr-5")}
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </ButtonStandard>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 18 18">
      <polyline
        className="ql-even ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        points="5 7 3 9 5 11"
      ></polyline>
      <polyline
        className="ql-even ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        points="13 7 15 9 13 11"
      ></polyline>
      <line
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        x1="10"
        x2="8"
        y1="5"
        y2="13"
      ></line>
    </svg>
  )
}

function ItalicIcon() {
  return (
    <svg viewBox="0 0 18 18">
      <line
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        x1="7"
        x2="13"
        y1="4"
        y2="4"
      ></line>
      <line
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        x1="5"
        x2="11"
        y1="14"
        y2="14"
      ></line>
      <line
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        x1="8"
        x2="10"
        y1="14"
        y2="4"
      ></line>
    </svg>
  )
}

function BoldIcon() {
  return (
    <svg className="stroke-current " viewBox="0 0 18 18">
      <path
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"
      ></path>
      <path
        className="ql-stroke stroke-2 stroke-current fill-none stroke-linecap-round stroke-linejoin-round"
        d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"
      ></path>
    </svg>
  )
}

export function SaveIcon({ dirty = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={dirty ? ct("fill-current", "text-yellow-400") : ""}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
    </svg>
  )
}

function move({
  child,
  setParentItem,
  updateChildren,
  position,
}: Pick<Props, "child" | "setParentItem"> & {
  updateChildren: UseMutationFunction<typeof updateChildrenOrder>
  position: number
}) {
  if (!child) return

  setParentItem?.((prevParentItem) => {
    if (!prevParentItem.children) return prevParentItem

    const reorderedChildren = prevParentItem.children.filter((c) => c !== child)

    reorderedChildren.splice(
      prevParentItem.children.indexOf(child) + position,
      0,
      child,
    )

    const childrenWithNewPositions = reorderedChildren.map((prop, index) => ({
      ...prop,
      position: index,
      itemURL: prevParentItem.url,
    }))

    void updateChildren(childrenWithNewPositions)

    return {
      ...prevParentItem,
      children: childrenWithNewPositions,
    }
  })
}
