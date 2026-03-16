// "use client"

// import { useEffect,useState } from "react"

// export default function TicketsPage(){

// const [tickets,setTickets] = useState<any[]>([])

// useEffect(()=>{

// async function load(){

// const res = await fetch("/api/tickets")

// const data = await res.json()

// setTickets(data.tickets || [])

// }

// load()

// },[])

// async function updateStatus(ticketId:string,status:string){

// await fetch("/api/tickets",{
// method:"PATCH",
// headers:{
// "Content-Type":"application/json"
// },
// body:JSON.stringify({
// ticket_id:ticketId,
// status
// })
// })

// setTickets(tickets.map(t =>
// t.id === ticketId ? {...t,status} : t
// ))

// }

// return(

// <div className="max-w-6xl mx-auto py-10">

// <h1 className="text-2xl font-bold mb-8">
// Support Tickets
// </h1>

// <div className="space-y-4">

// {tickets.map(ticket =>(

// <div key={ticket.id} className="border rounded-xl p-6">

// <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

// <div>
// <p className="text-xs text-slate-500">Ticket</p>
// <p className="font-semibold">{ticket.id.slice(0,8)}</p>
// </div>

// <div>
// <p className="text-xs text-slate-500">User</p>
// <p>{ticket.users?.full_name}</p>
// </div>

// <div>
// <p className="text-xs text-slate-500">Phone</p>
// <p>{ticket.users?.phone}</p>
// </div>

// <div>
// <p className="text-xs text-slate-500">Order</p>
// <p>{ticket.orders?.order_number}</p>
// </div>

// <div>
// <p className="text-xs text-slate-500">Type</p>
// <p className="capitalize">{ticket.ticket_type}</p>
// </div>

// <div>

// <p className="text-xs text-slate-500">Status</p>

// <select
// value={ticket.status}
// onChange={(e)=>updateStatus(ticket.id,e.target.value)}
// className="border rounded px-2 py-1"
// >

// <option value="open">Open</option>
// <option value="in_progress">In Progress</option>
// <option value="resolved">Resolved</option>
// <option value="closed">Closed</option>

// </select>

// </div>

// </div>

// </div>

// ))}

// </div>

// </div>

// )

// }

"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"

export default function TicketsPage(){

const [tickets,setTickets] = useState<any[]>([])
const router = useRouter()

useEffect(()=>{

async function load(){

const res = await fetch("/api/tickets")
const data = await res.json()

setTickets(data.tickets || [])

}

load()

},[])

async function updateStatus(ticketId:string,status:string){

await fetch("/api/tickets",{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
ticket_id:ticketId,
status
})
})

setTickets(tickets.map(t =>
t.id === ticketId ? {...t,status} : t
))

}

return(

<div className="max-w-6xl mx-auto py-10">

<h1 className="text-2xl font-bold mb-8">
Support Tickets
</h1>

<div className="space-y-4">

{tickets.map(ticket =>(

<div
key={ticket.id}
onClick={()=>router.push(`/dashboard/tickets/${ticket.id}`)}
className="border rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition"
>

<div className="grid grid-cols-2 md:grid-cols-6 gap-4">

<div>
<p className="text-xs text-slate-500">Ticket</p>
<p className="font-semibold">{ticket.id.slice(0,8)}</p>
</div>

<div>
<p className="text-xs text-slate-500">User</p>
<p>{ticket.users?.full_name}</p>
</div>

<div>
<p className="text-xs text-slate-500">Phone</p>
<p>{ticket.users?.phone}</p>
</div>

<div>
<p className="text-xs text-slate-500">Order</p>
<p>{ticket.orders?.order_number}</p>
</div>

<div>
<p className="text-xs text-slate-500">Type</p>
<p className="capitalize">{ticket.ticket_type}</p>
</div>

<div>

<p className="text-xs text-slate-500">Status</p>

<select
value={ticket.status}
onClick={(e)=>e.stopPropagation()}
onChange={(e)=>updateStatus(ticket.id,e.target.value)}
className="border rounded px-2 py-1"
>

<option value="open">Open</option>
<option value="in_progress">In Progress</option>
<option value="resolved">Resolved</option>
<option value="closed">Closed</option>

</select>

</div>

</div>

</div>

))}

</div>

</div>

)

}