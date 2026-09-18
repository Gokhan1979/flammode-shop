'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [user,setUser] = useState<any>(null)
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUser(data.user))
  },[])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-black tracking-widest">FLAMMODE</h1>
        <div className="flex gap-4 text-sm">
          {user ? (
            <>
              <a href="/profile" className="hover:text-zinc-400">Profile</a>
              <a href="/admin" className="hover:text-zinc-400">Admin</a>
              <button onClick={async()=>{await supabase.auth.signOut(); location.reload()}} className="hover:text-zinc-400">Logout</button>
            </>
          ) : (
            <a href="/auth" className="bg-white text-black px-4 py-1 rounded-full font-bold">SIGN IN</a>
          )}
        </div>
      </header>

      <section className="text-center py-24 px-6">
        <h2 className="text-6xl md:text-8xl font-black">FLAM</h2>
        <p className="text-zinc-500 mt-4 tracking-[0.3em]">NEW COLLECTION 2026</p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="#shop" className="bg-white text-black px-8 py-3 rounded-full font-bold">SHOP NOW</a>
        </div>
      </section>

      <section id="shop" className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 p-px">
        {[1,2,3,4,5,6,7,8].map(i=>(
          <div key={i} className="bg-zinc-900 p-6 aspect-[3/4] flex flex-col justify-end">
            <div className="bg-zinc-800 h-3/4 mb-4 rounded"></div>
            <p className="text-sm">FLAM TEE {i}</p>
            <p className="text-zinc-500 text-sm">£29.99</p>
            <button className="mt-2 bg-white text-black text-xs py-2 rounded font-bold">ADD TO CART</button>
          </div>
        ))}
      </section>

      <footer className="p-10 text-center text-zinc-600 text-xs">© 2026 FLAMMODE - All rights reserved</footer>
    </div>
  )
}