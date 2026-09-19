'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(()=>{
    const saved = localStorage.getItem('cart')
    if(saved){
      try { setCartCount(JSON.parse(saved).length) } catch {}
    }
  },[])

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER - ONLY ON HOMEPAGE AFTER SIGN IN */}
      <header className="w-full bg-black text-white h-[64px] flex items-center justify-between px-4 lg:px-8 border-b border-zinc-800 sticky top-0 z-50">
        <Link href="/" className="font-black text-[20px] tracking-wider">
          FLAMMODE
        </Link>

        <div className="flex items-center gap-4">
          {/* UK FLAG */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">
            🇬🇧
          </button>

          {/* TROLLEY */}
          <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* HEAD ICON */}
          <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </header>

      {/* HOMEPAGE CONTENT - AFTER SIGN IN YOU SEE THIS */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <p className="text-zinc-500 mt-2">You are now logged in. Shop collection below.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-zinc-900 h-56 rounded-xl"></div>
          <div className="bg-zinc-900 h-56 rounded-xl"></div>
          <div className="bg-zinc-900 h-56 rounded-xl"></div>
          <div className="bg-zinc-900 h-56 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}
