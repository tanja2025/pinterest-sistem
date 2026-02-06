"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Calendar,
    Layers,
    Share2,
    Settings,
    PlusCircle,
    Image as ImageIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Assets & Upload",
        url: "/assets",
        icon: ImageIcon,
    },
    {
        title: "Schedule",
        url: "/schedule",
        icon: Calendar,
    },
    {
        title: "Manual Share",
        url: "/manual-share",
        icon: Share2,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800">
            <SidebarHeader className="h-16 flex items-center px-6">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-red-600">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
                        P
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden">PinAuto</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Space</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url}>
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-zinc-100 dark:border-zinc-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href="/settings">
                                <Settings className="w-5 h-5" />
                                <span>Settings</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
