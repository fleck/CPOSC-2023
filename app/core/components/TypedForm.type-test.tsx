import React from "react"
import { createForm } from "./TypedForm"

interface User {
  id: number
  name: string
  email: string
  address: {
    id: number
    street: string
    city: string
    state: string
    zip: number
  }
  properties: {
    id: number
    type: number
  }[]
  hostnames: string[]
  readonly hostnamesReadonly: readonly string[]
  readonly propertiesReadonly: readonly {
    readonly id: number
    readonly datum: { name: string }
  }[]
}

const { Form } = createForm({
  formComponents: {
    /**
     * Ensure components that accept different props are allowed to be added.
     */
    TextInput: (
      props: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
    ) => <input {...props} />,
    SelectInput: (
      props: React.DetailedHTMLProps<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
      >,
    ) => <select {...props} />,
  },
})

const FormTest = () => (
  <>
    {/* Test against model */}
    <Form<User>>
      {({ TextInput }) => (
        <>
          <TextInput name="id" />
          <TextInput name="name" />
          <TextInput name="email" />
          <TextInput name="address[street]" />
          <TextInput name="properties[0][type]" />
          <TextInput name="properties[0][id]" />
          <TextInput name="hostnames[]" />
          <TextInput name="hostnamesReadonly[]" />
          <TextInput name="propertiesReadonly[0][id]" />
          <TextInput name="propertiesReadonly[0][datum][name]" />
          {/* @ts-expect-error nested keys should be able to be used as top level keys */}
          <TextInput name="zip" />
          {/* @ts-expect-error keys with array or object values shouldn't be included at the top level */}
          <TextInput name="properties" />
          {/* @ts-expect-error keys with array or object values shouldn't be included at the top level */}
          <TextInput name="address" />
          {/* @ts-expect-error This shouldn't allow empty brackets */}
          <TextInput name="properties[][id]" />
          {/* @ts-expect-error top level keys shouldn't be duplicated with bracket wrapped keys */}
          <TextInput name="[email]" />
        </>
      )}
    </Form>

    {/* @ts-expect-error When a model type argument isn't provided it shouldn't allow any name */}
    <Form>{({ TextInput }) => <TextInput name={""} />}</Form>
  </>
)

console.log({ FormTest })
