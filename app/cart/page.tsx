'use client'
import { useEffect, useState } from 'react'
export default function Cart(){
  const [cart,setCart]=useState<any[]>([])
  useEffect(()=>{setCart(JSON.parse(localStorage.getItem('cart')||'[]'))},[])
  const remove = (i:number)=>{
    const newCart=[...cart]
    newCart.splice(i,1)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }
  const total = cart.reduce((s,p)=>s+Number(p.price),0)

  return(
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/" className="text-zinc-500">← Back to Shop</a>
      <h1 className="text-3xl font-black mt-6">YOUR CART ({cart.length})</h1>
      
      <div className="mt-8 space-y-4">
        {cart.map((p,i)=>(
          <div key={i} className="flex gap-4 bg-zinc-900 p-4 rounded">
            <img src={p.image_url} className="w-20 h-20 object-cover rounded"/>
            <div className="flex-1"><p>{p.name}</p><p className="text-zinc-500">${p.price}</p></div>
            <button onClick={()=>remove(i)} className="text-red-400">Remove</button>
          </div>
        ))}
        {cart.length===0 && <p className="text-zinc-600">Cart empty - go shopping!</p>}
      </div>
      
      {cart.length>0 && (
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <p className="text-xl">Total: ${total.toFixed(2)}</p>
          <button onClick={()=>alert('FLAMMODE COMING SOON 🔥\n\nProducts not in stock yet! We are launching very soon. Follow us on Instagram for launch date.')} className="mt-4 bg-zinc-800 text-zinc-500 px-8 py-3 rounded-full font-bold w-full cursor-not-allowed">
            COMING SOON - NOT FOR SALE YET
          </button>
          <p className="text-zinc-600 text-sm mt-3 text-center">We are not taking orders yet. Launching soon! 🔥</p>
        </div>
      )}
    </div>
  )
}
