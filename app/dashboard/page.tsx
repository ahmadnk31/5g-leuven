import { createClient } from '@/lib/supabase/server';
import { Overview } from '@/components/dashboard/overview';
import { redirect } from 'next/navigation';
export default async function DashboardPage() {

  const supabase = await createClient();
  const {data:{user},error}=await supabase.auth.getUser()
  console.log(user)
  // Fetch dashboard data
  if(!user||error){
    redirect('/auth/signin')
  }
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: variantsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('variants').select('*', { count: 'exact', head: true }),
  ]);

  // Mock data for the chart - in a real app, you'd fetch this from your database
  const recentSales = [
    { name: 'Jan', total: 1200 },
    { name: 'Feb', total: 2100 },
    { name: 'Mar', total: 1800 },
    { name: 'Apr', total: 2400 },
    { name: 'May', total: 1900 },
    { name: 'Jun', total: 2800 },
  ];

  return (
    <div className="space-y-4 px-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <Overview
        totalProducts={productsCount ?? 0}
        totalCategories={categoriesCount ?? 0}
        totalVariants={variantsCount ?? 0}
        recentSales={recentSales}
      />
    </div>
  );
}