// "use server"

// import { redirect } from "next/navigation"
// import { createClient } from "@/utils/supabase/server"

// export async function login(formData: FormData) {
//   const supabase = await createClient()

//   const email = formData.get("email") as string
//   const password = formData.get("password") as string

//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   })

//   if (error) {
//     throw new Error(error.message)
//   }

//   redirect("/dashboard")
// }

// export async function logout() {
//   const supabase = await createClient()

//   await supabase.auth.signOut()

//   redirect("/")
// }

"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {

  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Invalid email or password" }
  }

  const user = data.user

  // check role in public.users table
  const { data: dbUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!dbUser || dbUser.role !== "admin") {

    // destroy session immediately
    await supabase.auth.signOut()

    return {
      error: "You are not authorised to access this admin dashboard."
    }
  }

  redirect("/dashboard")
}

export async function logout() {

  const supabase = await createClient()

  await supabase.auth.signOut()

  redirect("/")
}