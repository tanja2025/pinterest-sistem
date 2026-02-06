import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Pin as PinIcon } from "lucide-react";
import { format } from "date-fns";

export const dynamic = 'force-dynamic'

export default async function SchedulePage() {
    const { data: schedule } = await supabase
        .from('schedule')
        .select(`
            *,
            pins (
                title,
                type,
                assets (
                    image_url
                )
            )
        `)
        .order('scheduled_at', { ascending: true });

    const entries = schedule || [];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Planner</h1>
                <p className="text-zinc-500">Your content calendar for the next few days.</p>
            </div>

            {entries.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-zinc-400" />
                    </div>
                    <p className="text-zinc-500">No pins scheduled yet. Analyze an asset to start planning.</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {/* Simplified grouping by day for MVP */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-red-600" />
                            Upcoming Posts
                        </h2>
                        <div className="grid gap-4">
                            {entries.map((entry: any) => (
                                <Card key={entry.id} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white dark:bg-zinc-900">
                                    <div className="flex items-center p-4 gap-4">
                                        <div className="w-16 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={entry.pins?.assets?.image_url}
                                                alt="Pin"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 px-1.5 py-0.5 bg-red-50 dark:bg-red-900/20 rounded">
                                                    {entry.pins?.type}
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    {format(new Date(entry.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                {entry.pins?.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {entry.is_posted ? (
                                                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Posted
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Scheduled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
