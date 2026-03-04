import { createClient } from "@/utils/supabase/server"

export default async function AddProductPage() {

  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">
        Add Product
      </h1>

      <p>Admin: {user?.email}</p>

    </div>
  )
}