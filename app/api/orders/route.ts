import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total_amount,
      payment_status,
      shipping_status,
      created_at,
      users (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)

}