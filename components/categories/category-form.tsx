"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CategorySchema, type CategoryFormValues } from "@/lib/validations/category";
import { ImageUpload } from "./image-upload";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  initialData: CategoryFormValues;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
      image_url: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      const isNew = !initialData;

      if (initialData?.image_url && initialData.image_url !== data.image_url) {
        // Delete old image if it was changed
        const oldImagePath = initialData.image_url.split("category-images/").pop();
        if (oldImagePath) {
          await supabase.storage
            .from("category-images")
            .remove([oldImagePath]);
        }
      }

      const { error } = await supabase
        .from("categories")
        [isNew ? "insert" : "update"]({
          name: data.name,
          image_url: data.image_url,
          ...(isNew ? {} : { id: initialData.id }),
        })
        .eq("id", isNew ? undefined : initialData.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Category ${isNew ? "created" : "updated"} successfully`,
      });

      router.push("/dashboard/categories");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}