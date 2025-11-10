import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthCtx = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => {
    try { 
      const { data } = await api.get('/auth/me'); 
      if (data.authenticated) {
        setUser(data.user)
      }
    }
    catch { setUser(null) }
    finally { setLoading(false) }
  })() }, [])

  async function login(email, password){
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)
  }
  async function register(fullName, email, password){
    const { data } = await api.post('/auth/register', { fullName, email, password })
    setUser(data.user)
  }
  async function logout(){ 
    await api.post('/auth/logout'); 
    setUser(null) 
  }
  async function togglePremium() {
    const { data } = await api.put('/auth/premium');
    setUser(data.user);
  }

  return <AuthCtx.Provider value={{ user, authenticated: !!user, loading, login, register, logout, togglePremium }}>{children}</AuthCtx.Provider>
}

export function useAuth(){ return useContext(AuthCtx) }




