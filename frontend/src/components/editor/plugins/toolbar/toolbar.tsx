"use client"
import { FORMAT_TEXT_COMMAND, type TextFormatType } from "lexical"
import { useToolbarContext } from "@/components/editor/context/toolbar-context"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline } from "lucide-react"

export function Toolbar() {
  const { activeEditor } = useToolbarContext()

  const format = (style: TextFormatType) => {
    try {
      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, style)
    } catch (e) {
      // If dispatchCommand isn't available for some editor instances, fail silently
      // The toolbar is best-effort; more commands can be added later.
      // eslint-disable-next-line no-console
      console.error("Toolbar format error:", e)
    }
  }

  return (
    <div className="flex items-center gap-2 border-b px-4 py-2 bg-muted">
      <Button variant="ghost" size="icon" onClick={() => format("bold" as TextFormatType)} aria-label="Bold">
        <Bold className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => format("italic" as TextFormatType)} aria-label="Italic">
        <Italic className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => format("underline" as TextFormatType)} aria-label="Underline">
        <Underline className="size-4" />
        
      </Button>
    </div>
  )
}

export default Toolbar
