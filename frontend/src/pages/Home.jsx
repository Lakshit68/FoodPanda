import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import RestaurantQuickView from '../components/RestaurantQuickView.jsx'
import { cuisines as cuisinesSample } from '../data/sample.js'

export default function Home() {
  const [q, setQ] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [offers, setOffers] = useState([])
  const [quickId, setQuickId] = useState(null)
  const [showSuggest, setShowSuggest] = useState(false)
  const [favs, setFavs] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetchRestaurants(q)
    fetchOffers()
  }, [q])

  async function fetchRestaurants(query) {
    const { data } = await api.get('/restaurants', { params: { search: query } })
    setRestaurants(data.items || [])
  }

  async function fetchOffers() {
    try {
      const { data } = await api.get('/restaurants/offers')
      setOffers(data || [])
    } catch (err) {
      if (err?.response?.status !== 404) {
        console.warn('Failed to load offers:', err?.message || err)
      }
      setOffers([])
    }
  }

  // Compute offers to display (fallback to top restaurants if no offers)
  const displayOffers = (offers && offers.length > 0)
    ? offers
    : (restaurants || []).slice(0, 8).map(r => ({
        ...r,
        offer: Math.max(10, Math.min(60, Math.round(((4.8 - (r.rating || 4)) * 20) + 20)))
      }))

  function handleCuisineClick(cuisine) {
    setQ(cuisine.name)
  }

  return (
    <>
      {/* Hero Section */}
      <div style={{
        padding: '120px 16px 96px',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470') center/cover`,
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize:60,fontWeight:800,marginBottom:10,letterSpacing:0.2}}>Your next meal, delivered</h1>
        <p style={{fontSize:22,fontWeight:500,marginTop:0,marginBottom:28,opacity:0.95}}>Discover the best food & drinks near you</p>
        <div style={{maxWidth:840,margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',gap:10,background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',padding:8,borderRadius:999,border:'1px solid rgba(255,255,255,0.25)'}}> 
            <input
              value={q}
              onChange={e=>{ setQ(e.target.value); setShowSuggest(true); }}
              onFocus={()=> setShowSuggest(true)}
              onBlur={() => setTimeout(()=>setShowSuggest(false), 150)}
              placeholder="Search for restaurants or cuisines"
              style={{flex:1,padding:'16px 18px',border:'none',borderRadius:999,fontSize:18,background:'rgba(255,255,255,0.9)',color:'#111'}}
            />
            <button onClick={() => { fetchRestaurants(q); setShowSuggest(false); }} className="ff-primary" style={{padding:'16px 28px',fontSize:18,borderRadius:999}}>Search</button>
          </div>
          {showSuggest && q && restaurants.length > 0 && (
            <div style={{position:'absolute',left:0,right:0,top:'100%',marginTop:8,background:'#fff',color:'#111',borderRadius:12,boxShadow:'0 12px 30px rgba(0,0,0,0.15)',overflow:'hidden',zIndex:20}}>
              {restaurants.slice(0,7).map(item => (
                <div
                  key={item._id}
                  onMouseDown={() => {
                    if (item._id) {
                      navigate(`/restaurant/${item._id}/details`, { state: { view: 'ordering' } })
                    } else {
                      setQ(item.name || '')
                      fetchRestaurants(item.name || '')
                    }
                    setShowSuggest(false)
                  }}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',cursor:'pointer'}}
                  className="ff-card"
                >
                  <div style={{width:40,height:40,borderRadius:8,background:`url(${item.image||'https://picsum.photos/80'}) center/cover`}} />
                  <div style={{display:'grid'}}>
                    <span style={{fontWeight:700}}>{item.name}</span>
                    <span style={{fontSize:12,opacity:0.7}}>{(item.cuisine||[]).join(', ')}</span>
                  </div>
                  <div style={{marginLeft:'auto',fontSize:12,opacity:0.7}}>★ {item.rating?.toFixed?.(1) || '0.0'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      

      {!q && displayOffers.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 40%, #ff8050 100%)',
          padding: '40px 16px',
          color: '#fff'
        }}>
          <div style={{maxWidth:1280,margin:'0 auto'}}>
            <div style={{fontWeight:800,fontSize:30,letterSpacing:0.2,margin:'0 0 6px', textAlign: 'center'}}>🔥 Special Offers Just for You! 🔥</div>
            <div style={{opacity:0.95,fontSize:15, textAlign:'center', marginBottom:18}}>Handpicked deals from top-rated restaurants near you</div>
            <div style={{display:'grid',gridAutoFlow:'column',gridAutoColumns:'minmax(320px,1fr)',gap:22,overflowX:'auto',paddingBottom:6}}>
              {displayOffers.map(r => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/restaurant/${r._id}/details`, { state: { view: 'ordering' } })}
                  className="ff-card fade-in"
                  style={{
                    cursor: 'pointer',
                    overflow:'hidden',
                    background: '#fff',
                    color: '#000',
                    borderRadius:16,
                    boxShadow:'0 12px 30px rgba(0,0,0,0.18)'
                  }}
                >
                  <div style={{position:'relative', height:210, background:`url(${r.image||'https://picsum.photos/400?blur=2'}) center/cover`}}>
                    <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.15))'}} />
                    <div style={{position:'absolute', top:12, left:12, background:'#fff', color:'#111', borderRadius:999, padding:'6px 12px', fontWeight:800, fontSize:14}}>
                      {r.offer}% OFF
                    </div>
                    <div style={{position:'absolute', top:12, right:12, background:'rgba(0,0,0,0.65)', color:'#fff', borderRadius:8, padding:'6px 10px', fontSize:14, fontWeight:700}}>
                      ★ {r.rating?.toFixed?.(1) || '0.0'}
                    </div>
                    <div style={{position:'absolute', bottom:12, left:12, color:'#fff'}}>
                      <div style={{fontSize:22, fontWeight:800, lineHeight:1.2}}>{r.name}</div>
                      <div style={{opacity:0.9, fontSize:14}}>Upto ₹{r.offer*3}</div>
                    </div>
                  </div>
                  <div style={{padding:18}}>
                    <div style={{color:'#555',fontSize:14,margin:'2px 0 10px'}}>{(r.cuisine||[]).join(', ')}</div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', fontSize:14}}>
                      <span style={{fontWeight:600}}>🚴 {r.deliveryTimeMins||30} mins</span>
                      <span style={{opacity:0.8}}>₹ {((r.priceLevel||2)*10+15)} for one</span>
                      <span style={{background:'var(--primary)', color:'#fff', borderRadius:999, padding:'8px 12px', fontWeight:700}}>View Deal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!q && (
        <div style={{background: '#fff', padding: '48px 16px'}}>
          <div style={{maxWidth:1280,margin:'0 auto'}}>
            <div style={{fontWeight:800,fontSize:28,margin:'0 0 24px'}}>Popular Cuisines</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:32,marginBottom:32}}>
              {cuisinesSample.map(c => (
                <div key={c.name} onClick={() => handleCuisineClick(c)} className="ff-card fade-in" style={{padding:20,display:'grid',justifyItems:'center',gap:16,cursor:'pointer'}}>
                  <div style={{width:100,height:100,borderRadius:'50%',background:`url(${c.img}) center/cover`}} />
                  <div style={{fontWeight:600,fontSize:18}}>{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Home Delivery / Dining Toggle */}
      {!q && (
        <div style={{background: '#f8f9fa', padding: '32px 16px'}}>
          <div style={{maxWidth:1280,margin:'0 auto',display:'flex',justifyContent:'center'}}>
            <div style={{
              display: 'flex',
              gap: 8,
              background: '#fff',
              padding: 6,
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <button
                onClick={() => {}}
                style={{
                  padding: '12px 32px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Home Delivery
              </button>
              <button
                onClick={() => navigate('/dining')}
                style={{
                  padding: '12px 32px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'transparent',
                  color: '#666',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9ff'
                  e.currentTarget.style.color = '#667eea'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#666'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Dining
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{background: 'var(--bg)', padding: '48px 16px'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div style={{fontWeight:800,fontSize:28,margin:'0 0 24px'}}>
            {q ? `Search Results for "${q}"` : 'Restaurants Near You'}
          </div>
          {restaurants.length > 0 ? (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:32}}>
              {restaurants.map(r => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/restaurant/${r._id}/details`, { state: { view: 'ordering' } })}
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
          ) : <p>No restaurants found.</p>}
        </div>
      </div>
      {quickId && <RestaurantQuickView id={quickId} onClose={()=>setQuickId(null)} />}
    </>
  );
}
