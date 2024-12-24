import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function SizesPage() {
  
  const supabase = await createClient();

  const { data:sizes } = await supabase
    .from('sizes')
    .select(`
      *
    `);
  
console.log(sizes)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Sizes</h2>
        <Link href="/dashboard/sizes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Size
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={sizes || []} />
    </div>
  );
}