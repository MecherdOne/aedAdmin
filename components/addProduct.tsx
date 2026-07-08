

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
//   attributes: Record<string, string>
//   addon_price: number
//   inventory_quantity: number
//   reserved_quantity: number
//   low_stock_threshold: number
//   tax_percent: number
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

//   const [taxPercent, setTaxPercent] = useState(0)

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
//     const previews: string[] = []

//     for (const file of Array.from(files)) {

//       if (file.size > 5 * 1024 * 1024) {
//         alert(`${file.name} exceeds 5MB`)
//         return
//       }

//       const name = Date.now() + "-" + file.name

//       await supabase.storage
//         .from("product-images")
//         .upload(name, file)

//       const { data } = supabase.storage
//         .from("product-images")
//         .getPublicUrl(name)

//       urls.push(data.publicUrl)
//       previews.push(URL.createObjectURL(file))
//     }

//     setImages(urls)
//     setPreview(previews)
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
//       { name: "", sort_order: 0, values: [] }
//     ])
//   }

//   function addOptionValue(index: number) {

//     const copy = [...options]

//     copy[index].values.push({
//       value: "",
//       sort_order: 0,
//       sku: "",
//       name: "",
//       attributes: {},
//       addon_price: 0,
//       inventory_quantity: 0,
//       reserved_quantity: 0,
//       low_stock_threshold: 5,
//       tax_percent: 0,
//       is_active: true
//     })

//     setOptions(copy)
//   }

//   function updateOptionName(index: number, value: string) {

//     const copy = [...options]
//     copy[index].name = value
//     setOptions(copy)
//   }

//   function updateOptionValue(
//     optionIndex: number,
//     valueIndex: number,
//     field: keyof OptionValue,
//     value: any
//   ) {

//     const copy = [...options]

//     const updatedValue = {
//       ...copy[optionIndex].values[valueIndex],
//       [field]: value
//     }

//     copy[optionIndex].values[valueIndex] = updatedValue

//     setOptions(copy)
//   }

//   /* ---------------- ATTRIBUTES ---------------- */

//   function addAttribute(optionIndex: number, valueIndex: number) {

//     const copy = [...options]

//     copy[optionIndex].values[valueIndex].attributes[""] = ""

//     setOptions(copy)
//   }

//   function updateAttribute(optionIndex: number, valueIndex: number, key: string, value: string) {

//     const copy = [...options]

//     copy[optionIndex].values[valueIndex].attributes[key] = value

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
//       tax_percent: taxPercent,

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
//   }

//   /* ---------------- UI ---------------- */

//   return (

//     <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 max-w-7xl">

//       {/* BASIC INFO */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-3 gap-6">

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

//       {/* CATEGORY */}

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

//       {/* IMAGES */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Product Images</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">

//           <Input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => uploadImages(e.target.files)}
//           />

//           <div className="grid grid-cols-5 gap-4">
//             {preview.map((src, i) => (
//               <img
//                 key={i}
//                 src={src}
//                 className="w-full h-24 object-cover rounded"
//               />
//             ))}
//           </div>

//         </CardContent>
//       </Card>

//       {/* PRICING */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Pricing</CardTitle>
//         </CardHeader>

//         <CardContent className="grid grid-cols-3 gap-6">

//           <div>
//             <Label>Base Price</Label>
//             <Input name="base_price" type="number" />
//           </div>

//           <div>
//             <Label>MRP</Label>
//             <Input name="mrp" type="number" />
//           </div>

//           <div>
//             <Label>Tax %</Label>
//             <Input type="number" value={taxPercent}
//               onChange={(e) => setTaxPercent(Number(e.target.value))} />
//           </div>

//         </CardContent>
//       </Card>

//       {/* METADATA */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Metadata</CardTitle>
//         </CardHeader>

//         <CardContent>

//           <Label>Comma separated metadata</Label>
//           <Input name="metadata" />

//         </CardContent>
//       </Card>

//       {/* FLAGS */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Product Settings</CardTitle>
//         </CardHeader>

//         <CardContent className="flex gap-8">

