'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage(){
  const [form,setForm]=useState({name:'',surname:'',postcode:'',street:'',town:'',city:'',country:'UK',photo:''})
  const [addresses,setAddresses]=useState<any[]>([])
  const [photoUrl,setPhotoUrl]=useState('')

  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{ if(data.user) setForm(f=>({...f, name:data.user?.user_metadata?.name||''})) }) },[])

  const lookup = async()=>{
    if(!form.postcode) return
    // Use getAddress.io or postcodes.io - here free postcodes.io for town/city, for door number you need getAddress API key
    const res = await fetch(`https://api.postcodes.io/postcodes/${form.postcode}`)
    const data = await res.json()
    if(data.result){
      setForm({...form, town:data.result.admin_ward, city:data.result.admin_district, country:'UK', street:data.result.parish||''})
      // Example door lookup - if you get getAddress.io key, fetch: https://api.getAddress.io/autocomplete/${postcode}?api-key=YOUR_KEY
      // For now show dropdown with mock street
      setAddresses([`${data.result.parish} - 1`, `${data.result.parish} - 2`, `${data.result.parish} - 3`])
    }
  }

  const save = async()=>{
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return
    await supabase.from('profiles').upsert({id:user.id,...form, avatar_url:photoUrl})
    alert('Saved!'); location.href='/'
  }

  const uploadPhoto = async(e:any)=>{
    const file = e.target.files[0]
    if(!file) return
    const {data:{user}} = await supabase.auth.getUser()
    const path = `${user?.id}/${file.name}`
    await supabase.storage.from('avatars').upload(path, file, {upsert:true})
    const {data} = supabase.storage.from('avatars').getPublicUrl(path)
    setPhotoUrl(data.publicUrl)
  }

  return(
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-lg mx-auto bg-zinc-900 p-8 rounded-2xl space-y-4">
        <h1 className="text-xl font-bold">Profile Form</h1>

        {photoUrl? <img src={photoUrl} className="w-20 h-20 rounded-full mx-auto" /> : <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto flex items-center justify-center">👤</div>}
        <input type="file" onChange={uploadPhoto} className="w-full text-sm" />

        <div className="grid grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="p-3 bg-zinc-800 rounded-xl" />
          <input value={form.surname} onChange={e=>setForm({...form,surname:e.target.value})} placeholder="Surname" className="p-3 bg-zinc-800 rounded-xl" />
        </div>

        <div className="flex gap-2">
          <input value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value})} placeholder="Enter postcode" className="flex-1 p-3 bg-zinc-800 rounded-xl" />
          <button onClick={lookup} className="bg-white text-black px-6 rounded-xl font-bold">Search</button>
        </div>

        {addresses.length>0 && (
          <select onChange={e=>setForm({...form,street:e.target.value})} className="w-full p-3 bg-zinc-800 rounded-xl">
            <option>Select door number & street</option>
            {addresses.map((a,i)=><option key={i} value={a}>{a}</option>)}
          </select>
        )}

        <input value={form.street} onChange={e=>setForm({...form,street:e.target.value})} placeholder="Street name" className="w-full p-3 bg-zinc-800 rounded-xl" />
        <input value={form.town} placeholder="Town" className="w-full p-3 bg-zinc-800 rounded-xl" />
        <input value={form.city} placeholder="City" className="w-full p-3 bg-zinc-800 rounded-xl" />
        <input value={form.country} placeholder="Country" className="w-full p-3 bg-zinc-800 rounded-xl" />

        <button onClick={save} className="w-full bg-white text-black py-3 rounded-full font-bold">Save & Open Homepage</button>
      </div>
    </div>
  )
}
