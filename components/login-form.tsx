// "use client"

// import { login } from "@/app/actions/auth"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"

// export function LoginForm() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted">
//       <Card className="w-[380px]">
//         <CardHeader>
//           <CardTitle>Admin Login</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form action={login} className="space-y-4">

//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input name="email" type="email" required />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <Input name="password" type="password" required />
//             </div>

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
    <div className="flex min-h-screen items-center justify-center bg-muted">

      <Card className="w-[380px]">

        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
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
              <div className="text-sm text-red-500 space-y-2">

                <p>{error}</p>

                <a
                  href="https://aedsindia.in"
                  className="text-blue-600 underline"
                >
                  Visit AEDS India
                </a>

              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}