

// "use client"

// import { useEffect, useState, useRef } from "react"
// import { createClient } from "@/utils/supabase/client"

// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"

// /* ---------------- TYPES ---------------- */

// interface Category {
//   id: string
//   name: string
// }

// interface DescriptionBlock {
//   title: string
//   description: string
// }

// interface Attribute {
//   key: string
//   value: string
// }

// interface OptionValue {
//   id?: string
//   value: string
//   name: string
//   sku: string
//   sort_order: number
//   addon_price: number
//   inventory_quantity: number
//   reserved_quantity: number
//   low_stock_threshold: number
//   tax_percent: number
//   attributes: Attribute[]
//   is_active: boolean
// }

// interface ProductOption {
//   id?: string
//   name: string
//   sort_order: number
//   values: OptionValue[]
// }

// /* ---------------- COMPONENT ---------------- */

// export default function EditProducts({
//   productId,
//   categories
// }:{
//   productId:string
//   categories:Category[]
// }){

//   const supabase = createClient()
//   const formRef = useRef<HTMLFormElement>(null)

//   const [product,setProduct] = useState<any>(null)

//   const [images,setImages] = useState<string[]>([])
//   const [preview,setPreview] = useState<string[]>([])

//   const [description,setDescription] = useState<DescriptionBlock[]>([])
//   const [options,setOptions] = useState<ProductOption[]>([])

//   const [isFeatured,setIsFeatured] = useState(false)
//   const [isActive,setIsActive] = useState(true)

//   /* ---------------- LOAD PRODUCT ---------------- */

//   useEffect(()=>{

//     async function load(){

//       const res = await fetch(`/api/inventory?product_id=${productId}`)
//       const data = await res.json()

//       setProduct(data)

//       setImages(data.images ?? [])
//       setPreview(data.images ?? [])

//       setDescription(data.description ?? [])

//       setIsFeatured(data.is_featured)
//       setIsActive(data.is_active)

//       const opts = (data.product_options ?? []).map((o:any)=>({

//         id:o.id,
//         name:o.name,
//         sort_order:o.sort_order,

//         values:(o.product_option_values ?? []).map((v:any)=>({

//           id:v.id,
//           value:v.value,
//           name:v.name ?? "",
//           sku:v.sku ?? "",
//           sort_order:v.sort_order ?? 0,
//           addon_price:v.addon_price ?? 0,
//           inventory_quantity:v.inventory_quantity ?? 0,
//           reserved_quantity:v.reserved_quantity ?? 0,
//           low_stock_threshold:v.low_stock_threshold ?? 5,
//           tax_percent:v.tax_percent ?? 0,
//           attributes:Object.entries(v.attributes ?? {}).map(([k,val])=>({
//             key:k,
//             value:String(val)
//           })),
//           is_active:v.is_active ?? true

//         }))

//       }))

//       setOptions(opts)

//     }

//     load()

//   },[productId])

//   /* ---------------- IMAGE UPLOAD ---------------- */

//   async function uploadImages(files:FileList|null){

//     if(!files) return

//     const urls:string[]=[]

//     for(const file of Array.from(files)){

//       const name = Date.now()+"-"+file.name

//       await supabase.storage
//         .from("product-images")
//         .upload(name,file)

//       const {data} = supabase.storage
//         .from("product-images")
//         .getPublicUrl(name)

//       urls.push(data.publicUrl)

//     }

//     setImages([...images,...urls])
//     setPreview([...preview,...urls])

//   }

//   /* ---------------- IMAGE DELETE ---------------- */

//   function removeImage(index:number){

//     const img=[...images]
//     const prev=[...preview]

//     img.splice(index,1)
//     prev.splice(index,1)

//     setImages(img)
//     setPreview(prev)

//   }

//   /* ---------------- DESCRIPTION ---------------- */

//   function addDescription(){

//     setDescription([
//       ...description,
//       {title:"",description:""}
//     ])

