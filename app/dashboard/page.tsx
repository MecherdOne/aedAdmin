// import { createClient } from "@/utils/supabase/server"
// import { logout } from "@/app/actions/auth"

// export default async function Dashboard() {

//   const supabase = await createClient()

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   return (
//     <div className="p-10">

//       <h1 className="text-2xl font-bold mb-4">
//         Admin Dashboard
//       </h1>

//       <p>Logged in as: {user?.email}</p>

//       <form action={logout}>
//         <button className="mt-4 bg-black text-white px-4 py-2 rounded">
//           Logout
//         </button>
//       </form>

//     </div>
//   )
// }

import Image from "next/image"
import Link from "next/link"

import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/actions/auth"

import { Card, CardContent } from "@/components/ui/card"

import {
  FiPlusCircle,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiClipboard,
  FiLogOut
} from "react-icons/fi"

export default async function Dashboard() {

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const tiles = [
    {
      title: "Add Product",
      href: "/dashboard/add_product",
      icon: <FiPlusCircle size={28} />
    },
    {
      title: "Manage Inventory",
      href: "/dashboard/manage_inventory",
      icon: <FiPackage size={28} />
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: <FiShoppingCart size={28} />
    },
    {
      title: "Performance Leads",
      href: "/dashboard/performanceLeads",
      icon: <FiBarChart2 size={28} />
    },
    {
      title: "Tickets",
      href: "/dashboard/tickets",
      icon: <FiClipboard size={28} />
    }
  ]

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6 py-10 space-y-8">

      {/* HEADER */}

      <div className="flex flex-col items-center space-y-2">

        <Image
          src="/logo.png"
          alt="AEDSIndia"
          width={70}
          height={70}
        />

        <h1 className="text-3xl font-bold">
          AEDSIndia Admin
        </h1>

        <p className="text-sm text-gray-500">
          Logged in as {user?.email}
        </p>

      </div>


      {/* TILE GRID */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">

        {tiles.map((tile) => (

          <Link key={tile.href} href={tile.href}>

            <Card className="hover:shadow-lg transition cursor-pointer hover:scale-[1.02]">

              <CardContent className="flex flex-col items-center justify-center gap-3 py-10">

                <div className="text-black">
                  {tile.icon}
                </div>

                <p className="font-medium text-center">
                  {tile.title}
                </p>

              </CardContent>

            </Card>

          </Link>

        ))}

      </div>


      {/* LOGOUT */}

      <form action={logout}>

        <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded hover:opacity-90">

          <FiLogOut />

          Logout

        </button>

      </form>


      {/* FOOTER WARNING */}

      <p className="text-xs text-gray-500 text-center max-w-md">

        ⚠ This administration system is restricted to authorized
        AEDSIndia employees and administrators only. Unauthorized
        access or misuse may result in strict disciplinary action.

      </p>

    </div>

  )
}