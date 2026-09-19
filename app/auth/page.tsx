'use client'
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ResetPage(){
  const [password,setPassword]=useState('')
  const [message,setMessage]=useState('')
  const [loading,setLoading]=useState(false)

  const handleUpdate = async()=>{
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if(error) setMessage(error.message)
    else {
      setMessage('Password updated! Redirecting to login...')
      setTimeout(()=> window.location.href='/auth', 1500)
    }
    setLoading(false)
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-black mb-6">Set New Password</h1>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="New password" className="w-full bg-zinc-800 p-3 rounded mb-4 outline-none" />
        {message && <p className="text-sm mb-4 text-yellow-400">{message}</p>}
        <button onClick={handleUpdate} disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}
