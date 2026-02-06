"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            className={`h-8 w-8 p-0 opacity-0 group-hover/title:opacity-100 group-hover/desc:opacity-100 transition-opacity ${copied ? 'text-green-500 hover:text-green-600' : 'text-zinc-400'}`}
        >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
    )
}
