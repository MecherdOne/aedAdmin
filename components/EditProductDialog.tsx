


// "use client"

// import { useEffect,useState } from "react"
// import { createClient } from "@/utils/supabase/client"


// import {
// Dialog,
// DialogContent,
// DialogHeader,
// DialogTitle
// } from "@/components/ui/dialog"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"

// /* ---------------- TYPES ---------------- */

// interface DescriptionBlock{
// title:string
// description:string
// }

// interface OptionValue{
// value:string
// sort_order:number
// sku:string
// name:string
// attributes:Record<string,unknown>
// addon_price:number
// inventory_quantity:number
// reserved_quantity:number
// low_stock_threshold:number
// is_active:boolean
// }

// interface ProductOption{
// name:string
// sort_order:number
// values:OptionValue[]
// }

// interface Product{
// id:string
// category_id:string
// name:string
// brand:string
// slug:string
// description:DescriptionBlock[]
// images:string[]
// metadata:any
// base_price:number
// mrp:number
// is_featured:boolean
// is_active:boolean
// options:ProductOption[]
// }

// interface Props{
// product:Product
// open:boolean
// setOpen:(v:boolean)=>void
// reload:()=>void
// }

// export default function EditProductDialog({
// product,
// open,
// setOpen,
// reload
// }:Props){

// const supabase=createClient()

// /* ---------------- STATE ---------------- */

// const [name,setName]=useState("")
// const [brand,setBrand]=useState("")
// const [slug,setSlug]=useState("")

// const [basePrice,setBasePrice]=useState(0)
// const [mrp,setMrp]=useState(0)

// const [images,setImages]=useState<string[]>([])
// const [preview,setPreview]=useState<string[]>([])

// const [metadata,setMetadata]=useState("")

// const [description,setDescription]=useState<DescriptionBlock[]>([])
// const [options,setOptions]=useState<ProductOption[]>([])

// const [isFeatured,setIsFeatured]=useState(false)
// const [isActive,setIsActive]=useState(true)

// /* ---------------- LOAD PRODUCT ---------------- */

// useEffect(()=>{

// if(!product) return

// setName(product.name ?? "")
// setBrand(product.brand ?? "")
// setSlug(product.slug ?? "")

// setBasePrice(product.base_price ?? 0)
// setMrp(product.mrp ?? 0)

// setImages(product.images ?? [])
// setPreview(product.images ?? [])

// setMetadata(
// Array.isArray(product.metadata)
// ? product.metadata.join(",")
// : ""
// )

// setDescription(product.description ?? [])
// setOptions(product.options ?? [])

// setIsFeatured(product.is_featured ?? false)
// setIsActive(product.is_active ?? true)

// },[product])

// /* ---------------- IMAGE UPLOAD ---------------- */

// async function uploadImages(files:FileList|null){

// if(!files) return

// if(images.length + files.length > 5){
// alert("Maximum 5 images allowed")
// return
// }

// const urls:string[]=[]

// for(const file of Array.from(files)){

// const fileName = Date.now()+"-"+file.name

// await supabase.storage
// .from("product-images")
// .upload(fileName,file)

// const {data}=supabase.storage
// .from("product-images")
// .getPublicUrl(fileName)

// urls.push(data.publicUrl)

// }

// setImages(prev=>[...prev,...urls])
// setPreview(prev=>[...prev,...urls])

// }

// function removeImage(index:number){

// const copy=[...images]
// copy.splice(index,1)

// setImages(copy)
// setPreview(copy)

// }

// /* ---------------- DESCRIPTION ---------------- */

// function addDescription(){

// setDescription([
// ...description,
// {title:"",description:""}
// ])

// }

// function updateDescription(
// index:number,
// field:keyof DescriptionBlock,
// value:string
// ){

// const copy=[...description]
// copy[index][field]=value
// setDescription(copy)

// }

// /* ---------------- OPTIONS ---------------- */

// function addOption(){

// setOptions([
// ...options,
// {name:"",sort_order:0,values:[]}
// ])

// }

// function addOptionValue(index:number){

// const copy=[...options]

// copy[index].values.push({

// value:"",
// sort_order:0,
// sku:"",
// name:"",
// attributes:{},
// addon_price:0,
// inventory_quantity:0,
// reserved_quantity:0,
// low_stock_threshold:5,
// is_active:true

// })

// setOptions(copy)

// }

// function updateOptionName(index:number,value:string){

