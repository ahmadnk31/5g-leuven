import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductsPage() {
  
  const supabase = await createClient();

  const { data:variants } = await supabase
    .from('variants')
    .select(`
      *,
      product:product_id(*)
    `);
  
console.log(variants)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Variants</h2>
        <Link href="/dashboard/product-variants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={variants || []} />
    </div>
  );
}