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
      await api.post('/bookings', bookingDetails)
      setIsBookingModalOpen(false)
      alert('Your table has been booked successfully!')
    } catch (error) {
      console.error('Failed to book table', error)
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
          <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:24,alignItems:'center'}}>
            <div style={{width:120,height:120,borderRadius:16,background:`url(${restaurant.image||'https://picsum.photos/200'}) center/cover`}} />
            <div>
              <h1 style={{fontSize:36,fontWeight:800,margin:0}}>{restaurant.name}</h1>
              <div style={{fontSize:16,color:'#666',margin:'8px 0'}}>{(restaurant.cuisine||[]).join(', ')}</div>
              <div style={{fontSize:16,color:'#666'}}>{restaurant.address}</div>
              <div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}>
                <div style={{display:'flex',alignItems:'center',gap:4,fontSize:16,fontWeight:600}}>
                  <span style={{color:'var(--accent)'}}>★</span>
                  <span>{restaurant.rating?.toFixed?.(1)||'0.0'}</span>
                </div>
                <span style={{color:'#999'}}>•</span>
                <div style={{fontSize:16}}>{restaurant.deliveryTimeMins} mins</div>
                {view === 'dining' && (
                  <button onClick={() => setIsBookingModalOpen(true)} className="ff-primary" style={{marginLeft:'auto',padding:'8px 16px'}}>Book a Table</button>
                )}
              </div>
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

      <div style={{borderBottom:'1px solid var(--border)',marginBottom:24}}>
        <nav style={{display:'flex',gap:24}}>
          {view === 'ordering' && (
            <button onClick={()=>setActiveTab('menu')} style={{padding:'12px 0',border:'none',background:'none',fontSize:18,fontWeight:600,color:activeTab==='menu'?'var(--brand)':'var(--text)',borderBottom:activeTab==='menu'?'2px solid var(--brand)':'2px solid transparent'}}>Menu</button>
          )}
          <button onClick={()=>setActiveTab('about')} style={{padding:'12px 0',border:'none',background:'none',fontSize:18,fontWeight:600,color:activeTab==='about'?'var(--brand)':'var(--text)',borderBottom:activeTab==='about'?'2px solid var(--brand)':'2px solid transparent'}}>About</button>
          <button onClick={()=>setActiveTab('reviews')} style={{padding:'12px 0',border:'none',background:'none',fontSize:18,fontWeight:600,color:activeTab==='reviews'?'var(--brand)':'var(--text)',borderBottom:activeTab==='reviews'?'2px solid var(--brand)':'2px solid transparent'}}>Reviews ({reviews.length})</button>
        </nav>
      </div>

      {activeTab === 'menu' && view === 'ordering' && (
        <div>
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} style={{marginBottom:32}}>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>{category}</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
                {items.map(item => (
                  <div key={item._id} className="ff-card" style={{overflow:'hidden', position:'relative'}}>
                    {item.isSpecial && <div className="ff-badge" style={{position:'absolute',top:12,left:12,background:'var(--brand)',color:'#fff'}}>Special</div>}
                    <div style={{height:140,background:`url(${item.image||'https://picsum.photos/400?food'}) center/cover`}} />
                    <div style={{padding:16}}>
                      <div style={{fontWeight:600,fontSize:18}}>{item.name}</div>
                      <div style={{color:'#666',fontSize:14,margin:'8px 0'}}>{item.description}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                        <div style={{fontSize:16,fontWeight:600}}>₹{item.price}</div>
                        <button onClick={()=>add(item)} className="ff-primary" style={{padding:'8px 12px'}}>Add</button>
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
        <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',zIndex:100}}>
          <button onClick={() => navigate('/cart')} className="ff-primary" style={{padding:'12px 24px',fontSize:18,borderRadius:999}}>
            Get Your Bill
          </button>
        </div>
      )}

    </div>
  )
}