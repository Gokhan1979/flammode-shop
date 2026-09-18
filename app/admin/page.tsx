'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const ADMIN_EMAIL = 'gokhan@example.com' // CHANGE TO YOUR EMAIL

export default function Admin(){
  const [user,setUser]=useState<any>(null)
  const [ok,setOk]=useState(false)
  
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user)
      if(data.user && data.user.email===ADMIN_EMAIL) setOk(true)
    })
  },[])

  if(!user) return <div className="p-10 bg-black min-h-screen text-white">Login first <a href="/auth" className="underline">Sign in</a></div>
  if(!ok) return <div className="p-10 bg-black min-h-screen text-white">Not authorized. Your email: {user.email}<br/>Admin email is set to {ADMIN_EMAIL} - change it in code.</div>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/" className="text-zinc-500">← Shop</a>
      <h1 className="text-3xl font-black mt-6">ADMIN PANEL</h1>
      <p className="text-zinc-500 text-sm">Only you can see this</p>
      <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl">
        <div className="border border-zinc-800 p-6 rounded-2xl"><p className="text-2xl font-bold">£1,240</p><p className="text-zinc-500 text-xs">Total Sales</p></div>
        <div className="border border-zinc-800 p-6 rounded-2xl"><p className="text-2xl font-bold">23</p><p className="text-zinc-500 text-xs">Orders</p></div>
        <div className="border border-zinc-800 p-6 rounded-2xl col-span-2">
          <h3 className="font-bold mb-2">Products</h3>
          <p className="text-zinc-500 text-sm">Here you will manage products later. For now homepage has 8 demo products.</p>
          <button className="mt-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold">Add Product (coming)</button>
        </div>
      </div>
    </div>
  )
}