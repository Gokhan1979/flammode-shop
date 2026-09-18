'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPassword(){
  const [code,setCode]=useState('')
  const [pass,setPass]=useState('')
  const [confirm,setConfirm]=useState('')
  const router = useRouter()
  const handleReset = () => {
    if(!code || !pass || !confirm) return alert('Fill all fields')
    if(pass !== confirm) return alert('Passwords do not match')
    if(code !== '123456') return alert('For testing, code is 123456')
    alert('Password reset successful! Now login with new password.')
    router.push('/login')
  }
  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-2xl">
        <h1 className="text-2xl font-black">Reset Password</h1>
        <p className="text-zinc-500 text-sm mt-2">Enter code and new password</p>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Enter 6-digit code" className="mt-6 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"/>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="New password" className="mt-3 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"/>
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm new password" className="mt-3 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"/>
        <button onClick={handleReset} className="mt-6 bg-white text-black w-full py-3 rounded-full font-bold">RESET PASSWORD</button>
        <a href="/login" className="block text-center text-zinc-500 text-sm mt-4">Back to login</a>
      </div>
    </div>
  )
}
