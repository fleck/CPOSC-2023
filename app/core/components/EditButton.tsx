import ct from "class-types.macro"

const colors = {
  amber: ct("bg-amber-600", "hover:bg-amber-700", "focus:ring-amber-500"),
  gray: ct("bg-gray-600", "hover:bg-gray-700", "focus:ring-gray-500"),
}

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: ClassTypes
} & {
  color: keyof typeof colors
}

export default function EditButton({
  className = "",
  children,
  color,
  ...props
}: Props) {
  return (
    <button
      type="button"
      aria-label="Edit"
      className={ct(
        "flex",
        "items-center",
        "rounded-full",
        "border",
        "border-transparent",
        "p-1",
        "text-white",
        "shadow-sm",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-amber-500",
        "focus:ring-offset-2",
        className,
        colors[color],
      )}
      {...props}
    >
      {children}
    </button>
  )
}
