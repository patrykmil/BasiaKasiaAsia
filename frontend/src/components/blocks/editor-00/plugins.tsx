"use client"

import { useState } from "react"
import { ListItemNode, ListNode } from "@lexical/list"
import type { InitialConfigType } from "@lexical/react/LexicalComposer"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
// ListPlugin is intentionally not imported to avoid runtime errors when list nodes are not registered.
// import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ParagraphNode, TextNode } from "lexical"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import Toolbar from "@/components/editor/plugins/toolbar/toolbar"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
  ],
  onError: (error: Error) => {
    console.error(error)
  },
}

export function RichTextEditorDemo() {
  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <Plugins />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}

const placeholder = "Start typing..."

export function Plugins() {
  const [_floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (elem: HTMLDivElement) => {
    if (elem !== null) {
      setFloatingAnchorElem(elem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {() => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <Toolbar />
          </div>
        )}
        
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
    {/* List and checklist plugins removed to avoid runtime errors when list nodes are not registered.
      If you want list support, register ListNode and ListItemNode (and any checklist nodes) in the editor's nodes array. */}
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
export default RichTextEditorDemo