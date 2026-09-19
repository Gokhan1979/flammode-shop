'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [postcode, setPostcode] = useState('')
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddr, setSelectedAddr] = useState('')
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setEmail(localStorage.getItem('userEmail') || '')
    setName(localStorage.getItem('userName') || '')
  },[])

  const findAddresses = async () => {
    if(!postcode) return alert('Enter postcode')
    setLoading(true)
    try {
      const res = await fetch(`https://api.getAddress.io/find/${postcode}?api-key=UCoNlu507k-SZpdmYc82rg54138&expand=true`)
      const data = await res.json()
      if(data.addresses){
        setAddresses(data.addresses)
      } else {
        alert('No addresses found for ' + postcode)
        setAddresses([])
      }
    } catch {
      alert('Error finding address')
    }
    setLoading(false)
  }

  const selectAddress = (addr: any) => {
    setSelectedAddr(`${addr.line_1}, ${addr.line_2 || ''}`.replace(',,','').trim())
    setCity(addr.town_or_city || '')
    setAddresses([])
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('cart')
    router.push('/login')
  }

  const handleSave = () => {
    localStorage.setItem('userName', name)
    localStorage.setItem('userAddress', selectedAddr)
    localStorage.setItem('userCity', city)
    localStorage.setItem('userPostcode', postcode)
    alert('Profile Saved!')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="w-full h-[64px] flex items-center justify-between px-4 lg:px-8 border-b border-zinc-800">
        <Link href="/" className="font-black text-[20px]">FLAMMODE</Link>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-sm">🇬🇧</span>
          <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">🛒</Link>
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black font-bold">👤</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6">
        <div className="flex items-center justify-between mt-2">
          <h1 className="text-3xl font-black">MY PROFILE</h1>
          <button onClick={handleLogout} className="text-sm bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-full hover:bg-white hover:text-black">
            LOGOUT
          </button>
        </div>

        <div className="mt-8 bg-zinc-900 rounded-[24px] p-6 space-y-5">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="John Doe" className="mt-2 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white" />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Email</label>
            <input value={email} readOnly className="mt-2 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none text-zinc-400" />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Phone</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07xxx xxxxxx" className="mt-2 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white" />
          </div>

          <div className="h-[1px] bg-zinc-800 my-6"></div>

          <h2 className="font-bold">DELIVERY ADDRESS (UK)</h2>

          <div className="flex gap-2">
            <input value={postcode} onChange={e=>setPostcode(e.target.value.toUpperCase())} placeholder="Postcode e.g. SW1A 1AA" className="flex-1 bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white uppercase" />
            <button onClick={findAddresses} disabled={loading} className="bg-white text-black px-6 rounded-full font-bold text-sm disabled:opacity-50">
              {loading? '...' : 'FIND'}
            </button>
          </div>

          {addresses.length > 0 && (
            <div className="bg-black border border-zinc-800 rounded-2xl max-h-48 overflow-y-auto">
              {addresses.map((a,i)=>(
                <button key={i} onClick={()=>selectAddress(a)} className="w-full text-left px-5 py-3 hover:bg-zinc-900 text-sm border-b border-zinc-900 last:border-0">
                  {a.formatted_address.join(', ')}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest">Address Line</label>
            <input value={selectedAddr} onChange={e=>setSelectedAddr(e.target.value)} placeholder="Select from postcode above" className="mt-2 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white" />
          </div>

          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest">City</label>
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="London" className="mt-2 w-full bg-black border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white" />
          </div>

          <button onClick={handleSave} className="w-full bg-white text-black py-4 rounded-full font-black mt-4">
            SAVE PROFILE
          </button>
        </div>
      </div>
    </div>
  )
}
