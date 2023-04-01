import Form, { FormProps } from "app/core/components/Form"
import LabeledCheckbox from "app/core/components/LabeledCheckbox"
import LabeledTextField from "app/core/components/LabeledTextField"
import getAllIndexers from "app/indexers/queries/findMany"

import { useQuery } from "@blitzjs/rpc"
import ct from "class-types.macro"
import { Datum, Indexer } from "db"
import { useEffect } from "react"
import { Field, FormSpy } from "react-final-form"

import { useFileUpload } from "../../file/useFileUpload"
import type { ChildItem } from "../queries/getRootItem"

import useWebSocket from "react-use-websocket"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import LabeledTextArea from "app/core/components/LabeledTextArea"

import { UpdateDatum } from "app/properties/Datum"

type FormType = FormProps<typeof UpdateDatum>

type Props = Omit<FormType, "onSubmit" | "property"> & {
  submitText: string
  setItem?: React.Dispatch<React.SetStateAction<ChildItem>>
  item?: ChildItem
  onSubmit?: FormType["onSubmit"]
  property: ChildItem["properties"][number]
}

const safeURL = (url: string | null) => {
  if (!url) return

  let validURL
  try {
    validURL = new URL(url)
  } catch (e) {}

  return validURL
}

const byValidURL = (urlToMatch: string | null) => {
  const url = safeURL(urlToMatch)

  if (!url) return () => false

  return (indexer: Indexer) => url.toString().includes(indexer.hostname)
}

