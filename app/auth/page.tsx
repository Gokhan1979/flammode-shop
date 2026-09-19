'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthPage(){
  const [isSignUp,setIsSignUp]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [msg,setMsg]=useState('')
  const [loading,setLoading]=useState(false)

  const handleAuth = async(e:any)=>{
    e.preventDefault(); setLoading(true); setMsg('')
    try{
      if(isSignUp){
        const {error}=await supabase.auth.signUp({email,password})
        if(error) throw error
        setMsg('Check email to confirm!')
      }else{
        const {error}=await supabase.auth.signInWithPassword({email,password})
        if(error) throw error
        window.location.href='/'
      }
    }catch(err:any){ setMsg(err.message) }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-black">{isSignUp?'JOIN FLAMMODE':'WELCOME BACK'}</h1>
        <form onSubmit={handleAuth} className="space-y-4 mt-6">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
          {msg && <p className="text-yellow-400 text-sm text-center">{msg}</p>}
          <button disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">{isSignUp?'CREATE ACCOUNT':'SIGN IN'}</button>
        </form>
        <div className="mt-6 text-center text-sm flex flex-col gap-3">
          <a href="/auth/forgot" className="text-zinc-400 hover:text-white">Forgot password? - opens new page</a>
          <button onClick={()=>setIsSignUp(!isSignUp)} className="text-zinc-500">{isSignUp?'Have account? Sign In' : "No account? Sign Up"}</button>
        </div>
      </div>
    </div>
  )
}
