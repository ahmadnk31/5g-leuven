import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/products/product-form';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {

  const supabase = await createClient();
  const {productId}=await params
  const isNew = productId === 'new';

  const [{ data: product }, { data: categories }] = await Promise.all([
    isNew 
      ? { data: null }
      : supabase
          .from('products')
          .select(`*`)
          .eq('id', productId)
          .single(),
    supabase.from('categories').select('*')
  ]);
console.log('product',product)
  
  return (
    <div className="space-y-4 ">
      <h2 className="text-3xl font-bold tracking-tight">
        {isNew ? 'Create Product' : 'Edit Product'}
      </h2>
      <ProductForm 
        initialData={product} 
        categories={categories || []}
      />
    </div>
  );
}