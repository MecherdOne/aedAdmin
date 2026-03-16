// import { notFound } from "next/navigation"
// import { createClient } from "@/utils/supabase/server"

// export default async function OrderDetailsPage({
//   params
// }: {
//   params: Promise<{ order_id: string }>
// }) {

//   const { order_id } = await params

//   const supabase = await createClient()

//   /* =========================
//      ORDER CORE
//   ========================== */

//   const { data: order } = await supabase
//     .from("orders")
//     .select(`
//       *,
//       users:users!orders_user_id_fkey (
//         id,
//         full_name,
//         email,
//         phone
//       ),
//       shipping_address:addresses!orders_shipping_address_fkey (
//         *
//       ),
//       billing_address:addresses!orders_billing_address_fkey (
//         *
//       ),
//       gst:user_gst_details!orders_gst_fkey (
//         *
//       )
//     `)
//     .eq("id", order_id)
//     .single()

//   if (!order) return notFound()

//   /* =========================
//      ORDER ITEMS
//   ========================== */

//   const { data: items } = await supabase
//     .from("order_items")
//     .select(`
//       *,
//       product:products (
//         id,
//         name,
//         slug,
//         brand,
//         images
//       ),
//       variant:product_option_values (
//         id,
//         label,
//         value
//       )
//     `)
//     .eq("order_id", order_id)

//   /* =========================
//      SHIPPING EVENTS
//   ========================== */

//   const { data: shipping_events } = await supabase
//     .from("shipping_events")
//     .select("*")
//     .eq("order_id", order_id)
//     .order("event_timestamp", { ascending: true })

//   /* =========================
//      WEBHOOK EVENTS
//   ========================== */

//   const { data: webhook_events } = await supabase
//     .from("webhook_events")
//     .select("*")
//     .eq("order_id", order_id)
//     .order("received_at", { ascending: false })

//   return (

//     <div className="p-8 space-y-10">

//       {/* ORDER HEADER */}

//       <div className="border rounded-lg p-6">

//         <h1 className="text-2xl font-semibold mb-4">
//           Order {order.order_number}
//         </h1>

//         <div className="grid grid-cols-4 gap-6 text-sm">

//           <div>
//             <p className="text-gray-500">Total</p>
//             <p className="font-medium">₹{order.total_amount}</p>
//           </div>

//           <div>
//             <p className="text-gray-500">Payment</p>
//             <p>{order.payment_status}</p>
//           </div>

//           <div>
//             <p className="text-gray-500">Shipping</p>
//             <p>{order.shipping_status}</p>
//           </div>

//           <div>
//             <p className="text-gray-500">Placed</p>
//             <p>{new Date(order.created_at).toLocaleString()}</p>
//           </div>

//         </div>

//       </div>

//       {/* CUSTOMER */}

//       <div className="border rounded-lg p-6">

//         <h2 className="font-semibold mb-4">
//           Customer
//         </h2>

//         <div className="text-sm space-y-1">

//           <p>{order.users?.full_name}</p>
//           <p>{order.users?.email}</p>
//           <p>{order.users?.phone}</p>

//         </div>

//       </div>

//       {/* ADDRESSES */}

//       <div className="grid grid-cols-2 gap-6">

//         <div className="border rounded-lg p-6">

//           <h2 className="font-semibold mb-4">
//             Shipping Address
//           </h2>

//           {order.shipping_address && (

//             <div className="text-sm space-y-1">

//               <p>{order.shipping_address.full_name}</p>
//               <p>{order.shipping_address.phone}</p>
//               <p>{order.shipping_address.line1}</p>
//               <p>{order.shipping_address.line2}</p>

//               <p>
//                 {order.shipping_address.city},{" "}
//                 {order.shipping_address.state}
//               </p>

//               <p>{order.shipping_address.pincode}</p>

//             </div>

//           )}

//         </div>

//         <div className="border rounded-lg p-6">

//           <h2 className="font-semibold mb-4">
//             Billing Address
//           </h2>

//           {order.billing_address && (

//             <div className="text-sm space-y-1">

