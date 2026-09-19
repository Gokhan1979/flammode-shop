'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Verify(){
  const [code,setCode]=useState(''); const [msg,setMsg]=useState('')
  const verify = async(e:any)=>{
    e.preventDefault()
    const email = localStorage.getItem('verify_email')||''
    const {error} = await supabase.auth.verifyOtp({email, token:code, type:'signup'})
    if(error){ setMsg(error.message); return }
    location.href='/profile'
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={verify} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl space-y-4">
        <h1 className="font-bold">Confirm Email</h1>
        <p className="text-sm text-zinc-500">Code sent to your email, enter code</p>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit code" className="w-full p-3 bg-zinc-800 rounded-xl text-center text-xl tracking-widest" required />
        <button className="w-full bg-white text-black py-3 rounded-full font-bold">Verify</button>
        {msg && <p className="text-center text-sm text-yellow-400">{msg}</p>}
      </form>
    </div>
  )
}
