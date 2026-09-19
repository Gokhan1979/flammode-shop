'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuthPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState('')

  const signIn = async(e:any)=>{
    e.preventDefault(); setMsg('Signing in...')
    const {data,error} = await supabase.auth.signInWithPassword({email,password})
    if(error){ setMsg(error.message); return }
    window.location.href='/'
  }

  return(
    <div className="min-h-screen bg-black text-white">
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <div className="font-black text-xl">FLAMMODE</div>
        <div className="text-2xl">🇬🇧</div>
        <div className="flex gap-4 items-center"><span>🛒</span><span>👤</span></div>
      </header>
      <div className="flex justify-center pt-20 px-6">
        <form onSubmit={signIn} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl space-y-4">
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 bg-zinc-800 rounded-xl" required />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 bg-zinc-800 rounded-xl" required />
          <button className="w-full bg-white text-black py-3 rounded-full font-bold">Sign In</button>
          <div className="flex justify-between text-sm pt-2">
            <Link href="/auth/forgot" className="text-zinc-400 underline">Forgot password?</Link>
            <Link href="/auth/signup" className="text-white font-bold">No account? Sign up</Link>
          </div>
          {msg && <p className="text-center text-sm text-yellow-400">{msg}</p>}
        </form>
      </div>
    </div>
  )
}
