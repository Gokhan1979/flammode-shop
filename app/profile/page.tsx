'use client'
import Link from 'next/link'
export default function Page(){
 return (
 <div style={{background:'black',color:'white',minHeight:'100vh',padding:'20px'}}>
  <Link href="/" style={{color:'white',textDecoration:'underline'}}>← Home</Link>
  <h1 style={{fontSize:'28px',fontWeight:'bold',marginTop:'20px'}}>Profile</h1>
  <button 
    onClick={()=>{localStorage.clear(); window.location.href='/login'}} 
    style={{marginTop:'20px',background:'white',color:'black',padding:'12px 30px',borderRadius:'99px',fontWeight:'bold'}}>
    LOGOUT
  </button>
 </div>
 )
}
