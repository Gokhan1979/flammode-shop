'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AuthPage(){
  const [isSignUp,setIsSignUp]=useState(false)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')

  const handleAuth = async(e:any)=>{
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try{
      if(isSignUp){
        const { error } = await supabase.auth.signUp({email,password})
        if(error) throw error
        setMessage('Check your email to confirm account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({email,password})
        if(error) throw error
        window.location.href='/'
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
        redirectTo: `https://flammode-shopping.vercel.app/auth/reset`
      })
      if(error) throw error
      setMessage('Reset link sent! Check your email.')
    }catch(err:any){
      setMessage(err.message)
    }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-3xl font-black mb-2">{isSignUp ? 'JOIN FLAMMODE' : 'WELCOME BACK'}</h1>
        <p className="text-zinc-500 text-sm mb-8">{isSignUp ? 'Create your account' : 'Sign in to continue'}</p>

        <form onSubmit={handleAuth} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-zinc-800 p-3 rounded outline-none focus:ring-1 focus:ring-white" />
          
          {/* PASSWORD WITH EYE ICON */}
          <div className="relative">
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              required 
              className="w-full bg-zinc-800 p-3 pr-12 rounded outline-none focus:ring-1 focus:ring-white" 
            />
            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
              {showPassword ? (
                // Eye Off icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.59 9.59 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
              ) : (
                // Eye On icon
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>

          {message && <p className="text-sm text-center text-yellow-400">{message}</p>}
          
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-zinc-200">
            {loading ? 'Loading...' : isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm space-y-2">
          {!isSignUp && <button onClick={handleForgot} className="text-zinc-400 hover:text-white block w-full">Forgot password?</button>}
          <button onClick={()=>setIsSignUp(!isSignUp)} className="text-zinc-500 hover:text-white">
            {isSignUp ? 'Already have account? Sign In' : "Don't have account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  )
}
