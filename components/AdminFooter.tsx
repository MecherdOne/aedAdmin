import Image from "next/image"

export default function AdminFooter(){

return(

<footer className="border-t bg-gray-50 mt-12">

<div className="max-w-7xl mx-auto px-6 py-8 space-y-4">

{/* LOGO */}

<div className="flex items-center gap-3">

<Image
src="/logo.png"
alt="AEDSIndia"
width={32}
height={32}
/>

<span className="font-semibold">
AEDSIndia Admin Panel
</span>

</div>

{/* WARNING */}

<div className="text-sm text-gray-700 leading-relaxed">

<p className="font-semibold text-red-600">
⚠️ Restricted Access
</p>

<p>
This administration panel is strictly intended for
<strong> authorized AEDSIndia employees and administrators only.</strong>
Unauthorized access, usage, or attempts to manipulate the system are
strictly prohibited.
</p>

<p>
Any unauthorized activity may result in
<strong> disciplinary action, legal consequences, and permanent access restriction.</strong>
All actions within this system are monitored and logged.
</p>

</div>

{/* COPYRIGHT */}

<p className="text-xs text-gray-500">

© {new Date().getFullYear()} AEDSIndia. All rights reserved.

</p>

</div>

</footer>

)

}