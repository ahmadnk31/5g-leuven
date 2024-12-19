import { createClient } from '@/lib/supabase/server';
import { VariantForm } from '@/components/variants/variant-form';

interface ProductVariantPageProps {
  params: {
    variantId: string;
  };
}

export default async function VariantPage({ params }: ProductVariantPageProps) {

  const supabase = await createClient();
  const {variantId}=await params
  const isNew = variantId === 'new';

  const [{ data: variant }, { data: products }] = await Promise.all([
    isNew 
      ? { data: null }
      : supabase
          .from('variants')
          .select(`*`)
          .eq('id', variantId)
          .single(),
    supabase.from('products').select('*')
  ]);
console.log('product',products)
  
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {isNew ? 'Create Variant' : 'Edit Product'}
      </h2>
      <VariantForm
        initialData={variant} 
        products={products || []}
      />
    </div>
  );
}