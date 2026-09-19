"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState("")
  const [form, setForm] = useState({
    name:"", surname:"", postcode:"", street:"", town:"", city:"", country:"UK", avatar_url:""
  })

  const API_KEY = "UCoNlu507k-SZpdmYc82rg54138"

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if(data.user){
        const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()
        if(p){ setForm(p); setAvatarPreview(p.avatar_url||"") }
      }
    })
  }, [])

  // AUTOCOMPLETE - live suggestions as you type
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length < 3) return setSuggestions([])
      try {
        const res = await fetch(`https://api.getAddress.io/autocomplete/${encodeURIComponent(searchTerm)}?api-key=${API_KEY}&all=true&top=6`)
        const data = await res.json()
        if(data.suggestions) setSuggestions(data.suggestions)
      } catch {}
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const selectSuggestion = async (s: any) => {
    const res = await fetch(`https://api.getAddress.io/get/${s.id}?api-key=${API_KEY}`)
    const a = await res.json()
    setForm({
     ...form,
      postcode: a.postcode,
      street: `${a.building_number || ""} ${a.thoroughfare || a.line_1}`.trim(),
      town: a.town_or_city,
      city: a.county || a.district,
      country: a.country || "UK"
    })
    setSearchTerm(a.line_1 + ", " + a.postcode)
    setSuggestions([])
  }

  const handleSave = async () => {
    if(!user) return alert("Login first")
    setLoading(true)
    let avatar_url = form.avatar_url
    if(avatarFile){
      const fileName = `${user.id}/${Date.now()}.jpg`
      await supabase.storage.from("avatars").upload(fileName, avatarFile, {upsert:true})
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
      avatar_url = data.publicUrl
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,...form, avatar_url,
      shipping_address: `${form.street}, ${form.town}, ${form.city}, ${form.postcode}`
    })
    setLoading(false)
    if(error) alert(error.message)
    else alert("Saved! ✅")
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">My Profile & Address</h1>

      <div className="flex flex-col items-center mb-5">
        <img src={avatarPreview || "https://via.placeholder.com/100"} className="w-24 h-24 rounded-full object-cover border-2" />
        <input type="file" accept="image/*" className="mt-2 text-sm" onChange={e=>{
          if(e.target.files?.[0]){ setAvatarFile(e.target.files[0]); setAvatarPreview(URL.createObjectURL(e.target.files[0])) }
        }} />
      </div>

      <div className="space-y-3">
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full p-3 rounded bg-zinc-900 border" />
        <input placeholder="Surname" value={form.surname} onChange={e=>setForm({...form,surname:e.target.value})} className="w-full p-3 rounded bg-zinc-900 border" />

        {/* AUTOCOMPLETE INPUT */}
        <label className="text-xs text-zinc-400">Start typing address or postcode:</label>
        <input placeholder="e.g. 10 Downing Street or SW1A 1AA" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full p-3 rounded bg-white text-black font-bold" />

        {suggestions.length>0 && (
          <div className="bg-white text-black rounded overflow-hidden -mt-2">
            {suggestions.map((s,i)=>(
              <div key={i} onClick={()=>selectSuggestion(s)} className="p-3 border-b cursor-pointer hover:bg-zinc-200 text-sm">{s.address}</div>
            ))}
          </div>
        )}

        <input placeholder="Street" value={form.street} onChange={e=>setForm({...form,street:e.target.value})} className="w-full p-3 rounded bg-zinc-900 border" />
        <input placeholder="Postcode" value={form.postcode} onChange={e=>setForm({...form,postcode:e.target.value.toUpperCase()})} className="w-full p-3 rounded bg-zinc-900 border" />
        <input placeholder="Town" value={form.town} onChange={e=>setForm({...form,town:e.target.value})} className="w-full p-3 rounded bg-zinc-900 border" />
        <input placeholder="City/County" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="w-full p-3 rounded bg-zinc-900 border" />

        <button onClick={handleSave} className="w-full py-3 bg-white text-black rounded-full font-bold">{loading?"Saving...":"Save Profile"}</button>
      </div>
    </div>
  )
}
