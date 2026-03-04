import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/actions/auth"

export default async function Dashboard() {

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">
        Admin Dashboard
      </h1>

      <p>Logged in as: {user?.email}</p>

      <form action={logout}>
        <button className="mt-4 bg-black text-white px-4 py-2 rounded">
          Logout
        </button>
      </form>

    </div>
  )
}