//   }

//   function updateDescription(index:number,field:keyof DescriptionBlock,value:string){

//     const copy=[...description]
//     copy[index][field]=value
//     setDescription(copy)

//   }

//   /* ---------------- OPTIONS ---------------- */

//   function addOption(){

//     setOptions([
//       ...options,
//       {name:"",sort_order:0,values:[]}
//     ])

//   }

//   function addOptionValue(index:number){

//     const copy=[...options]

//     copy[index].values.push({
//       value:"",
//       name:"",
//       sku:"",
//       sort_order:0,
//       addon_price:0,
//       inventory_quantity:0,
//       reserved_quantity:0,
//       low_stock_threshold:5,
//       tax_percent:0,
//       attributes:[],
//       is_active:true
//     })

//     setOptions(copy)

//   }

//   function updateOptionName(index:number,value:string){

//     const copy=[...options]
//     copy[index].name=value
//     setOptions(copy)

//   }

//   function updateOptionValue(
//     optionIndex:number,
//     valueIndex:number,
//     field:keyof OptionValue,
//     value:any
//   ){

//     const copy=[...options]

//     const updatedValue={
//       ...copy[optionIndex].values[valueIndex],
//       [field]:value
//     }

//     copy[optionIndex].values[valueIndex]=updatedValue

//     setOptions(copy)

//   }

//   /* ---------------- ATTRIBUTE ADD ---------------- */

//   function addAttribute(optionIndex:number,valueIndex:number){

//     const copy=[...options]

//     copy[optionIndex].values[valueIndex].attributes.push({
//       key:"",
//       value:""
//     })

//     setOptions(copy)

//   }

//   /* ---------------- SUBMIT ---------------- */

//   async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

//     e.preventDefault()

//     const form = new FormData(e.currentTarget)

//     const metadataValue = form.get("metadata") as string | null

//     const formattedOptions = options.map(option=>({

//       ...option,

//       values:option.values.map(v=>({

//         ...v,

//         attributes:Object.fromEntries(
//           v.attributes.map(a=>[a.key,a.value])
//         )

//       }))

//     }))

//     const payload={

//       product_id:productId,

//       category_id:form.get("category"),
//       name:form.get("name"),
//       brand:form.get("brand"),
//       slug:form.get("slug"),

//       base_price:Number(form.get("base_price")),
//       mrp:Number(form.get("mrp")),
//       tax_percent:Number(form.get("tax_percent")),

//       description,
//       images,

//       metadata:metadataValue
//         ? metadataValue.split(",")
//         : [],

//       is_featured:isFeatured,
//       is_active:isActive,

//       options:formattedOptions

//     }

//     const res = await fetch("/api/inventory",{
//       method:"PUT",
//       headers:{ "Content-Type":"application/json" },
//       body:JSON.stringify(payload)
//     })

//     const data = await res.json()

//     if(!res.ok){
//       alert(data.error)
//       return
//     }

//     alert("Product updated")

//   }

//   if(!product) return <div className="p-10">Loading...</div>

//   /* ---------------- UI ---------------- */

//   return (

// <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 max-w-7xl">

// {/* BASIC INFO */}

// <Card>

// <CardHeader>
// <CardTitle>Basic Information</CardTitle>
// </CardHeader>

// <CardContent className="grid grid-cols-3 gap-6">

// <div>
// <Label>Name</Label>
// <Input name="name" defaultValue={product.name}/>
// </div>

// <div>
// <Label>Brand</Label>
// <Input name="brand" defaultValue={product.brand}/>
// </div>

// <div>
// <Label>Slug</Label>
// <Input name="slug" defaultValue={product.slug}/>
// </div>

// </CardContent>
// </Card>

// {/* CATEGORY */}

// <Card>

// <CardHeader>
// <CardTitle>Category</CardTitle>
// </CardHeader>

// <CardContent>

