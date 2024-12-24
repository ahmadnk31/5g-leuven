'use client';

import { ColumnDef } from '@tanstack/react-table';
import {  MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';


export type Color = {
  id: string;
  name: string;
  value: string;
};

export const columns: ColumnDef<Color>[] = [
    
  {
    accessorKey: 'name',
    header: 'Name',
  },
 
    {
        accessorKey: 'value',
        header: 'Value',
    },
  {
    id: 'actions',
    cell: ({ row }) => {
      const color = row.original;
      const router = useRouter();
      const { toast } = useToast();
      const supabase = createClient();

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from('colors')
            .delete()
            .eq('id', color.id);

          if (error) throw error;

          toast({
            title: 'Success',
            description: 'Color deleted successfully',
          });
          
          router.refresh();
        } catch (error: any) {
          toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
          });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/dashboard/colors/${color.id}`}>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];