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
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-zinc-800 p-3 rounded outline-none" />
          
          <div className="relative">
            <input 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              type={showPassword ? "text" : "password"} 
