"use client"

import { useEffect, useState } from "react"
import * as XLSX from "xlsx"

export default function PerformanceLeads() {

const [leads,setLeads] = useState<any[]>([])
const [from,setFrom] = useState("")
const [to,setTo] = useState("")

/* =========================
FETCH DATA
========================= */

async function load(){

const params = new URLSearchParams()

if(from) params.append("from",from)
if(to) params.append("to",to)

const res = await fetch(`/api/performance-leads?${params.toString()}`)

const data = await res.json()

setLeads(data ?? [])

}

useEffect(()=>{
load()
},[])

/* =========================
EXPORT EXCEL
========================= */

function exportExcel(){

const rows = leads.map((l:any)=>{

const product =
l.products ||
l.product_option_values?.product_options?.products

return {

type:l.type,

user:l.users?.full_name || "",
email:l.users?.email || "",
phone:l.users?.phone || "",

addresses:
l.users?.addresses
?.map((a:any)=>
`${a.line1 || ""}, ${a.city || ""}, ${a.state || ""}, ${a.pincode || ""}`
)
.join(" | ") || "",

product:product?.name || "",

variant:l.product_option_values?.value || "",

sku:l.product_option_values?.sku || "",

price:l.product_option_values?.addon_price || "",

time:l.created_at

}

})

const worksheet = XLSX.utils.json_to_sheet(rows)

const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook,worksheet,"Performance Leads")

XLSX.writeFile(workbook,"performance_leads.xlsx")

}

/* =========================
UI
========================= */

return(

<div className="p-10 space-y-6">

<h1 className="text-3xl font-bold">
Performance Leads
</h1>


{/* FILTER */}

<div className="flex gap-4 items-center">

<input
type="date"
value={from}
onChange={(e)=>setFrom(e.target.value)}
className="border px-3 py-2 rounded"
/>

<input
type="date"
value={to}
onChange={(e)=>setTo(e.target.value)}
className="border px-3 py-2 rounded"
/>

<button
onClick={load}
className="bg-black text-white px-4 py-2 rounded"
>
Filter
</button>

<button
onClick={exportExcel}
className="bg-green-600 text-white px-4 py-2 rounded"
>
Export Excel
</button>

</div>


{/* TABLE */}

<div className="border rounded-lg overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-100">

<tr>

<th className="p-3 text-left">Type</th>
<th className="p-3 text-left">User</th>
<th className="p-3 text-left">Email</th>
<th className="p-3 text-left">Phone</th>
<th className="p-3 text-left">Addresses</th>
<th className="p-3 text-left">Product</th>
<th className="p-3 text-left">Variant</th>
<th className="p-3 text-left">SKU</th>
<th className="p-3 text-left">Price</th>
<th className="p-3 text-left">Added At</th>

</tr>

</thead>

<tbody>

{leads.map((l:any)=>{

const product =
l.products ||
l.product_option_values?.product_options?.products

return(

<tr key={l.id} className="border-t hover:bg-gray-50">

<td className="p-3 font-medium">
{l.type}
</td>

<td className="p-3">
{l.users?.full_name}
</td>

<td className="p-3">
{l.users?.email}
</td>

<td className="p-3">
{l.users?.phone}
</td>

<td className="p-3">

{l.users?.addresses?.length ? (

<div className="space-y-2">

{l.users.addresses.map((a:any)=>(
<div
key={a.id}
className="text-xs border rounded p-2 bg-gray-50"
>

<p className="font-medium">
{a.label || "Address"}
</p>

<p>{a.line1}</p>

{a.line2 && <p>{a.line2}</p>}

<p>
{a.city}, {a.state}
</p>

<p>{a.pincode}</p>

</div>
))}

</div>

) : (

<span className="text-gray-400">
No Address
</span>

)}

</td>

<td className="p-3">
{product?.name}
</td>

<td className="p-3">
{l.product_option_values?.value}
</td>

<td className="p-3">
{l.product_option_values?.sku}
</td>

<td className="p-3">
{l.product_option_values?.addon_price}
</td>

<td className="p-3">
{new Date(l.created_at).toLocaleString()}
</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

)

}