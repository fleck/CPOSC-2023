import ct from "class-types.macro"
import { forwardRef, PropsWithoutRef } from "react"
import { useField } from "react-final-form"

export interface LabeledTextFieldProps
  extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label?: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

// https://tailwindui.com/components/application-ui/forms/input-groups#component-bd664362c1ab2e20c6dc4c0ee14c4984
export const LabeledTextField = forwardRef<
  HTMLInputElement,
  LabeledTextFieldProps
>(({ name, label, outerProps, type = "text", ...props }, ref) => {
  const {
    input,
    meta: { touched, error, submitError, submitting },
  } = useField(name, {
    parse:
      type === "number"
        ? (value) =>
            typeof value === "string" && value.trim().length > 0
              ? Number(value)
              : null
        : undefined,
  })

  const normalizedError = Array.isArray(error)
    ? error.join(", ")
    : error || submitError

  return (
    <div
      {...outerProps}
      className={ct(
        "relative",
        "rounded-md",
        "border",
        "border-gray-300",
        "py-2",
        "px-3",
        "shadow-sm",
        "focus-within:border-lime-600",
        "focus-within:ring-1",
        "focus-within:ring-lime-600",
      )}
    >
      <label
        htmlFor={name}
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
        {name}
      </label>
      <input
        {...input}
        disabled={submitting}
        type={type}
        id={name}
        {...props}
        ref={ref}
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
      />

      {touched && normalizedError && (
        <div role="alert" style={{ color: "red" }}>
          {normalizedError}
        </div>
      )}
    </div>
  )
})

export default LabeledTextField
