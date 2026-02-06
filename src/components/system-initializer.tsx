"use client"

import { useEffect, useState } from "react";
import { initializeAppData } from "@/lib/init";
import { Button } from "@/components/ui/button";
import { Database, Loader2, CheckCircle } from "lucide-react";

export function SystemInitializer() {
    const [status, setStatus] = useState<'idle' | 'initializing' | 'done'>('idle');

    const handleInit = async () => {
        setStatus('initializing');
        try {
            await initializeAppData();
            setStatus('done');
        } catch (error) {
            console.error("Init failed:", error);
            setStatus('idle');
        }
    };

    return (
        <div className="flex items-center gap-2">
            {status === 'done' ? (
                <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                    <CheckCircle className="h-3 w-3" /> System Ready
                </div>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-8 px-4 text-xs gap-2 border-zinc-200 dark:border-zinc-800"
                    onClick={handleInit}
                    disabled={status === 'initializing'}
                >
                    {status === 'initializing' ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <Database className="h-3 w-3" />
                    )}
                    {status === 'initializing' ? "Seeding..." : "Initialize System"}
                </Button>
            )}
        </div>
    );
}
