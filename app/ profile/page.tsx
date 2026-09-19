'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [address, setAddress] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])

  const searchAddress = async (value: string) => {
    setAddress(value)
    if (value.length < 3) {
      setSuggestions([])
      return
    }
    try {
      const res = await fetch(`https://api.getAddress.io/autocomplete/${value}?api-key=UCoNlu507k-SZpdmYc82rg54138`)
      const data = await res.json()
      setSuggestions(data.suggestions || [])
    } catch (e) {
      setSuggestions([])
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER SAME AS HOMEPAGE */}
      <header className="w-full bg-black text-white h-[64px] flex items-center justify-between px-4 lg:px-8 border-b border-zinc-800">
        <Link href="/" className="font-black text-[20px] tracking-wider">FLAMMODE</Link>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">🇬🇧</span>
          <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700">🛒</Link>
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black">👤</span>
        </div>
      </header>

      <div className="p-6 max-w-md mx-auto">
        <Link href="/" className="text-zinc-500 text-sm">← Back to Shop</Link>

        <h1 className="text-2xl font-bold mt-6">My Profile</h1>
        <p className="text-zinc-500 text-sm mt-2">UK Address Autocomplete</p>

        <div className="mt-8 relative">
          <label className="text-sm text-zinc-400">Search Address</label>
          <input
            value={address}
            onChange={e => searchAddress(e.target.value)}
            placeholder="Start typing postcode..."
            className="mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-full px-5 py-3 outline-none focus:border-white"
          />

          {suggestions.length > 0 && (
            <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              {suggestions.map((s: any, i: number) => (
                <button
                  key={i}
                  onClick={() => {
                    setAddress(s.address)
                    setSuggestions([])
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-zinc-800 text-sm"
                >
                  {s.address}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="mt-6 bg-white text-black w-full py-3 rounded-full font-bold">
          SAVE ADDRESS
        </button>
      </div>
    </div>
  )
}
