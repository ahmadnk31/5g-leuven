"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash, Edit2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("category-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/category-images/${fileName}`;
        console.log(`category image url: ${url}`);
        onChange(url);
        setIsEditing(false);
      } catch (error: any) {
        console.error("Error uploading image:", error);
      }
    },
    [onChange, supabase]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    disabled,
  });

  const handleDeleteImage = useCallback(() => {
    onChange("");
    setIsEditing(false);
  }, [onChange]);

  return (
    <div className="space-y-4">
      {!value || isEditing ? (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary"}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <ImagePlus className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the image here"
                : "Drag & drop an image here, or click to select"}
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-40">
          <Image
            src={value}
            alt="Category image"
            className="rounded-lg object-cover"
            width={160}
            height={160}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={disabled}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleDeleteImage}
              disabled={disabled}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}