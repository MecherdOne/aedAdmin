import AddProducts from "@/components/addProduct"
import AddProduct from "@/components/addProduct"
import { createClient } from "@/utils/supabase/server"

export default async function AddProductPage() {

  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div className="p-10">
<div className="p-10">
      <h1 className="text-3xl font-bold mb-8">
        Add Product
      </h1>

      <AddProducts/>
    </div>

    </div>
  )
}