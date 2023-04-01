import { toggleBold, toggleItalic } from "app/core/components/RichTextEditor"
import { useProseMirror } from "use-prosemirror"
import { history, redo, undo } from "prosemirror-history"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { schema } from "prosemirror-schema-basic"

export const proseMirrorOptions: Parameters<typeof useProseMirror>[0] = {
  schema,
  plugins: [
    history(),
    keymap({
      ...baseKeymap,
      "Mod-z": undo,
      "Mod-y": redo,
      "Mod-Shift-z": redo,
      "Mod-b": toggleBold,
      "Mod-i": toggleItalic,
    }),
  ],
}
