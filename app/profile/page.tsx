'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_email') || 'user@flammode.com'
    setEmail(savedEmail)
  }, [])

  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ color: 'white', fontSize: 14 }}>← Back</Link>
        <span style={{ fontWeight: 'bold', letterSpacing: 2 }}>FLAMMODE</span>
        <div style={{ width: 40 }}></div>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 20px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ width: 80, height: 80, background: 'white', color: 'black', borderRadius: '50%', display: 'flex', alignItems
