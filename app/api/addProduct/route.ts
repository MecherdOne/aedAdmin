import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const supabase = await createClient()
    const body = await req.json()

    const {
      category_id,
      name,
      brand,
      slug,
      description,
      base_price,
      mrp,
      images,
      metadata,
      is_featured,
      is_active,
      options
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      )
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        category_id,
        name,
        brand,
        slug,
        description,
        base_price,
        mrp,
        images,
        metadata,
        is_featured,
        is_active
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const productId = product.id

    if (options?.length) {

      for (const option of options) {

        const { data: optionRow, error: optionError } = await supabase
          .from("product_options")
          .insert({
            product_id: productId,
            name: option.name,
            sort_order: option.sort_order
          })
          .select()
          .single()

        if (optionError) {
          return NextResponse.json(
            { error: optionError.message },
            { status: 500 }
          )
        }

        const optionId = optionRow.id

        for (const value of option.values) {

          const { error: valueError } = await supabase
            .from("product_option_values")
            .insert({
              option_id: optionId,
              value: value.value,
              sort_order: value.sort_order,
              sku: value.sku,
              name: value.name,
              attributes: value.attributes,
              addon_price: value.addon_price,
              inventory_quantity: value.inventory_quantity,
              reserved_quantity: value.reserved_quantity,
              low_stock_threshold: value.low_stock_threshold,
              is_active: value.is_active
            })

          if (valueError) {
            return NextResponse.json(
              { error: valueError.message },
              { status: 500 }
            )
          }
        }
      }
    }

    return NextResponse.json({ success: true })

  } catch (err) {

    console.log(err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}