// const copy=[...options]
// copy[index].name=value
// setOptions(copy)

// }

// function updateOptionValue(
// optionIndex:number,
// valueIndex:number,
// field:keyof OptionValue,
// value:OptionValue[keyof OptionValue]
// ){

// const copy=[...options]

// copy[optionIndex].values[valueIndex]={

// ...copy[optionIndex].values[valueIndex],
// [field]:value

// }

// setOptions(copy)

// }

// /* ---------------- SAVE ---------------- */

// async function saveProduct(){

// const payload={

// id:product.id,

// category_id:product.category_id,

// name,
// brand,
// slug,

// base_price:basePrice,
// mrp,

// description,
// images,

// metadata:metadata
// ? metadata.split(",")
// :[],

// is_featured:isFeatured,
// is_active:isActive,

// options

// }

// const res=await fetch("/api/products/update-details",{

// method:"POST",
// headers:{
// "Content-Type":"application/json"
// },
// body:JSON.stringify(payload)

// })

// const data=await res.json()

// if(!res.ok){
// alert(data.error)
// return
// }

// reload()
// setOpen(false)

// }

// /* ---------------- UI ---------------- */

// return(

// <Dialog open={open} onOpenChange={setOpen}>

// <DialogContent className="max-w-[1300px] w-[95vw] max-h-[90vh] overflow-y-auto">

// <DialogHeader>
// <DialogTitle className="text-2xl font-extrabold">
// Edit Product
// </DialogTitle>
// </DialogHeader>

// <div className="space-y-10">

// {/* BASIC INFO */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Basic Information
// </CardTitle>
// </CardHeader>

// <CardContent className="space-y-6">

// <div>
// <Label className="font-semibold">Product Name</Label>
// <Input value={name ?? ""} onChange={(e)=>setName(e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Brand</Label>
// <Input value={brand ?? ""} onChange={(e)=>setBrand(e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Slug</Label>
// <Input value={slug ?? ""} onChange={(e)=>setSlug(e.target.value)}/>
// </div>

// </CardContent>

// </Card>

// {/* PRICING */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Pricing
// </CardTitle>
// </CardHeader>

// <CardContent className="space-y-6">

// <div>
// <Label className="font-semibold">Base Price</Label>
// <Input type="number" value={basePrice ?? 0}
// onChange={(e)=>setBasePrice(Number(e.target.value))}/>
// </div>

// <div>
// <Label className="font-semibold">MRP</Label>
// <Input type="number" value={mrp ?? 0}
// onChange={(e)=>setMrp(Number(e.target.value))}/>
// </div>

// </CardContent>

// </Card>

// {/* METADATA */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Metadata
// </CardTitle>
// </CardHeader>

// <CardContent>

// <Label className="font-semibold">Comma Separated Metadata</Label>

// <Input
// value={metadata ?? ""}
// onChange={(e)=>setMetadata(e.target.value)}
// />

// </CardContent>

// </Card>

// {/* FLAGS */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Product Settings
// </CardTitle>
// </CardHeader>

// <CardContent className="flex gap-10">

// <div className="flex items-center gap-3">
// <Checkbox checked={isFeatured ?? false}
// onCheckedChange={(v)=>setIsFeatured(Boolean(v))}/>
// <Label className="font-semibold">Featured Product</Label>
// </div>

// <div className="flex items-center gap-3">
// <Checkbox checked={isActive ?? false}
// onCheckedChange={(v)=>setIsActive(Boolean(v))}/>
// <Label className="font-semibold">Active Product</Label>
// </div>

// </CardContent>

// </Card>

// {/* DESCRIPTION */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Product Description Sections
// </CardTitle>
// </CardHeader>

// <CardContent className="space-y-6">

// {description.map((d,i)=>(

// <div key={i} className="border rounded-lg p-6 space-y-4">

// <div>
// <Label className="font-semibold">Section Title</Label>
// <Input value={d.title ?? ""}
// onChange={(e)=>updateDescription(i,"title",e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Section Description</Label>
// <Textarea value={d.description ?? ""}
// onChange={(e)=>updateDescription(i,"description",e.target.value)}/>
// </div>

// </div>

// ))}

// <Button type="button" onClick={addDescription}>
// Add Description Section
// </Button>

// </CardContent>

// </Card>

// {/* IMAGES */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Product Images
// </CardTitle>
// </CardHeader>

// <CardContent className="space-y-4">

