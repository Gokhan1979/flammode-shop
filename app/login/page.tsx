'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const router = useRouter()

  // THIS FIXES YOUR CART BUG - clears cart when you go to login page (after logout)
  useEffect(()=>{
    localStorage.removeItem('cart')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('flammode-cart')
  },[])

  const handleLogin = () => {
    if(!email || !password) return alert('Enter email and password')
    // For now just fake login
    alert('Logged in! (front-end only for now)')
    router.push('/')
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-black">FLAMMODE</h1>
        <p className="text-zinc-500 text-sm mt-2">Login to your account</p>
        
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="Email" 
          className="mt-6 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"
        />
        <input 
          type="password"
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          placeholder="Password" 
          className="mt-3 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"
        />

        <a href="/forgot-password" className="text-zinc-500 text-sm mt-3 block text-right hover:text-white">
          Forgot password?
        </a>

        <button onClick={handleLogin} className="mt-6 bg-white text-black w-full py-3 rounded-full font-bold">
          LOGIN
        </button>

        <p className="text-center text-zinc-600 text-sm mt-4">
          Don't have account? <a href="/signup" className="text-white">Sign up</a>
        </p>

        <a href="/" className="block text-center text-zinc-500 text-sm mt-4">← Back to Shop</a>
      </div>
    </div>
  )
}
