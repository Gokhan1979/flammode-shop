'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Settings(){
  const [user,setUser]=useState<any>(null)
  const [profile,setProfile]=useState({first_name:'',last_name:'',dob:'',postcode:'',address:'',avatar_url:''})
  const [email,setEmail]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [postcodeResults,setPostcodeResults]=useState<any[]>([])
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getUser().then(async({data})=>{
      setUser(data.user)
      setEmail(data.user?.email || '')
      const {data:prof} = await supabase.from('profiles').select('*').eq('id', data.user?.id).single()
      if(prof) setProfile(prof)
    })
  },[])

  const lookupPostcode = async()=>{
    if(!profile.postcode) return
    const clean = profile.postcode.replace(/\s/g,'')
    const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`)
    const json = await res.json()
    if(json.result){
      setPostcodeResults([json.result])
      // For full address list we can use autocomplete - using this result
    } else {
      alert('Postcode not found')
    }
  }

  const handleAvatar = async(e:any)=>{
    const file = e.target.files[0]
    if(!file) return
    const fileName = `${user.id}/${Date.now()}.jpg`
    await supabase.storage.from('avatars').upload(fileName, file)
    const {data} = supabase.storage.from('avatars').getPublicUrl(fileName)
    setProfile({...profile, avatar_url: data.publicUrl})
  }

  const saveProfile = async()=>{
    setLoading(true)
    await supabase.from('profiles').upsert({id:user.id, ...profile})
    alert('Profile saved!')
    setLoading(false)
  }

  const changeEmail = async()=>{
    await supabase.auth.updateUser({email})
    alert('Check new email to confirm')
  }

  const changePassword = async()=>{
    await supabase.auth.updateUser({password:newPassword})
    alert('Password updated!')
    setNewPassword('')
  }

  const deleteAccount = async()=>{
    if(!confirm('Are you sure? This will delete everything!')) return
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.admin
    alert('Please contact support to fully delete auth user, or delete from Supabase dashboard')
  }

  return(
    <div className="min-h-screen bg-black text-white p-6 max-w-2xl mx-auto">
      <a href="/" className="text-zinc-500">← Back to Home</a>
      <h1 className="text-3xl font-black mt-6 mb-8">SETTINGS</h1>
      
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-6">
        <h2 className="font-bold">Profile Photo</h2>
        <div className="flex items-center gap-4">
          <img src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.first_name}&background=fff&color=000`} className="w-20 h-20 rounded-full object-cover" />
          <input type="file" onChange={handleAvatar} className="text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input value={profile.first_name} onChange={e=>setProfile({...profile,first_name:e.target.value})} placeholder="First Name" className="bg-zinc-800 p-3 rounded" />
          <input value={profile.last_name} onChange={e=>setProfile({...profile,last_name:e.target.value})} placeholder="Last Name" className="bg-zinc-800 p-3 rounded" />
        </div>
        <input value={profile.dob} onChange={e=>setProfile({...profile,dob:e.target.value})} type="date" className="bg-zinc-800 p-3 rounded w-full" />
        
        <div className="flex gap-2">
          <input value={profile.postcode} onChange={e=>setProfile({...profile,postcode:e.target.value})} placeholder="Enter postcode e.g. E11 2EN" className="bg-zinc-800 p-3 rounded flex-1" />
          <button onClick={lookupPostcode} className="bg-white text-black px-4 rounded font-bold">Find</button>
        </div>
        {postcodeResults.map((r,i)=>(
          <button key={i} onClick={()=>setProfile({...profile, address: `${r.parish}, ${r.admin_district}, ${r.region}`, postcode:r.postcode})} className="block w-full text-left bg-zinc-800 p-3 rounded hover:bg-zinc-700">
            {r.postcode} - {r.admin_district}, {r.parish}
          </button>
        ))}
        <input value={profile.address} onChange={e=>setProfile({...profile,address:e.target.value})} placeholder="Full Address (auto fills after postcode click)" className="bg-zinc-800 p-3 rounded w-full" />

        <button onClick={saveProfile} disabled={loading} className="w-full bg-white text-black py-3 rounded-full font-bold">{loading?'Saving...':'Save Profile'}</button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl mt-6 space-y-4">
        <h2 className="font-bold">Change Email</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="bg-zinc-800 p-3 rounded w-full" />
        <button onClick={changeEmail} className="bg-zinc-800 py-2 px-4 rounded">Update Email</button>

        <h2 className="font-bold pt-4">Change Password</h2>
        <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} type="password" placeholder="New password" className="bg-zinc-800 p-3 rounded w-full" />
        <button onClick={changePassword} className="bg-zinc-800 py-2 px-4 rounded">Update Password</button>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl mt-6 space-y-3">
        <a href="/orders" className="block hover:text-zinc-400">My Orders →</a>
        <a href="/legal" className="block hover:text-zinc-400">Legal Information →</a>
        <button onClick={deleteAccount} className="text-red-400">Delete Account</button>
      </div>
    </div>
  )
}
