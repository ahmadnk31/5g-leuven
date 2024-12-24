import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function ColorsPage() {
  
  const supabase = await createClient();

  const { data:colors } = await supabase
    .from('colors')
    .select(`
      *
    `);
  
console.log(colors)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Colors</h2>
        <Link href="/dashboard/colors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Color
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={colors || []} />
    </div>
  );
}