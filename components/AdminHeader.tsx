"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

const links = [
{ name: "Add Product", href: "/dashboard/add_product" },
{ name: "Manage Inventory", href: "/dashboard/manage_inventory" },
{ name: "Orders", href: "/dashboard/orders" },
{ name: "Performance Leads", href: "/dashboard/performanceLeads" },
{ name: "Tickets", href: "/dashboard/tickets" }
]

export default function AdminHeader(){

const pathname = usePathname()

return(

<header className="border-b bg-white sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

{/* LOGO */}

<Link
href="/dashboard"
className="flex items-center gap-3"
>

<Image
src="/logo.png"
alt="AEDSIndia"
width={40}
height={40}
/>

<span className="font-bold text-lg">
AEDSIndia Admin
</span>

</Link>

{/* NAVIGATION */}

<nav className="flex items-center gap-6 text-sm font-medium">

{links.map((link)=>{

const active = pathname === link.href

return(

<Link
key={link.href}
href={link.href}
className={`transition ${
active
? "text-black font-semibold"
: "text-gray-600 hover:text-black"
}`}
>

{link.name}

</Link>

)

})}

</nav>

</div>

</header>

)

}