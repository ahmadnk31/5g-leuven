'use client';

import { useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  disabled
}: ImageUploadProps) {
  const supabase = createClient();
useEffect(() => {
    const fetchImages= async () => {
      const { data: categories } = await supabase.storage.from('category-images').list();
      console.log(categories);
    }
    fetchImages();
    
  }, []);
  const uploadImage = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('category-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('category-images')
        .getPublicUrl(fileName);

      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/category-images/${fileName}`;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return null;
    }
  }, [supabase]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    console.log(`category image url: ${url}`);
    if (url) {
      onChange(url);
    }
  }, [onChange, uploadImage]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          asChild
        >
          <label>
            <ImagePlus className="mr-2 h-4 w-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={disabled}
            />
          </label>
        </Button>
      </div>

      {value && (
        <div className="relative w-40">
          <Image
            src={value}
            alt="Category image"
            className="rounded-lg object-cover"
            width={160}
            height={160}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange('')}
            disabled={disabled}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}