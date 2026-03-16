import { NextResponse } from "next/server"
import { adminClient } from "@/utils/supabase/admin"

export async function GET(req: Request){

const { searchParams } = new URL(req.url)

const from = searchParams.get("from")
const to = searchParams.get("to")

/* =========================
CART ITEMS
========================= */

let cartQuery = adminClient
.from("cart_items")
.select(`
id,
quantity,
variant_option_value_ids,
created_at,

users (
id,
full_name,
email,
phone,

addresses (
id,
label,
full_name,
phone,
line1,
line2,
city,
state,
pincode
)

),

product_option_values (
id,
value,
sku,
name,
addon_price,
tax_percent,

product_options (
name,

products (
id,
name,
slug,
brand,
base_price,
mrp,
images
)

)

)
`)

if(from) cartQuery = cartQuery.gte("created_at",from)
if(to) cartQuery = cartQuery.lte("created_at",to)

const { data: cart } = await cartQuery


/* =========================
WISHLIST
========================= */

let wishlistQuery = adminClient
.from("wishlists")
.select(`
id,
variant_option_value_ids,
created_at,

users (
id,
full_name,
email,
phone,

addresses (
id,
label,
full_name,
phone,
line1,
line2,
city,
state,
pincode
)

),

products (
id,
name,
slug,
brand,
base_price,
mrp,
images
)
`)

if(from) wishlistQuery = wishlistQuery.gte("created_at",from)
if(to) wishlistQuery = wishlistQuery.lte("created_at",to)

const { data: wishlist } = await wishlistQuery


/* =========================
MERGE
========================= */

const leads = [

...(cart ?? []).map((i:any)=>({

type:"cart",
...i

})),

...(wishlist ?? []).map((i:any)=>({

type:"wishlist",
...i

}))

]

return NextResponse.json(leads)

}