import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'

export default function Auth(){
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ fullName:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

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
      setError('Something went wrong. Please check your details and try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'calc(100dvh - 64px)',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:440,background:'#fff',border:'1px solid #eee',borderRadius:16,boxShadow:'0 10px 30px rgba(0,0,0,0.08)',overflow:'hidden'}}>
        <div style={{padding:'18px 20px',background:'linear-gradient(135deg,#ffe3e6,#fff4e6)'}}>
          <div style={{fontWeight:800,fontSize:22,color:'#e23744'}}>{mode==='login'?'Welcome back':'Create your account'}</div>
          <div style={{color:'#555',marginTop:6}}>{mode==='login'?'Sign in to continue':'Join FoodTown to discover great food'}</div>
        </div>
        <div style={{padding:20}}>
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
        </div>
      </div>
    </div>
  )
}


