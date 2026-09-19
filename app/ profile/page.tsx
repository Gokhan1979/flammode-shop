'use client'
import Link from 'next/link'

export default function Page(){
 return <div className="min-h-screen bg-black text-white p-10">
  <Link href="/" className="text-zinc-500">← Home</Link>
  <h1 className="text-3xl font-bold mt-10">Profile</h1>
  <button onClick={()=>{
   localStorage.clear()
   window.location.href='/login'
  }} className="mt-10 bg-white text-black px-8 py-3 rounded-full font-bold">LOGOUT</button>
  <div className="mt-10">
   <input placeholder="Postcode" id="pc" className="bg-zinc-900 border border-zinc-800 rounded-full px-5 py-3"/>
   <button onClick={async()=>{
    const pc = (document.getElementById('pc') as HTMLInputElement).value
    const r = await fetch(`https://api.getAddress.io/find/${pc}?api-key=UCoNlu507k-SZpdmYc82rg54138`)
    const d = await r.json()
    alert(JSON.stringify(d.addresses?.[0] || d))
   }} className="ml-2 bg-white text-black px-6 py-3 rounded-full">FIND</button>
  </div>
 </div>
}
