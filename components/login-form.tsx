

// "use client"

// import { useState } from "react"
// import { login } from "@/app/actions/auth"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"

// export function LoginForm() {

//   const [error, setError] = useState<string | null>(null)

//   async function handleSubmit(formData: FormData) {

//     setError(null)

//     const result = await login(formData)

//     if (result?.error) {
//       setError(result.error)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted">

//       <Card className="w-95">

//         <CardHeader>
//           <CardTitle>Admin Login</CardTitle>
//         </CardHeader>

//         <CardContent>

//           <form action={handleSubmit} className="space-y-4">

//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input name="email" type="email" required />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <Input name="password" type="password" required />
//             </div>

//             {error && (
//               <div className="text-sm text-red-500 space-y-2">

//                 <p>{error}</p>

//                 <a
//                   href="https://aedsindia.in"
//                   className="text-blue-600 underline"
//                 >
//                   Visit AEDS India
//                 </a>

//               </div>
//             )}

//             <Button type="submit" className="w-full">
//               Login
//             </Button>

//           </form>

//         </CardContent>

//       </Card>

//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { login } from "@/app/actions/auth"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export function LoginForm() {

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {

    setError(null)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
    }

  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">

      <div className="w-full max-w-md space-y-6">

        {/* LOGO */}

        <div className="flex flex-col items-center gap-3">

          <Image
            src="/logo.png"
            alt="AEDSIndia"
            width={200}
            height={90}
          />

          <h1 className="text-2xl font-bold">
            AEDSIndia Admin
          </h1>

          <p className="text-sm text-gray-500 text-center">
            Secure access for authorized employees
          </p>

        </div>

        {/* LOGIN CARD */}

        <Card className="shadow-md">

          <CardHeader>
            <CardTitle className="text-lg">
              Admin Login
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form action={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" required />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" required />
              </div>

              {error && (

                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 space-y-2">

                  <p>{error}</p>

                  <a
                    href="https://aedsindia.in"
                    className="text-blue-600 underline"
                  >
                    Visit AEDSIndia Website
                  </a>

                </div>

              )}

              <Button type="submit" className="w-full">
                Login
              </Button>

            </form>

          </CardContent>

        </Card>

        {/* SECURITY WARNING */}

        <div className="text-xs text-gray-600 text-center space-y-2">

          <p className="font-semibold text-red-600">
            ⚠ Restricted System
          </p>

          <p>
            This administration portal is strictly intended for
            <strong> authorized AEDSIndia employees and administrators only.</strong>
          </p>

          <p>
            Unauthorized access, usage, or attempts to interfere with this
            system are strictly prohibited and may result in
            <strong> disciplinary action, legal proceedings, and permanent access restrictions.</strong>
          </p>

          <p>
            All login attempts and system activities are
            <strong> monitored and logged.</strong>
          </p>

        </div>

      </div>

    </div>

  )
}