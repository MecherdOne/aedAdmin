
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

// interface OptionValue {
//   value: string
//   sort_order: number
//   sku: string
//   name: string
//   attributes: Record<string, unknown>
//   addon_price: number
//   inventory_quantity: number
//   reserved_quantity: number
//   low_stock_threshold: number
//   is_active: boolean
// }

// interface ProductOption {
//   name: string
//   sort_order: number
//   values: OptionValue[]
// }

// /* ---------------- COMPONENT ---------------- */

// export default function AddProducts() {

//   const supabase = createClient()

//   const formRef = useRef<HTMLFormElement>(null)

//   const [categories, setCategories] = useState<Category[]>([])
//   const [images, setImages] = useState<string[]>([])
//   const [preview, setPreview] = useState<string[]>([])

//   const [description, setDescription] = useState<DescriptionBlock[]>([
//     { title: "", description: "" }
//   ])

//   const [options, setOptions] = useState<ProductOption[]>([])

//   const [isFeatured, setIsFeatured] = useState(false)
//   const [isActive, setIsActive] = useState(true)

//   /* ---------------- LOAD CATEGORIES ---------------- */

//   useEffect(() => {

//     async function loadCategories() {

//       const { data } = await supabase
//         .from("categories")
//         .select("id,name")

//       setCategories(data ?? [])
//     }

//     loadCategories()

//   }, [supabase])

//   /* ---------------- IMAGE UPLOAD ---------------- */

//   async function uploadImages(files: FileList | null) {

//     if (!files) return

//     if (files.length > 5) {
//       alert("Maximum 5 images allowed")
//       return
//     }

//     const urls: string[] = []

//     for (const file of Array.from(files)) {

//       const fileName = `${Date.now()}-${file.name}`

//       await supabase.storage
//         .from("product-images")
//         .upload(fileName, file)

//       const { data } = supabase.storage
//         .from("product-images")
//         .getPublicUrl(fileName)

//       urls.push(data.publicUrl)
//     }

//     setImages(urls)
//   }

//   /* ---------------- DESCRIPTION ---------------- */

//   function addDescription() {
//     setDescription([...description, { title: "", description: "" }])
//   }

//   function updateDescription(index: number, field: keyof DescriptionBlock, value: string) {

//     const copy = [...description]
//     copy[index][field] = value
//     setDescription(copy)
//   }

//   /* ---------------- OPTIONS ---------------- */

//   function addOption() {

//     setOptions([
//       ...options,
//       {
//         name: "",
//         sort_order: 0,
//         values: []
//       }
//     ])
//   }

//   function addOptionValue(index: number) {

//     const copy: ProductOption[] = [...options]

//     copy[index].values = [
//       ...copy[index].values,
//       {
//         value: "",
//         sort_order: 0,
//         sku: "",
//         name: "",
//         attributes: {},
//         addon_price: 0,
//         inventory_quantity: 0,
//         reserved_quantity: 0,
//         low_stock_threshold: 5,
//         is_active: true
//       }
//     ]

//     setOptions(copy)
//   }

//   function updateOptionName(index: number, value: string) {

//     const copy: ProductOption[] = [...options]
//     copy[index].name = value
//     setOptions(copy)
//   }

//   function updateOptionValue(
//     optionIndex: number,
//     valueIndex: number,
//     field: keyof OptionValue,
//     value: OptionValue[keyof OptionValue]
//   ) {

//     const copy: ProductOption[] = [...options]

//     const updatedValue: OptionValue = {
//       ...copy[optionIndex].values[valueIndex],
//       [field]: value
//     }

//     copy[optionIndex].values[valueIndex] = updatedValue

//     setOptions(copy)
//   }

//   /* ---------------- SUBMIT ---------------- */

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

//     e.preventDefault()

//     const form = new FormData(e.currentTarget)

//     const metadataValue = form.get("metadata") as string | null

//     const payload = {

//       category_id: form.get("category") as string | null,
//       name: form.get("name") as string,
//       brand: form.get("brand") as string | null,
//       slug: form.get("slug") as string,

//       base_price: Number(form.get("base_price")),
//       mrp: Number(form.get("mrp")),

//       description,
//       images,

//       metadata: metadataValue ? metadataValue.split(",") : [],

//       is_featured: isFeatured,
//       is_active: isActive,

//       options
//     }

//     const res = await fetch("/api/addProduct", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     })

//     const data = await res.json()

//     if (!res.ok) {
//       alert(data.error)
//       return
//     }

//     alert("Product saved successfully")

