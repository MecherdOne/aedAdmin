// import { createClient } from "@/utils/supabase/server"
// import { NextResponse } from "next/server"

// /* ========================= */
// /* GET TICKET DETAILS        */
// /* ========================= */

// export async function GET(req:Request){

// const {searchParams} = new URL(req.url)

// const ticket_id = searchParams.get("ticket_id")

// if(!ticket_id){
// return NextResponse.json({error:"ticket_id required"},{status:400})
// }

// const supabase = await createClient()

// /* FETCH TICKET */

// const {data:ticket,error} = await supabase
// .from("support_tickets")
// .select("*")
// .eq("id",ticket_id)
// .single()

// if(error || !ticket){
// return NextResponse.json({error:"Ticket not found"},{status:404})
// }

// /* FETCH USER + ORDER */

// const [
// userRes,
// orderRes
// ] = await Promise.all([

// supabase
// .from("users")
// .select("id,full_name,email,phone")
// .eq("id",ticket.user_id)
// .single(),

// ticket.order_id
// ? supabase
// .from("orders")
// .select(`
// id,
// order_number,
// total_amount,
// shipping_address_id,
// billing_address_id,
// gst_id
// `)
// .eq("id",ticket.order_id)
// .single()
// : Promise.resolve({data:null})

// ])

// const user = userRes.data
// const order = orderRes.data

// let items:any[]=[]
// let shippingAddress=null
// let billingAddress=null
// let gst=null

// if(order){

// const [
// itemsRes,
// shipRes,
// billRes,
// gstRes
// ] = await Promise.all([

// supabase
// .from("order_items")
// .select(`
// id,
// product_name,
// variant_name,
// unit_price,
// quantity,
// final_price
// `)
// .eq("order_id",order.id),

// order.shipping_address_id
// ? supabase
// .from("addresses")
// .select("*")
// .eq("id",order.shipping_address_id)
// .single()
// : Promise.resolve({data:null}),

// order.billing_address_id
// ? supabase
// .from("addresses")
// .select("*")
// .eq("id",order.billing_address_id)
// .single()
// : Promise.resolve({data:null}),

// order.gst_id
// ? supabase
// .from("user_gst_details")
// .select("*")
// .eq("id",order.gst_id)
// .single()
// : Promise.resolve({data:null})

// ])

// items = itemsRes.data || []
// shippingAddress = shipRes.data
// billingAddress = billRes.data
// gst = gstRes.data

// }

// return NextResponse.json({
// ticket,
// user,
// order,
// items,
// shippingAddress,
// billingAddress,
// gst
// })

// }



// /* ========================= */
// /* ADMIN REPLY               */
// /* ========================= */

// export async function POST(req:Request){

// const supabase = await createClient()

// const body = await req.json()

// const {ticket_id,message,admin_id="admin"} = body

// if(!ticket_id || !message){
// return NextResponse.json({error:"Missing fields"})
// }

// const {data:ticket} = await supabase
// .from("support_tickets")
// .select("comments")
// .eq("id",ticket_id)
// .single()

// const comments = ticket?.comments || []

// const newComment = {
// user:admin_id,
// message,
// timestamp:new Date().toISOString()
// }

// const updated = [...comments,newComment]

// const {error} = await supabase
// .from("support_tickets")
// .update({
// comments:updated
// })
// .eq("id",ticket_id)

// if(error){
// return NextResponse.json({error:error.message})
// }

// return NextResponse.json({success:true})

// }



// /* ========================= */
// /* UPDATE STATUS             */
// /* ========================= */

// export async function PATCH(req:Request){

// const supabase = await createClient()

// const body = await req.json()

// const {ticket_id,status} = body

// if(!ticket_id || !status){
// return NextResponse.json({error:"Missing fields"})
// }

// const {error} = await supabase
// .from("support_tickets")
// .update({status})
// .eq("id",ticket_id)

// if(error){
// return NextResponse.json({error:error.message})
// }

// return NextResponse.json({success:true})

// }

import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

/* ========================= */
/* GET TICKET DETAILS        */
/* ========================= */

export async function GET(req:Request){

const {searchParams} = new URL(req.url)
const ticket_id = searchParams.get("ticket_id")

if(!ticket_id){
return NextResponse.json({error:"ticket_id required"},{status:400})
}

const supabase = await createClient()

/* FETCH TICKET */

const {data:ticket,error} = await supabase
.from("support_tickets")
.select("*")
.eq("id",ticket_id)
.single()

if(error || !ticket){
return NextResponse.json({error:"Ticket not found"},{status:404})
}

/* FETCH USER + ORDER */

const [userRes,orderRes] = await Promise.all([

supabase
.from("users")
.select("id,full_name,email,phone")
.eq("id",ticket.user_id)
.single(),

ticket.order_id
? supabase
.from("orders")
.select(`
id,
order_number,
total_amount,
shipping_address_id,
billing_address_id,
gst_id
`)
.eq("id",ticket.order_id)
.single()
: Promise.resolve({data:null})

])

const user = userRes.data
const order = orderRes.data

let items:any[]=[]
let shippingAddress=null
let billingAddress=null
let gst=null

/* ========================= */
/* ORDER RELATED DATA        */
/* ========================= */

if(order){

const [itemsRes,shipRes,billRes,gstRes] = await Promise.all([

/* ORDER ITEMS */

supabase
.from("order_items")
.select(`
id,
product_name,
variant_name,
unit_price,
quantity,
final_price
`)
.eq("order_id",order.id),

/* SHIPPING ADDRESS */

order.shipping_address_id
? supabase
.from("addresses")
.select(`
id,
full_name,
phone,
line1,
line2,
city,
state,
pincode
`)
.eq("id",order.shipping_address_id)
.single()
: Promise.resolve({data:null}),

/* BILLING ADDRESS */

order.billing_address_id
? supabase
.from("addresses")
.select(`
id,
full_name,
phone,
line1,
line2,
city,
state,
pincode
`)
.eq("id",order.billing_address_id)
.single()
: Promise.resolve({data:null}),

/* GST */

order.gst_id
? supabase
.from("user_gst_details")
.select("*")
.eq("id",order.gst_id)
.single()
: Promise.resolve({data:null})

])

items = itemsRes.data || []
shippingAddress = shipRes.data
billingAddress = billRes.data
gst = gstRes.data

}

return NextResponse.json({
ticket,
user,
order,
items,
shippingAddress,
billingAddress,
gst
})

}



/* ========================= */
/* ADMIN REPLY               */
/* ========================= */

export async function POST(req:Request){

const supabase = await createClient()

const body = await req.json()

const {ticket_id,message,admin_id="admin"} = body

if(!ticket_id || !message){
return NextResponse.json({error:"Missing fields"})
}

/* FETCH EXISTING COMMENTS */

const {data:ticket} = await supabase
.from("support_tickets")
.select("comments")
.eq("id",ticket_id)
.single()

const comments = ticket?.comments || []

const newComment = {
user:admin_id,
message,
timestamp:new Date().toISOString()
}

const updated = [...comments,newComment]

/* UPDATE COMMENTS */

const {error} = await supabase
.from("support_tickets")
.update({
comments:updated
})
.eq("id",ticket_id)

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}



/* ========================= */
/* UPDATE STATUS             */
/* ========================= */

export async function PATCH(req:Request){

const supabase = await createClient()

const body = await req.json()

const {ticket_id,status} = body

if(!ticket_id || !status){
return NextResponse.json({error:"Missing fields"})
}

const {error} = await supabase
.from("support_tickets")
.update({status})
.eq("id",ticket_id)

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}