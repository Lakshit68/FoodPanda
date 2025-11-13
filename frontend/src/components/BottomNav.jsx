import { Link, useLocation } from 'react-router-dom'

function Icon({ name, active }){
  const color = active? 'var(--brand)' : '#888'
  const fill = active? 'var(--brand)' : 'none'
  if (name==='home') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill}><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  )
  if (name==='search') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.6"/><path d="m20 20-3.5-3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>
  )
  if (name==='orders') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill}><path d="M6 3h12v4H6zM4 7h16v14H4z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/></svg>
  )
  if (name==='profile') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={fill}><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.6"/><path d="M4 21a8 8 0 0 1 16 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>
  )
  return null
}

export default function BottomNav(){
  const loc = useLocation()
  const items = [
    { to:'/', label:'Home', icon:'home' },
    { to:'/dining', label:'Dining', icon:'search' },
    { to:'/orders', label:'Orders', icon:'orders' },
    { to:'/profile', label:'Profile', icon:'profile' },
  ]
  return (
    <nav style={{
      position:'sticky',
      bottom:0,
      background:'linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,0.7))',
      backdropFilter:'saturate(180%) blur(10px)',
      WebkitBackdropFilter:'saturate(180%) blur(10px)',
      borderTop:'1px solid rgba(255,255,255,0.6)',
      display:'grid',
      gridTemplateColumns:'repeat(4,1fr)',
      padding:'8px 10px calc(8px + env(safe-area-inset-bottom))',
      boxShadow:'0 -10px 24px rgba(0,0,0,0.08)',
      zIndex:50
    }}>
      {items.map(i => {
        const active = loc.pathname===i.to || (i.to!=='/' && loc.pathname.startsWith(i.to))
        return (
          <Link key={i.to} to={i.to} style={{textDecoration:'none',color:active?'var(--brand)':'#666',display:'grid',placeItems:'center',padding:'6px 4px',position:'relative'}}>
            <Icon name={i.icon} active={active} />
            <div style={{fontSize:12,marginTop:2}}>{i.label}</div>
            {active && <div style={{position:'absolute',bottom:2,width:20,height:3,background:'var(--brand)',borderRadius:999}} />}
          </Link>
        )
      })}
    </nav>
  )
}




