'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthPage(){
  const [view,setView]=useState<'login'|'signup'|'forgot-email'|'reset-code'>('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [confirmPassword,setConfirmPassword]=useState('')
  const [code,setCode]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')

  const handleLogin = async(e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true); setMessage('')
    try{
      if(view==='signup'){
        const {error} = await supabase.auth.signUp({email,password})
        if(error) throw error
        setMessage('Check your email to confirm!')
      }else{
        const {error} = await supabase.auth.signInWithPassword({email,password})
        if(error) throw error
        window.location.href='/'
      }
    }catch(err:any){ setMessage(err.message) }
    setLoading(false)
  }

  const handleForgotEmail = async(e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true); setMessage('')
    try{
      const {error} = await supabase.auth.resetPasswordForEmail(email)
      if(error) throw error
      setMessage('Email sent! Check your inbox for reset code.')
      setTimeout(()=>{ setView('reset-code'); setMessage('Enter code from email and new password') },1500)
    }catch(err:any){ setMessage(err.message) }
    setLoading(false)
  }

  const handleResetCode = async(e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true); setMessage('')
    if(password !== confirmPassword){ setMessage('Passwords do not match!'); setLoading(false); return }
    try{
      const {error:verifyError} = await supabase.auth.verifyOtp({email, token:code, type:'recovery'})
      if(verifyError) throw verifyError
      const {error:updateError} = await supabase.auth.updateUser({password})
      if(updateError) throw updateError
      setMessage('Password reset successful! Go back to login.')
      setTimeout(()=>{ setView('login'); setMessage(''); setPassword(''); setConfirmPassword(''); setCode('') },2000)
    }catch(err:any){ setMessage(err.message) }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">

        {/* LOGIN / SIGNUP */}
        {(view==='login' || view==='signup') && (
          <>
            <h1 className="text-3xl font-black mb-2">{view==='signup'? 'JOIN FLAMMODE' : 'WELCOME BACK'}</h1>
            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              <div className="relative">
                <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword? "text" : "password"} placeholder="Password" required className="w-full bg-zinc-800 p-3 pr-12 rounded-xl outline-none" />
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">{showPassword? '🙈' : '👁️'}</button>
              </div>
              {message && <p className="text-sm text-center text-yellow-400">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">{loading? 'Loading...' : view==='signup'? 'CREATE ACCOUNT' : 'SIGN IN'}</button>
            </form>
            <div className="flex flex-col gap-3 mt-6 text-sm text-center">
              <button onClick={()=>setView('forgot-email')} className="text-zinc-400 hover:text-white">Forgot password?</button>
              <button onClick={()=>setView(view==='login'?'signup':'login')} className="text-zinc-500 hover:text-white">{view==='signup'? 'Already have account? Sign In' : "Don't have account? Sign Up"}</button>
            </div>
          </>
        )}

        {/* STEP 1 - FORGOT EMAIL */}
        {view==='forgot-email' && (
          <>
            <h1 className="text-2xl font-black mb-2">FORGOT PASSWORD</h1>
            <p className="text-zinc-500 text-sm mb-6">Enter your email address</p>
            <form onSubmit={handleForgotEmail} className="space-y-4">
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Enter email address" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              {message && <p className="text-sm text-center text-yellow-400">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">{loading? 'Sending...' : 'SEND RESET CODE'}</button>
            </form>
            <button onClick={()=>setView('login')} className="text-zinc-500 hover:text-white text-sm mt-6 w-full text-center">Back to Login</button>
          </>
        )}

        {/* STEP 2 - RESET CODE + NEW PASSWORD */}
        {view==='reset-code' && (
          <>
            <h1 className="text-2xl font-black mb-2">RESET PASSWORD</h1>
            <p className="text-zinc-500 text-sm mb-6">Email sent! Check inbox. Enter code + new password</p>
            <form onSubmit={handleResetCode} className="space-y-4">
              <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter reset code from email" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="New password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              <input value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} type="password" placeholder="Confirm new password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              {message && <p className="text-sm text-center text-yellow-400">{message}</p>}
              <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">{loading? 'Resetting...' : 'RESET PASSWORD'}</button>
            </form>
            <button onClick={()=>setView('login')} className="text-zinc-500 hover:text-white text-sm mt-6 w-full text-center">Back to Login</button>
          </>
        )}

      </div>
    </div>
  )
}
