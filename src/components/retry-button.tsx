"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface RetryButtonProps {
    assetId: string;
    imageUrl: string;
    status: string;
}

export function RetryButton({ assetId, imageUrl, status }: RetryButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRetry = async () => {
        try {
            setIsLoading(true)
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId, imageUrl })
            });

            if (res.ok) {
                toast.success("Analysis started!")
                router.refresh()
            } else {
                toast.error("Retry failed. Please try again.")
            }
        } catch (error) {
            toast.error("Connection error. Check your internet.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleRetry}
            disabled={isLoading}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white min-w-[140px]"
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                status === 'analyzing' ? "Force Retry" : "Try Again"
            )}
        </Button>
    )
}
