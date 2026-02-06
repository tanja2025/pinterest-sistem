import { supabase } from "@/lib/supabase";
import { Metadata } from "next";

interface Props {
    params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { token } = await params;
    const { data: asset } = await supabase
        .from('assets')
        .select('*, pins(*)')
        .eq('share_token', token)
        .single();

    if (!asset) return { title: "Not Found" };

    const firstPin = asset.pins?.[0];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pinterest-sistem.vercel.app';
    const proxyUrl = `${appUrl}/api/share-image/${token}`;

    return {
        title: firstPin?.title || "Check out this pin!",
        description: firstPin?.description || "Automated Pinterest Content",
        openGraph: {
            title: firstPin?.title,
            description: firstPin?.description,
            images: [
                {
                    url: proxyUrl,
                    width: 1000,
                    height: 1500,
                    alt: firstPin?.title,
                }
            ],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: firstPin?.title,
            description: firstPin?.description,
            images: [proxyUrl],
        }
    };
}

export default async function PublicSharePage({ params }: Props) {
    const { token } = await params;
    const { data: asset } = await supabase
        .from('assets')
        .select('*, pins(*)')
        .eq('share_token', token)
        .single();

    if (!asset) return <div className="p-20 text-center">Pin not found.</div>;

    const proxyUrl = `/api/share-image/${token}`;

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <img src={proxyUrl} alt="Pinterest Content" className="w-full h-auto" />
                <div className="p-6 space-y-4">
                    <h1 className="text-xl font-bold">{asset.pins?.[0]?.title}</h1>
                    <p className="text-zinc-500 text-sm leading-relaxed">{asset.pins?.[0]?.description}</p>
                    <div className="pt-4 flex justify-center">
                        <img src="/logo.png" alt="PinAuto" className="h-6 opacity-20" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                </div>
            </div>
        </div>
    );
}
