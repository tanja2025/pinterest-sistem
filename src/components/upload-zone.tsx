"use client"

import { useState } from "react"
import { Upload, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function UploadZone() {
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)

            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `uploads/${fileName}`

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            // 3. Create entry in Database
            const { data: assetData, error: dbError } = await supabase
                .from('assets')
                .insert({
                    image_url: publicUrl,
                    status: 'analyzing'
                })
                .select()
                .single()

            if (dbError) throw dbError

            // 4. Trigger AI Analysis
            await fetch('/api/analyze', {
                method: 'POST',
                body: JSON.stringify({
                    assetId: assetData.id,
                    imageUrl: publicUrl
                })
            })

            // 5. Redirect to the asset page
            router.push(`/assets/${assetData.id}`)
            router.refresh()

        } catch (error) {
            console.error("Upload failed:", error)
            alert("Upload failed. Make sure you have created the 'assets' bucket in Supabase and enabled RLS.")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                        <Loader2 className="w-12 h-12 text-zinc-400 animate-spin mb-4" />
                    ) : (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-red-600" />
                        </div>
                    )}
                    <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-200 font-semibold">
                        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-zinc-500">PNG, JPG or WebP (Max 10MB)</p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={isUploading}
                />
            </label>
        </div>
    )
}
