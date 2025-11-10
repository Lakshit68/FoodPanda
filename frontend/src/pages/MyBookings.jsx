import { useEffect, useState } from 'react'
import { api } from '../lib/api'

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
    <div style={{maxWidth:960,margin:'24px auto',padding:'0 16px'}}>
      <h1 style={{fontSize:36,fontWeight:800,marginBottom:24}}>My Bookings</h1>
      {bookings.length === 0 && <p>You have no bookings.</p>}
      <div style={{display:'grid',gap:16}}>
        {bookings.map(booking => (
          <div key={booking._id} className="ff-card" style={{display:'grid',gridTemplateColumns:'100px 1fr',gap:16,alignItems:'center',padding:16}}>
            <div style={{width:100,height:100,borderRadius:12,background:`url(${booking.restaurant.image}) center/cover`}} />
            <div>
              <div style={{fontWeight:700,fontSize:20}}>{booking.restaurant.name}</div>
              <div style={{color:'#666',margin:'8px 0'}}>
                <span>{new Date(booking.date).toLocaleDateString()}</span> at <span>{booking.time}</span>
              </div>
              <div style={{fontWeight:600}}>Guests: {booking.guests}</div>
              <div style={{marginTop:8,fontWeight:700,color:booking.status === 'CONFIRMED' ? 'var(--accent)' : 'var(--brand)'}}>{booking.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
