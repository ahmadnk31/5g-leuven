'use client'
import { DashboardNav } from '@/components/dashboard/nav';
import {Toaster} from '@/components/ui/toaster';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {Toaster as SonnerToaster} from '@/components/ui/sonner';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* <DashboardHeader /> */}
      <DashboardNav />
      <div className='flex-1 p-4'>
      <SidebarTrigger />
        {children}
        <Toaster/>
        <SonnerToaster/>
      </div>
    </SidebarProvider>
  );
}