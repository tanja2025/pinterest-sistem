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

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back to your Pinterest automation hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <SystemInitializer />
          <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">
            <Plus className="mr-2 h-4 w-4" /> New Asset
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
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-zinc-400 mt-1">Next 5 days planned</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Posted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,204</div>
            <p className="text-xs text-zinc-400 mt-1">Lifetime total</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-zinc-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">AI Tokens</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-zinc-500 mt-1">Remaining credits</p>
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
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <div className="w-12 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      Modern Kitchen Interior Design {i}
                    </p>
                    <p className="text-xs text-zinc-500">Scheduled for Today at 4:30 PM</p>
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                    Scheduled
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Quick Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Drop an image here</p>
            <p className="text-xs text-zinc-500 mt-1">or click to browse your files</p>
            <Button variant="outline" className="mt-6 rounded-full">Choose Image</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
