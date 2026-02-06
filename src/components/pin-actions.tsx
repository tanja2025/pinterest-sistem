"use client"

import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface PinActionsProps {
    pinId: string;
    assetId: string;
    shareToken: string;
    title: string;
    description: string;
}

export function PinActions({ pinId, assetId, shareToken, title, description }: PinActionsProps) {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const handlePinterestCreate = () => {
        const appUrl = window.location.origin;
        const shareUrl = `${appUrl}/p/${shareToken}`;
        const imageUrl = `${appUrl}/api/share-image/${shareToken}`;

        const params = new URLSearchParams({
            url: shareUrl,
            media: imageUrl,
            description: description,
            is_video: 'false'
        });

        const pinterestUrl = `https://www.pinterest.com/pin/create/button/?${params.toString()}`;

        window.open(pinterestUrl, "_blank");
        toast.success("Opening Pinterest Create flow!");
    };

    const handleSchedule = async () => {
        setIsScheduling(true);
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { error } = await supabase
                .from('schedule')
                .insert({
                    pin_id: pinId,
                    scheduled_at: tomorrow.toISOString(),
                    is_posted: false
                });

            if (error) throw error;
            toast.success("Pin scheduled for tomorrow!");
        } catch (error: any) {
            toast.error("Failed to schedule: " + error.message);
        } finally {
            setIsScheduling(false);
        }
    };

    const handleMarkAsPosted = async () => {
        setIsPosting(true);
        try {
            // Update in schedule table if it exists
            const { error } = await supabase
                .from('schedule')
                .update({ is_posted: true })
                .eq('pin_id', pinId);

            if (error) throw error;
            toast.success("Pin marked as Shared!");
        } catch (error: any) {
            toast.error("Failed to update status: " + error.message);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-8"
                    onClick={handlePinterestCreate}
                >
                    <ExternalLink className="mr-2 h-3 w-3" /> Pinterest Create
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-xs h-8 text-zinc-500 hover:text-green-600"
                        onClick={handleMarkAsPosted}
                        disabled={isPosting}
                    >
                        <CheckCircle className="mr-2 h-3 w-3" /> Mark Shared
                    </Button>
                    <Button
                        className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs h-8 px-6"
                        onClick={handleSchedule}
                        disabled={isScheduling}
                    >
                        {isScheduling ? "Scheduling..." : "Schedule Pin"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
