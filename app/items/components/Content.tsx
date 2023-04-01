import { createElement } from "react"
import { marks, nodes } from "prosemirror-schema-basic"

type Mark = {
  type: keyof typeof marks
  attributes: { [key: string]: unknown }
}

type Inline = {
  text: string
  type: string
  marks?: Mark[]
}

export type BlockProps = {
  type: keyof typeof nodes
  content: {
    type: string
    content?: Inline[]
  }[]
} | null

export const mapContent = (contentState: BlockProps) => {
  return contentState?.content?.map((block) => {
    if (block.type === "paragraph" && block.content) {
      return createElement(
        "p",
        { key: JSON.stringify(block.content) },
        block.content?.map(inline),
      )
    }
  })
}

const inline = (inlineContent: Inline) => {
  if (inlineContent.marks) {
    return createMarks(inlineContent.marks, inlineContent.text)
  } else {
    return inlineContent.text
  }
}

const createMarks = (
  marks: Mark[],
  text: string,
  index = 0,
): React.DetailedReactHTMLElement<{}, HTMLElement> | undefined => {
  const mark = marks[index]
  const nextMark = marks[index + 1]
  if (mark) {
    return createElement(
      mark.type === "link" ? "a" : mark.type,
      { key: mark.type + index, ...mark.attributes },
      nextMark ? createMarks(marks, text, index + 1) : text,
    )
  }
}
