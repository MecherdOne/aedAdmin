import { createClient } from "@/utils/supabase/server"
import EditProduct from "@/components/EditProduct"

export default async function Page({
  params
}: {
  params: Promise<{ product_id: string }>
}) {

  const { product_id } = await params

  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("id,name")

  return (

<div className="p-10">

<h1 className="text-3xl font-bold mb-8">
Edit Product
</h1>

<EditProduct
productId={product_id}
categories={categories ?? []}
/>

</div>

  )
}