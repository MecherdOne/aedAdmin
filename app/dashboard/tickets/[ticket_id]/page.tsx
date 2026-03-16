"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"

function formatPrice(p:number){
return new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(p)
}

export default function TicketPage(){

const {ticket_id} = useParams()

const [data,setData]=useState<any>(null)
const [message,setMessage]=useState("")
const [status,setStatus]=useState("")

useEffect(()=>{

async function load(){

const res = await fetch(`/api/ticketDetails?ticket_id=${ticket_id}`)
const json = await res.json()

setData(json)
setStatus(json.ticket.status)

}

if(ticket_id) load()

},[ticket_id])

if(!data) return <div className="p-10">Loading...</div>

const {ticket,user,order,items,shippingAddress,billingAddress,gst} = data

const comments = ticket.comments || []

/* SEND ADMIN REPLY */

async function sendReply(){

await fetch("/api/ticketDetails",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
ticket_id,
message,
admin_id:"admin"
})
})

setMessage("")
location.reload()

}

/* UPDATE STATUS */

async function updateStatus(){

await fetch("/api/ticketDetails",{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
ticket_id,
status
})
})

alert("Status updated")

}

return(

<div className="max-w-6xl mx-auto py-10 space-y-8">

<h1 className="text-2xl font-bold">
Ticket {ticket.id.slice(0,8)}
</h1>

{/* CUSTOMER */}

<div className="border rounded-xl p-6">

<h2 className="font-bold mb-3">Customer</h2>

<p>{user?.full_name}</p>
<p>{user?.phone}</p>
<p>{user?.email}</p>

</div>

{/* ORDER */}

<div className="border rounded-xl p-6">

<h2 className="font-bold mb-3">
Order {order?.order_number}
</h2>

<p>Total: {formatPrice(order?.total_amount || 0)}</p>

</div>

{/* PRODUCTS */}

<div className="border rounded-xl p-6">

<h2 className="font-bold mb-4">Products</h2>

<div className="space-y-4">

{items.map((item:any)=>(
<div key={item.id} className="border p-4 rounded">

<p className="font-semibold">{item.product_name}</p>

{item.variant_name &&(
<p className="text-sm text-slate-500">
Variant: {item.variant_name}
</p>
)}

<p>Unit: {formatPrice(item.unit_price)}</p>
<p>Qty: {item.quantity}</p>
<p>Total: {formatPrice(item.final_price)}</p>

</div>
))}

</div>

</div>

{/* ADDRESSES */}

<div className="grid md:grid-cols-2 gap-6">

<div className="border rounded-xl p-6">

<h3 className="font-bold mb-3">Shipping Address</h3>

<p>{shippingAddress?.full_name}</p>
<p>Phone: {shippingAddress?.phone}</p>
<p>{shippingAddress?.line1}</p>
<p>{shippingAddress?.city}</p>
<p>{shippingAddress?.pincode}</p>

</div>

<div className="border rounded-xl p-6">

<h3 className="font-bold mb-3">Billing Address</h3>

<p>{billingAddress?.full_name}</p>
<p>Phone: {billingAddress?.phone}</p>
<p>{billingAddress?.line1}</p>
<p>{billingAddress?.city}</p>
<p>{billingAddress?.pincode}</p>

</div>

</div>

{/* GST */}

{gst &&(

<div className="border rounded-xl p-6">

<h3 className="font-bold mb-3">GST</h3>

<p>{gst.gst_name}</p>
<p>{gst.gst_number}</p>

</div>

)}

{/* STATUS */}

<div className="border rounded-xl p-6">

<h3 className="font-bold mb-3">Ticket Status</h3>

<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="border p-2 rounded"
>

<option value="open">Open</option>
<option value="in_progress">In Progress</option>
<option value="resolved">Resolved</option>
<option value="closed">Closed</option>

</select>

<button
onClick={updateStatus}
className="ml-4 bg-black text-white px-4 py-2 rounded"
>
Update
</button>

</div>

{/* CONVERSATION */}

<div className="border rounded-xl p-6">

<h2 className="font-bold mb-4">Conversation</h2>

<div className="space-y-4 mb-6">

{comments.map((c:any,i:number)=>{

const isAdmin = c.user==="admin"

return(

<div key={i} className={`flex ${isAdmin?"justify-end":"justify-start"}`}>

<div className={`px-4 py-3 rounded-lg max-w-sm
${isAdmin?"bg-blue-600 text-white":"bg-slate-200"}
`}>

<p>{c.message}</p>

<p className="text-xs opacity-70 mt-2">
{new Date(c.timestamp).toLocaleString()}
</p>

</div>

</div>

)

})}

</div>

<textarea
value={message}
onChange={(e)=>setMessage(e.target.value)}
rows={4}
placeholder="Reply to customer..."
className="w-full border p-3 rounded"
/>

<button
onClick={sendReply}
className="mt-3 bg-black text-white px-6 py-2 rounded"
>
Send Reply
</button>

</div>

</div>

)

}