// <select
// name="category"
// defaultValue={product.category_id}
// className="border rounded p-2 w-full"
// >

// {categories.map(c=>(
// <option key={c.id} value={c.id}>
// {c.name}
// </option>
// ))}

// </select>

// </CardContent>
// </Card>

// {/* PRICING */}

// <Card>

// <CardHeader>
// <CardTitle>Pricing</CardTitle>
// </CardHeader>

// <CardContent className="grid grid-cols-3 gap-6">

// <div>
// <Label>Base Price</Label>
// <Input name="base_price" type="number" defaultValue={product.base_price}/>
// </div>

// <div>
// <Label>MRP</Label>
// <Input name="mrp" type="number" defaultValue={product.mrp}/>
// </div>

// <div>
// <Label>Tax %</Label>
// <Input name="tax_percent" type="number" defaultValue={product.tax_percent}/>
// </div>

// </CardContent>
// </Card>

// {/* METADATA */}

// <Card>

// <CardHeader>
// <CardTitle>Metadata</CardTitle>
// </CardHeader>

// <CardContent>

// <Label>Comma separated metadata</Label>

// <Input
// name="metadata"
// defaultValue={(product.metadata ?? []).join(",")}
// />

// </CardContent>
// </Card>

// {/* FLAGS */}

// <Card>

// <CardHeader>
// <CardTitle>Product Settings</CardTitle>
// </CardHeader>

// <CardContent className="flex gap-8">

// <div className="flex items-center gap-3">

// <Checkbox
// checked={isFeatured}
// onCheckedChange={(v)=>setIsFeatured(Boolean(v))}
// />

// <Label>Featured</Label>

// </div>

// <div className="flex items-center gap-3">

// <Checkbox
// checked={isActive}
// onCheckedChange={(v)=>setIsActive(Boolean(v))}
// />

// <Label>Active</Label>

// </div>

// </CardContent>
// </Card>

// {/* DESCRIPTION */}

// <Card>

// <CardHeader>
// <CardTitle>Description Sections</CardTitle>
// </CardHeader>

// <CardContent className="space-y-6">

// {description.map((d,i)=>(

// <div key={i} className="border rounded-lg p-4 space-y-3">

// <div>
// <Label>Title</Label>
// <Input
// value={d.title}
// onChange={(e)=>updateDescription(i,"title",e.target.value)}
// />
// </div>

// <div>
// <Label>Description</Label>
// <Textarea
// value={d.description}
// onChange={(e)=>updateDescription(i,"description",e.target.value)}
// />
// </div>

// </div>

// ))}

// <Button type="button" onClick={addDescription}>
// Add Section
// </Button>

// </CardContent>
// </Card>

// {/* IMAGES */}

// <Card>

// <CardHeader>
// <CardTitle>Images</CardTitle>
// </CardHeader>

// <CardContent className="space-y-4">

// <input
// type="file"
// multiple
// onChange={(e)=>uploadImages(e.target.files)}
// />

// <div className="flex gap-4 flex-wrap">

// {preview.map((src,i)=>(

// <div key={`${src}-${i}`} className="relative">

// <img
// src={src}
// className="w-24 h-24 object-cover rounded"
// />

// <button
// type="button"
// className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
// onClick={()=>removeImage(i)}
// >
// X
// </button>

// </div>

// ))}

// </div>

// </CardContent>
// </Card>

// {/* VARIANTS */}

// <Card>

// <CardHeader>
// <CardTitle>Product Options / Variants</CardTitle>
// </CardHeader>

// <CardContent className="space-y-10">

// {options.map((option,i)=>(

// <div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

// <div className="grid grid-cols-2 gap-6">

// <div>
// <Label>Option Name</Label>
// <Input
// value={option.name}
// onChange={(e)=>updateOptionName(i,e.target.value)}
// />
// </div>

