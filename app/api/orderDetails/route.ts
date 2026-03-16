// import { createClient } from "@/utils/supabase/server"
// import { NextResponse } from "next/server"

// export async function GET(req: Request) {

//   const { searchParams } = new URL(req.url)
//   const order_id = searchParams.get("order_id")

//   if (!order_id) {
//     return NextResponse.json(
//       { error: "order_id required" },
//       { status: 400 }
//     )
//   }

//   const supabase = await createClient()

//   /* =========================
//      ORDER CORE DATA
//   ========================== */

//   const { data: order, error: orderError } = await supabase
//     .from("orders")
//     .select(`
//       id,
//       order_number,
//       subtotal,
//       discount_amount,
//       coupon_code,
//       shipping_cost,
//       total_amount,
//       payment_status,
//       shipping_status,
//       razorpay_order_id,
//       razorpay_payment_id,
//       notes,
//       created_at,
//       updated_at,
//       paid_at,
//       expires_at,

//       shiprocket_order_id,
//       shiprocket_shipment_id,
//       shiprocket_awb_code,
//       shiprocket_courier_name,
//       shiprocket_pickup_scheduled,
//       shipped_at,
//       delivered_at,

//       users:users!orders_user_id_fkey (
//         id,
//         full_name,
//         email,
//         phone,
//         role,
//         created_at
//       ),

//       shipping_address:addresses!orders_shipping_address_fkey (
//         id,
//         label,
//         full_name,
//         phone,
//         line1,
//         line2,
//         city,
//         state,
//         pincode
//       ),

//       billing_address:addresses!orders_billing_address_fkey (
//         id,
//         label,
//         full_name,
//         phone,
//         line1,
//         line2,
//         city,
//         state,
//         pincode
//       ),

//       gst:user_gst_details!orders_gst_fkey (
//         id,
//         gst_name,
//         gst_number
//       )
//     `)
//     .eq("id", order_id)
//     .single()

//   if (orderError) {
//     return NextResponse.json(
//       { error: orderError.message },
//       { status: 500 }
//     )
//   }

//   /* =========================
//      ORDER ITEMS + PRODUCT
//   ========================== */

//   const { data: items, error: itemsError } = await supabase
//     .from("order_items")
//     .select(`
//       id,
//       product_id,
//       option_value_id,
//       product_name,
//       variant_name,
//       sku,
//       unit_price,
//       quantity,
//       final_price,
//       refunded_quantity,
//       refunded_amount,
//       variant_option_value_ids,

//       product:products (
//         id,
//         name,
//         slug,
//         brand,
//         description,
//         base_price,
//         mrp,
//         images,
//         metadata
//       ),

//       variant:product_option_values (
//         id,
//         label,
//         value,
//         price_adjustment
//       )
//     `)
//     .eq("order_id", order_id)

//   if (itemsError) {
//     return NextResponse.json(
//       { error: itemsError.message },
//       { status: 500 }
//     )
//   }

//   /* =========================
//      SHIPPING EVENTS
//   ========================== */

//   const { data: shippingEvents, error: shippingError } = await supabase
//     .from("shipping_events")
//     .select(`
//       id,
//       courier_name,
//       awb_number,
//       status,
//       location,
//       event_timestamp,
//       event_type,
//       status_code,
//       tracking_url,
//       raw_payload,
//       created_at
//     `)
//     .eq("order_id", order_id)
//     .order("event_timestamp", { ascending: true })

//   if (shippingError) {
//     return NextResponse.json(
//       { error: shippingError.message },
//       { status: 500 }
//     )
//   }

//   /* =========================
//      WEBHOOK EVENTS
//   ========================== */

//   const { data: webhooks, error: webhookError } = await supabase
//     .from("webhook_events")
//     .select(`
//       event_id,
//       event_type,
//       razorpay_payment_id,
//       razorpay_order_id,
//       signature,
//       payload,
//       status,
//       received_at,
//       processed_at,
//       error
//     `)
//     .eq("order_id", order_id)
//     .order("received_at", { ascending: false })

//   if (webhookError) {
//     return NextResponse.json(
//       { error: webhookError.message },
//       { status: 500 }
//     )
//   }

//   /* =========================
//      RESPONSE STRUCTURE
//   ========================== */

//   const response = {
//     order,
//     items,
//     shipping_events: shippingEvents,
//     webhook_events: webhooks
//   }

//   return NextResponse.json(response)
// }

import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const order_id = searchParams.get("order_id")

  if (!order_id) {
    return NextResponse.json(
      { error: "order_id required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  /* =========================
     ORDER
  ========================= */

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      users:users!orders_user_id_fkey (*),
      shipping_address:addresses!orders_shipping_address_fkey (*),
      billing_address:addresses!orders_billing_address_fkey (*),
      gst:user_gst_details!orders_gst_fkey (*)
    `)
    .eq("id", order_id)
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  /* =========================
     ORDER ITEMS
  ========================= */

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      *,
      product:products (*),
      variant:product_option_values (*)
    `)
    .eq("order_id", order_id)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  /* =========================
     SHIPPING EVENTS
  ========================= */

  const { data: shipping_events } = await supabase
    .from("shipping_events")
    .select("*")
    .eq("order_id", order_id)
    .order("event_timestamp", { ascending: true })

  /* =========================
     WEBHOOK EVENTS
  ========================= */

  const { data: webhook_events } = await supabase
    .from("webhook_events")
    .select("*")
    .eq("order_id", order_id)
    .order("received_at", { ascending: false })

  return NextResponse.json({
    order,
    items,
    shipping_events,
    webhook_events
  })
}