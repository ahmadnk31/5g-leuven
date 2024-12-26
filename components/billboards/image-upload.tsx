'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

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

  const uploadImage = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('billboard-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('billboard-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return null;
    }
  }, [supabase]);

  const handleDelete = useCallback(async () => {
    if (!value) return;

    try {
      const fileName = value.split('/').pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from('billboard-images')
        .remove([fileName]);

      if (error) throw error;
      onChange('');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [value, onChange, supabase]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const url = await uploadImage(acceptedFiles[0]);
    if (url) onChange(url);
  }, [uploadImage, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    disabled,
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mx-auto h-8 w-8 mb-2" />
        <p>Drag & drop an image here, or click to select</p>
      </div>

      {value && (
        <div className="relative w-full max-w-xl">
          <div className="relative aspect-[2/1] w-full">
            <Image
              src={value}
              alt="Billboard image"
              className="rounded-lg object-cover"
              fill
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleDelete}
            disabled={disabled}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}