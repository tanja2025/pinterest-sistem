import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ImageIcon,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SystemInitializer } from "@/components/system-initializer";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Home() {
  // 1. Fetch real stats from Supabase
  const { count: totalAssets } = await supabase
    .from('assets')
    .select('*', { count: 'exact', head: true });

  const { count: scheduledPins } = await supabase
    .from('pins')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'planned');

  const { count: totalPosted } = await supabase
    .from('pins')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'shared');

  // 2. Fetch Recent Activity (last 5 pins)
  const { data: recentPins } = await supabase
    .from('pins')
    .select('*, assets(image_url)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back to your Pinterest automation hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <SystemInitializer />
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6" asChild>
            <Link href="/assets">
              <Plus className="mr-2 h-4 w-4" /> New Asset
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Assets</CardTitle>
            <ImageIcon className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets || 0}</div>
            <p className="text-xs text-zinc-400 mt-1">Total uploaded images</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledPins || 0}</div>
            <p className="text-xs text-zinc-400 mt-1">Planned pin variants</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Posted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosted || 0}</div>
            <p className="text-xs text-zinc-400 mt-1">Lifetime shared pins</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">System Status</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Online</div>
            <p className="text-xs text-zinc-500 mt-1">AI Engine active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPins && recentPins.length > 0 ? (
                recentPins.map((pin) => (
                  <Link key={pin.id} href={`/assets/${pin.asset_id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="w-12 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={pin.assets?.image_url} alt="Pin" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {pin.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {pin.status === 'shared' ? 'Shared on ' : 'Generated on '}
                        {new Date(pin.shared_at || pin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${pin.status === 'shared'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                      {pin.status}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-zinc-500 text-sm italic">
                  No activity yet. Upload an asset to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Quick Launch</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Ready for a new pin?</p>
            <p className="text-xs text-zinc-500 mt-1">Upload an image to generate 3 SEO variations</p>
            <Button className="mt-6 rounded-full bg-red-600 hover:bg-red-700 text-white" asChild>
              <Link href="/assets">Start Upload</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