//           <div className="flex items-center gap-3">
//             <Checkbox checked={isFeatured} onCheckedChange={(v) => setIsFeatured(Boolean(v))} />
//             <Label>Featured</Label>
//           </div>

//           <div className="flex items-center gap-3">
//             <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
//             <Label>Active</Label>
//           </div>

//         </CardContent>
//       </Card>

//       {/* DESCRIPTION */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Description Sections</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-6">

//           {description.map((d, i) => (
//             <div key={i} className="border rounded-lg p-4 space-y-3">

//               <div>
//                 <Label>Title</Label>
//                 <Input value={d.title} onChange={(e) => updateDescription(i, "title", e.target.value)} />
//               </div>

//               <div>
//                 <Label>Description</Label>
//                 <Textarea value={d.description} onChange={(e) => updateDescription(i, "description", e.target.value)} />
//               </div>

//             </div>
//           ))}

//           <Button type="button" onClick={addDescription}>
//             Add Section
//           </Button>

//         </CardContent>
//       </Card>

//       {/* VARIANTS */}

//       <Card>

//         <CardHeader>
//           <CardTitle>Product Options / Variants</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-10">

//           {options.map((option, i) => (

//             <div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

//               <div className="grid grid-cols-2 gap-6">

//                 <div>
//                   <Label>Option Name</Label>
//                   <Input value={option.name} onChange={(e) => updateOptionName(i, e.target.value)} />
//                 </div>

//                 <div>
//                   <Label>Sort Order</Label>
//                   <Input type="number" value={option.sort_order}
//                     onChange={(e) => {
//                       const copy = [...options]
//                       copy[i].sort_order = Number(e.target.value)
//                       setOptions(copy)
//                     }} />
//                 </div>

//               </div>

//               <div className="space-y-6">

//                 {option.values.map((value, vi) => (

//                   <div key={vi} className="border p-6 rounded-lg grid grid-cols-3 gap-6">

//                     <div>
//                       <Label>Value</Label>
//                       <Input value={value.value}
//                         onChange={(e) => updateOptionValue(i, vi, "value", e.target.value)} />
//                     </div>

//                     <div>
//                       <Label>SKU</Label>
//                       <Input value={value.sku}
//                         onChange={(e) => updateOptionValue(i, vi, "sku", e.target.value)} />
//                     </div>

//                     <div>
//                       <Label>Tax %</Label>
//                       <Input type="number"
//                         value={value.tax_percent}
//                         onChange={(e) => updateOptionValue(i, vi, "tax_percent", Number(e.target.value))} />
//                     </div>

//                     <div>
//                       <Label>Addon Price</Label>
//                       <Input type="number" value={value.addon_price}
//                         onChange={(e) => updateOptionValue(i, vi, "addon_price", Number(e.target.value))} />
//                     </div>

//                     <div>
//                       <Label>Inventory</Label>
//                       <Input type="number" value={value.inventory_quantity}
//                         onChange={(e) => updateOptionValue(i, vi, "inventory_quantity", Number(e.target.value))} />
//                     </div>

//                     <div>
//                       <Label>Reserved</Label>
//                       <Input type="number" value={value.reserved_quantity}
//                         onChange={(e) => updateOptionValue(i, vi, "reserved_quantity", Number(e.target.value))} />
//                     </div>

//                     <div>
//                       <Label>Low Stock</Label>
//                       <Input type="number" value={value.low_stock_threshold}
//                         onChange={(e) => updateOptionValue(i, vi, "low_stock_threshold", Number(e.target.value))} />
//                     </div>

//                     <div className="col-span-3 space-y-2">

//                       <Label>Attributes</Label>

//                       {Object.entries(value.attributes).map(([k, v], ai) => (
//                         <div key={ai} className="flex gap-2">

//                           <Input
//                             placeholder="Key"
//                             value={k}
//                             onChange={(e) => {

//                               const copy = { ...value.attributes }
//                               delete copy[k]
//                               copy[e.target.value] = v

//                               updateOptionValue(i, vi, "attributes", copy)