// <input
// type="file"
// multiple
// accept="image/*"
// onChange={(e)=>uploadImages(e.target.files)}
// />

// <div className="flex gap-4 flex-wrap">

// {preview.map((src,i)=>(

// <div key={i} className="relative">

// <img
// src={src}
// className="w-24 h-24 object-cover rounded border"
// />

// <Button
// type="button"
// size="icon"
// variant="destructive"
// className="absolute -top-2 -right-2 h-6 w-6"
// onClick={()=>removeImage(i)}
// >
// ✕
// </Button>

// </div>

// ))}

// </div>

// </CardContent>

// </Card>

// {/* OPTIONS */}

// <Card>

// <CardHeader>
// <CardTitle className="text-xl font-bold">
// Product Options / Variants
// </CardTitle>
// </CardHeader>

// <CardContent className="space-y-10">

// {options.map((option,i)=>(

// <div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

// <h3 className="text-lg font-bold">
// Option {i+1}
// </h3>

// <div>
// <Label className="font-semibold">Option Name</Label>
// <Input value={option.name ?? ""}
// onChange={(e)=>updateOptionName(i,e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Sort Order</Label>
// <Input type="number"
// value={option.sort_order ?? 0}
// onChange={(e)=>{
// const copy=[...options]
// copy[i].sort_order=Number(e.target.value)
// setOptions(copy)
// }}
// />
// </div>

// {/* OPTION VALUES */}

// <div className="space-y-6">

// {option.values.map((value,vi)=>(

// <div key={vi} className="border rounded-lg p-6 space-y-4">

// <h4 className="font-bold text-md">
// Variant {vi+1}
// </h4>

// <div>
// <Label className="font-semibold">Variant Value</Label>
// <Input value={value.value ?? ""}
// onChange={(e)=>updateOptionValue(i,vi,"value",e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Display Name</Label>
// <Input value={value.name ?? ""}
// onChange={(e)=>updateOptionValue(i,vi,"name",e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">SKU</Label>
// <Input value={value.sku ?? ""}
// onChange={(e)=>updateOptionValue(i,vi,"sku",e.target.value)}/>
// </div>

// <div>
// <Label className="font-semibold">Sort Order</Label>
// <Input type="number"
// value={value.sort_order ?? 0}
// onChange={(e)=>updateOptionValue(i,vi,"sort_order",Number(e.target.value))}/>
// </div>

// <div>
// <Label className="font-semibold">Addon Price</Label>
// <Input type="number"
// value={value.addon_price ?? 0}
// onChange={(e)=>updateOptionValue(i,vi,"addon_price",Number(e.target.value))}/>
// </div>

// <div>
// <Label className="font-semibold">Inventory Quantity</Label>
// <Input type="number"
// value={value.inventory_quantity ?? 0}
// onChange={(e)=>updateOptionValue(i,vi,"inventory_quantity",Number(e.target.value))}/>
// </div>

// <div>
// <Label className="font-semibold">Reserved Quantity</Label>
// <Input type="number"
// value={value.reserved_quantity ?? 0}
// onChange={(e)=>updateOptionValue(i,vi,"reserved_quantity",Number(e.target.value))}/>
// </div>

// <div>
// <Label className="font-semibold">Low Stock Threshold</Label>
// <Input type="number"
// value={value.low_stock_threshold ?? 0}
// onChange={(e)=>updateOptionValue(i,vi,"low_stock_threshold",Number(e.target.value))}/>
// </div>

// </div>

// ))}

// <Button type="button" variant="outline" onClick={()=>addOptionValue(i)}>
// Add Variant
// </Button>

// </div>

// </div>

// ))}

// <Button type="button" variant="secondary" onClick={addOption}>
// Add Product Option
// </Button>

// </CardContent>

// </Card>

// <Button size="lg" onClick={saveProduct}>
// Update Product
// </Button>

// </div>

// </DialogContent>

// </Dialog>

// )

// }

"use client"

import { useEffect,useState } from "react"
import { createClient } from "@/utils/supabase/client"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import { Product } from "@/types/product"

/* ---------------- TYPES ---------------- */

interface DescriptionBlock{
title:string
description:string
}

interface OptionValue{
value:string
sort_order:number
sku:string
name:string
attributes:Record<string,unknown>
addon_price:number
inventory_quantity:number
reserved_quantity:number
low_stock_threshold:number
is_active:boolean
}

interface ProductOption{
id?:string
name:string
sort_order:number
values:OptionValue[]
}

