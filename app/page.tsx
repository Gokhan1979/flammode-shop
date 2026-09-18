'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [user,setUser]=useState<any>(null)
  const [profile,setProfile]=useState<any>(null)
  const [products,setProducts]=useState<any[]>([])
  const [cartCount,setCartCount]=useState(0)
  const [menuOpen,setMenuOpen]=useState(false)
  const menuRef=useRef<any>(null)

  useEffect(()=>{
    supabase.auth.getUser().then(async ({data})=>{
      setUser(data.user)
      if(!data.user){
        localStorage.removeItem('cart')
        setCartCount(0)
      } else {
        const cart = JSON.parse(localStorage.getItem('cart')||'[]')
        setCartCount(cart.length)
        const {data:prof} = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
        setProfile(prof)
      }
    })
    supabase.from('products').select('*').then(({data})=>{if(data) setProducts(data)})
    const handleClickOutside=(e:any)=>{ if(menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return ()=>document.removeEventListener('mousedown', handleClickOutside)
  },[])

  const addToCart = (p:any)=>{
    if(!user){ alert('Please sign in first!'); window.location.href='/auth'; return }
    const cart = JSON.parse(localStorage.getItem('cart')||'[]')
    cart.push(p)
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount(cart.length)
  }

  const handleLogout = async()=>{
    localStorage.removeItem('cart')
    Object.keys(localStorage).forEach(k=>{ if(k.startsWith('sb-')) localStorage.removeItem(k) })
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  return(
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between p-6 border-b border-zinc-800 items-center">
        <h1 className="text-2xl font-black tracking-widest">FLAMMODE</h1>
        <div className="flex gap-6 items-center text-sm">
          {user && <a href="/cart" className="hover:text-zinc-400">CART ({cartCount})</a>}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={()=>setMenuOpen(!menuOpen)} className="flex items-center gap-2">
                <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.first_name || user.email}&background=fff&color=000`} className="w-8 h-8 rounded-full object-cover" />
                <span>{profile?.first_name || user.email.split('@')[0]}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-56 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden z-50">
                  <a href="/orders" className="block px-4 py-3 hover:bg-zinc-800">My Orders</a>
                  <a href="/help" className="block px-4 py-3 hover:bg-zinc-800">Help Center</a>
                  <a href="/settings" className="block px-4 py-3 hover:bg-zinc-800">Settings</a>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-zinc-800 border-t border-zinc-800">Logout</button>
                </div>
              )}
            </div>
          ) : <a href="/auth" className="bg-white text-black px-4 py-1 rounded-full font-bold">SIGN IN</a>}
        </div>
      </header>
      <section className="text-center py-24"><h2 className="text-6xl md:text-8xl font-black">FLAM</h2><p className="text-zinc-500 mt-4 tracking-[0.3em]">NEW COLLECTION 2026</p></section>
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
