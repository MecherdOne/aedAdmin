import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

/* GET ALL TICKETS */

export async function GET(){

const supabase = await createClient()

const { data, error } = await supabase
.from("support_tickets")
.select(`
id,
ticket_type,
status,
reason,
created_at,
comments,
orders (
id,
order_number
),
users (
id,
full_name,
phone
)
`)
.order("created_at",{ascending:false})

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({tickets:data})

}

/* ADMIN REPLY */

export async function POST(req:Request){

const supabase = await createClient()

const body = await req.json()

const {ticket_id,message,admin_id} = body

if(!message){
return NextResponse.json({error:"Message required"})
}

const {data:ticket} = await supabase
.from("support_tickets")
.select("comments")
.eq("id",ticket_id)
.single()

const comments = ticket?.comments || []

const newComment = {
user:admin_id || "admin",
message,
timestamp:new Date().toISOString()
}

const updated = [...comments,newComment]

const {error} = await supabase
.from("support_tickets")
.update({comments:updated})
.eq("id",ticket_id)

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}

/* UPDATE STATUS */

export async function PATCH(req:Request){

const supabase = await createClient()

const body = await req.json()

const {ticket_id,status} = body

const {error} = await supabase
.from("support_tickets")
.update({status})
.eq("id",ticket_id)

if(error){
return NextResponse.json({error:error.message})
}

return NextResponse.json({success:true})

}