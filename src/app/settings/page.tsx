import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, User, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-zinc-500">Configure your application preferences and API keys.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <User className="h-4 w-4 text-zinc-400" />
                            Account Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 italic">Profile management coming soon...</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Shield className="h-4 w-4 text-zinc-400" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 italic">Security settings coming soon...</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Bell className="h-4 w-4 text-zinc-400" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-zinc-500 italic">Email notification settings coming soon...</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <SettingsIcon className="h-4 w-4 text-zinc-400" />
                            App Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <span className="text-sm font-medium">Theme</span>
                                <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Dark</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                                <span className="text-sm font-medium">Language</span>
                                <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">English</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
