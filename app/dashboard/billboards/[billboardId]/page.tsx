import { createClient } from '@/lib/supabase/client';
import { BillboardForm } from '@/components/billboards/billboard-form';
import { notFound } from 'next/navigation';

interface BillboardPageProps {
  params: {
    billboardId: string;
  };
}

export default async function BillboardPage({ params }: BillboardPageProps) {
  const supabase = createClient();
  
  const isNew = params.billboardId === 'new';

  const { data: billboard } = isNew
    ? { data: null }
    : await supabase
        .from('billboards')
        .select('*')
        .eq('id', params.billboardId)
        .single();

  if (!isNew && !billboard) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {isNew ? 'Create Billboard' : 'Edit Billboard'}
      </h2>
      <BillboardForm initialData={billboard} />
    </div>
  );
}