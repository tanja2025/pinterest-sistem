import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token: rawToken } = await params;
    const token = rawToken.replace(/\.(jpg|jpeg|png|webp)$/i, '');

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

        // Redirect directly to the Supabase public URL
        // Pinterest handles redirects well and this is more reliable than streaming
        return NextResponse.redirect(asset.image_url, {
            status: 302
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return new NextResponse("Failed to proxy image", { status: 500 });
    }
}
