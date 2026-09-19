'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Signup(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [msg,setMsg]=useState('')
  const signup = async(e:any)=>{
    e.preventDefault(); setMsg('Creating...')
    const {error} = await supabase.auth.signUp({email,password})
    if(error){ setMsg(error.message); return }
    localStorage.setItem('verify_email', email)
    location.href='/auth/verify'
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={signup} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl space-y-4">
        <h1 className="font-bold text-xl">Sign Up</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 bg-zinc-800 rounded-xl" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 bg-zinc-800 rounded-xl" required />
        <button className="w-full bg-white text-black py-3 rounded-full font-bold">Create Account</button>
        {msg && <p className="text-center text-sm">{msg}</p>}
      </form>
    </div>
  )
}
