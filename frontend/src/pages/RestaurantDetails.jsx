import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { useCart } from '../state/CartContext.jsx'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import BookingModal from '../components/BookingModal.jsx'

// Group menu items by category
function groupByCategory(menu) {
  return menu.reduce((acc, item) => {
    const { category } = item
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {})
}

// Fallback image logic
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

export default function RestaurantDetails() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [reviews, setReviews] = useState([])
  const { add, items } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const view = location.state?.view || 'ordering'
  const [activeTab, setActiveTab] = useState(view === 'ordering' ? 'menu' : 'about')
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  async function handleConfirmBooking(bookingDetails) {
    try {
      const payload = {
        restaurant: bookingDetails.restaurantId || restaurant?._id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        guests: Number(bookingDetails.guests || 1)
      }
      await api.post('/bookings', payload)
      setIsBookingModalOpen(false)
      alert('Your table has been booked successfully!')
    } catch (error) {
      if (error?.response?.status === 401) {
        alert('Please sign in to book a table.')
        navigate('/auth')
      } else {
        alert('Failed to book table. Please try again.')
      }
    }
  }

  useEffect(() => {
    (async () => {
      const [r, m, rev] = await Promise.all([
        api.get(`/restaurants/${id}`),
        api.get(`/restaurants/${id}/menu`),
        api.get(`/reviews/${id}`)
      ])
      setRestaurant(r.data)
      setMenu(m.data)
      setReviews(rev.data)
    })()
  }, [id])

  const menuByCategory = groupByCategory(menu)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf4 50%, #f0f4ff 100%)',
      padding: '80px 0 40px'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
      
      {/* Header Section */}
      {restaurant && (
        <div style={{ padding: '32px 0 24px' }}>
          <div className="ff-card"
            style={{
              padding: 32,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 20px 60px rgba(102, 126, 234, 0.25)',
              borderRadius: 24,
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
            {/* Decorative background pattern */}
            <div style={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }} />
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr auto',
              gap: 28,
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              
              {/* Restaurant Image */}
              <div style={{
                width: 140,
                height: 140,
                borderRadius: 20,
                background: `url(${restaurant.image || 'https://picsum.photos/200'}) center/cover`,
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                border: '4px solid rgba(255,255,255,0.3)'
              }} />

              {/* Restaurant Info */}
              <div>
                <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, color: '#fff', letterSpacing: '-0.5px' }}>
                  {restaurant.name}
                </h1>
                <div style={{ color: 'rgba(255,255,255,0.9)', marginTop: 8, fontSize: 16, fontWeight: 500 }}>
                  {(restaurant.cuisine || []).join(' • ')}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: 6, fontSize: 14 }}>
                  📍 {restaurant.address}
                </div>

                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 15,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    <span style={{ color: '#ffd700', fontSize: 18 }}>★</span>
                    <span>{restaurant.rating?.toFixed?.(1) || '0.0'}</span>
                    <span style={{ opacity: 0.8, fontWeight: 400, marginLeft: 4 }}>
                      ({restaurant.ratingCount || 0} reviews)
                    </span>
                  </div>

                  <div style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}>
                    ⏱ {restaurant.deliveryTimeMins} mins
                  </div>

                  {restaurant.isOpen !== false && (
                    <div style={{
                      padding: '8px 16px',
                      background: 'rgba(76, 175, 80, 0.3)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      border: '1px solid rgba(76, 175, 80, 0.5)'
                    }}>
                      🟢 Open Now
                    </div>
                  )}
                </div>
              </div>

              {/* Book Table Button */}
              {view === 'dining' && (
                <div>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    style={{
                      padding: '14px 28px',
                      fontSize: 16,
                      fontWeight: 700,
                      borderRadius: 14,
                      background: '#fff',
                      color: '#667eea',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.25)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                    📅 Book a Table
                  </button>
                  <div style={{ fontSize: 12, opacity: 0.9, marginTop: 8, textAlign: 'center' }}>
                    Instant confirmation
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && restaurant && (
        <BookingModal
          restaurant={restaurant}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Tabs */}
      <div style={{ marginBottom: 32 }}>
        <nav style={{
          display: 'flex',
          gap: 8,
          background: '#f8f9fa',
          padding: 8,
          borderRadius: 16,
          width: 'fit-content',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
        }}>
          {view === 'ordering' && (
            <button
              onClick={() => setActiveTab('menu')}
              style={{
                padding: '12px 24px',
                borderRadius: 12,
                background: activeTab === 'menu' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'menu' ? '#fff' : '#666',
                boxShadow: activeTab === 'menu' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              🍽️ Menu
            </button>
          )}
          <button
            onClick={() => setActiveTab('about')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: activeTab === 'about' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'about' ? '#fff' : '#666',
              boxShadow: activeTab === 'about' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            ℹ️ About
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: activeTab === 'reviews' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'reviews' ? '#fff' : '#666',
              boxShadow: activeTab === 'reviews' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
            ⭐ Reviews ({reviews.length})
          </button>
        </nav>
      </div>

      {/* MENU TAB */}
      {activeTab === 'menu' && view === 'ordering' && (
        <div>
          {Object.entries(menuByCategory).map(([category, items]) => (
            <div key={category} style={{ marginBottom: 48 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 24 
              }}>
                <h2 style={{ 
                  fontSize: 32, 
                  fontWeight: 900, 
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {category}
                </h2>
                <div style={{
                  flex: 1,
                  height: 2,
                  background: 'linear-gradient(to right, #667eea, transparent)',
                  borderRadius: 2
                }} />
                <div style={{
                  padding: '4px 12px',
                  background: '#f0f4ff',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#667eea'
                }}>
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 28
                }}
              >
                {items.map(item => (
                  <div
                    key={item._id}
                    className="ff-card"
                    style={{
                      borderRadius: 20,
                      overflow: 'hidden',
                      background: '#fff',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0,0,0,0.04)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      {item.isSpecial && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                            color: '#fff',
                            padding: '8px 16px',
                            borderRadius: 12,
                            fontWeight: 700,
                            fontSize: 12,
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(238, 90, 111, 0.4)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                          ⭐ Special
                        </div>
                      )}

                      <img
                        src={item.image || getFallbackImage(item, category)}
                        alt={item.name}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: 220,
                          objectFit: 'cover',
                          display: 'block',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={e => (e.currentTarget.src = getFallbackImage(item, category))}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      />
                    </div>

                    <div style={{ padding: 24 }}>
                      <div style={{ 
                        fontWeight: 800, 
                        fontSize: 22,
                        marginBottom: 8,
                        color: '#1a1a1a',
                        lineHeight: 1.3
                      }}>
                        {item.name}
                      </div>

                      <div
                        style={{
                          color: '#666',
                          marginTop: 4,
                          fontSize: 15,
                          lineHeight: 1.6,
                          minHeight: 48,
                          marginBottom: 16
                        }}
                      >
                        {item.description}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: 16,
                          borderTop: '1px solid #f0f0f0'
                        }}
                      >
                        <div style={{ 
                          fontSize: 24, 
                          fontWeight: 900,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          ₹{item.price}
                        </div>

                        <button
                          onClick={() => add(item)}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 0,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)'
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.5)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)'
                          }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* View Cart Button - Below Menu */}
          {items.length > 0 && (
            <div style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: 40
            }}>
              <button
                onClick={() => navigate('/cart')}
                style={{
                  padding: '16px 48px',
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none',
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 16px 50px rgba(102, 126, 234, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)'
                }}>
                🧾 View Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
              </button>
            </div>
          )}
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && restaurant && (
        <div style={{ display: 'grid', gap: 24 }}>
          <div className="ff-card" style={{ 
            padding: 32,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <h2 style={{ 
              fontSize: 32, 
              fontWeight: 900,
              marginBottom: 20,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              About {restaurant.name}
            </h2>
            <p style={{ 
              lineHeight: 1.8, 
              fontSize: 16,
              color: '#444',
              marginBottom: 0
            }}>
              {restaurant.about || 'Experience the finest culinary delights at ' + restaurant.name + '. We are committed to serving you the best quality food with exceptional service.'}
            </p>
          </div>

          <div className="ff-card" style={{ 
            padding: 32,
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ 
              fontWeight: 800, 
              fontSize: 24,
              marginBottom: 24,
              color: '#1a1a1a'
            }}>
              📞 Contact Information
            </h3>
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: 16,
                padding: 20,
                background: '#f8f9ff',
                borderRadius: 16
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  📍
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>Address</div>
                  <div style={{ color: '#666', fontSize: 15 }}>{restaurant.address}</div>
                </div>
              </div>

              {restaurant.contact?.phone && (
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 16,
                  padding: 20,
                  background: '#f8f9ff',
                  borderRadius: 16
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}>
                    📞
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>Phone</div>
                    <div style={{ color: '#666', fontSize: 15 }}>{restaurant.contact.phone}</div>
                  </div>
                </div>
              )}

              {restaurant.contact?.email && (
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 16,
                  padding: 20,
                  background: '#f8f9ff',
                  borderRadius: 16
                }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24
                  }}>
                    ✉️
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>Email</div>
                    <div style={{ color: '#666', fontSize: 15 }}>{restaurant.contact.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div>
          {reviews.length === 0 ? (
            <div className="ff-card" style={{ 
              padding: 48,
              textAlign: 'center',
              borderRadius: 24,
              background: '#f8f9ff'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>
                No reviews yet
              </h3>
              <p style={{ color: '#666' }}>
                Be the first to share your experience!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 20 }}>
              {reviews.map((r, index) => (
                <div 
                  key={r._id} 
                  className="ff-card" 
                  style={{ 
                    padding: 28,
                    borderRadius: 20,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.12)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: 12
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18
                      }}>
                        {(r.user?.fullName || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a' }}>
                          {r.user?.fullName || 'Anonymous'}
                        </div>
                        <div style={{ color: '#999', fontSize: 13, marginTop: 2 }}>
                          {new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #fff5e6, #ffe8cc)',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 15
                    }}>
                      <span style={{ color: '#ff9800', fontSize: 18 }}>★</span>
                      <span style={{ color: '#ff6b00' }}>{r.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p style={{ 
                    color: '#444', 
                    marginTop: 8,
                    lineHeight: 1.7,
                    fontSize: 15
                  }}>
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      </div>
    </div>
  )
}