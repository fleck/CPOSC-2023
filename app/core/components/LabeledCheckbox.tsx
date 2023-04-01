import ct from "class-types.macro"
import { forwardRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledTextFieldProps
  extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  fieldProps?: UseFieldConfig<string>
  formId?: string
}

/** https://tailwindui.com/components/application-ui/forms/checkboxes */
export const LabeledCheckbox = forwardRef<
  HTMLInputElement,
  LabeledTextFieldProps
>(
  (
    {
      name,
      id,
      label,
      fieldProps,
      outerProps,
      formId = `${name}-${id}`,
      ...props
    },
    ref,
  ) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      type: "checkbox",
      ...fieldProps,
    })

    const normalizedError = Array.isArray(error)
      ? error.join(", ")
      : error || submitError

    return (
      <div {...outerProps} className={ct("relative", "flex", "items-start")}>
        <div className="flex items-center h-5">
          <input
            id={id}
            disabled={submitting}
            ref={ref}
            {...input}
            {...props}
            aria-describedby="comments-description"
            className="focus:ring-lime-500 h-4 w-4 text-lime-600 border-gray-300 rounded"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={formId}
            className="font-medium text-gray-700 capitalize"
          >
            {name}
          </label>
          {/* <span id="comments-description" className="text-gray-500">
          <span className="sr-only">New comments </span>so you always know what's happening.
        </span> */}
        </div>
        {touched && normalizedError && (
          <div role="alert" style={{ color: "red" }}>
            {normalizedError}
          </div>
        )}
      </div>
    )
  },
)

export default LabeledCheckbox
