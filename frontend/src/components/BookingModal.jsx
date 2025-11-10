import { useState } from 'react'

export default function BookingModal({ restaurant, onClose, onConfirm }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('19:00')
  const [guests, setGuests] = useState(2)

  function handleConfirm() {
    onConfirm({ restaurantId: restaurant._id, date, time, guests })
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:100}} onClick={onClose}>
      <div className="ff-card" style={{width:'min(400px, 90vw)',padding:24}} onClick={e => e.stopPropagation()}>
        <h2 style={{margin:'0 0 16px',fontSize:24,fontWeight:700}}>Book a Table at {restaurant.name}</h2>
        <div style={{display:'grid',gap:16}}>
          <div>
            <label htmlFor="date" style={{display:'block',marginBottom:4,fontWeight:600}}>Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
          </div>
          <div>
            <label htmlFor="time" style={{display:'block',marginBottom:4,fontWeight:600}}>Time</label>
            <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
          </div>
          <div>
            <label htmlFor="guests" style={{display:'block',marginBottom:4,fontWeight:600}}>Guests</label>
            <input type="number" id="guests" value={guests} onChange={e => setGuests(e.target.value)} min="1" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid var(--border)'}} />
          </div>
        </div>
        <div style={{display:'flex',gap:12,marginTop:24}}>
          <button onClick={onClose} className="ff-outline" style={{flex:1,padding:'10px 12px'}}>Cancel</button>
          <button onClick={handleConfirm} className="ff-primary" style={{flex:1,padding:'10px 12px'}}>Confirm Booking</button>
        </div>
      </div>
    </div>
  )
}
