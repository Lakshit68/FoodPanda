import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useCart } from '../state/CartContext.jsx'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import BookingModal from '../components/BookingModal.jsx'

function groupByCategory(menu) {
  return menu.reduce((acc, item) => {
    const { category } = item
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})
}

// Category-based fallback images to ensure correct food visuals
function getFallbackImage(item, category) {
  const name = (item?.name || '').toLowerCase()
  const cat = (category || item?.category || '').toLowerCase()
  if (cat.includes('salad') || name.includes('salad')) return 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b5?q=80&w=800'
  if (cat.includes('pizza') || name.includes('pizza')) return 'https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=800'
  if (cat.includes('burger') || name.includes('burger')) return 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800'
  if (cat.includes('pasta') || name.includes('pasta')) return 'https://images.unsplash.com/photo-1521389508051-d7ffb5dc8bbf?q=80&w=800'
  if (cat.includes('dessert') || name.includes('cake') || name.includes('ice')) return 'https://images.unsplash.com/photo-1505253216365-9a30b46f7e2b?q=80&w=800'
  if (cat.includes('drink') || name.includes('juice') || name.includes('coffee')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800'
  if (cat.includes('taco') || name.includes('taco')) return 'https://images.unsplash.com/photo-1601924569208-6a3e1b1a79a5?q=80&w=800'
  if (cat.includes('sushi') || name.includes('sushi')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800'
  return 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800'
}

export default function RestaurantDetails(){
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const navigate = useNavigate()
  const { add, items } = useCart()
  const location = useLocation()

  const view = location.state?.view || 'ordering' // 'ordering' or 'dining'

  const [activeTab, setActiveTab] = useState(view === 'ordering' ? 'menu' : 'about')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  async function handleConfirmBooking(bookingDetails) {
    try {
      // Ensure payload matches backend schema { restaurant, date, time, guests }
      const payload = {
        restaurant: bookingDetails.restaurantId || bookingDetails.restaurant || restaurant?._id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        guests: Number(bookingDetails.guests || 1)
      }
      await api.post('/bookings', payload)
      setIsBookingModalOpen(false)
      alert('Your table has been booked successfully!')
    } catch (error) {
      console.error('Failed to book table', error)
      if (error?.response?.status === 401) {
        alert('Please sign in to book a table.')
        navigate('/auth')
        return
      }
      alert('Failed to book table. Please try again.')
    }
  }

  useEffect(()=>{ (async ()=>{
    const [r, m, rev] = await Promise.all([
      api.get(`/restaurants/${id}`),
      api.get(`/restaurants/${id}/menu`),
      api.get(`/reviews/${id}`)
    ])
    setRestaurant(r.data)
    setMenu(m.data)
    setReviews(rev.data)
  })() }, [id])

  const menuByCategory = groupByCategory(menu)

  return (
    <div style={{maxWidth:1280,margin:'0 auto',padding:'0 16px'}}>
      {restaurant && (
        <div style={{padding: '24px 0'}}>
          <div className="ff-card" style={{
            padding:24,
            background:'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
            boxShadow:'0 10px 30px rgba(0,0,0,0.06)'
          }}>
            <div style={{display:'grid',gridTemplateColumns:'120px 1fr auto',gap:24,alignItems:'center'}}>
              <div style={{width:120,height:120,borderRadius:16,background:`url(${restaurant.image||'https://picsum.photos/200'}) center/cover`, boxShadow:'0 8px 20px rgba(0,0,0,0.15)'}} />
              <div>
                <h1 style={{fontSize:40,fontWeight:800,margin:0}}>{restaurant.name}</h1>
                <div style={{fontSize:16,color:'#666',marginTop:6}}>{(restaurant.cuisine||[]).join(', ')}</div>
                <div style={{fontSize:15,color:'#777',marginTop:2}}>{restaurant.address}</div>
                <div style={{display:'flex',gap:12,alignItems:'center',marginTop:10}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,fontSize:16,fontWeight:700,background:'#fff',borderRadius:999,padding:'6px 10px',boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>
                    <span style={{color:'var(--accent)'}}>★</span>
                    <span>{restaurant.rating?.toFixed?.(1)||'0.0'}</span>
                  </div>
                  <div style={{opacity:0.6}}>•</div>
                  <div style={{fontSize:15,background:'#fff',borderRadius:999,padding:'6px 10px',boxShadow:'0 2px 10px rgba(0,0,0,0.06)'}}>⏱ {restaurant.deliveryTimeMins} mins</div>
                </div>
              </div>
              {view === 'dining' && (
                <div>
                  <button onClick={() => setIsBookingModalOpen(true)}
                    className="ff-primary"
                    style={{
                      padding:'12px 20px',
                      fontSize:18,
                      borderRadius:12,
                      boxShadow:'0 10px 20px rgba(255,75,43,0.35)'
                    }}>
                    Book a Table
                  </button>
                  <div style={{fontSize:12,opacity:0.7,marginTop:6,textAlign:'center'}}>Real-time confirmation</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isBookingModalOpen && restaurant && (
        <BookingModal 
          restaurant={restaurant} 
          onClose={() => setIsBookingModalOpen(false)} 
          onConfirm={handleConfirmBooking} 
        />
      )}

      <div style={{marginBottom:24}}>
        <nav style={{display:'flex',gap:12,background:'rgba(0,0,0,0.03)',padding:6,borderRadius:999,width:'fit-content'}}>
          {view === 'ordering' && (
            <button onClick={()=>setActiveTab('menu')} style={{
              padding:'10px 16px',
              border:'none',
              borderRadius:999,
              background: activeTab==='menu'?'#fff':'transparent',
              boxShadow: activeTab==='menu'?'0 6px 14px rgba(0,0,0,0.08)':'none',
              color: activeTab==='menu'?'var(--brand)':'#444',
              fontSize:16,
              fontWeight:700,
              transition:'all .2s ease'
            }}>Menu</button>
          )}
          <button onClick={()=>setActiveTab('about')} style={{
            padding:'10px 16px',
            border:'none',
            borderRadius:999,
            background: activeTab==='about'?'#fff':'transparent',
            boxShadow: activeTab==='about'?'0 6px 14px rgba(0,0,0,0.08)':'none',
            color: activeTab==='about'?'var(--brand)':'#444',
            fontSize:16,
            fontWeight:700,
            transition:'all .2s ease'
          }}>About</button>
          <button onClick={()=>setActiveTab('reviews')} style={{
            padding:'10px 16px',
            border:'none',
            borderRadius:999,
            background: activeTab==='reviews'?'#fff':'transparent',
            boxShadow: activeTab==='reviews'?'0 6px 14px rgba(0,0,0,0.08)':'none',
            color: activeTab==='reviews'?'var(--brand)':'#444',
            fontSize:16,
            fontWeight:700,
            transition:'all .2s ease'
          }}>Reviews</button>
        </nav>
      </div>

      {activeTab === 'menu' && view === 'ordering' && (
        <div>
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} style={{marginBottom:32}}>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>{category}</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
                {items.map(item => (
                  <div key={item._id} className="ff-card" style={{overflow:'hidden', position:'relative', borderRadius:16, transition:'transform .15s ease, box-shadow .15s ease'}}>
                    {item.isSpecial && <div className="ff-badge" style={{position:'absolute',top:12,left:12,background:'var(--brand)',color:'#fff'}}>Special</div>}
                    <img
                      src={item.image || getFallbackImage(item, category)}
                      alt={item.name}
                      loading="lazy"
                      style={{width:'100%',height:160,objectFit:'cover',display:'block'}}
                      onError={(e)=>{ e.currentTarget.src = getFallbackImage(item, category) }}
                    />
                    <div style={{padding:16}}>
                      <div style={{fontWeight:700,fontSize:18}}>{item.name}</div>
                      <div style={{color:'#666',fontSize:14,margin:'8px 0'}}>{item.description}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                        <div style={{fontSize:16,fontWeight:700}}>₹{item.price}</div>
                        <button aria-label="Add to cart" onClick={()=>add(item)} className="ff-primary" style={{padding:'8px 12px',borderRadius:999}}>+
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'about' && restaurant && (
        <div className="ff-card" style={{padding:24}}>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>About {restaurant.name}</h2>
          <p style={{fontSize:16,lineHeight:1.6}}>{restaurant.about}</p>
          <div style={{marginTop:24}}>
            <h3 style={{fontSize:20,fontWeight:700,marginBottom:12}}>Contact Information</h3>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Phone:</strong> {restaurant.contact?.phone}</p>
            <p><strong>Email:</strong> {restaurant.contact?.email}</p>
          </div>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="ff-card" style={{padding:24}}>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>Reviews</h2>
          {reviews.map(review => (
            <div key={review._id} style={{borderBottom:'1px solid var(--border)',padding:'16px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontWeight:600}}>{review.user?.fullName || 'Anonymous'}</div>
                <div style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{color:'var(--accent)'}}>★</span>
                  <span>{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <p style={{marginTop:8,color:'#666'}}>{review.comment}</p>
            </div>
          ))}
          {reviews.length === 0 && <p>No reviews yet.</p>}
        </div>
      )}

      {view === 'ordering' && items.length > 0 && (
        <div style={{position:'fixed',bottom:'calc(72px + env(safe-area-inset-bottom))',left:'50%',transform:'translateX(-50%)',zIndex:1000}}>
          <button onClick={() => navigate('/cart')} className="ff-primary" style={{
            padding:'12px 22px',
            fontSize:16,
            borderRadius:999,
            boxShadow:'0 10px 24px rgba(0,0,0,0.18)',
            display:'inline-flex',
            alignItems:'center',
            gap:10
          }}>
            <span>🧾</span> Get Your Bill
          </button>
        </div>
      )}

    </div>
  )
}