// <div>
// <Label>Sort Order</Label>
// <Input
// type="number"
// value={option.sort_order}
// onChange={(e)=>{
// const copy=[...options]
// copy[i].sort_order=Number(e.target.value)
// setOptions(copy)
// }}
// />
// </div>

// </div>

// <div className="space-y-6">

// {option.values.map((value,vi)=>(

// <div key={vi} className="border p-6 rounded-lg grid grid-cols-4 gap-6">

// <div>
// <Label>Value</Label>
// <Input
// value={value.value}
// onChange={(e)=>updateOptionValue(i,vi,"value",e.target.value)}
// />
// </div>

// <div>
// <Label>Name</Label>
// <Input
// value={value.name}
// onChange={(e)=>updateOptionValue(i,vi,"name",e.target.value)}
// />
// </div>

// <div>
// <Label>SKU</Label>
// <Input
// value={value.sku}
// onChange={(e)=>updateOptionValue(i,vi,"sku",e.target.value)}
// />
// </div>

// <div>
// <Label>Sort Order</Label>
// <Input
// type="number"
// value={value.sort_order}
// onChange={(e)=>updateOptionValue(i,vi,"sort_order",Number(e.target.value))}
//  />
// </div>

// <div>
// <Label>Addon Price</Label>
// <Input
// type="number"
// value={value.addon_price}
// onChange={(e)=>updateOptionValue(i,vi,"addon_price",Number(e.target.value))}
//  />
// </div>

// <div>
// <Label>Inventory</Label>
// <Input
// type="number"
// value={value.inventory_quantity}
// onChange={(e)=>updateOptionValue(i,vi,"inventory_quantity",Number(e.target.value))}
//  />
// </div>

// <div>
// <Label>Reserved</Label>
// <Input
// type="number"
// value={value.reserved_quantity}
// onChange={(e)=>updateOptionValue(i,vi,"reserved_quantity",Number(e.target.value))}
//  />
// </div>

// <div>
// <Label>Low Stock Threshold</Label>
// <Input
// type="number"
// value={value.low_stock_threshold}
// onChange={(e)=>updateOptionValue(i,vi,"low_stock_threshold",Number(e.target.value))}
//  />
// </div>

// <div>
// <Label>Tax %</Label>
// <Input
// type="number"
// value={value.tax_percent}
// onChange={(e)=>updateOptionValue(i,vi,"tax_percent",Number(e.target.value))}
//  />
// </div>

// <div className="col-span-4 space-y-2">

// <Label>Attributes</Label>

// {value.attributes.map((attr,ai)=>(

// <div key={ai} className="flex gap-2">

// <Input
// placeholder="Title"
// value={attr.key}
// onChange={(e)=>{

// const copy=[...options]
// copy[i].values[vi].attributes[ai].key=e.target.value
// setOptions(copy)

// }}
// />

// <Input
// placeholder="Value"
// value={attr.value}
// onChange={(e)=>{

// const copy=[...options]
// copy[i].values[vi].attributes[ai].value=e.target.value
// setOptions(copy)

// }}
// />

// </div>

// ))}

// <Button
// type="button"
// variant="outline"
// onClick={()=>addAttribute(i,vi)}
// >
// Add Attribute
// </Button>

// </div>

// <div className="flex items-center gap-3">

// <Checkbox
// checked={value.is_active}
// onCheckedChange={(v)=>updateOptionValue(i,vi,"is_active",Boolean(v))}
// />

// <Label>Active</Label>

// </div>

// </div>

// ))}

// <Button type="button" variant="outline" onClick={()=>addOptionValue(i)}>
// Add Option Value
// </Button>

// </div>

// </div>

// ))}

// <Button type="button" variant="secondary" onClick={addOption}>
// Add Product Option
// </Button>

// </CardContent>
// </Card>

// <Button size="lg" type="submit">
// Update Product
// </Button>

// </form>

//   )
// }

"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

/* ---------------- TYPES ---------------- */

interface Category {
  id: string
  name: string
}

