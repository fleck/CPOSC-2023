import ct from "class-types.macro"
import React from "react"

type Props = {
  size?: "2xl" | "3xl"
  children: React.ReactNode
  className?: ClassTypes
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

export function Heading({
  size = "3xl",
  children,
  className = "",
  ...props
}: Props) {
  const Element = size === "3xl" ? "h1" : "h2"

  return (
    <Element
      className={ct(
        "flex",
        "items-center",
        "leading-8",
        "tracking-tight",
        "text-gray-900",
        size === "3xl"
          ? ct("text-3xl", "font-extrabold", "sm:text-4xl")
          : ct("text-2xl", "font-semibold", "sm:text-3xl"),
        className,
      )}
      {...props}
    >
      {children}
    </Element>
  )
}
