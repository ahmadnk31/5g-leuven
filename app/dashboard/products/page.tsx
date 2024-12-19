import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductsPage() {
  
  const supabase = await createClient();

  const { data:products } = await supabase
    .from('products')
    .select(`
      *,
      category:category_id(*)
    `);
  
console.log(products)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={products || []} />
    </div>
  );
}