interface Props{
product:Product
open:boolean
setOpen:(v:boolean)=>void
reload:()=>void
}

export default function EditProductDialog({
product,
open,
setOpen,
reload
}:Props){

const supabase=createClient()

/* ---------------- STATE ---------------- */

const [name,setName]=useState("")
const [brand,setBrand]=useState("")
const [slug,setSlug]=useState("")

const [basePrice,setBasePrice]=useState(0)
const [mrp,setMrp]=useState(0)

const [images,setImages]=useState<string[]>([])
const [preview,setPreview]=useState<string[]>([])

const [metadata,setMetadata]=useState("")

const [description,setDescription]=useState<DescriptionBlock[]>([])
const [options,setOptions]=useState<ProductOption[]>([])

const [isFeatured,setIsFeatured]=useState(false)
const [isActive,setIsActive]=useState(true)

/* ---------------- LOAD PRODUCT ---------------- */

useEffect(()=>{

if(!product) return

setName(product.name ?? "")
setBrand(product.brand ?? "")
setSlug(product.slug ?? "")

setBasePrice(product.base_price ?? 0)
setMrp(product.mrp ?? 0)

setImages(product.images ?? [])
setPreview(product.images ?? [])

setMetadata(
Array.isArray(product.metadata)
? product.metadata.join(",")
: ""
)

setDescription(product.description ?? [])

setOptions(
(product.product_options ?? []).map(opt=>({
id:opt.id,
name:opt.name,
sort_order:opt.sort_order,
values:(opt.product_option_values ?? []).map(v=>({
value:v.value,
sort_order:v.sort_order ?? 0,
sku:v.sku ?? "",
name:v.name ?? "",
attributes:{},
addon_price:v.addon_price ?? 0,
inventory_quantity:v.inventory_quantity ?? 0,
reserved_quantity:v.reserved_quantity ?? 0,
low_stock_threshold:v.low_stock_threshold ?? 0,
is_active:v.is_active ?? true
}))
}))
)

setIsFeatured(product.is_featured ?? false)
setIsActive(product.is_active ?? true)

},[product])

/* ---------------- IMAGE UPLOAD ---------------- */

async function uploadImages(files:FileList|null){

if(!files) return

if(images.length + files.length > 5){
alert("Maximum 5 images allowed")
return
}

const urls:string[]=[]

for(const file of Array.from(files)){

const fileName = Date.now()+"-"+file.name

await supabase.storage
.from("product-images")
.upload(fileName,file)

const {data}=supabase.storage
.from("product-images")
.getPublicUrl(fileName)

urls.push(data.publicUrl)

}

setImages(prev=>[...prev,...urls])
setPreview(prev=>[...prev,...urls])

}

function removeImage(index:number){

const copy=[...images]
copy.splice(index,1)

setImages(copy)
setPreview(copy)

}

/* ---------------- DESCRIPTION ---------------- */

function addDescription(){

setDescription([
...description,
{title:"",description:""}
])

}

function updateDescription(
index:number,
field:keyof DescriptionBlock,
value:string
){

const copy=[...description]
copy[index][field]=value
setDescription(copy)

}

/* ---------------- OPTIONS ---------------- */

function addOption(){

setOptions([
...options,
{name:"",sort_order:0,values:[]}
])

}

function addOptionValue(index:number){

const copy=[...options]

copy[index].values.push({

value:"",
sort_order:0,
sku:"",
name:"",
attributes:{},
addon_price:0,
inventory_quantity:0,
reserved_quantity:0,
low_stock_threshold:5,
is_active:true

})

setOptions(copy)

}

function updateOptionName(index:number,value:string){

const copy=[...options]
copy[index].name=value
setOptions(copy)

}

function updateOptionValue(
optionIndex:number,
valueIndex:number,
field:keyof OptionValue,
value:OptionValue[keyof OptionValue]
){

const copy=[...options]

copy[optionIndex].values[valueIndex]={

...copy[optionIndex].values[valueIndex],
[field]:value

}

setOptions(copy)

}

/* ---------------- SAVE ---------------- */

async function saveProduct(){

const payload={

id:product.id,

category_id:product.category_id,

name,
brand,
slug,

base_price:basePrice,
mrp,

description,
images,

metadata:metadata
? metadata.split(",")
:[],

is_featured:isFeatured,
is_active:isActive,

product_options:options

}

const res=await fetch("/api/products/update-details",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)

})

