"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteAssetProps {
    assetId: string;
    imageUrl: string;
}

export function DeleteAsset({ assetId, imageUrl }: DeleteAssetProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
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
            router.push('/assets')
            router.refresh()
        } catch (error: any) {
            toast.error("Delete failed: " + error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600 transition-colors"
                    disabled={isDeleting}
                >
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the image
                        and all generated pin variants.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
