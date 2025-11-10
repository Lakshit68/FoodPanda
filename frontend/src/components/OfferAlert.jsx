import { useState } from 'react';

export default function OfferAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div style={{ background: 'linear-gradient(to right, #ff416c, #ff4b2b)', color: 'white', padding: '16px', textAlign: 'center', position: 'relative' }}>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>🎉 Today's Special Offer: Get 30% off on all Italian restaurants! 🎉</p>
      <button onClick={() => setVisible(false)} style={{ position: 'absolute', top: '50%', right: '16px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'white', fontSize: 24, cursor: 'pointer' }}>&times;</button>
    </div>
  );
}
