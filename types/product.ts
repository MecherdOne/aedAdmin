// export interface Variant {
//   id?: string
//   value: string
//   name: string
//   sku: string
//   sort_order: number

//   addon_price: number
//   inventory_quantity: number
//   reserved_quantity: number
//   low_stock_threshold: number

//   attributes: Record<string, unknown>
//   is_active: boolean
// }

// export interface ProductOption {
//   id?: string
//   name: string
//   sort_order: number
//   values: Variant[]
// }

// export interface DescriptionBlock {
//   title: string
//   description: string
// }

// export interface Product {
//   id: string
//   name: string
//   brand: string
//   slug: string

//   description?: DescriptionBlock[]
//   metadata?: string[]
//   images?: string[]

//   options: ProductOption[]

//   base_price?: number
//   mrp?: number
//   is_featured?: boolean
//   is_active?: boolean

//   product_options?: {
//     id: string
//     name: string
//     product_option_values: Variant[]
//   }[]
// }

export interface Variant {
  id: string
  value: string
  name: string
  sku: string
  addon_price: number
  inventory_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  sort_order: number
  is_active: boolean
}

export interface ProductOption {
  id: string
  name: string
  sort_order: number
  product_option_values: Variant[]
}

export interface DescriptionBlock {
  title: string
  description: string
}

export interface Product {
  id: string
  category_id: string | null

  name: string
  brand: string | null
  slug: string

  base_price: number
  mrp: number

  description: DescriptionBlock[]
  images: string[]

  metadata: string[]

  is_featured: boolean
  is_active: boolean

  product_options: ProductOption[]
}