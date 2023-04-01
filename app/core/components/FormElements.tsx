import ct from "class-types.macro"
import React, { useId } from "react"

export function Checkbox({
  label,
  ...props
}: Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "type" | "id"
> & { label: string; className?: ClassTypes }) {
  const id = useId()

  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
      </div>
    </div>
  )
}

export const SelectInput = ({
  children,
  label,
  ...props
}: Omit<
  React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >,
  "type" | "id"
> & { label: string; className?: ClassTypes }) => {
  const id = useId()

  return (
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
        htmlFor={id}
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
        {label}
      </label>
      <select
        id={id}
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
        {...props}
      >
        {children}
      </select>
    </div>
  )
}

export const TextInput = (
  props: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "id"
  > & { label: string; className?: ClassTypes },
) => {
  const id = useId()

  return (
    <div
      className={ct(
        "relative",
        "rounded-md",
        "border",
        "border-gray-300",
        "py-2",
        "px-3",
        "shadow-sm",
        "focus-within:border-indigo-600",
        "focus-within:ring-1",
        "focus-within:ring-indigo-600",
        props.className || "",
      )}
    >
      <label
        htmlFor={id}
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
          "text-gray-900",
        )}
      >
        {props.label}
      </label>
      <input
        {...props}
        id={id}
        className={ct(
          "block",
          "w-full",
          "border-0",
          "p-0",
          "text-gray-900",
          "placeholder-gray-500",
          "focus:ring-0",
          "focus-visible:outline-none",
          "sm:text-sm",
        )}
      />
    </div>
  )
}
