import { useNavigate } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  if (!restaurant) return null;

  const {
    _id,
    name,
    image,
    cuisine,
    rating,
    deliveryTimeMins,
    priceLevel,
    address,
  } = restaurant;

  const priceForOne = ((priceLevel || 2) * 10 + 15);

  return (
    <div
      onClick={() => navigate(`/restaurant/${_id}`, { state: { view: 'ordering' } })}
      className="ff-card fade-in"
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 16,
        boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
        transition: 'transform .15s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 200,
          background: `url(${image || 'https://picsum.photos/400?blur=2'}) center/cover`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          ★ {rating?.toFixed?.(1) || '0.0'}
        </div>
      </div>
      <div style={{ padding: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 20 }}>{name}</div>
          <div style={{ opacity: 0.8, fontSize: 14 }}>₹ {priceForOne} for one</div>
        </div>
        <div style={{ color: '#666', fontSize: 14, margin: '6px 0' }}>
          {(cuisine || []).join(', ')}
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            fontSize: 13,
            marginTop: 8,
            color: '#444',
          }}
        >
          <span>⏱ {deliveryTimeMins || 30} mins</span>
          {address && <span>📍 {address.split(',')[0]}</span>}
        </div>
      </div>
    </div>
  );
}
