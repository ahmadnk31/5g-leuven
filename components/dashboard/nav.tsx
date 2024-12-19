'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Smartphone, 
  FolderTree,
  ImageIcon,
  LogOut, 
  Layers
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const routes = [
  {
    label: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard',
    pattern: /^\/dashboard$/,
  },
  {
    label: 'Products',
    icon: Smartphone,
    href: '/dashboard/products',
    pattern: /^\/dashboard\/products/,
  },
  {
    label:'Prodcuct variants',
    icon: Layers,
    href: '/dashboard/product-variants',
    pattern: /^\/dashboard\/product-variants/,
  },
  {
    label: 'Categories',
    icon: FolderTree,
    href: '/dashboard/categories',
    pattern: /^\/dashboard\/categories/,
  },
  {
    label: 'Billboards',
    icon: ImageIcon,
    href: '/dashboard/billboards',
    pattern: /^\/dashboard\/billboards/,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return (
    <nav className="space-y-6 h-[calc(100vh - h-16)] overflow-y-auto">
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-sidebar-accent text-sidebar-foreground',
              route.pattern.test(pathname) 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                : 'text-sidebar-foreground'
            )}
          >
            <route.icon className="h-4 w-4 mr-2" />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="px-3">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" 
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </nav>
  );
}