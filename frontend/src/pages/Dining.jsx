import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Dining() {
  const [restaurants, setRestaurants] = useState([])
  const [favs, setFavs] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchRestaurants() {
      const { data } = await api.get('/restaurants')
      setRestaurants(data.items || [])
    }
    fetchRestaurants()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <div style={{
        padding: '64px 16px',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1374') center/cover`,
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize:56,fontWeight:800,marginBottom:8}}>Dine Out</h1>
        <p style={{fontSize:22,fontWeight:500,marginTop:0,marginBottom:32}}>Book a table at your favorite restaurant</p>
      </div>

      <div style={{background: 'var(--bg)', padding: '48px 16px'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div style={{fontWeight:800,fontSize:28,margin:'0 0 24px'}}>Restaurants</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:32}}>
            {restaurants.map(r => (
              <div
                key={r._id}
                onClick={() => navigate(`/restaurant/${r._id}/details`, { state: { view: 'dining' } })}
                className="ff-card fade-in"
                style={{cursor: 'pointer', overflow:'hidden', borderRadius:16, boxShadow:'0 10px 24px rgba(0,0,0,0.08)', transition:'transform .15s ease'}}
              >
                <div style={{position:'relative',height:200,background:`url(${r.image||'https://picsum.photos/400?blur=2'}) center/cover`}}>
                  <button aria-label="favorite" onClick={(e)=>{e.stopPropagation(); setFavs(prev=>({ ...prev, [r._id]: !prev[r._id] }));}} style={{position:'absolute',top:12,left:12,background:'rgba(255,255,255,0.9)',backdropFilter:'blur(6px)',border:'none',borderRadius:999,padding:'6px 8px',cursor:'pointer',boxShadow:'0 4px 10px rgba(0,0,0,0.08)'}}>{favs[r._id] ? '♥' : '♡'}</button>
                  <div style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.65)',color:'#fff',borderRadius:8,padding:'4px 10px',fontSize:14,fontWeight:700}}>★ {r.rating?.toFixed?.(1) || '0.0'}</div>
                </div>
                <div style={{padding:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
                    <div style={{fontWeight:800,fontSize:20}}>{r.name}</div>
                    <div style={{opacity:0.8,fontSize:14}}>₹ {((r.priceLevel||2)*10+15)} for one</div>
                  </div>
                  <div style={{color:'#666',fontSize:14,margin:'6px 0'}}>{(r.cuisine||[]).join(', ')}</div>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',fontSize:13,marginTop:8,color:'#444'}}>
                    <span>⏱ {r.deliveryTimeMins||30} mins</span>
                    {r.address && <span>📍 {r.address.split(',')[0]}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
