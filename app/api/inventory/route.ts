

// import { createClient } from "@/utils/supabase/server"
// import { NextResponse } from "next/server"

// /* ---------------- GET PRODUCT ---------------- */

// export async function GET(req: Request) {

//   const { searchParams } = new URL(req.url)
//   const product_id = searchParams.get("product_id")

//   if (!product_id) {
//     return NextResponse.json(
//       { error: "product_id required" },
//       { status: 400 }
//     )
//   }

//   const supabase = await createClient()

//   const { data, error } = await supabase
//     .from("products")
//     .select(`
//       id,
//       category_id,
//       name,
//       brand,
//       slug,
//       description,
//       base_price,
//       mrp,
//       tax_percent,
//       images,
//       metadata,
//       is_featured,
//       is_active,
//       product_options (
//         id,
//         name,
//         sort_order,
//         product_option_values (
//           id,
//           value,
//           name,
//           sku,
//           sort_order,
//           addon_price,
//           inventory_quantity,
//           reserved_quantity,
//           low_stock_threshold,
//           tax_percent,
//           attributes,
//           is_active
//         )
//       )
//     `)
//     .eq("id", product_id)
//     .single()

//   if (error) {
//     return NextResponse.json(
//       { error: error.message },
//       { status: 500 }
//     )
//   }

//   return NextResponse.json(data)
// }


// /* ---------------- UPDATE PRODUCT ---------------- */

// export async function PUT(req: Request) {

//   try {

//     const supabase = await createClient()
//     const body = await req.json()

//     const {
//       product_id,
//       category_id,
//       name,
//       brand,
//       slug,
//       description,
//       base_price,
//       mrp,
//       tax_percent,
//       images,
//       metadata,
//       is_featured,
//       is_active,
//       options
//     } = body

//     /* ---------------- UPDATE PRODUCT ---------------- */

//     const { error: productError } = await supabase
//       .from("products")
//       .update({
//         category_id,
//         name,
//         brand,
//         slug,
//         description,
//         base_price,
//         mrp,
//         tax_percent,
//         images,
//         metadata,
//         is_featured,
//         is_active
//       })
//       .eq("id", product_id)

//     if (productError) {
//       return NextResponse.json(
//         { error: productError.message },
//         { status: 500 }
//       )
//     }


//     /* ---------------- OPTIONS ---------------- */

//     for (const option of options ?? []) {

//       let optionId = option.id

//       /* CREATE OPTION IF NEW */

//       if (!optionId) {

//         const { data, error: optionError } = await supabase
//           .from("product_options")
//           .insert({
//             product_id,
//             name: option.name,
//             sort_order: option.sort_order
//           })
//           .select()
//           .single()

//         if (optionError) {
//           return NextResponse.json(
//             { error: optionError.message },
//             { status: 500 }
//           )
//         }

//         optionId = data.id
//       }


//       /* ---------------- VARIANTS ---------------- */

//       for (const value of option.values ?? []) {

//         if (value.id) {

//           /* UPDATE VARIANT */

//           const { error: updateError } = await supabase
//             .from("product_option_values")
//             .update({
//               value: value.value,
//               name: value.name,
//               sku: value.sku,
//               sort_order: value.sort_order,
//               addon_price: value.addon_price,
//               inventory_quantity: value.inventory_quantity,
//               reserved_quantity: value.reserved_quantity,
//               low_stock_threshold: value.low_stock_threshold,
//               tax_percent: value.tax_percent,
//               attributes: value.attributes,
//               is_active: value.is_active
//             })
//             .eq("id", value.id)

//           if (updateError) {
//             return NextResponse.json(
//               { error: updateError.message },
//               { status: 500 }
//             )
//           }

//         } else {

//           /* INSERT NEW VARIANT */

//           const { error: insertError } = await supabase
//             .from("product_option_values")
//             .insert({
//               option_id: optionId,
//               value: value.value,
//               name: value.name,
//               sku: value.sku,
//               sort_order: value.sort_order,
//               addon_price: value.addon_price,
//               inventory_quantity: value.inventory_quantity,
//               reserved_quantity: value.reserved_quantity,
//               low_stock_threshold: value.low_stock_threshold,
//               tax_percent: value.tax_percent,
//               attributes: value.attributes,
//               is_active: value.is_active
//             })

//           if (insertError) {
//             return NextResponse.json(
//               { error: insertError.message },
//               { status: 500 }
//             )
//           }

//         }

//       }

//     }

//     return NextResponse.json({
//       success: true
//     })

//   } catch (err) {

//     console.log(err)

//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     )

//   }

// }

import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