//                             }}
//                           />

//                           <Input
//                             placeholder="Value"
//                             value={String(v)}
//                             onChange={(e) => updateAttribute(i, vi, k, e.target.value)}
//                           />

//                         </div>
//                       ))}

//                       <Button type="button" size="sm"
//                         onClick={() => addAttribute(i, vi)}>
//                         Add Attribute
//                       </Button>

//                     </div>

//                   </div>

//                 ))}

//                 <Button type="button" variant="outline" onClick={() => addOptionValue(i)}>
//                   Add Option Value
//                 </Button>

//               </div>

//             </div>

//           ))}

//           <Button type="button" variant="secondary" onClick={addOption}>
//             Add Product Option
//           </Button>

//         </CardContent>

//       </Card>

//       <Button size="lg" type="submit">
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
  attributes: Record<string, string>
  addon_price: number
  inventory_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  tax_percent: number
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

  const [taxPercent, setTaxPercent] = useState(0)

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
    const previews: string[] = []

    for (const file of Array.from(files)) {

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB`)
        return
      }

      const name = Date.now() + "-" + file.name

      await supabase.storage
        .from("product-images")
        .upload(name, file)

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(name)

      urls.push(data.publicUrl)
      previews.push(URL.createObjectURL(file))
    }

    setImages(urls)
    setPreview(previews)
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

  function removeDescription(index: number) {

    const copy = [...description]
    copy.splice(index, 1)
    setDescription(copy)
  }

  /* ---------------- OPTIONS ---------------- */

  function addOption() {

    setOptions([
      ...options,
      { name: "", sort_order: 0, values: [] }
    ])
  }

  function removeOption(index: number) {

    const copy = [...options]
    copy.splice(index, 1)
    setOptions(copy)
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
      tax_percent: 0,
      is_active: true
    })

    setOptions(copy)
  }

  function removeOptionValue(optionIndex: number, valueIndex: number) {

    const copy = [...options]
    copy[optionIndex].values.splice(valueIndex, 1)
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
    value: any
  ) {

    const copy = [...options]

    const updatedValue = {
      ...copy[optionIndex].values[valueIndex],
      [field]: value
    }

    copy[optionIndex].values[valueIndex] = updatedValue

    setOptions(copy)
  }

  /* ---------------- ATTRIBUTES ---------------- */

  function addAttribute(optionIndex: number, valueIndex: number) {

    const copy = [...options]

    copy[optionIndex].values[valueIndex].attributes[""] = ""

    setOptions(copy)
  }

  function updateAttribute(optionIndex: number, valueIndex: number, key: string, value: string) {

    const copy = [...options]

    copy[optionIndex].values[valueIndex].attributes[key] = value

    setOptions(copy)
  }

  function removeAttribute(optionIndex: number, valueIndex: number, key: string) {

    const copy = [...options]

    const attrs = { ...copy[optionIndex].values[valueIndex].attributes }
    delete attrs[key]
    copy[optionIndex].values[valueIndex].attributes = attrs

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
      tax_percent: taxPercent,

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

      {/* IMAGES */}

      <Card>

        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => uploadImages(e.target.files)}
          />

          <div className="grid grid-cols-5 gap-4">
            {preview.map((src, i) => (
              <img
                key={i}
                src={src}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>

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
            <Input name="base_price" type="number" />
          </div>

          <div>
            <Label>MRP</Label>
            <Input name="mrp" type="number" />
          </div>

          <div>
            <Label>Tax %</Label>
            <Input type="number" value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))} />
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
            <Checkbox checked={isFeatured} onCheckedChange={(v) => setIsFeatured(Boolean(v))} />
            <Label>Featured</Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(Boolean(v))} />
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

          {description.map((d, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">

              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Section {i + 1}</Label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeDescription(i)}
                >
                  Delete
                </Button>
              </div>

              <div>
                <Label>Title</Label>
                <Input value={d.title} onChange={(e) => updateDescription(i, "title", e.target.value)} />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={d.description} onChange={(e) => updateDescription(i, "description", e.target.value)} />
              </div>

            </div>
          ))}

          <Button type="button" onClick={addDescription}>
            Add Section
          </Button>

        </CardContent>
      </Card>

      {/* VARIANTS */}

      <Card>

        <CardHeader>
          <CardTitle>Product Options / Variants</CardTitle>
        </CardHeader>

        <CardContent className="space-y-10">

          {options.map((option, i) => (

            <div key={i} className="border rounded-xl p-6 space-y-6 bg-muted/20">

              <div className="flex items-start justify-between gap-6">

                <div className="grid grid-cols-2 gap-6 flex-1">

                  <div>
                    <Label>Option Name</Label>
                    <Input value={option.name} onChange={(e) => updateOptionName(i, e.target.value)} />
                  </div>

                  <div>
                    <Label>Sort Order</Label>
                    <Input type="number" value={option.sort_order}
                      onChange={(e) => {
                        const copy = [...options]
                        copy[i].sort_order = Number(e.target.value)
                        setOptions(copy)
                      }} />
                  </div>

                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeOption(i)}
                >
                  Delete Option
                </Button>

              </div>

              <div className="space-y-6">

                {option.values.map((value, vi) => (

                  <div key={vi} className="border p-6 rounded-lg grid grid-cols-3 gap-6 relative">

                    <div className="col-span-3 flex items-center justify-between">
                      <Label className="text-sm font-semibold">Value {vi + 1}</Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeOptionValue(i, vi)}
                      >
                        Delete Value
                      </Button>
                    </div>

                    <div>
                      <Label>Value</Label>
                      <Input value={value.value}
                        onChange={(e) => updateOptionValue(i, vi, "value", e.target.value)} />
                    </div>

                    <div>
                      <Label>SKU</Label>
                      <Input value={value.sku}
                        onChange={(e) => updateOptionValue(i, vi, "sku", e.target.value)} />
                    </div>

                    <div>
                      <Label>Tax %</Label>
                      <Input type="number"
                        value={value.tax_percent}
                        onChange={(e) => updateOptionValue(i, vi, "tax_percent", Number(e.target.value))} />
                    </div>

                    <div>
                      <Label>Addon Price</Label>
                      <Input type="number" value={value.addon_price}
                        onChange={(e) => updateOptionValue(i, vi, "addon_price", Number(e.target.value))} />
                    </div>

                    <div>
                      <Label>Inventory</Label>
                      <Input type="number" value={value.inventory_quantity}
                        onChange={(e) => updateOptionValue(i, vi, "inventory_quantity", Number(e.target.value))} />
                    </div>

                    <div>
                      <Label>Reserved</Label>
                      <Input type="number" value={value.reserved_quantity}
                        onChange={(e) => updateOptionValue(i, vi, "reserved_quantity", Number(e.target.value))} />
                    </div>

                    <div>
                      <Label>Low Stock</Label>
                      <Input type="number" value={value.low_stock_threshold}
                        onChange={(e) => updateOptionValue(i, vi, "low_stock_threshold", Number(e.target.value))} />
                    </div>

                    <div className="col-span-3 space-y-2">

                      <Label>Attributes</Label>

                      {Object.entries(value.attributes).map(([k, v], ai) => (
                        <div key={ai} className="flex gap-2">

                          <Input
                            placeholder="Key"
                            value={k}
                            onChange={(e) => {

                              const copy = { ...value.attributes }
                              delete copy[k]
                              copy[e.target.value] = v

                              updateOptionValue(i, vi, "attributes", copy)

                            }}
                          />

                          <Input
                            placeholder="Value"
                            value={String(v)}
                            onChange={(e) => updateAttribute(i, vi, k, e.target.value)}
                          />

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeAttribute(i, vi, k)}
                          >
                            Delete
                          </Button>

                        </div>
                      ))}

                      <Button type="button" size="sm"
                        onClick={() => addAttribute(i, vi)}>
                        Add Attribute
                      </Button>

                    </div>

                  </div>

                ))}

                <Button type="button" variant="outline" onClick={() => addOptionValue(i)}>
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