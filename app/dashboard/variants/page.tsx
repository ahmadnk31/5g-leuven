import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ProductVariantsPage() {
  
  const supabase = await createClient();

  const { data:variants } = await supabase
    .from('product_variants')
    .select(`
      *,
      product:product_id(*),
        size:size_id(*),
        color:color_id(*)
    `);
  const {data:images}=await supabase.from('images').select('*')
  const {data:stock}=await supabase.from('stock').select('*,variant:variant_id(*)')
  console.log('stock',stock)
  console.log(`variants`,variants)
  const formattedVariants = variants?.map((variant) => {
    return {
      id: variant.id,
      name: variant.name,
      price: variant.price,
      stock: stock?.filter((stock) => stock.variant_id === variant.id).reduce((acc, curr) => acc + curr.quantity, 0),
      product: variant.product,
      color: variant.color?.name,
      size: variant.size?.name,
      images: images?.filter((image) => image.variant_id === variant.id) || []
    };
  });
console.log(variants)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Variants</h2>
        <Link href="/dashboard/variants/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={formattedVariants || []} />
    </div>
  );
}