const data=await res.json()

if(!res.ok){
alert(data.error)
return
}

reload()
setOpen(false)

}

/* ---------------- UI ---------------- */

return(

<Dialog open={open} onOpenChange={setOpen}>

<DialogContent className="max-w-[1300px] w-[95vw] max-h-[90vh] overflow-y-auto">

<DialogHeader>
<DialogTitle className="text-2xl font-extrabold">
Edit Product
</DialogTitle>
</DialogHeader>

<div className="space-y-10">

<Card>

<CardHeader>
<CardTitle className="text-xl font-bold">
Basic Information
</CardTitle>
</CardHeader>

<CardContent className="space-y-6">

<div>
<Label className="font-semibold">Product Name</Label>
<Input value={name} onChange={(e)=>setName(e.target.value)}/>
</div>

<div>
<Label className="font-semibold">Brand</Label>
<Input value={brand} onChange={(e)=>setBrand(e.target.value)}/>
</div>

<div>
<Label className="font-semibold">Slug</Label>
<Input value={slug} onChange={(e)=>setSlug(e.target.value)}/>
</div>

</CardContent>

</Card>

{/* Pricing */}

<Card>

<CardHeader>
<CardTitle className="text-xl font-bold">
Pricing
</CardTitle>
</CardHeader>

<CardContent className="space-y-6">

<div>
<Label className="font-semibold">Base Price</Label>
<Input type="number" value={basePrice}
onChange={(e)=>setBasePrice(Number(e.target.value))}/>
</div>

<div>
<Label className="font-semibold">MRP</Label>
<Input type="number" value={mrp}
onChange={(e)=>setMrp(Number(e.target.value))}/>
</div>

</CardContent>

</Card>

{/* Images */}

<Card>

<CardHeader>
<CardTitle className="text-xl font-bold">
Product Images
</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>uploadImages(e.target.files)}
/>

<div className="flex gap-4 flex-wrap">

{preview.map((src,i)=>(

<div key={i} className="relative">

<img
src={src}
className="w-24 h-24 object-cover rounded border"
/>

<Button
type="button"
size="icon"
variant="destructive"
className="absolute -top-2 -right-2 h-6 w-6"
onClick={()=>removeImage(i)}
>
✕
</Button>

</div>

))}

</div>

</CardContent>

</Card>

{/* OPTIONS */}

<Card>

<CardHeader>
<CardTitle className="text-xl font-bold">
Product Options / Variants
</CardTitle>
</CardHeader>

<CardContent className="space-y-10">

{options.map((option,i)=>(

<div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

<h3 className="text-lg font-bold">
Option {i+1}
</h3>

<div>
<Label className="font-semibold">Option Name</Label>
<Input value={option.name}
onChange={(e)=>updateOptionName(i,e.target.value)}/>
</div>

<div>
<Label className="font-semibold">Sort Order</Label>
<Input type="number"
value={option.sort_order}
onChange={(e)=>{
const copy=[...options]
copy[i].sort_order=Number(e.target.value)
setOptions(copy)
}}
/>
</div>

<div className="space-y-6">

{option.values.map((value,vi)=>(

<div key={vi} className="border rounded-lg p-6 space-y-4">

<h4 className="font-bold">
Variant {vi+1}
</h4>

<div>
<Label>Variant Value</Label>
<Input value={value.value}
onChange={(e)=>updateOptionValue(i,vi,"value",e.target.value)}/>
</div>

<div>
<Label>SKU</Label>
<Input value={value.sku}
onChange={(e)=>updateOptionValue(i,vi,"sku",e.target.value)}/>
</div>

<div>
<Label>Addon Price</Label>
<Input type="number"
value={value.addon_price}
onChange={(e)=>updateOptionValue(i,vi,"addon_price",Number(e.target.value))}/>
</div>

<div>
<Label>Inventory</Label>
<Input type="number"
value={value.inventory_quantity}
onChange={(e)=>updateOptionValue(i,vi,"inventory_quantity",Number(e.target.value))}/>
</div>

</div>

))}

<Button type="button" variant="outline" onClick={()=>addOptionValue(i)}>
Add Variant
</Button>

</div>

</div>

))}

<Button type="button" variant="secondary" onClick={addOption}>
Add Product Option
</Button>

</CardContent>

</Card>

<Button size="lg" onClick={saveProduct}>
Update Product
</Button>

</div>

</DialogContent>

</Dialog>

)

}