import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/categories/category-form';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase =await createClient();
  
  const isNew = params.categoryId === 'new';

  const { data: category } = isNew
    ? { data: null }
    : await supabase
        .from('categories')
        .select('*')
        .eq('id', params.categoryId)
        .single();

  if (!isNew && !category) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {isNew ? 'Create Category' : 'Edit Category'}
      </h2>
      <CategoryForm initialData={category} />
    </div>
  );
}