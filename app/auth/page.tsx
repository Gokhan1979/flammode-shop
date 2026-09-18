'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Auth(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [mode,setMode]=useState<'signin'|'signup'>('signin')
  const [msg,setMsg]=useState('')

  async function handleAuth(){
    setMsg('Loading...')
    if(mode==='signup'){
      const {error} = await supabase.auth.signUp({email,password})
      if(error) setMsg(error.message)
      else setMsg('Check your email to confirm! Then sign in.')
    }else{
      const {error} = await supabase.auth.signInWithPassword({email,password})
      if(error) setMsg(error.message)
      else { setMsg('Logged in!'); window.location.href='/' }
    }
  }

  async function forgot(){
    if(!email) return setMsg('Enter email first')
    const {error} = await supabase.auth.resetPasswordForEmail(email)
    if(error) setMsg(error.message)
    else setMsg('Password reset email sent!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-sm border border-zinc-800 p-8 rounded-2xl">
        <h1 className="text-3xl font-black mb-6">FLAMMODE</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setMode('signin')} className={`px-4 py-2 rounded-full text-sm ${mode==='signin'?'bg-white text-black':'bg-zinc-900'}`}>Sign In</button>
          <button onClick={()=>setMode('signup')} className={`px-4 py-2 rounded-full text-sm ${mode==='signup'?'bg-white text-black':'bg-zinc-900'}`}>Sign Up</button>
        </div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
        <button onClick={handleAuth} className="w-full bg-white text-black py-3 rounded-full font-bold text-sm mt-2">{mode==='signin'?'SIGN IN':'CREATE ACCOUNT'}</button>
        <button onClick={forgot} className="w-full text-zinc-500 text-xs mt-4">Forgot password?</button>
        <p className="text-xs text-zinc-400 mt-4">{msg}</p>
        <a href="/" className="text-xs text-zinc-600 mt-6 block text-center">Back to shop</a>
      </div>
    </div>
  )
}