import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Auth(){
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function onGoogleLoginSuccess(tokenResponse) {
    try {
      console.log('Google User:', jwtDecode(tokenResponse.credential));
      await loginWithGoogle(tokenResponse.credential)
      navigate('/')
    } catch (e) {
      setError('Something went wrong with Google Login. Please try again.')
    }
  }

  async function onSubmit(e){
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.fullName, form.email, form.password)
      }
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong. Please check your details and try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{position:'relative',minHeight:'100dvh'}}>
      {/* Blur overlay to obscure navbars and background */}
      <div style={{position:'fixed',inset:0,backdropFilter:'blur(12px) brightness(0.9)',WebkitBackdropFilter:'blur(12px) brightness(0.9)',background:'rgba(255,255,255,0.35)',zIndex:200,pointerEvents:'none'}} />
      <div style={{position:'fixed',zIndex:300,top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(520px,92vw)',background:'#fff',border:'1px solid #eee',borderRadius:16,boxShadow:'0 16px 40px rgba(0,0,0,0.12)',overflow:'hidden'}}>
        <div style={{padding:'22px 24px',background:'linear-gradient(135deg,#ffe3e6,#fff4e6)'}}>
          <div style={{fontWeight:800,fontSize:24,color:'#e23744'}}>{mode==='login'?'Welcome back':'Create your account'}</div>
          <div style={{color:'#555',marginTop:6}}>Sign in to continue</div>
        </div>
        <div style={{padding:22}}>
          <div style={{display:'flex',gap:8,marginBottom:16}}>
            <button onClick={()=>setMode('login')} disabled={mode==='login'} style={{flex:1,padding:'10px 12px',borderRadius:10,border:'1px solid #eee',background:mode==='login'?'#111':'#fff',color:mode==='login'?'#fff':'#111'}}>Login</button>
            <button onClick={()=>setMode('register')} disabled={mode==='register'} style={{flex:1,padding:'10px 12px',borderRadius:10,border:'1px solid #eee',background:mode==='register'?'#111':'#fff',color:mode==='register'?'#fff':'#111'}}>Register</button>
          </div>
          {error && <div style={{background:'#fee2e2',color:'#991b1b',padding:'10px 12px',borderRadius:8,marginBottom:12}}>{error}</div>}
          <form onSubmit={onSubmit}>
            {mode==='register' && (
              <input placeholder="Full name" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} style={{display:'block',width:'100%',padding:12,marginBottom:10,border:'1px solid #ddd',borderRadius:10}} />
            )}
            <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={{display:'block',width:'100%',padding:12,marginBottom:10,border:'1px solid #ddd',borderRadius:10}} />
            <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} style={{display:'block',width:'100%',padding:12,marginBottom:12,border:'1px solid #ddd',borderRadius:10}} />
            <button disabled={loading} type="submit" style={{width:'100%',padding:'12px 14px',background:'#e23744',color:'#fff',border:'none',borderRadius:10,fontWeight:700}}>{loading? 'Please wait...' : (mode==='login'?'Login':'Create account')}</button>
          </form>
          <div style={{marginTop:12, width:'100%'}}>
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={() => { setError('Something went wrong with Google Login. Please try again.') }}
              useOneTap={false}
              theme="outline"
              size="large"
              shape="rectangular"
              text="signin_with"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