//               <p>{order.billing_address.full_name}</p>
//               <p>{order.billing_address.phone}</p>
//               <p>{order.billing_address.line1}</p>
//               <p>{order.billing_address.line2}</p>

//               <p>
//                 {order.billing_address.city},{" "}
//                 {order.billing_address.state}
//               </p>

//               <p>{order.billing_address.pincode}</p>

//             </div>

//           )}

//         </div>

//       </div>

//       {/* GST */}

//       {order.gst && (

//         <div className="border rounded-lg p-6">

//           <h2 className="font-semibold mb-4">
//             GST Details
//           </h2>

//           <div className="text-sm">

//             <p>{order.gst.gst_name}</p>
//             <p>{order.gst.gst_number}</p>

//           </div>

//         </div>

//       )}

//       {/* ORDER ITEMS */}

//       <div className="border rounded-lg">

//         <div className="p-6 border-b font-semibold">
//           Order Items
//         </div>

//         <table className="w-full text-sm">

//           <thead className="bg-gray-50">

//             <tr>
//               <th className="p-3 text-left">Product</th>
//               <th className="p-3 text-left">Variant</th>
//               <th className="p-3 text-left">SKU</th>
//               <th className="p-3 text-left">Qty</th>
//               <th className="p-3 text-left">Unit Price</th>
//               <th className="p-3 text-left">Final Price</th>
//             </tr>

//           </thead>

//           <tbody>

//             {items?.map((item: any) => (

//               <tr key={item.id} className="border-t">

//                 <td className="p-3">
//                   {item.product_name}
//                 </td>

//                 <td className="p-3">
//                   {item.variant_name || "-"}
//                 </td>

//                 <td className="p-3">
//                   {item.sku || "-"}
//                 </td>

//                 <td className="p-3">
//                   {item.quantity}
//                 </td>

//                 <td className="p-3">
//                   ₹{item.unit_price}
//                 </td>

//                 <td className="p-3">
//                   ₹{item.final_price}
//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//       {/* SHIPPING EVENTS */}

//       <div className="border rounded-lg p-6">

//         <h2 className="font-semibold mb-4">
//           Shipping Timeline
//         </h2>

//         <div className="space-y-4 text-sm">

//           {shipping_events?.map((event: any) => (

//             <div key={event.id} className="border-b pb-2">

//               <p className="font-medium">
//                 {event.status}
//               </p>

//               <p className="text-gray-500">
//                 {event.location}
//               </p>

//               <p className="text-gray-400 text-xs">
//                 {new Date(event.event_timestamp).toLocaleString()}
//               </p>

//             </div>

//           ))}

//         </div>

//       </div>

//       {/* WEBHOOK EVENTS */}

//       <div className="border rounded-lg p-6">

//         <h2 className="font-semibold mb-4">
//           Razorpay Webhooks
//         </h2>

//         <div className="space-y-4 text-sm">

//           {webhook_events?.map((event: any) => (

//             <div key={event.event_id} className="border-b pb-2">

//               <p className="font-medium">
//                 {event.event_type}
//               </p>

//               <p>Status: {event.status}</p>

//               <p className="text-gray-400 text-xs">
//                 {new Date(event.received_at).toLocaleString()}
//               </p>

//             </div>

//           ))}

//         </div>

//       </div>

//     </div>
//   )
// }

