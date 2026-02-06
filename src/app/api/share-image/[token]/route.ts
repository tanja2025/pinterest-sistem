import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    try {
        // 1. Get the asset by share_token
        const { data: asset, error } = await supabase
            .from('assets')
            .select('image_url')
            .eq('share_token', token)
            .single();

        if (error || !asset) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // 2. Fetch the image from the URL
        const imageRes = await fetch(asset.image_url);
        const imageBuffer = await imageRes.arrayBuffer();

        // 3. Return the image with correct headers
        return new NextResponse(imageBuffer, {
            headers: {
                "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Failed to proxy image", { status: 500 });
    }
}
