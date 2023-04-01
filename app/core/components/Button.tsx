import ct from "class-types.macro"
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react"

const colors = {
  lime: ct("bg-lime-600", "hover:bg-lime-700", "focus:ring-lime-500"),
  amber: ct("bg-amber-600", "hover:bg-amber-700", "focus:ring-amber-500"),
  cyan: ct("bg-cyan-600", "hover:bg-cyan-700", "focus:ring-cyan-500"),
  red: ct("bg-red-600", "hover:bg-red-700", "focus:ring-red-500"),
  gray: ct(
    "border-gray-300",
    "bg-white",
    "text-gray-700",
    "hover:bg-gray-50",
    "focus:ring-indigo-500",
  ),
}

type Props = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color: keyof typeof colors
  className?: ClassTypes
}

export default forwardRef<HTMLButtonElement, Props>(function Button(
  { className = "", ...props },
  ref,
) {
  return (
    <button
      {...props}
      className={ct(
        "inline-flex",
        "justify-center",
        "rounded-md",
        "border",
        "border-transparent",
        "px-4",
        "py-2",
        "text-sm",
        "font-medium",
        "text-white",
        "shadow-sm",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
        props.color ? colors[props.color] : "",
        className,
      )}
      ref={ref}
    >
      {props.children}
    </button>
  )
})