import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function OrderDetailsPage({
  params
}: {
  params: Promise<{ order_id: string }>
}) {

  const { order_id } = await params

  const supabase = await createClient()

  /* =========================
     ORDER
  ========================= */

  const { data: order } = await supabase
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

  if (!order) return notFound()

  /* =========================
     ORDER ITEMS
  ========================= */

  const { data: items } = await supabase
    .from("order_items")
    .select(`
      *,
      product:products (*),
      variant:product_option_values (*)
    `)
    .eq("order_id", order_id)

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

  return (

<div className="p-10 space-y-10">

{/* ORDER HEADER */}

<div className="border rounded-lg p-6">

<h1 className="text-2xl font-bold mb-4">
Order {order.order_number}
</h1>

<div className="grid grid-cols-4 gap-6 text-sm">

<div>
<p className="text-gray-500">Total</p>
<p>₹{order.total_amount}</p>
</div>

<div>
<p className="text-gray-500">Payment Status</p>
<p>{order.payment_status}</p>
</div>

<div>
<p className="text-gray-500">Shipping Status</p>
<p>{order.shipping_status}</p>
</div>

<div>
<p className="text-gray-500">Created</p>
<p>{new Date(order.created_at).toLocaleString()}</p>
</div>

</div>

</div>


{/* CUSTOMER */}

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">Customer</h2>

<p>Name: {order.users?.full_name}</p>
<p>Email: {order.users?.email}</p>
<p>Phone: {order.users?.phone}</p>

</div>


{/* ADDRESSES */}

<div className="grid grid-cols-2 gap-6">

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">Shipping Address</h2>

<p>{order.shipping_address?.full_name}</p>
<p>{order.shipping_address?.phone}</p>
<p>{order.shipping_address?.line1}</p>
<p>{order.shipping_address?.line2}</p>
<p>{order.shipping_address?.city}</p>
<p>{order.shipping_address?.state}</p>
<p>{order.shipping_address?.pincode}</p>

</div>

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">Billing Address</h2>

<p>{order.billing_address?.full_name}</p>
<p>{order.billing_address?.phone}</p>
<p>{order.billing_address?.line1}</p>
<p>{order.billing_address?.line2}</p>
<p>{order.billing_address?.city}</p>
<p>{order.billing_address?.state}</p>
<p>{order.billing_address?.pincode}</p>

</div>

</div>


{/* GST */}

{order.gst && (

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">GST Details</h2>

<p>{order.gst.gst_name}</p>
<p>{order.gst.gst_number}</p>

</div>

)}


{/* ORDER ITEMS */}

<div className="border rounded-lg">

<div className="p-6 border-b font-semibold">
Order Items
</div>

<table className="w-full text-sm">

<thead className="bg-gray-50">

<tr>
<th className="p-3 text-left">Product</th>
<th className="p-3 text-left">Variant</th>
<th className="p-3 text-left">SKU</th>
<th className="p-3 text-left">Qty</th>
<th className="p-3 text-left">Unit Price</th>
<th className="p-3 text-left">Final Price</th>
<th className="p-3 text-left">Refund Qty</th>
<th className="p-3 text-left">Refund Amount</th>
</tr>

</thead>

<tbody>

{items?.map((item:any)=> (

<tr key={item.id} className="border-t">

<td className="p-3">{item.product_name}</td>
<td className="p-3">{item.variant_name}</td>
<td className="p-3">{item.sku}</td>
<td className="p-3">{item.quantity}</td>
<td className="p-3">₹{item.unit_price}</td>
<td className="p-3">₹{item.final_price}</td>
<td className="p-3">{item.refunded_quantity}</td>
<td className="p-3">₹{item.refunded_amount}</td>

</tr>

))}

</tbody>

</table>

</div>


{/* SHIPPING EVENTS */}

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">Shipping Events</h2>

{shipping_events?.map((e:any)=> (

<div key={e.id} className="border-b py-2">

<p>Status: {e.status}</p>
<p>Location: {e.location}</p>
<p>Courier: {e.courier_name}</p>
<p>AWB: {e.awb_number}</p>
<p>Time: {new Date(e.event_timestamp).toLocaleString()}</p>

</div>

))}

</div>


{/* WEBHOOK EVENTS */}

<div className="border rounded-lg p-6">

<h2 className="font-semibold mb-4">Webhook Events</h2>

{webhook_events?.map((e:any)=> (

<div key={e.event_id} className="border-b py-2">

<p>Event: {e.event_type}</p>
<p>Status: {e.status}</p>
<p>Payment ID: {e.razorpay_payment_id}</p>
<p>Order ID: {e.razorpay_order_id}</p>
<p>Received: {new Date(e.received_at).toLocaleString()}</p>

</div>

))}

</div>


</div>

  )
}