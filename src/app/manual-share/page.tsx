import { supabase } from "@/lib/supabase";
import { ManualShareTool } from "@/components/manual-share-tool";

export const dynamic = 'force-dynamic'

export default async function ManualSharePage() {
    // Fetch the next pin that is planned, ordered by creation (first in, first out)
    const { data: firstPin } = await supabase
        .from('pins')
        .select('*, assets(*)')
        .eq('status', 'planned')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Manual Share</h1>
                <p className="text-zinc-500">The most efficient way to post your generated variants.</p>
            </div>

            <ManualShareTool initialPin={firstPin as any} />
        </div>
    );
}
