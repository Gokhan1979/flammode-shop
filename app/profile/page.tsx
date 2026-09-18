'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Profile(){
  const [user,setUser]=useState<any>(null)
  const [phone,setPhone]=useState('')
  const [address,setAddress]=useState('')
  const [newEmail,setNewEmail]=useState('')
  const [newPass,setNewPass]=useState('')
  const [msg,setMsg]=useState('')

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user)
      setPhone(localStorage.getItem('flam_phone')||'')
      setAddress(localStorage.getItem('flam_addr')||'')
    })
  },[])

  async function saveProfile(){
    localStorage.setItem('flam_phone',phone)
    localStorage.setItem('flam_addr',address)
    setMsg('Profile saved!')
  }

  async function changeEmail(){
    const {error}=await supabase.auth.updateUser({email:newEmail})
    setMsg(error?error.message:'Check new email to confirm!')
  }

  async function changePass(){
    const {error}=await supabase.auth.updateUser({password:newPass})
    setMsg(error?error.message:'Password updated!')
  }

  if(!user) return <div className="p-10 bg-black min-h-screen text-white">Loading... <a href="/auth" className="underline">Sign in</a></div>

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <a href="/" className="text-zinc-500 text-sm">← Back</a>
      <h1 className="text-3xl font-black mt-6">My Profile</h1>
      <p className="text-zinc-500 text-sm mt-2">{user.email}</p>
      
      <div className="mt-8 max-w-md space-y-6">
        <div className="border border-zinc-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Contact & Address</h3>
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
          <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full address" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
          <button onClick={saveProfile} className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold">Save</button>
        </div>

        <div className="border border-zinc-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Change Email</h3>
          <input value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="New email" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
          <button onClick={changeEmail} className="bg-zinc-800 px-6 py-2 rounded-full text-sm">Update Email</button>
        </div>

        <div className="border border-zinc-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-4">Change Password</h3>
          <input value={newPass} onChange={e=>setNewPass(e.target.value)} type="password" placeholder="New password" className="w-full bg-zinc-900 p-3 rounded mb-3 text-sm"/>
          <button onClick={changePass} className="bg-zinc-800 px-6 py-2 rounded-full text-sm">Update Password</button>
        </div>

        <p className="text-sm text-zinc-400">{msg}</p>
      </div>
    </div>
  )
}