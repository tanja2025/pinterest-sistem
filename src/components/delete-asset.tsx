"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DeleteAssetProps {
    assetId: string;
    imageUrl: string;
}

export function DeleteAsset({ assetId, imageUrl }: DeleteAssetProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this asset? This will also delete all its variants.")) {
            return;
        }

        try {
            setIsDeleting(true)

            // 1. Delete from Storage if it's a Supabase URL
            if (imageUrl.includes('supabase.co')) {
                const path = imageUrl.split('/').pop()
                if (path) {
                    await supabase.storage
                        .from('assets')
                        .remove([`uploads/${path}`])
                }
            }

            // 2. Delete from Database (Pins will be deleted via CASCADE)
            const { error } = await supabase
                .from('assets')
                .delete()
                .eq('id', assetId)

            if (error) throw error

            toast.success("Asset deleted successfully")

            // If we are on the detail page, go back to assets list
            if (window.location.pathname.includes(assetId)) {
                router.push('/assets')
            }

            router.refresh()
        } catch (error: any) {
            toast.error("Delete failed: " + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 transition-colors bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full shadow-sm"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
            }}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    )
}
