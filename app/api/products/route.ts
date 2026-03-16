import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)

  const search = searchParams.get("search")
  const category = searchParams.get("category")
  const page = Number(searchParams.get("page") ?? 1)
  const limit = Number(searchParams.get("limit") ?? 20)

  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      brand,
      slug,
      base_price,
      mrp,
      images,
      is_active,
      is_featured,
      created_at,
      category:categories(
        id,
        name
      )
    `, { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (category) {
    query = query.eq("category_id", category)
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    products: data,
    count,
    page,
    limit
  })
}