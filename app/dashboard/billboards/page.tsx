import { createClient } from '@/lib/supabase/server';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function BillboardsPage() {

  const supabase = await createClient();

  const { data: billboards } = await supabase
    .from('billboards')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Billboards</h2>
        <Link href="/dashboard/billboards/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Billboard
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={billboards || []} />
    </div>
  );
}