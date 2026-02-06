"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Copy,
    ExternalLink,
    CheckCircle2,
    ArrowRight,
    Info,
    Layout
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface PinData {
    id: string;
    title: string;
    description: string;
    destination_url: string;
    board_name: string;
    type: string;
    assets: {
        image_url: string;
        share_token: string;
    }
}

export function ManualShareTool({ initialPin }: { initialPin: PinData | null }) {
    const [pin, setPin] = useState<PinData | null>(initialPin);
    const [isMarking, setIsMarking] = useState(false);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`, {
            description: "Ready to paste on Pinterest.",
            duration: 2000
        });
    };

    const handleShare = () => {
        if (!pin) return;
        const appUrl = window.location.origin;
        const shareUrl = `${appUrl}/p/${pin.assets.share_token}`;
        const imageUrl = `${appUrl}/api/share-image/${pin.assets.share_token}.jpg`;

        const params = new URLSearchParams({
            url: shareUrl,
            media: imageUrl,
            description: pin.description,
            is_video: 'false'
        });

        const pinterestUrl = `https://www.pinterest.com/pin/create/button/?${params.toString()}`;

        window.open(pinterestUrl, "_blank");
        toast.info("Opening Pinterest...", {
            description: "The image will load from our share landing page."
        });
    };

    const handleMarkShared = async () => {
        if (!pin) return;
        setIsMarking(true);
        try {
            const { error } = await supabase
                .from('pins')
                .update({
                    status: 'shared',
                    shared_at: new Date().toISOString()
                })
                .eq('id', pin.id);

            if (error) throw error;

            toast.success("Marked as Shared!", {
                description: "This pin is now archived. Fetching next..."
            });

            // Fetch next planned pin
            const { data: nextPin } = await supabase
                .from('pins')
                .select('*, assets(*)')
                .eq('status', 'planned')
                .order('created_at', { ascending: true })
                .limit(1)
                .single();

            setPin(nextPin as any);
        } catch (error: any) {
            toast.error("Failed to update: " + error.message);
        } finally {
            setIsMarking(false);
        }
    };

    if (!pin) {
        return (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <Layout className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">No planned pins found.</p>
                <p className="text-sm text-zinc-400 mt-1 mb-6">Analyze an asset to generate new variants.</p>
                <Button variant="outline" className="rounded-full" asChild>
                    <a href="/assets">Go to Assets & Upload</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Preview Section */}
            <div className="space-y-6">
                <Card className="overflow-hidden border-none shadow-2xl rounded-[2rem] bg-white dark:bg-zinc-900">
                    <img
                        src={pin.assets.image_url}
                        alt="Preview"
                        className="w-full aspect-[3/4] object-cover"
                    />
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                {pin.type} VARIANT
                            </span>
                        </div>
                        <h3 className="font-bold text-lg leading-tight">{pin.title}</h3>
                    </div>
                </Card>

                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl flex gap-3 border border-red-100 dark:border-red-900/20">
                    <Info className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-900 dark:text-red-200">How to post manually:</p>
                        <ol className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 space-y-1 list-decimal ml-4">
                            <li>Click "Open Pinterest" to load the image automatically.</li>
                            <li>Copy and paste Title, Description, and Link.</li>
                            <li>Select the correct Board and click Publish.</li>
                            <li>Come back here and "Mark Shared".</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Copy & Action Section */}
            <div className="space-y-6">
                <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 p-6 rounded-[2rem] space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 px-1">Title</label>
                            <div
                                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer group"
                                onClick={() => copyToClipboard(pin.title, "Title")}
                            >
                                <p className="text-sm font-medium pr-4 truncate">{pin.title}</p>
                                <Copy className="h-4 w-4 text-zinc-400 shrink-0 group-hover:text-red-600 transition-colors" />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 px-1">Description</label>
                            <div
                                className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer group relative"
                                onClick={() => copyToClipboard(pin.description, "Description")}
                            >
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-8 line-clamp-4">
                                    {pin.description}
                                </p>
                                <Copy className="h-4 w-4 text-zinc-400 absolute top-3 right-3 group-hover:text-red-600 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 px-1">Destination Link</label>
                                <div
                                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer group"
                                    onClick={() => copyToClipboard(pin.destination_url || "https://", "Link")}
                                >
                                    <p className="text-sm font-medium truncate pr-2">{pin.destination_url || 'https://...'}</p>
                                    <Copy className="h-4 w-4 text-zinc-400 shrink-0 group-hover:text-red-600 transition-colors" />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1 px-1">Board</label>
                                <div
                                    className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer group"
                                    onClick={() => copyToClipboard(pin.board_name || "General", "Board Name")}
                                >
                                    <p className="text-sm font-medium truncate pr-2">{pin.board_name || 'Home Decor'}</p>
                                    <Copy className="h-4 w-4 text-zinc-400 shrink-0 group-hover:text-red-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button
                            className="w-full h-14 rounded-2xl text-lg font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none"
                            onClick={handleShare}
                        >
                            <ExternalLink className="mr-2 h-5 w-5" /> Open Pinterest Create
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-14 rounded-2xl text-lg font-bold border-2"
                            onClick={handleMarkShared}
                            disabled={isMarking}
                        >
                            {isMarking ? "Updating..." : <><CheckCircle2 className="mr-2 h-5 w-5 text-green-600" /> Mark as Shared</>}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