//     /* -------- RESET FORM -------- */

//     formRef.current?.reset()

//     setImages([])
//     setPreview([])

//     setDescription([
//       { title: "", description: "" }
//     ])

//     setOptions([])

//     setIsFeatured(false)
//     setIsActive(true)
//   }

//   /* ---------------- UI ---------------- */

//   return (

//     <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-5xl">

//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>

//         <CardContent className="grid gap-4">

//           <div>
//             <Label>Name</Label>
//             <Input name="name" required />
//           </div>

//           <div>
//             <Label>Brand</Label>
//             <Input name="brand" />
//           </div>

//           <div>
//             <Label>Slug</Label>
//             <Input name="slug" required />
//           </div>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Category</CardTitle>
//         </CardHeader>

//         <CardContent>

//           <select name="category" className="border rounded p-2 w-full">

//             {categories.map(c => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}

//           </select>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Pricing</CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-2 gap-4">

//           <div>
//             <Label>Base Price</Label>
//             <Input name="base_price" type="number" />
//           </div>

//           <div>
//             <Label>MRP</Label>
//             <Input name="mrp" type="number" />
//           </div>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Metadata</CardTitle>
//         </CardHeader>

//         <CardContent>

//           <Label>Comma separated metadata</Label>
//           <Input name="metadata" placeholder="portable,medical,lightweight" />

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Product Settings</CardTitle>
//         </CardHeader>

//         <CardContent className="flex gap-6">

//           <div className="flex items-center gap-2">

//             <Checkbox
//               checked={isFeatured}
//               onCheckedChange={(v) => setIsFeatured(Boolean(v))}
//             />

//             <Label>Featured</Label>

//           </div>

//           <div className="flex items-center gap-2">

//             <Checkbox
//               checked={isActive}
//               onCheckedChange={(v) => setIsActive(Boolean(v))}
//             />

//             <Label>Active</Label>

//           </div>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Description Sections</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">

//           {description.map((d, i) => (

//             <div key={i} className="border rounded p-4 space-y-2">

//               <Input
//                 placeholder="Title"
//                 value={d.title}
//                 onChange={(e) =>
//                   updateDescription(i, "title", e.target.value)
//                 }
//               />

//               <Textarea
//                 placeholder="Description"
//                 value={d.description}
//                 onChange={(e) =>
//                   updateDescription(i, "description", e.target.value)
//                 }
//               />

//             </div>

//           ))}

//           <Button type="button" onClick={addDescription}>
//             + Add Section
//           </Button>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Images (Max 5)</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">

//           <input
//             type="file"
//             multiple
//             onChange={(e) => {

//               uploadImages(e.target.files)

//               const previews = Array.from(e.target.files ?? []).map(file =>
//                 URL.createObjectURL(file)
//               )

//               setPreview(previews)
//             }}
//           />

//           <div className="flex gap-4">

//             {preview.map(src => (
//               <img
//                 key={src}
//                 src={src}
//                 className="w-20 h-20 rounded object-cover"
//               />
//             ))}

//           </div>

//         </CardContent>
//       </Card>

//       <Card>

//         <CardHeader>
//           <CardTitle>Product Options</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">

//           {options.map((option, i) => (

//             <div key={i} className="border rounded p-4 space-y-4">

//               <Input
//                 placeholder="Option Name (Size / Color)"
//                 value={option.name}
//                 onChange={(e) =>
//                   updateOptionName(i, e.target.value)
//                 }
//               />

//               {option.values.map((value, vi) => (

//                 <div key={vi} className="grid grid-cols-4 gap-3">

//                   <Input
//                     placeholder="Value"
//                     value={value.value}
//                     onChange={(e) =>
//                       updateOptionValue(i, vi, "value", e.target.value)
//                     }
//                   />

//                   <Input
//                     placeholder="SKU"
//                     value={value.sku}
//                     onChange={(e) =>
//                       updateOptionValue(i, vi, "sku", e.target.value)
//                     }
//                   />

//                   <Input
//                     placeholder="Addon Price"
//                     type="number"
//                     value={value.addon_price}
//                     onChange={(e) =>
//                       updateOptionValue(i, vi, "addon_price", Number(e.target.value))
//                     }
//                   />

//                   <Input
//                     placeholder="Stock"
//                     type="number"
//                     value={value.inventory_quantity}
//                     onChange={(e) =>
//                       updateOptionValue(i, vi, "inventory_quantity", Number(e.target.value))
//                     }
//                   />

//                 </div>

