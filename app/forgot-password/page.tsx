'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Forgot(){
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState('')
  const send = async(e:any)=>{
    e.preventDefault()
    const {error} = await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/auth/reset`})
    setMsg(error?error.message:'Reset link sent to your email! Click link in email')
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={send} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl space-y-4">
        <h1 className="text-xl font-bold">Forgot Password</h1>
        <p className="text-sm text-zinc-500">Enter email, we send reset link</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter email" className="w-full p-3 bg-zinc-800 rounded-xl" required />
        <button className="w-full bg-white text-black py-3 rounded-full font-bold">Send Reset Link</button>
        {msg && <p className="text-yellow-400 text-sm text-center">{msg}</p>}
      </form>
    </div>
  )
}
