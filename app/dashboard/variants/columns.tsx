'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ImageIcon, MoreHorizontal, Pencil, Trash } from 'lucide-react';
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
import { ImagesFormValues } from '@/lib/validations/images';

export type ProductVariant = {
  id: string;
  name: string;
  color:string,
  size:string,
  price: number;
    stock: number;
    images: ImagesFormValues[];
  product: {
    name: string;
  };
};

export const columns: ColumnDef<ProductVariant>[] = [
    {
        accessorKey: 'images',
        header: 'Images',
        cell: ({ row }) => {
            const images = row.getValue('images') as ImagesFormValues[];
            const imageUrl = images&&images[0];
            return imageUrl ? (
                <div className="relative h-10 w-10">
                    <Image
                        src={imageUrl?.url||''}
                        alt={row.getValue('name')}
                        className="rounded-md object-cover"
                        fill
                    />
                </div>
            ) : <ImageIcon className="h-10 w-10" />;
        }
    },
  {
    accessorKey: 'name',
    header: 'Name',
  },
 
  {
    accessorKey: 'product.name',
    header: 'Product',
  },
    {
        accessorKey: 'price',
        header: 'Price',
    },
    {
        accessorKey: 'color',
        header: 'Color',
    },
    {
        accessorKey: 'size',
        header: 'Size',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
  {
    id: 'actions',
    cell: ({ row }) => {
      const product_variant = row.original;
      const router = useRouter();
      const { toast } = useToast();
      const supabase = createClient();

      const handleDelete = async () => {
        try {
          const { error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', product_variant.id);

          if (error) throw error;

          toast({
            title: 'Success',
            description: 'Product variant deleted successfully',
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
            <Link href={`/dashboard/variants/${product_variant.id}`}>
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