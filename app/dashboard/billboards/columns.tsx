'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
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
import Image from 'next/image';

export type Billboard = {
  id: string;
  label: string;
  image_url: string;
  created_at: string;
};

export const columns: ColumnDef<Billboard>[] = [
  {
    accessorKey: 'image_url',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image_url') as string;
      return imageUrl ? (
        <div className="relative h-20 w-40">
          <Image
            src={imageUrl}
            alt={row.getValue('label')}
            className="rounded-md object-cover"
            fill
          />
        </div>
      ) : null;
    },
  },
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const billboard = row.original;
      const router = useRouter();
      const { toast } = useToast();
      const supabase = createClient();

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from('billboards')
            .delete()
            .eq('id', billboard.id);

          if (error) throw error;
          console.log(error)
          toast({
            title: 'Success',
            description: 'Billboard deleted successfully',
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
            <Link href={`/dashboard/billboards/${billboard.id}`}>
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