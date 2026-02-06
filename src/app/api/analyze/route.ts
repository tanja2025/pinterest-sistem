import { analyzeImage } from "@/lib/openai";
import { generatePinVariants } from "@/lib/pin-generator";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { assetId, imageUrl } = await req.json();

        if (!assetId || !imageUrl) {
            return NextResponse.json({ error: "Missing assetId or imageUrl" }, { status: 400 });
        }

        // 1. Analyze with OpenAI
        const analysis = await analyzeImage(imageUrl);

        // 2. Update asset analysis and status
        const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const { error: assetError } = await supabase
            .from('assets')
            .update({
                analysis,
                status: 'ready',
                share_token: shareToken
            })
            .eq('id', assetId);

        if (assetError) throw assetError;

        // 3. Generate Pin Variants
        const pinVariants = await generatePinVariants(analysis);

        // 4. Save Pins to database
        const pinsToInsert = pinVariants.map((pin: any) => ({
            asset_id: assetId,
            type: pin.type,
            title: pin.title,
            description: pin.description,
            status: 'planned',
            board_name: analysis.suggested_boards?.[0] || 'Home Decor'
        }));

        const { error: pinError } = await supabase
            .from('pins')
            .insert(pinsToInsert);

        if (pinError) throw pinError;

        return NextResponse.json({ success: true, analysis, pinsGenerated: pinsToInsert.length });
    } catch (error) {
        console.error("Analysis and generation failed:", error);
        return NextResponse.json({ error: "Process failed" }, { status: 500 });
    }
}
