import type { Component } from "solid-js"
import { createEffect, createSignal, on, Show, splitProps } from "solid-js"

import { As } from "@kobalte/core"
import { TbCheck, TbCopy } from "solid-icons/tb"

import { cn } from "~/lib/utils"
import type { ToggleProps } from "~/registry/ui/toggle"
import { Toggle } from "~/registry/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/registry/ui/tooltip"

export interface CopyButtonProps extends ToggleProps {
  content: string
}

const CopyButton: Component<CopyButtonProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "content"])
  const [isCopied, setCopied] = createSignal(false)

  createEffect(
    on(
      isCopied,
      () => {
        if (isCopied()) {
          copyToClipboard(props.content)
          setTimeout(() => {
            setCopied(false)
          }, 2000)
        }
      },
      { defer: true }
    )
  )

  return (
    <>
      <Tooltip placement="top">
        <TooltipTrigger asChild>
          <As
            component={Toggle}
            onChange={setCopied}
            pressed={isCopied()}
            disabled={isCopied()}
            class={cn(
              "z-10 size-6 p-2 text-zinc-50 transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              props.class
            )}
            {...rest}
          >
            <Show when={isCopied()} fallback={<TbCopy class="size-4" />}>
              <TbCheck class="size-4" />
            </Show>
          </As>
        </TooltipTrigger>
        <TooltipContent>{isCopied() ? `Copied!` : `Copy to Clipboard`}</TooltipContent>
      </Tooltip>
    </>
  )
}

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Async: Copying to clipboard was successful!")
      },
      (err) => {
        console.log("Async: Could not copy text: ", err)
      }
    )
    return
  }
}

export { CopyButton }
