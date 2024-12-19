'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash, FileImage, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import { VariantFormValues } from '@/lib/validations/variant';

interface ImageUploadProps {
  form: UseFormReturn<VariantFormValues>;
  loading: boolean;
  maxImages?: number;
}

export function ImageUpload({ 
  form, 
  loading, 
  maxImages = 5 
}: ImageUploadProps) {
  const supabase = createClient();
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  const uploadImage = useCallback(async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('variant-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('variant-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      return null;
    }
  }, [supabase]);

  const handleImageUpload = useCallback(async (acceptedFiles: File[]) => {
    if (loading || uploadingImages) return;

    setUploadingImages(true);
    try {
      const currentImages = form.getValues('images') || [];
      
      // Limit total images
      const remainingSlots = maxImages - currentImages.length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      const uploadPromises = filesToUpload.map(uploadImage);
      const newUrls = await Promise.all(uploadPromises);
      
      const validUrls = newUrls.filter(url => url !== null);
      
      form.setValue('images', [...currentImages, ...validUrls]);
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      setUploadingImages(false);
    }
  }, [form, loading, uploadingImages, uploadImage, maxImages]);

  const removeImage = useCallback((urlToRemove: string) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter(url => url !== urlToRemove));
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleImageUpload,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: loading || uploadingImages
  });

  const images = form.watch('images') || [];

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          p-6 border-2 border-dashed rounded-lg text-center cursor-pointer 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${loading || uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <FileImage className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive 
              ? 'Drop images here' 
              : 'Drag & drop images, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Max {maxImages} images. PNG, JPEG, GIF, WEBP
          </p>
        </div>
      </div>

      {uploadingImages && (
        <div className="text-sm text-gray-600 flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading images...
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map((imageUrl, index) => (
            <div key={imageUrl} className="relative group">
              <Image
                src={imageUrl}
                alt={`Variant image ${index + 1}`}
                className="rounded-lg object-cover aspect-square"
                width={200}
                height={200}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(imageUrl)}
                disabled={loading}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}