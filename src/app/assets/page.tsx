import { UploadZone } from "@/components/upload-zone";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Asset } from "@/types";

export const dynamic = 'force-dynamic'

export default async function AssetsPage() {
    const { data: assets } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
                <p className="text-zinc-500">Upload and manage your images for pin generation.</p>
            </div>

            <UploadZone />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {assets?.map((asset: Asset) => (
                    <Link key={asset.id} href={`/assets/${asset.id}`}>
                        <Card className="overflow-hidden border-none shadow-sm hover:ring-2 hover:ring-red-500 transition-all group">
                            <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100">
                                <img
                                    src={asset.image_url}
                                    alt="Asset"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${asset.status === 'ready' ? 'bg-green-500 text-white' :
                                            asset.status === 'analyzing' ? 'bg-yellow-500 text-white' :
                                                'bg-zinc-500 text-white'
                                        }`}>
                                        {asset.status}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <p className="text-xs text-zinc-500 truncate">
                                    {new Date(asset.created_at).toLocaleDateString()}
                                </p>
                                <p className="text-sm font-medium truncate mt-1">
                                    {asset.analysis?.niche || 'No analysis yet'}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {(!assets || assets.length === 0) && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <p className="text-zinc-500">No assets found. Start by uploading one!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
