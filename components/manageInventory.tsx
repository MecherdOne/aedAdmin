// "use client"

// import { useEffect, useState } from "react"
// import React from "react"

// import {
// Table,
// TableBody,
// TableCell,
// TableHead,
// TableHeader,
// TableRow
// } from "@/components/ui/table"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"

// import { ChevronDown, ChevronRight } from "lucide-react"

// import EditProductDialog from "./EditProductDialog"

// import { Product, Variant } from "@/types/product"

// export default function ManageInventory(){

// const [products,setProducts]=useState<Product[]>([])
// const [expanded,setExpanded]=useState<string | null>(null)

// const [dialogOpen,setDialogOpen]=useState(false)
// const [editingProduct,setEditingProduct]=useState<Product | null>(null)

// useEffect(()=>{
// loadProducts()
// },[])

// async function loadProducts(){

// const res=await fetch("/api/inventory/products")
// const data=await res.json()

// setProducts(data)

// }

// async function updateProduct(product:Product){

// await fetch("/api/inventory/update-product",{

// method:"POST",
// headers:{ "Content-Type":"application/json" },

// body:JSON.stringify({
// id:product.id,
// base_price:product.base_price,
// mrp:product.mrp,
// is_featured:product.is_featured,
// is_active:product.is_active
// })

// })

// }

// async function updateVariant(variant:Variant){

// await fetch("/api/inventory/update-variant",{

// method:"POST",
// headers:{ "Content-Type":"application/json" },

// body:JSON.stringify({
// id:variant.id,
// addon_price:variant.addon_price,
// inventory_quantity:variant.inventory_quantity,
// is_active:variant.is_active
// })

// })

// }

// return(

// <div className="space-y-6">

// <h1 className="text-2xl font-semibold">
// Manage Inventory
// </h1>

// <Table>

// <TableHeader>

// <TableRow>

// <TableHead></TableHead>
// <TableHead>Product</TableHead>
// <TableHead>Base Price</TableHead>
// <TableHead>MRP</TableHead>
// <TableHead>Featured</TableHead>
// <TableHead>Active</TableHead>
// <TableHead></TableHead>

// </TableRow>

// </TableHeader>

// <TableBody>

// {products.map(product=>(

// <React.Fragment key={product.id}>

// <TableRow>

// <TableCell className="w-12">

// <Button
// variant="ghost"
// size="icon"
// onClick={()=>setExpanded(
// expanded===product.id ? null : product.id
// )}
// >

// {expanded===product.id
// ? <ChevronDown size={18}/>
// : <ChevronRight size={18}/>
// }

// </Button>

// </TableCell>

// <TableCell>

// <div className="font-medium">
// {product.name ?? ""}
// </div>

// <div className="text-sm text-muted-foreground">
// {product.brand ?? ""}
// </div>

// </TableCell>

// <TableCell>

// <Input
// type="number"
// value={product.base_price ?? 0}
// onChange={(e)=>{

// product.base_price=Number(e.target.value)
// setProducts([...products])

// }}
// onBlur={()=>updateProduct(product)}
// className="w-28"
// />

// </TableCell>

// <TableCell>

// <Input
// type="number"
// value={product.mrp ?? 0}
// onChange={(e)=>{

// product.mrp=Number(e.target.value)
// setProducts([...products])

// }}
// onBlur={()=>updateProduct(product)}
// className="w-28"
// />

// </TableCell>

// <TableCell>

// <Checkbox
// checked={product.is_featured ?? false}
// onCheckedChange={(v)=>{

// product.is_featured=Boolean(v)
// setProducts([...products])
// updateProduct(product)

// }}
// />

// </TableCell>

// <TableCell>

// <Checkbox
// checked={product.is_active ?? false}
// onCheckedChange={(v)=>{

// product.is_active=Boolean(v)
// setProducts([...products])
// updateProduct(product)

// }}
// />

// </TableCell>

// <TableCell>

// <Button
// variant="outline"
// size="sm"
// onClick={()=>{

// setEditingProduct(product)
// setDialogOpen(true)

// }}
// >

// Edit Details

// </Button>

// </TableCell>

// </TableRow>

// {expanded===product.id && product.product_options && (

// <TableRow>

// <TableCell colSpan={7}>

// <div className="p-6 space-y-6 bg-muted/20 rounded-lg">

// {product.product_options.map(option=>(

// <div key={option.id} className="space-y-3">

// <div className="font-semibold text-sm">
// {option.name}
// </div>

// <Table>

// <TableHeader>

// <TableRow>

// <TableHead>Variant</TableHead>
// <TableHead>SKU</TableHead>
// <TableHead>Add-on Price</TableHead>
// <TableHead>Inventory</TableHead>
// <TableHead>Active</TableHead>

// </TableRow>

// </TableHeader>

// <TableBody>

// {option.product_option_values.map(variant=>(

// <TableRow key={variant.id}>

// <TableCell>{variant.value}</TableCell>

// <TableCell>{variant.sku}</TableCell>

// <TableCell>

// <Input
// type="number"
// value={variant.addon_price ?? 0}
// onChange={(e)=>{

// variant.addon_price=Number(e.target.value)
// setProducts([...products])

// }}
// onBlur={()=>updateVariant(variant)}
// className="w-28"
// />

// </TableCell>

// <TableCell>

// <Input
// type="number"
// value={variant.inventory_quantity ?? 0}
// onChange={(e)=>{

// variant.inventory_quantity=Number(e.target.value)
// setProducts([...products])

// }}
// onBlur={()=>updateVariant(variant)}
// className="w-28"
// />

// </TableCell>

// <TableCell>

// <Checkbox
// checked={variant.is_active ?? false}
// onCheckedChange={(v)=>{

