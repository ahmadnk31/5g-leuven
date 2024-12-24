'use client'
import {SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardNav } from "./dashboard/nav"

export function AppSidebar() {
  return (
    <div className='fixed top-[120px] left-0 h-[calc(100vh-120px)]'>
        <SidebarProvider>
        <DashboardNav/>
        <SidebarTrigger/>
    </SidebarProvider>
    </div>
  )
}
