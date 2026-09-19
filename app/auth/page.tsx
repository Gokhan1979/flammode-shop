'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthPage(){
  const [mode,setMode]=useState('login')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [newPass,setNewPass]=useState('')
  const [confirm,setConfirm]=useState('')
  const [msg,setMsg]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    // if user clicked reset link from email, supabase puts token in URL
    const hash = window.location.hash
    if(hash && hash.includes('access_token')){
      setMode('reset')
    }
  },[])

  const onSubmit = async(e:any)=>{
    e.preventDefault()
    if(!email && mode!=='reset'){ setMsg('Please enter your email first'); return }
    setLoading(true); setMsg('')
    try{
      if(mode==='login'){
        const {error}=await supabase.auth.signInWithPassword({email,password})
        if(error) throw error
        window.location.href='/'
      }
      if(mode==='signup'){
        const {error}=await supabase.auth.signUp({email,password})
        if(error) throw error
        setMsg('Check your email to confirm account!')
      }
      if(mode==='forgot'){
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{
          redirectTo: `${window.location.origin}/auth`
        })
        if(error) throw error
        setMsg('Email sent! Check your inbox - click link to reset password')
      }
      if(mode==='reset'){
        if(newPass!==confirm){ throw new Error('Passwords do not match') }
        const {error}=await supabase.auth.updateUser({password:newPass})
        if(error) throw error
        setMsg('Password updated! Redirecting to login...')
        setTimeout(()=>{ window.location.href='/auth'; setMode('login') },2000)
      }
    }catch(err:any){ setMsg(err.message) }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-black mb-1">
          {mode==='login' && 'WELCOME BACK'}
          {mode==='signup' && 'JOIN FLAMMODE'}
          {mode==='forgot' && 'FORGOT PASSWORD'}
          {mode==='reset' && 'SET NEW PASSWORD'}
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          {mode==='forgot' && 'Enter email address - we send reset link'}
          {mode==='reset' && 'Enter new password + confirm'}
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode!=='reset' && <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none text-white" />}
          {(mode==='login'||mode==='signup') && <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />}
          {mode==='reset' && (
            <>
              <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password" placeholder="New password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
              <input value={confirm} onChange={e=>setConfirm(e.target.value)} type="password" placeholder="Confirm new password" required className="w-full bg-zinc-800 p-3 rounded-xl outline-none" />
            </>
          )}
          {msg && <div className="bg-yellow-900/30 border border-yellow-600/30 text-yellow-300 text-sm p-3 rounded-xl text-center">{msg}</div>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">
            {loading? 'Please wait...' : mode==='login'?'SIGN IN' : mode==='signup'?'CREATE ACCOUNT' : mode==='forgot'?'SEND RESET EMAIL' : 'SAVE NEW PASSWORD'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm space-y-2">
          {mode==='login' && <><button onClick={()=>{setMode('forgot'); setMsg('')}} className="block w-full text-zinc-400">Forgot password?</button><button onClick={()=>{setMode('signup'); setMsg('')}} className="block w-full text-zinc-500">Don't have account? Sign Up</button></>}
          {mode==='signup' && <button onClick={()=>{setMode('login'); setMsg('')}} className="text-zinc-500">Already have account? Sign In</button>}
          {mode==='forgot' && <button onClick={()=>{setMode('login'); setMsg('')}} className="text-zinc-500">Back to login</button>}
        </div>
      </div>
    </div>
  )
}