interface DescriptionBlock {
  title: string
  description: string
}

interface Attribute {
  key: string
  value: string
}

interface OptionValue {
  id?: string
  value: string
  name: string
  sku: string
  sort_order: number
  addon_price: number
  inventory_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  tax_percent: number
  attributes: Attribute[]
  is_active: boolean
}

interface ProductOption {
  id?: string
  name: string
  sort_order: number
  values: OptionValue[]
}

/* ---------------- COMPONENT ---------------- */

export default function EditProducts({
  productId,
  categories
}:{
  productId:string
  categories:Category[]
}){

  const supabase = createClient()
  const formRef = useRef<HTMLFormElement>(null)

  const [product,setProduct] = useState<any>(null)

  const [images,setImages] = useState<string[]>([])
  const [preview,setPreview] = useState<string[]>([])

  const [description,setDescription] = useState<DescriptionBlock[]>([])
  const [options,setOptions] = useState<ProductOption[]>([])

  // Track ids removed by the user so the API can actually delete them in Supabase —
  // otherwise a removed option/value just reappears since PUT only inserts/updates.
  const [deletedOptionIds,setDeletedOptionIds] = useState<string[]>([])
  const [deletedValueIds,setDeletedValueIds] = useState<string[]>([])

  const [isFeatured,setIsFeatured] = useState(false)
  const [isActive,setIsActive] = useState(true)

  /* ---------------- LOAD PRODUCT ---------------- */

  useEffect(()=>{

    async function load(){

      const res = await fetch(`/api/inventory?product_id=${productId}`)
      const data = await res.json()

      setProduct(data)

      setImages(data.images ?? [])
      setPreview(data.images ?? [])

      setDescription(data.description ?? [])

      setIsFeatured(data.is_featured)
      setIsActive(data.is_active)

      const opts = (data.product_options ?? []).map((o:any)=>({

        id:o.id,
        name:o.name,
        sort_order:o.sort_order,

        values:(o.product_option_values ?? []).map((v:any)=>({

          id:v.id,
          value:v.value,
          name:v.name ?? "",
          sku:v.sku ?? "",
          sort_order:v.sort_order ?? 0,
          addon_price:v.addon_price ?? 0,
          inventory_quantity:v.inventory_quantity ?? 0,
          reserved_quantity:v.reserved_quantity ?? 0,
          low_stock_threshold:v.low_stock_threshold ?? 5,
          tax_percent:v.tax_percent ?? 0,
          attributes:Object.entries(v.attributes ?? {}).map(([k,val])=>({
            key:k,
            value:String(val)
          })),
          is_active:v.is_active ?? true

        }))

      }))

      setOptions(opts)

      // Reset deletion tracking whenever a fresh product loads
      setDeletedOptionIds([])
      setDeletedValueIds([])

    }

    load()

  },[productId])

  /* ---------------- IMAGE UPLOAD ---------------- */

  async function uploadImages(files:FileList|null){

    if(!files) return

    const urls:string[]=[]

    for(const file of Array.from(files)){

      const name = Date.now()+"-"+file.name

      await supabase.storage
        .from("product-images")
        .upload(name,file)

      const {data} = supabase.storage
        .from("product-images")
        .getPublicUrl(name)

      urls.push(data.publicUrl)

    }

    setImages([...images,...urls])
    setPreview([...preview,...urls])

  }

  /* ---------------- IMAGE DELETE ---------------- */

  function removeImage(index:number){

    const img=[...images]
    const prev=[...preview]

    img.splice(index,1)
    prev.splice(index,1)

    setImages(img)
    setPreview(prev)

  }

  /* ---------------- DESCRIPTION ---------------- */

  function addDescription(){

    setDescription([
      ...description,
      {title:"",description:""}
    ])

  }

  function updateDescription(index:number,field:keyof DescriptionBlock,value:string){

    const copy=[...description]
    copy[index][field]=value
    setDescription(copy)

  }

  function removeDescription(index:number){

    const copy=[...description]
    copy.splice(index,1)
    setDescription(copy)

  }

  /* ---------------- OPTIONS ---------------- */

  function addOption(){

    setOptions([
      ...options,
      {name:"",sort_order:0,values:[]}
    ])

  }

  function removeOption(index:number){

    const opt = options[index]

    // If this option already exists in the DB, mark it for deletion there too
    if(opt.id){
      setDeletedOptionIds(prev=>[...prev, opt.id as string])
    }

    const copy=[...options]
    copy.splice(index,1)
    setOptions(copy)

  }

  function addOptionValue(index:number){

    const copy=[...options]

    copy[index].values.push({
      value:"",
      name:"",
      sku:"",
      sort_order:0,
      addon_price:0,
      inventory_quantity:0,
      reserved_quantity:0,
      low_stock_threshold:5,
      tax_percent:0,
      attributes:[],
      is_active:true
    })

    setOptions(copy)

  }

  function removeOptionValue(optionIndex:number,valueIndex:number){

    const val = options[optionIndex].values[valueIndex]

    // If this value already exists in the DB, mark it for deletion there too
    if(val.id){
      setDeletedValueIds(prev=>[...prev, val.id as string])
    }

    const copy=[...options]
    copy[optionIndex].values.splice(valueIndex,1)
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
    value:any
  ){

    const copy=[...options]

    const updatedValue={
      ...copy[optionIndex].values[valueIndex],
      [field]:value
    }

    copy[optionIndex].values[valueIndex]=updatedValue

    setOptions(copy)

  }

  /* ---------------- ATTRIBUTE ADD ---------------- */

  function addAttribute(optionIndex:number,valueIndex:number){

    const copy=[...options]

    copy[optionIndex].values[valueIndex].attributes.push({
      key:"",
      value:""
    })

    setOptions(copy)

  }

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>){

    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const metadataValue = form.get("metadata") as string | null

    const formattedOptions = options.map(option=>({

      ...option,

      values:option.values.map(v=>({

        ...v,

        attributes:Object.fromEntries(
          v.attributes.map(a=>[a.key,a.value])
        )

      }))

    }))

    const payload={

      product_id:productId,

      category_id:form.get("category"),
      name:form.get("name"),
      brand:form.get("brand"),
      slug:form.get("slug"),

      base_price:Number(form.get("base_price")),
      mrp:Number(form.get("mrp")),
      tax_percent:Number(form.get("tax_percent")),

      description,
      images,

      metadata:metadataValue
        ? metadataValue.split(",")
        : [],

      is_featured:isFeatured,
      is_active:isActive,

      options:formattedOptions,

      // Tell the API which existing options/values to actually delete
      deleted_option_ids:deletedOptionIds,
      deleted_value_ids:deletedValueIds

    }

    const res = await fetch("/api/inventory",{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(payload)
    })

    const data = await res.json()

    if(!res.ok){
      alert(data.error)
      return
    }

    // Clear deletion tracking now that the server has processed them
    setDeletedOptionIds([])
    setDeletedValueIds([])

    alert("Product updated")

  }

  if(!product) return <div className="p-10">Loading...</div>

  /* ---------------- UI ---------------- */

  return (

<form ref={formRef} onSubmit={handleSubmit} className="space-y-10 max-w-7xl">

{/* BASIC INFO */}

<Card>

<CardHeader>
<CardTitle>Basic Information</CardTitle>
</CardHeader>

<CardContent className="grid grid-cols-3 gap-6">

<div>
<Label>Name</Label>
<Input name="name" defaultValue={product.name}/>
</div>

<div>
<Label>Brand</Label>
<Input name="brand" defaultValue={product.brand}/>
</div>

<div>
<Label>Slug</Label>
<Input name="slug" defaultValue={product.slug}/>
</div>

</CardContent>
</Card>

{/* CATEGORY */}

<Card>

<CardHeader>
<CardTitle>Category</CardTitle>
</CardHeader>

<CardContent>

<select
name="category"
defaultValue={product.category_id}
className="border rounded p-2 w-full"
>

{categories.map(c=>(
<option key={c.id} value={c.id}>
{c.name}
</option>
))}

</select>

</CardContent>
</Card>

{/* PRICING */}

<Card>

<CardHeader>
<CardTitle>Pricing</CardTitle>
</CardHeader>

<CardContent className="grid grid-cols-3 gap-6">

<div>
<Label>Base Price</Label>
<Input name="base_price" type="number" defaultValue={product.base_price}/>
</div>

<div>
<Label>MRP</Label>
<Input name="mrp" type="number" defaultValue={product.mrp}/>
</div>

<div>
<Label>Tax %</Label>
<Input name="tax_percent" type="number" defaultValue={product.tax_percent}/>
</div>

</CardContent>
</Card>

{/* METADATA */}

<Card>

<CardHeader>
<CardTitle>Metadata</CardTitle>
</CardHeader>

<CardContent>

<Label>Comma separated metadata</Label>

<Input
name="metadata"
defaultValue={(product.metadata ?? []).join(",")}
/>

</CardContent>
</Card>

{/* FLAGS */}

<Card>

<CardHeader>
<CardTitle>Product Settings</CardTitle>
</CardHeader>

<CardContent className="flex gap-8">

<div className="flex items-center gap-3">

<Checkbox
checked={isFeatured}
onCheckedChange={(v)=>setIsFeatured(Boolean(v))}
/>

<Label>Featured</Label>

</div>

<div className="flex items-center gap-3">

<Checkbox
checked={isActive}
onCheckedChange={(v)=>setIsActive(Boolean(v))}
/>

<Label>Active</Label>

</div>

</CardContent>
</Card>

{/* DESCRIPTION */}

<Card>

<CardHeader>
<CardTitle>Description Sections</CardTitle>
</CardHeader>

<CardContent className="space-y-6">

{description.map((d,i)=>(

<div key={i} className="border rounded-lg p-4 space-y-3 relative">

<div className="flex items-center justify-between">
<Label className="text-sm font-semibold">Section {i+1}</Label>
<Button
type="button"
variant="destructive"
size="sm"
onClick={()=>removeDescription(i)}
>
Delete
</Button>
</div>

<div>
<Label>Title</Label>
<Input
value={d.title}
onChange={(e)=>updateDescription(i,"title",e.target.value)}
/>
</div>

<div>
<Label>Description</Label>
<Textarea
value={d.description}
onChange={(e)=>updateDescription(i,"description",e.target.value)}
/>
</div>

</div>

))}

<Button type="button" onClick={addDescription}>
Add Section
</Button>

</CardContent>
</Card>

{/* IMAGES */}

<Card>

<CardHeader>
<CardTitle>Images</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<input
type="file"
multiple
onChange={(e)=>uploadImages(e.target.files)}
/>

<div className="flex gap-4 flex-wrap">

{preview.map((src,i)=>(

<div key={`${src}-${i}`} className="relative">

<img
src={src}
className="w-24 h-24 object-cover rounded"
/>

<button
type="button"
className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
onClick={()=>removeImage(i)}
>
X
</button>

</div>

))}

</div>

</CardContent>
</Card>

{/* VARIANTS */}

<Card>

<CardHeader>
<CardTitle>Product Options / Variants</CardTitle>
</CardHeader>

<CardContent className="space-y-10">

{options.map((option,i)=>(

<div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

<div className="flex items-start justify-between gap-6">

<div className="grid grid-cols-2 gap-6 flex-1">

<div>
<Label>Option Name</Label>
<Input
value={option.name}
onChange={(e)=>updateOptionName(i,e.target.value)}
/>
</div>

<div>
<Label>Sort Order</Label>
<Input
type="number"
value={option.sort_order}
onChange={(e)=>{
const copy=[...options]
copy[i].sort_order=Number(e.target.value)
setOptions(copy)
}}
/>
</div>

</div>

<Button
type="button"
variant="destructive"
size="sm"
onClick={()=>removeOption(i)}
>
Delete Option
</Button>

</div>

<div className="space-y-6">

{option.values.map((value,vi)=>(

<div key={vi} className="border p-6 rounded-lg grid grid-cols-4 gap-6 relative">

<div className="col-span-4 flex items-center justify-between">
<Label className="text-sm font-semibold">Value {vi+1}</Label>
<Button
type="button"
variant="destructive"
size="sm"
onClick={()=>removeOptionValue(i,vi)}
>
Delete Value
</Button>
</div>

<div>
<Label>Value</Label>
<Input
value={value.value}
onChange={(e)=>updateOptionValue(i,vi,"value",e.target.value)}
/>
</div>

<div>
<Label>Name</Label>
<Input
value={value.name}
onChange={(e)=>updateOptionValue(i,vi,"name",e.target.value)}
/>
</div>

<div>
<Label>SKU</Label>
<Input
value={value.sku}
onChange={(e)=>updateOptionValue(i,vi,"sku",e.target.value)}
/>
</div>

<div>
<Label>Sort Order</Label>
<Input
type="number"
value={value.sort_order}
onChange={(e)=>updateOptionValue(i,vi,"sort_order",Number(e.target.value))}
 />
</div>

<div>
<Label>Addon Price</Label>
<Input
type="number"
value={value.addon_price}
onChange={(e)=>updateOptionValue(i,vi,"addon_price",Number(e.target.value))}
 />
</div>

<div>
<Label>Inventory</Label>
<Input
type="number"
value={value.inventory_quantity}
onChange={(e)=>updateOptionValue(i,vi,"inventory_quantity",Number(e.target.value))}
 />
</div>

<div>
<Label>Reserved</Label>
<Input
type="number"
value={value.reserved_quantity}
onChange={(e)=>updateOptionValue(i,vi,"reserved_quantity",Number(e.target.value))}
 />
</div>

<div>
<Label>Low Stock Threshold</Label>
<Input
type="number"
value={value.low_stock_threshold}
onChange={(e)=>updateOptionValue(i,vi,"low_stock_threshold",Number(e.target.value))}
 />
</div>

<div>
<Label>Tax %</Label>
<Input
type="number"
value={value.tax_percent}
onChange={(e)=>updateOptionValue(i,vi,"tax_percent",Number(e.target.value))}
 />
</div>

<div className="col-span-4 space-y-2">

<Label>Attributes</Label>

{value.attributes.map((attr,ai)=>(

<div key={ai} className="flex gap-2">

<Input
placeholder="Title"
value={attr.key}
onChange={(e)=>{

const copy=[...options]
copy[i].values[vi].attributes[ai].key=e.target.value
setOptions(copy)

}}
/>

<Input
placeholder="Value"
value={attr.value}
onChange={(e)=>{

const copy=[...options]
copy[i].values[vi].attributes[ai].value=e.target.value
setOptions(copy)

}}
/>

</div>

))}

<Button
type="button"
variant="outline"
onClick={()=>addAttribute(i,vi)}
>
Add Attribute
</Button>

</div>

<div className="flex items-center gap-3">

<Checkbox
checked={value.is_active}
onCheckedChange={(v)=>updateOptionValue(i,vi,"is_active",Boolean(v))}
/>

<Label>Active</Label>

</div>

</div>

))}

<Button type="button" variant="outline" onClick={()=>addOptionValue(i)}>
Add Option Value
</Button>

</div>

</div>

))}

<Button type="button" variant="secondary" onClick={addOption}>
Add Product Option
</Button>

</CardContent>
</Card>

<Button size="lg" type="submit">
Update Product
</Button>

</form>

  )
}