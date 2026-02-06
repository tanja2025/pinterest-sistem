import { analyzeImage } from "@/lib/openai";
import { generatePinVariants } from "@/lib/pin-generator";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let currentAssetId: string | null = null;
    try {
        const { assetId, imageUrl } = await req.json();
        currentAssetId = assetId;

        if (!assetId || !imageUrl) {
            return NextResponse.json({ error: "Missing assetId or imageUrl" }, { status: 400 });
        }

        // 1. Analyze and Generate Pins with OpenAI in one go (faster for Vercel)
        const analysisPrompt = `
            Analyze this image for Pinterest. Provide a JSON response with the following keys:
            - niche: a broad category
            - keywords: a list of 10-15 relevant keywords
            - description: a 2-sentence visual description
            - suggested_boards: 3-5 board names
            - pins: an array of 3 objects with 'type' (SEO, Buyer Intent, Curiosity), 'title', and 'description'
        `;

        const response = await analyzeImage(imageUrl, analysisPrompt);

        // 2. Update asset analysis and status
        const shareToken = Math.random().toString(36).substring(2, 15);
        const { error: assetError } = await supabase
            .from('assets')
            .update({
                analysis: {
                    niche: response.niche,
                    keywords: response.keywords,
                    description: response.description,
                    suggested_boards: response.suggested_boards
                },
                status: 'ready',
                share_token: shareToken
            })
            .eq('id', assetId);

        if (assetError) throw assetError;

        // 3. Save Pins to database
        const pinsToInsert = response.pins.map((pin: any) => ({
            asset_id: assetId,
            type: pin.type,
            title: pin.title,
            description: pin.description,
            status: 'planned',
            board_name: response.suggested_boards?.[0] || 'Home Decor'
        }));

        const { error: pinError } = await supabase
            .from('pins')
            .insert(pinsToInsert);

        if (pinError) throw pinError;

        return NextResponse.json({ success: true, pinsGenerated: pinsToInsert.length });
    } catch (error) {
        console.error("Analysis failed:", error);
        // Fallback: mark as failed in DB so it doesn't stay analyzing
        if (currentAssetId) {
            await supabase.from('assets').update({ status: 'failed' }).eq('id', currentAssetId);
        }
        return NextResponse.json({ error: "Process failed" }, { status: 500 });
    }
}
