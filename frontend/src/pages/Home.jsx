import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import RestaurantQuickView from '../components/RestaurantQuickView.jsx'
import { cuisines as cuisinesSample } from '../data/sample.js'
import OfferAlert from '../components/OfferAlert.jsx'

export default function Home() {
  const [q, setQ] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [offers, setOffers] = useState([])
  const [quickId, setQuickId] = useState(null)
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
    const { data } = await api.get('/restaurants/offers')
    setOffers(data || [])
  }

  function handleCuisineClick(cuisine) {
    setQ(cuisine.name)
  }

  return (
    <>
      {/* Hero Section */}
      <div style={{
        padding: '64px 16px',
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470') center/cover`,
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{fontSize:56,fontWeight:800,marginBottom:8}}>Your next meal, delivered</h1>
        <p style={{fontSize:22,fontWeight:500,marginTop:0,marginBottom:32}}>Discover the best food & drinks near you</p>
        <div style={{maxWidth:700,margin:'0 auto',display:'flex',gap:8}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for restaurants or cuisines" style={{flex:1,padding:16,border:'none',borderRadius:12,fontSize:18}} />
          <button onClick={() => fetchRestaurants(q)} className="ff-primary" style={{padding:'16px 28px',fontSize:18}}>Search</button>
        </div>
      </div>

      <OfferAlert />

      {offers.length > 0 && (
        <div style={{background: 'linear-gradient(to right, #ff416c, #ff4b2b)', padding: '48px 16px', color: '#fff'}}>
          <div style={{maxWidth:1280,margin:'0 auto'}}>
            <div style={{fontWeight:800,fontSize:32,margin:'0 0 24px', textAlign: 'center'}}>🔥 Special Offers Just for You! 🔥</div>
            <div style={{display:'grid',gridAutoFlow:'column',gridAutoColumns:'minmax(320px,1fr)',gap:32,overflowX:'auto',paddingBottom:16}}>
              {offers.map(r => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/restaurant/${r._id}/details`, { state: { view: 'ordering' } })}
                  className="ff-card fade-in"
                  style={{cursor: 'pointer', overflow:'hidden', background: '#fff', color: '#000'}}
                >
                  <div style={{height:200,background:`url(${r.image||'https://picsum.photos/400?blur=2'}) center/cover`}}>
                    <div style={{padding:12,background:'rgba(0,0,0,0.4)',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
                      <div style={{color:'#fff',fontSize:24,fontWeight:800}}>{r.offer}% OFF</div>
                      <div style={{color:'#fff',fontSize:16,fontWeight:600}}>UPTO ₹{r.offer*3}</div>
                    </div>
                  </div>
                  <div style={{padding:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontWeight:700,fontSize:20}}>{r.name}</div>
                      <div style={{background:'var(--primary)',color:'#fff',borderRadius:8,padding:'4px 10px',fontSize:14,fontWeight:700}}>★ {r.rating?.toFixed?.(1) || '0.0'}</div>
                    </div>
                    <div style={{color:'#666',fontSize:15,margin:'6px 0'}}>{(r.cuisine||[]).join(', ')}</div>
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
                  style={{cursor: 'pointer', overflow:'hidden'}}
                >
                  <div style={{height:200,background:`url(${r.image||'https://picsum.photos/400?blur=2'}) center/cover`}} />
                  <div style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.6)',color:'#fff',borderRadius:8,padding:'4px 10px',fontSize:14,fontWeight:700}}>★ {r.rating?.toFixed?.(1) || '0.0'}</div>
                  <div style={{padding:20}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontWeight:700,fontSize:20}}>{r.name}</div>
                    </div>
                    <div style={{color:'#666',fontSize:15,margin:'6px 0'}}>{(r.cuisine||[]).join(', ')}</div>
                    <div style={{marginTop:16,fontSize:15,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontWeight:500}}>🚴 {r.deliveryTimeMins||30} mins</span>
                      <span style={{fontWeight:500}}>₹ {((r.priceLevel||2)*10+15)} for one</span>
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
