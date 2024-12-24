
import { SizeForm } from "@/components/sizes/size-form";
import {createClient} from "@/lib/supabase/server";

// app/admin/colors/[colorId]/page.tsx
export default async function ColorPage({ params }: { params: { colorId: string } }) {
    const supabase = await createClient();
    const {colorId}=await params
    const { data: color } = colorId !== 'new' 
      ? await supabase
          .from('colors')
          .select('*')
          .eq('id', colorId)
          .single()
      : { data: null };
  
    return <SizeForm initialData={color} />;
  }
  

 