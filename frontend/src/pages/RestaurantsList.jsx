import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard.jsx';

export default function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/restaurants');
        setRestaurants(data.items || []);
      } catch (e) {
        setError('Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ background: 'var(--bg)', padding: '48px 16px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ fontWeight: 800, fontSize: 28, margin: '0 0 24px' }}>
          All Restaurants
        </div>
        {loading && <p>Loading restaurants...</p>}
        {error && !loading && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          restaurants.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
                gap: 32,
              }}
            >
              {restaurants.map((r) => (
                <RestaurantCard key={r._id} restaurant={r} />
              ))}
            </div>
          ) : (
            <p>No restaurants found.</p>
          )
        )}
      </div>
    </div>
  );
}
