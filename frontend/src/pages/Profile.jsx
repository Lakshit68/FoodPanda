import { useAuth } from '../state/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Profile(){
  const { user, logout, togglePremium } = useAuth()
  return (
    <div style={{maxWidth:720,margin:'24px auto',padding:'0 16px'}}>
      <h2 style={{marginBottom:12}}>My Account</h2>
      <div className="ff-card" style={{padding:16,marginBottom:12}}>
        <div style={{fontWeight:700}}>User Info</div>
        <div style={{color:'#666',marginTop:6}}>
          <div>{user?.fullName}</div>
          <div>{user?.email}</div>
        </div>
      </div>
      <div className="ff-card" style={{padding:16,marginBottom:12}}>
        <div style={{fontWeight:700}}>Premium Membership</div>
        <div style={{color:'#666',marginTop:6}}>
          {user?.isPremium ? (
            <div>
              <p>You are a premium member!</p>
              <button onClick={togglePremium} className="ff-outline" style={{padding:'10px 12px'}}>Cancel Membership</button>
            </div>
          ) : (
            <div>
              <p>Become a premium member to get free delivery and other benefits!</p>
              <button onClick={togglePremium} className="ff-primary" style={{padding:'10px 12px'}}>Become a Premium Member</button>
            </div>
          )}
        </div>
      </div>
      <Link to="/my-bookings" className="ff-card" style={{display:'block',padding:16,marginBottom:12,textDecoration:'none'}}>
        <div style={{fontWeight:700}}>My Bookings</div>
        <div style={{color:'#666',marginTop:6}}>View your table bookings</div>
      </Link>
      <div className="ff-card" style={{padding:16,marginBottom:12}}>
        <div style={{fontWeight:700}}>Addresses</div>
        <div style={{color:'#666',marginTop:6}}>Manage delivery addresses</div>
      </div>
      <div className="ff-card" style={{padding:16,marginBottom:12}}>
        <div style={{fontWeight:700}}>Payment Methods</div>
        <div style={{color:'#666',marginTop:6}}>Manage cards and wallets</div>
      </div>
      <button onClick={logout} className="ff-outline" style={{padding:'10px 12px'}}>Log Out</button>
    </div>
  )
}




