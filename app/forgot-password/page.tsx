'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword(){
  const [email,setEmail]=useState('')
  const router = useRouter()
  const handleSend = () => {
    if(!email) return alert('Enter email')
    // save email temp
    localStorage.setItem('reset_email', email)
    router.push('/forgot-password/sent')
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <a href="/login" className="text-zinc-500 text-sm">← Back to Login</a>
        <h1 className="text-2xl font-black mt-4">Forgot Password?</h1>
        <p className="text-zinc-500 text-sm mt-2">Enter your email address</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" className="mt-6 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"/>
        <button onClick={handleSend} className="mt-4 bg-white text-black w-full py-3 rounded-full font-bold">SEND RESET CODE</button>
      </div>
    </div>
  )
}
