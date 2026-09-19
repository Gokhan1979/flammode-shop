'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [isLogin,setIsLogin]=useState(true)
  const [forgotMode,setForgotMode]=useState(false)
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)

  const handleAuth = async()=>{
    setLoading(true)
    setMessage('')
    try{
      if(isLogin){
        const { error } = await supabase.auth.signInWithPassword({email,password})
        if(error) throw error
        window.location.href='/'
      } else {
        const { error } = await supabase.auth.signUp({email,password})
        if(error) throw error
        setMessage('Check your email to confirm account!')
      }
    }catch(err:any){
      setMessage(err.message)
    }
    setLoading(false)
  }

  const handleForgot = async()=>{
    if(!email){ setMessage('Please enter your email first!'); return }
    setLoading(true)
    setMessage('')
    try{
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`
      })
      if(error) throw error
      setMessage('Reset link sent! Check your email.')
    }catch(err:any){
      setMessage(err.message)
    }
    setLoading(false)
  }

  // FORGOT PASSWORD PAGE
  if(forgotMode){
    return(
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
          <h1 className="text-2xl font-black mb-2">Forgot Password</h1>
          <p className="text-zinc-500 text-sm mb-6">Enter your email to get reset link</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" className="w-full bg-zinc-800 p-3 rounded mb-4 outline-none" />
          {message && <p className="text-sm mb-4 text-yellow-400">{message}</p>}
          <button onClick={handleForgot} disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold mb-3">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button onClick={()=>{setForgotMode(false); setMessage('')}} className="w-full text-zinc-400 text-sm">Back to Login</button>
        </div>
      </div>
    )
  }

  // LOGIN / SIGNUP PAGE
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-black mb-6">{isLogin ? 'Sign In' : 'Sign Up'}</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 p-3 rounded mb-3 outline-none" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-zinc-800 p-3 rounded mb-2 outline-none" />
        <div className="text-right mb-4">
          <button onClick={()=>setForgotMode(true)} className="text-xs text-zinc-400 hover:text-white">Forgot password?</button>
        </div>
        {message && <p className="text-sm mb-4 text-yellow-400">{message}</p>}
        <button onClick={handleAuth} disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold mb-3">
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
        <button onClick={()=>setIsLogin(!isLogin)} className="w-full text-zinc-400 text-sm">
          {isLogin ? "Don't have account? Sign Up" : "Already have account? Sign In"}
        </button>
      </div>
    </div>
  )
}
