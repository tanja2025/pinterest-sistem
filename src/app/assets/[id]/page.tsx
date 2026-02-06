import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import { Asset, Pin } from "@/types";
import { CopyButton } from "@/components/copy-button";
import { PinActions } from "@/components/pin-actions";
import { DeleteAsset } from "@/components/delete-asset";

export const dynamic = 'force-dynamic'

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Fetch Asset
    const { data: asset } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();

    // 2. Fetch Pins
    const { data: pins } = await supabase
        .from('pins')
        .select('*')
        .eq('asset_id', id);

    if (!asset) return <div>Asset not found</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Image & Analysis */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="overflow-hidden border-none shadow-lg relative group">
                        <img src={asset.image_url} alt="Asset" className="w-full h-auto" />
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DeleteAsset assetId={asset.id} imageUrl={asset.image_url} />
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                        <CardHeader>
                            <CardTitle className="text-lg">AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Niche</label>
                                <p className="text-sm font-medium">{asset.analysis?.niche || 'Analyzing...'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Keywords</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {asset.analysis?.keywords.map((kw: string) => (
                                        <span key={kw} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                    {asset.analysis?.description || 'AI is thinking...'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Generated Pins */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Generated Pin Variants</h2>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${asset.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {asset.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {pins?.map((pin: Pin) => (
                            <Card key={pin.id} className="border-none shadow-sm bg-white dark:bg-zinc-900 group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-sm font-bold text-red-600 uppercase tracking-widest">{pin.type}</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Calendar className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between group/title">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{pin.title}</p>
                                            <CopyButton value={pin.title} />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg relative group/desc">
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pr-8">
                                            {pin.description}
                                        </p>
                                        <div className="absolute top-2 right-2">
                                            <CopyButton value={pin.description} />
                                        </div>
                                    </div>
                                    <PinActions
                                        pinId={pin.id}
                                        assetId={asset.id}
                                        shareToken={asset.share_token}
                                        title={pin.title}
                                        description={pin.description}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                        {(!pins || pins.length === 0) && asset.status === 'analyzing' && (
                            <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                                <p className="text-zinc-500 italic">Generating your high-performing variants...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
