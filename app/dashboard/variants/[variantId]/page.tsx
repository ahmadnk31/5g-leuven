import { createClient } from '@/lib/supabase/server';
import { VariantForm } from '@/components/variants/variant-form';
import { ExperimentalVariantForm } from '@/components/experimental/variants/variant-form';

interface ProductVariantPageProps {
  params: {
    variantId: string;
  };
}

export default async function VariantPage({ params }: ProductVariantPageProps) {

  const supabase = await createClient();
  const {variantId}=await params
  const isNew = variantId === 'new';

  const [{ data: variants }, { data: products },{data:sizes},{data:colors},{data:images},{data:stock}] = await Promise.all([
    isNew 
      ? { data: null }
      : supabase
          .from('product_variants')
          .select(`*`)
          .eq('id', variantId)
          .single(),
    supabase.from('products').select('*'),
    supabase.from('sizes').select('*'),
    supabase.from('colors').select('*'),
    supabase.from('images').select('*').eq('variant_id',variantId),
    supabase.from('stock').select('*').eq('variant_id',variantId).single()
  ]);

console.log('stock',stock)
const formattedVariants=variants?{...variants,stock:stock?.quantity}:null
console.log('formatted',formattedVariants)
  return (
    <div className="space-y-4 container">
      <ExperimentalVariantForm
        initialData={formattedVariants||[]} 
        initialImages={images || []}
        products={products || []}
        sizes={sizes || []}
        colors={colors || []}
        edit={!isNew}
      />
    </div>
  );
}