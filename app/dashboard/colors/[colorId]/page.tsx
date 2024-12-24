import { ColorForm } from "@/components/colors/color-form";
import {createClient} from "@/lib/supabase/server";

// app/admin/colors/[colorId]/page.tsx
export default async function ColorPage({ params }: { params: { colorId: string } }) {
    const supabase = await createClient();
    const {colorId}=await params
    const { data: color } = params.colorId !== 'new' 
      ? await supabase
          .from('colors')
          .select('*')
          .eq('id', colorId)
          .single()
      : { data: null };
  
    return <ColorForm initialData={color} />;
  }
  
  // app/admin/sizes/[sizeId]/page.tsx
 