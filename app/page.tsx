'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home(){
  const [products,setProducts]=useState<any[]>([])
  const [cart,setCart]=useState<any[]>([])
  const [user,setUser]=useState<any>(null)
  const [showCart,setShowCart]=useState(false)
  const [showOrders,setShowOrders]=useState(false)
  const [orders,setOrders]=useState<any[]>([])

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setUser(data.session?.user))
    supabase.from('products').select('*').then(({data})=>{ if(data) setProducts(data) })
  },[])

  const fetchOrders = async()=>{
    const {data:{session}} = await supabase.auth.getSession()
    if(!session) return
    const {data} = await supabase.from('orders').select('*, order_items(*, products(*))').eq('user_id', session.user.id).order('created_at',{ascending:false})
    if(data) setOrders(data)
  }

  const addToCart = (p:any)=> setCart([...cart, p])
  const cartTotal = cart.reduce((s,i)=>s+i.price,0)

  const checkout = async()=>{
    if(!user){ window.location.href='/auth'; return }
    const {data:order} = await supabase.from('orders').insert({user_id:user.id, total:cartTotal, status:'pending'}).select().single()
    if(order){
      for(let item of cart){
        await supabase.from('order_items').insert({order_id:order.id, product_id:item.id, quantity:1, price:item.price})
      }
      alert('Order placed!')
      setCart([])
      setShowCart(false)
    }
  }

  return(
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800 flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-black tracking-tighter">FLAMMODE</h1>
        <div className="flex items-center gap-6 text-sm">
          <button onClick={async()=>{ await fetchOrders(); setShowOrders(true) }} className="hover:text-zinc-400">My Orders</button>
          <button onClick={()=>setShowCart(true)} className="hover:text-zinc-400">Cart ({cart.length})</button>
          {user ? <button onClick={async()=>{ await supabase.auth.signOut(); setUser(null) }} className="hover:text-zinc-400">Logout</button> : <a href="/auth" className="bg-white text-black px-4 py-2 rounded-full font-bold">Sign In</a>}
        </div>
      </header>

      {/* PRODUCTS */}
      <main className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p=>(
          <div key={p.id} className="bg-zinc-900 rounded-2xl overflow-hidden">
            <img src={p.image_url} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-zinc-500">${p.price}</p>
              <button onClick={()=>addToCart(p)} className="mt-3 w-full bg-white text-black py-2 rounded-full font-bold text-sm">Add to Cart</button>
            </div>
          </div>
        ))}
      </main>

      {/* CART */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
          <div className="w-full max-w-sm bg-zinc-900 p-6 h-full overflow-y-auto">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">Cart</h2><button onClick={()=>setShowCart(false)}>✕</button></div>
            {cart.map((c,i)=><div key={i} className="flex justify-between py-2 border-b border-zinc-800"><span>{c.name}</span><span>${c.price}</span></div>)}
            <p className="mt-4 font-bold">Total: ${cartTotal}</p>
            <button onClick={checkout} className="w-full bg-white text-black py-3 rounded-full font-bold mt-6">Checkout</button>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {showOrders && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
          <div className="w-full max-w-md bg-zinc-900 p-6 h-full overflow-y-auto">
            <div className="flex justify-between mb-6"><h2 className="text-xl font-bold">My Orders</h2><button onClick={()=>setShowOrders(false)}>✕</button></div>
            {orders.length===0 && <p className="text-zinc-500">No orders yet.</p>}
            {orders.map(o=>(
              <div key={o.id} className="bg-black p-4 rounded-xl mb-4 border border-zinc-800">
                <p className="text-sm text-zinc-500">{new Date(o.created_at).toLocaleString()} - ${o.total} - {o.status}</p>
                {o.order_items?.map((it:any)=><p key={it.id} className="text-sm mt-1">• {it.products?.name} x{it.quantity}</p>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