//               ))}

//               <Button type="button" onClick={() => addOptionValue(i)}>
//                 + Add Option Value
//               </Button>

//             </div>

//           ))}

//           <Button type="button" onClick={addOption}>
//             + Add Option
//           </Button>

//         </CardContent>

//       </Card>

//       <Button type="submit" size="lg">
//         Save Product
//       </Button>

//     </form>
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

interface OptionValue {
  value: string
  sort_order: number
  sku: string
  name: string
  attributes: Record<string, unknown>
  addon_price: number
  inventory_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  is_active: boolean
}

interface ProductOption {
  name: string
  sort_order: number
  values: OptionValue[]
}

/* ---------------- COMPONENT ---------------- */

export default function AddProducts() {

  const supabase = createClient()
  const formRef = useRef<HTMLFormElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>([])
  const [preview, setPreview] = useState<string[]>([])

  const [description, setDescription] = useState<DescriptionBlock[]>([
    { title: "", description: "" }
  ])

  const [options, setOptions] = useState<ProductOption[]>([])

  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)

  /* ---------------- LOAD CATEGORIES ---------------- */

  useEffect(() => {

    async function loadCategories() {

      const { data } = await supabase
        .from("categories")
        .select("id,name")

      setCategories(data ?? [])
    }

    loadCategories()

  }, [supabase])

  /* ---------------- IMAGE UPLOAD ---------------- */

  async function uploadImages(files: FileList | null) {

    if (!files) return

    if (files.length > 5) {
      alert("Maximum 5 images allowed")
      return
    }

    const urls: string[] = []

    for (const file of Array.from(files)) {

      const name = Date.now() + "-" + file.name

      await supabase.storage
        .from("product-images")
        .upload(name, file)

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(name)

      urls.push(data.publicUrl)
    }

    setImages(urls)
  }

  /* ---------------- DESCRIPTION ---------------- */

  function addDescription() {
    setDescription([...description, { title: "", description: "" }])
  }

  function updateDescription(index: number, field: keyof DescriptionBlock, value: string) {

    const copy = [...description]
    copy[index][field] = value
    setDescription(copy)
  }

  /* ---------------- OPTIONS ---------------- */

  function addOption() {

    setOptions([
      ...options,
      { name: "", sort_order: 0, values: [] }
    ])
  }

  function addOptionValue(index: number) {

    const copy = [...options]

    copy[index].values.push({
      value: "",
      sort_order: 0,
      sku: "",
      name: "",
      attributes: {},
      addon_price: 0,
      inventory_quantity: 0,
      reserved_quantity: 0,
      low_stock_threshold: 5,
      is_active: true
    })

    setOptions(copy)
  }

  function updateOptionName(index: number, value: string) {

    const copy = [...options]
    copy[index].name = value
    setOptions(copy)
  }

  function updateOptionValue(
    optionIndex: number,
    valueIndex: number,
    field: keyof OptionValue,
    value: OptionValue[keyof OptionValue]
  ) {

    const copy = [...options]

    const updatedValue = {
      ...copy[optionIndex].values[valueIndex],
      [field]: value
    }

    copy[optionIndex].values[valueIndex] = updatedValue

    setOptions(copy)
  }

  /* ---------------- SUBMIT ---------------- */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    const form = new FormData(e.currentTarget)

    const metadataValue = form.get("metadata") as string | null

    const payload = {

      category_id: form.get("category") as string | null,
      name: form.get("name") as string,
      brand: form.get("brand") as string | null,
      slug: form.get("slug") as string,

      base_price: Number(form.get("base_price")),
      mrp: Number(form.get("mrp")),

      description,
      images,

      metadata: metadataValue ? metadataValue.split(",") : [],

      is_featured: isFeatured,
      is_active: isActive,

      options
    }

    const res = await fetch("/api/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
    }

    alert("Product saved successfully")

    /* RESET FORM */

    formRef.current?.reset()

    setImages([])
    setPreview([])
    setOptions([])
    setDescription([{ title: "", description: "" }])
    setIsFeatured(false)
    setIsActive(true)
  }

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
<Input name="name" required />
</div>

<div>
<Label>Brand</Label>
<Input name="brand" />
</div>

<div>
<Label>Slug</Label>
<Input name="slug" required />
</div>

</CardContent>
</Card>

{/* CATEGORY */}

<Card>

<CardHeader>
<CardTitle>Category</CardTitle>
</CardHeader>

<CardContent>

<select name="category" className="border rounded p-2 w-full">

