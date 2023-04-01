import { DocumentDuplicateIcon, XCircleIcon } from "@heroicons/react/outline"
import Button from "app/core/components/Button"
import EditButton from "app/core/components/EditButton"
import { TextInput } from "app/core/components/FormElements"
import ct from "class-types.macro"
import debounce from "lodash/debounce"
import React, { Dispatch, SetStateAction } from "react"
import { useState } from "react"
import { withReactQuery, trpc } from "utils/trpc"
import { ChildOrRootItem } from "../queries/getRootItem"

const label = "Add property from template"

type Props = {
  item: ChildOrRootItem
  setItem: Dispatch<SetStateAction<ChildOrRootItem>>
}

export default withReactQuery(function AddNewPropertiesFromTemplate({
  item,
  setItem,
}: Props) {
  const [editing, setEditing] = useState(false)

  const [url, setUrl] = useState("")

  const { data: propertyTemplates, error } = trpc.propertyTemplates.useQuery(
    { url },
    { enabled: Boolean(url) },
  )

  const { error: mutationError, mutate } =
    trpc.createPropertiesFromTemplate.useMutation()

  if (!editing) {
    return (
      <EditButton
        aria-label={label}
        title={label}
        className={ct("mx-auto", "my-2")}
        color="amber"
        onClick={() => setEditing(true)}
      >
        <DocumentDuplicateIcon className={ct("h-4", "w-4")} />
      </EditButton>
    )
  }

  return (
    <>
      {[error, mutationError].map(
        (error) =>
          error && (
            <div key={error.toString()} className={ct("text-red-700")}>
              {error.toString()}
            </div>
          ),
      )}

      <EditButton
        className={ct("mr-2", "h-7", "w-7", "flex-shrink-0")}
        onClick={() => setEditing(false)}
        color="gray"
        title="Cancel adding property template"
        aria-label={`Cancel adding property template`}
      >
        <XCircleIcon />
      </EditButton>

      <form>
        <TextInput
          label="URL"
          placeholder="url"
          onChange={debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            setUrl(event.target.value)
          }, 500)}
        />
      </form>

      {!!propertyTemplates?.length && (
        <div>
          {propertyTemplates.map((propertyTemplate) => (
            <React.Fragment key={propertyTemplate.id.toString()}>
              Name: {propertyTemplate.name}{" "}
              <div>
                Properties that will be added:{" "}
                {propertyTemplate.properties.map((property) => (
                  <React.Fragment key={property.id.toString()}>
                    {property.datum.name}
                  </React.Fragment>
                ))}
              </div>
              <form
                onSubmit={async (event) => {
                  event.preventDefault()

                  mutate(
                    {
                      propertyTemplateId: propertyTemplate.id,
                      itemId: item.id,
                      url,
                    },
                    {
                      onSuccess: (properties) => {
                        setItem((item) => ({
                          ...item,
                          properties: [...item.properties, ...properties],
                        }))

                        setEditing(false)
                      },
                    },
                  )
                }}
              >
                <Button color="lime">Add the properties above</Button>
              </form>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
})
