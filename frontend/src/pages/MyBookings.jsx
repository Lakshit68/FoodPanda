import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Calendar, Clock, Users, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { data } = await api.get('/bookings/my')
        setBookings(data)
      } catch (error) {
        console.error('Failed to fetch bookings', error)
      }
    }
    fetchBookings()
  }, [])

  return (
    <div style={{maxWidth:1200,margin:'100px auto 40px',padding:'0 20px'}}>
      {/* Header */}
      <div style={{marginBottom: 48}}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 900,
          margin: 0,
          marginBottom: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          My Bookings
        </h1>
        <p style={{
          fontSize: 18,
          color: '#666',
          margin: 0,
          fontWeight: 500
        }}>
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
        </p>
      </div>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: '#f8f9ff',
          borderRadius: 24,
          border: '2px dashed #e8ecf4'
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#fff'
          }}>
            <Calendar size={40} />
          </div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            margin: '0 0 12px',
            color: '#1a1a1a'
          }}>
            No Bookings Yet
          </h3>
          <p style={{
            fontSize: 16,
            color: '#666',
            margin: 0,
            lineHeight: 1.6
          }}>
            You haven't made any restaurant bookings yet.<br />
            Start exploring and book a table at your favorite restaurant!
          </p>
        </div>
      ) : (
        <div style={{display:'grid',gap:24}}>
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className="ff-card" 
              style={{
                display:'grid',
                gridTemplateColumns:'120px 1fr',
                gap:24,
                alignItems:'center',
                padding:32,
                borderRadius: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                background: '#fff',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
              }}
            >
              {/* Restaurant Image */}
              <div style={{
                width:120,
                height:120,
                borderRadius: 16,
                background: `url(${booking.restaurant?.image || 'https://picsum.photos/200'}) center/cover`,
                position: 'relative',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
              }} />
              
              {/* Booking Details */}
              <div style={{flex: 1}}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16
                }}>
                  <div>
                    <h3 style={{
                      fontSize: 24,
                      fontWeight: 800,
                      margin: 0,
                      marginBottom: 8,
                      color: '#1a1a1a',
                      lineHeight: 1.2
                    }}>
                      {booking.restaurant?.name || 'Restaurant'}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#666',
                      fontSize: 14,
                      fontWeight: 500
                    }}>
                      <MapPin size={16} />
                      {booking.restaurant?.address || 'Restaurant Address'}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 700,
                    background: booking.status === 'CONFIRMED' 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#fff',
                    boxShadow: booking.status === 'CONFIRMED'
                      ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                      : '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}>
                    {booking.status === 'CONFIRMED' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {booking.status}
                  </div>
                </div>
                
                {/* Booking Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 16
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    background: '#f8f9ff',
                    borderRadius: 12,
                    border: '1px solid #e8ecf4'
                  }}>
                    <Calendar size={18} style={{color: '#667eea'}} />
                    <div>
                      <div style={{fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 2}}>Date</div>
                      <div style={{fontSize: 15, fontWeight: 700, color: '#1a1a1a'}}>
                        {new Date(booking.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    background: '#f8f9ff',
                    borderRadius: 12,
                    border: '1px solid #e8ecf4'
                  }}>
                    <Clock size={18} style={{color: '#667eea'}} />
                    <div>
                      <div style={{fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 2}}>Time</div>
                      <div style={{fontSize: 15, fontWeight: 700, color: '#1a1a1a'}}>
                        {booking.time}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: 12,
                    background: '#f8f9ff',
                    borderRadius: 12,
                    border: '1px solid #e8ecf4'
                  }}>
                    <Users size={18} style={{color: '#667eea'}} />
                    <div>
                      <div style={{fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 2}}>Guests</div>
                      <div style={{fontSize: 15, fontWeight: 700, color: '#1a1a1a'}}>
                        {booking.guests} {booking.guests === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
