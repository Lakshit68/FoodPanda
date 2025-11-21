import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Search(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [recent, setRecent] = useState(()=> JSON.parse(localStorage.getItem('ff_recent')||'[]'))
  const navigate = useNavigate()
  const popular = useMemo(()=> ['Pizza','Burgers','Indian','Chinese','Healthy','Desserts','Breakfast'], [])

  useEffect(()=>{ const t=setTimeout(run, 250); return ()=>clearTimeout(t) }, [q])
  async function run(){
    if(!q){ setResults([]); return }
    const { data } = await api.get('/restaurants', { params: { search: q } })
    setResults(data.items)
  }
  function useQuery(v){ setQ(v); if(!recent.includes(v)){ const next=[v,...recent].slice(0,10); setRecent(next); localStorage.setItem('ff_recent', JSON.stringify(next)) } }

  return (
    <div style={{maxWidth:960,margin:'16px auto',padding:'0 16px'}}>
      <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',alignItems:'center',gap:8,marginBottom:12}}>
        <button onClick={()=>navigate(-1)} className="ff-outline" style={{padding:'8px 10px'}}>←</button>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for restaurants or dishes..." style={{padding:12,border:'1px solid var(--border)',borderRadius:12}} />
        <button onClick={run} className="ff-primary" style={{padding:'10px 12px'}}>Search</button>
      </div>
      {!q && (
        <>
          <div style={{fontWeight:700,margin:'12px 0 8px'}}>Recent searches</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {recent.map(r => <button key={r} onClick={()=>setQ(r)} className="ff-outline" style={{padding:'8px 10px'}}>{r}</button>)}
          </div>
          <div style={{fontWeight:700,margin:'18px 0 8px'}}>Popular</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:10}}>
            {popular.map(p => <button key={p} onClick={()=>useQuery(p)} className="ff-outline" style={{padding:'12px'}}>{p}</button>)}
          </div>
        </>
      )}
      {q && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginTop:12}}>
          {results.map(r => (
            <div key={r._id} className="ff-card">
              <div style={{height:140,background:`url(${r.image||'https://picsum.photos/400?blur=2'}) center/cover`}} />
              <div style={{padding:12}}>
                <div style={{fontWeight:700}}>{r.name}</div>
                <div style={{color:'#666',fontSize:14,marginTop:4}}>{(r.cuisine||[]).join(', ')}</div>
                <div style={{marginTop:8,fontSize:14}}>⭐ {r.rating?.toFixed?.(1) || '0.0'} • {r.deliveryTimeMins||30} mins</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}