// variant.is_active=Boolean(v)
// setProducts([...products])
// updateVariant(variant)

// }}
// />

// </TableCell>

// </TableRow>

// ))}

// </TableBody>

// </Table>

// </div>

// ))}

// </div>

// </TableCell>

// </TableRow>

// )}

// </React.Fragment>

// ))}

// </TableBody>

// </Table>

// {editingProduct && (

// <EditProductDialog
// key={editingProduct.id}
// product={editingProduct}
// open={dialogOpen}
// setOpen={setDialogOpen}
// reload={loadProducts}
// />

// )}

// </div>

// )

// }
"use client"

import { useEffect, useState } from "react"
import React from "react"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { ChevronDown, ChevronRight } from "lucide-react"

import EditProductDialog from "./EditProductDialog"

import { Product, Variant } from "@/types/product"

export default function ManageInventory(){

const [products,setProducts]=useState<Product[]>([])
const [expanded,setExpanded]=useState<string | null>(null)

const [dialogOpen,setDialogOpen]=useState(false)
const [editingProduct,setEditingProduct]=useState<Product | null>(null)

useEffect(()=>{
loadProducts()
},[])

async function loadProducts(){

const res=await fetch("/api/inventory/products")
const data=await res.json()

setProducts(data)

}

async function updateProduct(product:Product){

await fetch("/api/inventory/update-product",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
id:product.id,
base_price:product.base_price,
mrp:product.mrp,
is_featured:product.is_featured,
is_active:product.is_active
})

})

}

async function updateVariant(variant:Variant){

await fetch("/api/inventory/update-variant",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({
id:variant.id,
addon_price:variant.addon_price,
inventory_quantity:variant.inventory_quantity,
is_active:variant.is_active
})

})

}

return(

<div className="space-y-6">

<h1 className="text-2xl font-semibold">
Manage Inventory
</h1>

<Table>

<TableHeader>

<TableRow>

<TableHead></TableHead>
<TableHead>Product</TableHead>
<TableHead>Base Price</TableHead>
<TableHead>MRP</TableHead>
<TableHead>Featured</TableHead>
<TableHead>Active</TableHead>
<TableHead></TableHead>

</TableRow>

</TableHeader>

<TableBody>

{products.map(product=>(

<React.Fragment key={product.id}>

<TableRow>

<TableCell className="w-12">

<Button
variant="ghost"
size="icon"
onClick={()=>setExpanded(
expanded===product.id ? null : product.id
)}
>

{expanded===product.id
? <ChevronDown size={18}/>
: <ChevronRight size={18}/>
}

</Button>

</TableCell>

<TableCell>

<div className="font-medium">
{product.name ?? ""}
</div>

<div className="text-sm text-muted-foreground">
{product.brand ?? ""}
</div>

</TableCell>

<TableCell>

<Input
type="number"
value={product.base_price ?? 0}
onChange={(e)=>{

product.base_price=Number(e.target.value)
setProducts([...products])

}}
onBlur={()=>updateProduct(product)}
className="w-28"
/>

</TableCell>

<TableCell>

<Input
type="number"
value={product.mrp ?? 0}
onChange={(e)=>{

product.mrp=Number(e.target.value)
setProducts([...products])

}}
onBlur={()=>updateProduct(product)}
className="w-28"
/>

</TableCell>

<TableCell>

<Checkbox
checked={product.is_featured ?? false}
onCheckedChange={(v)=>{

product.is_featured=Boolean(v)
setProducts([...products])
updateProduct(product)

}}
/>

</TableCell>

<TableCell>

<Checkbox
checked={product.is_active ?? false}
onCheckedChange={(v)=>{

product.is_active=Boolean(v)
setProducts([...products])
updateProduct(product)

}}
/>

</TableCell>

<TableCell>

<Button
variant="outline"
size="sm"
onClick={()=>{

setEditingProduct(product)
setDialogOpen(true)

}}
>

Edit Details

</Button>

</TableCell>

</TableRow>

{expanded===product.id && product.product_options && (

<TableRow>

<TableCell colSpan={7}>

<div className="p-6 space-y-6 bg-muted/20 rounded-lg">

{product.product_options.map(option=>(

<div key={option.id} className="space-y-3">

<div className="font-semibold text-sm">
{option.name}
</div>

<Table>

<TableHeader>

<TableRow>

<TableHead>Variant</TableHead>
<TableHead>SKU</TableHead>
<TableHead>Add-on Price</TableHead>
<TableHead>Inventory</TableHead>
<TableHead>Active</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{option.product_option_values.map(variant=>(

<TableRow key={variant.id}>

<TableCell>{variant.value}</TableCell>

<TableCell>{variant.sku}</TableCell>

<TableCell>

<Input
type="number"
value={variant.addon_price ?? 0}
onChange={(e)=>{

variant.addon_price=Number(e.target.value)
setProducts([...products])

}}
onBlur={()=>updateVariant(variant)}
className="w-28"
/>

</TableCell>

<TableCell>

<Input
type="number"
value={variant.inventory_quantity ?? 0}
onChange={(e)=>{

variant.inventory_quantity=Number(e.target.value)
setProducts([...products])

}}
onBlur={()=>updateVariant(variant)}
className="w-28"
/>

</TableCell>

<TableCell>

<Checkbox
checked={variant.is_active ?? false}
onCheckedChange={(v)=>{

variant.is_active=Boolean(v)
setProducts([...products])
updateVariant(variant)

}}
/>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</div>

))}

</div>

</TableCell>

</TableRow>

)}

</React.Fragment>

))}

</TableBody>

</Table>

{editingProduct && (

<EditProductDialog
key={editingProduct.id}
product={editingProduct}
open={dialogOpen}
setOpen={setDialogOpen}
reload={loadProducts}
/>

)}

</div>

)

}