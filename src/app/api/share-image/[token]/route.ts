import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token: rawToken } = await params;
    const token = rawToken.replace(/\.(jpg|jpeg|png|webp)$/i, '');

    try {
        const { data: asset, error } = await supabase
            .from('assets')
            .select('image_url')
            .eq('share_token', token)
            .single();

        if (error || !asset) {
            return new NextResponse("Image not found", { status: 404 });
        }

        const imageRes = await fetch(asset.image_url);
        if (!imageRes.ok) throw new Error("Failed to fetch image from storage");

        const imageBuffer = await imageRes.arrayBuffer();

        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
                "Content-Length": imageRes.headers.get("Content-Length") || imageBuffer.byteLength.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Failed to proxy image", { status: 500 });
    }
}