export default function PropertyForm({
  children,
  onSubmit,
  property,
  setItem,
  item,
  ...rest
}: Props) {
  const user = useCurrentUser()

  const [indexers] = useQuery(getAllIndexers, {})

  const matchingIndexers = indexers?.filter(byValidURL(property.datum.url))

  const {
    localURL,
    getRootProps,
    open,
    fileInput,
    getInputProps,
    filename,
    file,
    progress,
    done,
  } = useFileUpload()

  return (
    <>
      <Form
        {...rest}
        onSubmit={async (values, form, cb) => {
          await onSubmit?.(
            { ...values, fileId: file?.id?.toString() },
            form,
            cb,
          )
        }}
      >
        <fieldset className="space-y-5">
          <LabeledCheckbox name="featured" />
          <LabeledCheckbox name="global" />
          <LabeledCheckbox name="dynamic" />
        </fieldset>
        <LabeledTextField name="url" />

        {matchingIndexers?.length ? (
          <>
            <div
              className={ct(
                "relative",
                "rounded-md",
                "border",
                "border-gray-300",
                "py-2",
                "px-3",
                "pr-0",
                "shadow-sm",
                "focus-within:border-lime-600",
                "focus-within:ring-1",
                "focus-within:ring-lime-600",
              )}
            >
              <label
                htmlFor="indexerId"
                className={ct(
                  "absolute",
                  "-top-2",
                  "left-2",
                  "-mt-px",
                  "inline-block",
                  "bg-white",
                  "px-1",
                  "text-xs",
                  "font-medium",
                  "capitalize",
                  "text-gray-900",
                )}
              >
                Indexer
              </label>
              <Field
                id="indexerId"
                component="select"
                name="indexerId"
                className={ct(
                  "block",
                  "w-full",
                  "border-0",
                  "p-0",
                  "text-gray-900",
                  "placeholder-gray-500",
                  "focus:ring-0",
                  "sm:text-sm",
                )}
                defaultValue={property.datum.indexerId}
              >
                <option value="">Select Indexer</option>
                {matchingIndexers.map((indexer) => (
                  <option value={indexer.id} key={indexer.id}>
                    {indexer.name}
                  </option>
                ))}
              </Field>
            </div>
          </>
        ) : (
          "No matching indexers"
        )}

        <LabeledTextField name="name" />
        <LabeledTextArea name="text" />
        <LabeledTextField name="group" />
        <LabeledTextField name="digitsAfterDecimal" type="number" />
        <LabeledTextField name="prefix" />
        <LabeledTextField name="postfix" />
        <LabeledTextField name="indexError" />
        {children}
        <div className="sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 mb-3">
          <div className="mt-1 sm:mt-0 sm:col-span-2" {...getRootProps()}>
            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {localURL ? (
                  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                  <img src={localURL} />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                <div className="flex text-sm text-gray-600">
                  {!localURL && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation()

                        open()
                      }}
                      type="button"
                      className={ct(
                        "relative",
                        "cursor-pointer",
                        "rounded-md",
                        "bg-white",
                        "font-medium",
                        "text-lime-600",
                        "focus-within:outline-none",
                        "focus-within:ring-2",
                        "focus-within:ring-lime-500",
                        "focus-within:ring-offset-2",
                        "hover:text-lime-500",
                      )}
                    >
                      <span>Upload a file</span>
                    </button>
                  )}

                  <input
                    ref={fileInput}
                    id="file-upload"
                    name="file-upload"
                    className="sr-only"
                    {...getInputProps()}
                  />
                  {localURL ? (
                    done ? (
                      "done uploading"
                    ) : (
                      <div
                        className={ct("h-2", "bg-amber-600")}
                        style={{ width: `${progress}%` }}
                      />
                    )
                  ) : (
                    <p className="pl-1">or drag and drop</p>
                  )}
                </div>
                {!localURL && (
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                )}
                {filename}
              </div>
            </div>
          </div>
        </div>

        {Boolean(property.datum.indexerId) && user && setItem && (
          <Socket {...{ user, property, setItem }} />
        )}

        <FormSpy
          onChange={(props) => {
            if (!props.dirty || !props.active) return

            const dirtyFields = Object.keys(props.dirtyFields)

            const dirtyValues = Object.fromEntries(
              // Empty values aren't included in the form values, but we need to include them for the active field.
              Object.entries({ [props.active]: "", ...props.values }).filter(
                ([key]) => dirtyFields.includes(key),
              ),
            )

            const properties = Object.keys(property)

            const newPropertyValues = Object.fromEntries(
              Object.entries(dirtyValues).filter(([key]) =>
                properties.includes(key),
              ),
            )

            const data = Object.keys(property.datum)

            const newDataValues = Object.fromEntries(
              Object.entries(dirtyValues).filter(([key]) => data.includes(key)),
            )

            const modifiedProperty = {
              ...property,
              ...newPropertyValues,
              datum: { ...property.datum, ...newDataValues },
            }

            setItem?.((prevItem) => ({
              ...prevItem,
              properties: prevItem.properties.map((p) =>
                p.id === property.id ? modifiedProperty : p,
              ),
            }))
          }}
        />
      </Form>
    </>
  )
}

type IndexerProps = {
  user: Exclude<ReturnType<typeof useCurrentUser>, null>
  property: ChildItem["properties"][number]
  setItem: React.Dispatch<React.SetStateAction<ChildItem>>
}

const Socket = ({ user, setItem }: IndexerProps) => {
  const {
    lastJsonMessage,
  }: { lastJsonMessage: { updatedData: Datum[] } | null } = useWebSocket(
    `${window.location.protocol.endsWith("s:") ? "wss" : "ws"}://${
      window.location.host
    }/api/users/dataUpdates/${user?.id}`,
  )

  useEffect(() => {
    if (!lastJsonMessage) return

    setItem((prevItem) => ({
      ...prevItem,
      properties: prevItem.properties.map((prevProperty) => {
        const updatedDatum = lastJsonMessage?.updatedData.find(
          (datum) => datum.id === prevProperty.datum.id,
        )
        if (updatedDatum) {
          return {
            ...prevProperty,
            datum: { ...prevProperty.datum, ...updatedDatum },
          }
        }
        return prevProperty
      }),
    }))
  }, [lastJsonMessage, setItem])

  return null
}
