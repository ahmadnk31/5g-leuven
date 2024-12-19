import { DashboardNav } from '@/components/dashboard/nav';
import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="hidden w-64 shrink-0 border-r bg-white md:block">
          <div className="p-4">
            <DashboardNav />
          </div>
        </div>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}