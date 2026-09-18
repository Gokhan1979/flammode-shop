'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [user,setUser]=useState<any>(null)
  const [products,setProducts]=useState<any[]>([])
  const [cartCount,setCartCount]=useState(0)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user)
      if(!data.user){
        localStorage.removeItem('cart')
        setCartCount(0)
      } else {
        const cart = JSON.parse(localStorage.getItem('cart')||'[]')
        setCartCount(cart.length)
      }
    })
    supabase.from('products').select('*').then(({data})=>{if(data) setProducts(data)})
  },[])

  const addToCart = (p:any)=>{
    if(!user) {
      alert('Please sign in first!')
      window.location.href='/auth'
      return
    }
    const cart = JSON.parse(localStorage.getItem('cart')||'[]')
    cart.push(p)
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount(cart.length)
    alert(`${p.name} added to cart!`)
  }

  const handleLogout = async()=>{
    localStorage.removeItem('cart')
    Object.keys(localStorage).forEach(k=>{ if(k.startsWith('sb-')) localStorage.removeItem(k) })
    setCartCount(0)
    setUser(null)
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return(
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-black tracking-widest">FLAMMODE</h1>
        <div className="flex gap-4 text-sm items-center">
          {user && <a href="/cart" className="hover:text-zinc-400">CART ({cartCount})</a>}
          {user ? <><a href="/profile" className="hover:text-zinc-400">Profile</a><a href="/admin" className="hover:text-zinc-400">Admin</a><button onClick={handleLogout} className="hover:text-zinc-400">Logout</button></> : <a href="/auth" className="bg-white text-black px-4 py-1 rounded-full font-bold">SIGN IN</a>}
        </div>
      </header>
      <section className="text-center py-24 px-6">
        <h2 className="text-6xl md:text-8xl font-black">FLAM</h2>
        <p className="text-zinc-500 mt-4 tracking-[0.3em]">NEW COLLECTION 2026</p>
      </section>
      <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 p-px">
        {products.map((p)=>(
          <div key={p.id} className="bg-zinc-900 p-6 aspect-[3/4] flex flex-col justify-end">
            <img src={p.image_url} className="bg-zinc-800 h-3/4 mb-4 rounded object-cover w-full" />
            <p className="text-sm">{p.name}</p>
            <p className="text-zinc-500 text-sm">${p.price}</p>
            <button onClick={()=>addToCart(p)} className="mt-2 bg-white text-black text-xs py-2 rounded font-bold">ADD TO CART</button>
          </div>
        ))}
      </section>
    </div>
  )
}
