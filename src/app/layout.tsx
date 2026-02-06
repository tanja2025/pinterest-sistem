import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PinAuto - Pinterest Automation",
  description: "Automate your Pinterest pin creation and scheduling with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950`}
      >
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto bg-zinc-50 dark:bg-zinc-950">
              <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 bg-white dark:bg-zinc-900 sticky top-0 z-10">
                <SidebarTrigger />
                <div className="ml-4 h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
                <h2 className="ml-4 font-medium text-sm text-zinc-500">Dashboard / Overview</h2>
              </div>
              <div className="p-6">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
