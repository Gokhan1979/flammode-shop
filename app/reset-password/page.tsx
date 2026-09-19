'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Reset(){
  const [p1,setP1]=useState(''); const [p2,setP2]=useState(''); const [msg,setMsg]=useState('')
  const reset = async(e:any)=>{
    e.preventDefault()
    if(p1!==p2){ setMsg('Passwords not match'); return }
    const {error}=await supabase.auth.updateUser({password:p1})
    if(error){ setMsg(error.message); return }
    setMsg('Password changed! Go sign in'); setTimeout(()=>location.href='/auth',1500)
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={reset} className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl space-y-4">
        <h1 className="text-xl font-bold">New Password</h1>
        <input value={p1} onChange={e=>setP1(e.target.value)} type="password" placeholder="New password" className="w-full p-3 bg-zinc-800 rounded-xl" required />
        <input value={p2} onChange={e=>setP2(e.target.value)} type="password" placeholder="Re-enter password" className="w-full p-3 bg-zinc-800 rounded-xl" required />
        <button className="w-full bg-white text-black py-3 rounded-full font-bold">Save</button>
        {msg && <p className="text-center text-sm text-yellow-400">{msg}</p>}
      </form>
    </div>
  )
}