/* ---------------- GET PRODUCT ---------------- */

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url)
  const product_id = searchParams.get("product_id")

  if (!product_id) {
    return NextResponse.json(
      { error: "product_id required" },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      category_id,
      name,
      brand,
      slug,
      description,
      base_price,
      mrp,
      tax_percent,
      images,
      metadata,
      is_featured,
      is_active,
      product_options (
        id,
        name,
        sort_order,
        product_option_values (
          id,
          value,
          name,
          sku,
          sort_order,
          addon_price,
          inventory_quantity,
          reserved_quantity,
          low_stock_threshold,
          tax_percent,
          attributes,
          is_active
        )
      )
    `)
    .eq("id", product_id)
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}


/* ---------------- UPDATE PRODUCT ---------------- */

export async function PUT(req: Request) {

  try {

    const supabase = await createClient()
    const body = await req.json()

    const {
      product_id,
      category_id,
      name,
      brand,
      slug,
      description,
      base_price,
      mrp,
      tax_percent,
      images,
      metadata,
      is_featured,
      is_active,
      options,
      deleted_option_ids,
      deleted_value_ids
    } = body

    /* ---------------- UPDATE PRODUCT ---------------- */

    const { error: productError } = await supabase
      .from("products")
      .update({
        category_id,
        name,
        brand,
        slug,
        description,
        base_price,
        mrp,
        tax_percent,
        images,
        metadata,
        is_featured,
        is_active
      })
      .eq("id", product_id)

    if (productError) {
      return NextResponse.json(
        { error: productError.message },
        { status: 500 }
      )
    }


    /* ---------------- DELETE REMOVED OPTION VALUES ---------------- */
    // Explicit individual value deletions requested by the user in the UI.

    if (Array.isArray(deleted_value_ids) && deleted_value_ids.length > 0) {

      const { error: deleteValuesError } = await supabase
        .from("product_option_values")
        .delete()
        .in("id", deleted_value_ids)

      if (deleteValuesError) {
        return NextResponse.json(
          { error: deleteValuesError.message },
          { status: 500 }
        )
      }

    }


    /* ---------------- DELETE REMOVED OPTIONS ---------------- */
    // Delete child option_values first for FK constraints, then the options themselves.

    if (Array.isArray(deleted_option_ids) && deleted_option_ids.length > 0) {

      const { error: deleteOptionValuesError } = await supabase
        .from("product_option_values")
        .delete()
        .in("option_id", deleted_option_ids)

      if (deleteOptionValuesError) {
        return NextResponse.json(
          { error: deleteOptionValuesError.message },
          { status: 500 }
        )
      }

      const { error: deleteOptionsError } = await supabase
        .from("product_options")
        .delete()
        .in("id", deleted_option_ids)

      if (deleteOptionsError) {
        return NextResponse.json(
          { error: deleteOptionsError.message },
          { status: 500 }
        )
      }

    }


    /* ---------------- OPTIONS (create/update remaining) ---------------- */

    for (const option of options ?? []) {

      let optionId = option.id

      /* CREATE OPTION IF NEW */

      if (!optionId) {

        const { data, error: optionError } = await supabase
          .from("product_options")
          .insert({
            product_id,
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

        optionId = data.id
      }


      /* ---------------- VARIANTS ---------------- */

      for (const value of option.values ?? []) {

        if (value.id) {

          /* UPDATE VARIANT */

          const { error: updateError } = await supabase
            .from("product_option_values")
            .update({
              value: value.value,
              name: value.name,
              sku: value.sku,
              sort_order: value.sort_order,
              addon_price: value.addon_price,
              inventory_quantity: value.inventory_quantity,
              reserved_quantity: value.reserved_quantity,
              low_stock_threshold: value.low_stock_threshold,
              tax_percent: value.tax_percent,
              attributes: value.attributes,
              is_active: value.is_active
            })
            .eq("id", value.id)

          if (updateError) {
            return NextResponse.json(
              { error: updateError.message },
              { status: 500 }
            )
          }

        } else {

          /* INSERT NEW VARIANT */

          const { error: insertError } = await supabase
            .from("product_option_values")
            .insert({
              option_id: optionId,
              value: value.value,
              name: value.name,
              sku: value.sku,
              sort_order: value.sort_order,
              addon_price: value.addon_price,
              inventory_quantity: value.inventory_quantity,
              reserved_quantity: value.reserved_quantity,
              low_stock_threshold: value.low_stock_threshold,
              tax_percent: value.tax_percent,
              attributes: value.attributes,
              is_active: value.is_active
            })

          if (insertError) {
            return NextResponse.json(
              { error: insertError.message },
              { status: 500 }
            )
          }

        }

      }

    }

    return NextResponse.json({
      success: true
    })

  } catch (err) {

    console.log(err)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )

  }

}