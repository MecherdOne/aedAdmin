import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function OrdersPage() {

  const supabase = await createClient()

  const { data: orders, error } = await supabase
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
    return <div>Error loading orders</div>
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Orders
      </h1>

      <div className="overflow-x-auto border rounded-lg">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Shipping</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>

            {orders?.map((order:any) => (

              <tr key={order.id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-blue-600 font-medium"
                  >
                    {order.order_number}
                  </Link>
                </td>

                <td className="p-3">
                  {order.users?.full_name || "-"}
                </td>

                <td className="p-3">
                  {order.users?.email || "-"}
                </td>

                <td className="p-3">
                  ₹{order.total_amount}
                </td>

                <td className="p-3">
                  {order.payment_status}
                </td>

                <td className="p-3">
                  {order.shipping_status}
                </td>

                <td className="p-3">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}