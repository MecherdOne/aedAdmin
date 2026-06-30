// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { createClient } from "@/utils/supabase/client"

// import { Input } from "@/components/ui/input"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// interface Category {
//   id: string
//   name: string
// }

// interface Product {
//   id: string
//   name: string
//   brand: string
//   slug: string
//   base_price: number
//   mrp: number
//   images: string[]
//   is_active: boolean
//   is_featured: boolean
//   category: {
//     name: string
//   }
// }

// export default function ManageInventory() {

//   const router = useRouter()
//   const supabase = createClient()

//   const [products, setProducts] = useState<Product[]>([])
//   const [categories, setCategories] = useState<Category[]>([])

//   const [search, setSearch] = useState("")
//   const [category, setCategory] = useState("")

//   async function loadProducts() {

//     const params = new URLSearchParams()

//     if (search) params.append("search", search)
//     if (category) params.append("category", category)

//     const res = await fetch(`/api/products?${params.toString()}`)
//     const data = await res.json()

//     setProducts(data.products ?? [])
//   }

//   async function loadCategories() {

//     const { data } = await supabase
//       .from("categories")
//       .select("id,name")

//     setCategories(data ?? [])
//   }

//   useEffect(() => {

//     loadCategories()
//     loadProducts()

//   }, [])

//   useEffect(() => {
//     loadProducts()
//   }, [search, category])

//   return (

// <div className="p-10 space-y-8">

// <h1 className="text-3xl font-bold">
// Manage Inventory
// </h1>

// <Card>

// <CardHeader>
// <CardTitle>Filters</CardTitle>
// </CardHeader>

// <CardContent className="flex gap-6">

// <Input
// placeholder="Search product name..."
// value={search}
// onChange={(e)=>setSearch(e.target.value)}
// />

// <select
// className="border rounded p-2"
// value={category}
// onChange={(e)=>setCategory(e.target.value)}
// >

// <option value="">All Categories</option>

// {categories.map(c=>(
// <option key={c.id} value={c.id}>
// {c.name}
// </option>
// ))}

// </select>

// </CardContent>

// </Card>

// <Card>

// <CardHeader>
// <CardTitle>Products</CardTitle>
// </CardHeader>

// <CardContent>

// <table className="w-full">

// <thead className="border-b">

// <tr className="text-left">

// <th className="p-3">Image</th>
// <th>Name</th>
// <th>Brand</th>
// <th>Category</th>
// <th>Price</th>
// <th>Status</th>

// </tr>

// </thead>

// <tbody>

// {products.map(product=>(

// <tr
// key={product.id}
// className="border-b hover:bg-muted cursor-pointer"
// onClick={()=>router.push(`/dashboard/manage_inventory/${product.id}`)}
// >

// <td className="p-3">

// {product.images?.[0] && (
// <img
// src={product.images[0]}
// className="w-14 h-14 object-cover rounded"
// />
// )}

// </td>

// <td>{product.name}</td>
// <td>{product.brand}</td>
// <td>{product.category?.name}</td>

// <td>
// ₹{product.base_price}
// </td>

// <td>

// {product.is_active ? (
// <span className="text-green-600">Active</span>
// ) : (
// <span className="text-red-600">Inactive</span>
// )}

// </td>

// </tr>

// ))}

// </tbody>

// </table>

// </CardContent>

// </Card>

// </div>

//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  brand: string
  slug: string
  base_price: number
  mrp: number
  images: string[]
  is_active: boolean
  is_featured: boolean
  category: {
    name: string
  }
}

const PAGE_SIZE = 20

export default function ManageInventory() {

  const router = useRouter()
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  async function loadProducts() {

    const params = new URLSearchParams()

    if (search) params.append("search", search)
    if (category) params.append("category", category)

    params.append("page", page.toString())
    params.append("limit", PAGE_SIZE.toString())

    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()

    setProducts(data.products ?? [])
setTotalCount(data.count ?? data.products?.length ?? 0)
  }

  async function loadCategories() {

    const { data } = await supabase
      .from("categories")
      .select("id,name")

    setCategories(data ?? [])
  }

  useEffect(() => {

    loadCategories()
    loadProducts()

  }, [])

  useEffect(() => {
    loadProducts()
  }, [search, category, page])

  useEffect(() => {
    setPage(1)
  }, [search, category])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (

<div className="p-10 space-y-8">

<h1 className="text-3xl font-bold">
Manage Inventory
</h1>

<Card>

<CardHeader>
<CardTitle>Filters</CardTitle>
</CardHeader>

<CardContent className="flex gap-6">

<Input
placeholder="Search product name..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="border rounded p-2"
value={category}
onChange={(e)=>setCategory(e.target.value)}
>

<option value="">All Categories</option>

{categories.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>

</CardContent>

</Card>

<Card>

<CardHeader>
<CardTitle>Products</CardTitle>
</CardHeader>

<CardContent>

<table className="w-full">

<thead className="border-b">

<tr className="text-left h-12">

<th className="p-3">Image</th>
<th>Name</th>
<th>Brand</th>
<th>Category</th>
<th>Price</th>
<th>Status</th>

</tr>

</thead>

<tbody>

{products.map(product=>(

<tr
key={product.id}
className="border-b hover:bg-muted cursor-pointer h-20"
onClick={()=>router.push(`/dashboard/manage_inventory/${product.id}`)}
>

<td className="p-3">

{product.images?.[0] && (
<img
src={product.images[0]}
className="w-14 h-14 object-cover rounded"
/>
)}

</td>

<td>{product.name}</td>
<td>{product.brand}</td>
<td>{product.category?.name}</td>

<td>
₹{product.base_price}
</td>

<td>

{product.is_active ? (
<span className="text-green-600">Active</span>
) : (
<span className="text-red-600">Inactive</span>
)}

</td>

</tr>

))}

</tbody>

</table>

<div className="flex items-center justify-between mt-6">

<span className="text-sm text-muted-foreground">
Page {page} of {totalPages}
</span>

<div className="flex gap-2">

<Button
variant="outline"
disabled={page <= 1}
onClick={()=>setPage(p=>Math.max(1, p - 1))}
>
Previous
</Button>

<Button
variant="outline"
disabled={page >= totalPages}
onClick={()=>setPage(p=>Math.min(totalPages, p + 1))}
>
Next
</Button>

</div>

</div>

</CardContent>

</Card>

</div>

  )
}