{categories.map(c => (
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

<CardContent className="grid grid-cols-2 gap-6">

<div>
<Label>Base Price</Label>
<Input name="base_price" type="number" />
</div>

<div>
<Label>MRP</Label>
<Input name="mrp" type="number" />
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
<Input name="metadata" />

</CardContent>
</Card>

{/* FLAGS */}

<Card>

<CardHeader>
<CardTitle>Product Settings</CardTitle>
</CardHeader>

<CardContent className="flex gap-8">

<div className="flex items-center gap-3">
<Checkbox checked={isFeatured} onCheckedChange={(v)=>setIsFeatured(Boolean(v))}/>
<Label>Featured</Label>
</div>

<div className="flex items-center gap-3">
<Checkbox checked={isActive} onCheckedChange={(v)=>setIsActive(Boolean(v))}/>
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
<div key={i} className="border rounded-lg p-4 space-y-3">

<div>
<Label>Title</Label>
<Input value={d.title} onChange={(e)=>updateDescription(i,"title",e.target.value)} />
</div>

<div>
<Label>Description</Label>
<Textarea value={d.description} onChange={(e)=>updateDescription(i,"description",e.target.value)} />
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
<CardTitle>Images (max 5)</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<input type="file" multiple
onChange={(e)=>{

uploadImages(e.target.files)

const p=[...Array.from(e.target.files ?? [])].map(f=>URL.createObjectURL(f))
setPreview(p)

}}
/>

<div className="flex gap-4">

{preview.map(src=>(
<img key={src} src={src} className="w-24 h-24 object-cover rounded"/>
))}

</div>

</CardContent>
</Card>

{/* PRODUCT OPTIONS */}

<Card>

<CardHeader>
<CardTitle>Product Options / Variants</CardTitle>
</CardHeader>

<CardContent className="space-y-10">

{options.map((option,i)=>(
<div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

<div className="grid grid-cols-2 gap-6">

<div>
<Label>Option Name</Label>
<Input value={option.name} onChange={(e)=>updateOptionName(i,e.target.value)} />
</div>

<div>
<Label>Sort Order</Label>
<Input type="number" value={option.sort_order}
onChange={(e)=>{
const copy=[...options]
copy[i].sort_order=Number(e.target.value)
setOptions(copy)
}}/>
</div>

</div>

<div className="space-y-6">

{option.values.map((value,vi)=>(
<div key={vi} className="border p-6 rounded-lg grid grid-cols-4 gap-6">

<div>
<Label>Value</Label>
<Input value={value.value}
onChange={(e)=>updateOptionValue(i,vi,"value",e.target.value)}/>
</div>

<div>
<Label>Name</Label>
<Input value={value.name}
onChange={(e)=>updateOptionValue(i,vi,"name",e.target.value)}/>
</div>

<div>
<Label>SKU</Label>
<Input value={value.sku}
onChange={(e)=>updateOptionValue(i,vi,"sku",e.target.value)}/>
</div>

<div>
<Label>Sort Order</Label>
<Input type="number" value={value.sort_order}
onChange={(e)=>updateOptionValue(i,vi,"sort_order",Number(e.target.value))}/>
</div>

<div>
<Label>Addon Price</Label>
<Input type="number" value={value.addon_price}
onChange={(e)=>updateOptionValue(i,vi,"addon_price",Number(e.target.value))}/>
</div>

<div>
<Label>Inventory</Label>
<Input type="number" value={value.inventory_quantity}
onChange={(e)=>updateOptionValue(i,vi,"inventory_quantity",Number(e.target.value))}/>
</div>

<div>
<Label>Reserved</Label>
<Input type="number" value={value.reserved_quantity}
onChange={(e)=>updateOptionValue(i,vi,"reserved_quantity",Number(e.target.value))}/>
</div>

<div>
<Label>Low Stock Threshold</Label>
<Input type="number" value={value.low_stock_threshold}
onChange={(e)=>updateOptionValue(i,vi,"low_stock_threshold",Number(e.target.value))}/>
</div>

<div>
<Label>Attributes (JSON)</Label>
<Input placeholder='{"weight":"200g"}'
onChange={(e)=>{
try{
updateOptionValue(i,vi,"attributes",JSON.parse(e.target.value))
}catch{}
}}/>
</div>

<div className="flex items-center gap-3">
<Checkbox checked={value.is_active}
onCheckedChange={(v)=>updateOptionValue(i,vi,"is_active",Boolean(v))}/>
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
Save Product
</Button>

</form>
  )
}