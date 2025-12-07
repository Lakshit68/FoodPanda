import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../state/AuthContext.jsx';

export default function OwnerDashboard() {
  const { user, authenticated } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    city: '',
    address: '',
    about: '',
    cuisine: '',
    image: '',
    openingHours: '10:00 AM - 11:00 PM',
    deliveryTimeMins: 30,
    priceLevel: 2,
  });

  useEffect(() => {
    if (!authenticated) return;
    if (user?.role !== 'owner') {
      navigate('/');
      return;
    }
    (async () => {
      try {
        const { data } = await api.get('/owner/restaurants');
        setRestaurants(data || []);
      } catch (e) {
        console.error('Failed to load owner restaurants', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [authenticated, user, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        city: form.city,
        address: form.address,
        about: form.about,
        cuisine: form.cuisine
          ? form.cuisine.split(',').map(c => c.trim()).filter(Boolean)
          : [],
        image: form.image,
        openingHours: form.openingHours,
        deliveryTimeMins: Number(form.deliveryTimeMins) || 30,
        priceLevel: Number(form.priceLevel) || 2,
      };
      const { data } = await api.post('/owner/restaurants', payload);
      setRestaurants(prev => [data, ...prev]);
      setForm({
        name: '',
        city: '',
        address: '',
        about: '',
        cuisine: '',
        image: '',
        openingHours: '10:00 AM - 11:00 PM',
        deliveryTimeMins: 30,
        priceLevel: 2,
      });
      // Later: navigate(`/owner/restaurants/${data._id}/categories`)
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setSaving(false);
    }
  }

  if (!authenticated || user?.role !== 'owner') {
    return <div style={{ padding: 24 }}>Only restaurant owners can access this page.</div>;
  }

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Owner Dashboard</h1>
      <p style={{ color: '#555', marginBottom: 24 }}>Add and manage your restaurants.</p>

      <div className="ff-card" style={{ padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Add Your Restaurant</h2>
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <input
            required
            placeholder="Restaurant name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <input
            placeholder="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <textarea
            placeholder="About"
            value={form.about}
            onChange={e => setForm({ ...form, about: e.target.value })}
            rows={3}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }}
          />
          <input
            placeholder="Cuisines (comma separated, e.g. Indian, Chinese)"
            value={form.cuisine}
            onChange={e => setForm({ ...form, cuisine: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              placeholder="Opening hours"
              value={form.openingHours}
              onChange={e => setForm({ ...form, openingHours: e.target.value })}
              style={{ flex: 1, minWidth: 180, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
            <input
              type="number"
              min="10"
              max="120"
              placeholder="Delivery time (mins)"
              value={form.deliveryTimeMins}
              onChange={e => setForm({ ...form, deliveryTimeMins: e.target.value })}
              style={{ width: 180, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
            <input
              type="number"
              min="1"
              max="4"
              placeholder="Price level (1-4)"
              value={form.priceLevel}
              onChange={e => setForm({ ...form, priceLevel: e.target.value })}
              style={{ width: 160, padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="ff-primary"
            style={{ padding: '10px 14px', borderRadius: 10, border: 'none', fontWeight: 700 }}
          >
            {saving ? 'Saving...' : 'Create Restaurant'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Your Restaurants</h2>
        {loading ? (
          <div>Loading...</div>
        ) : restaurants.length === 0 ? (
          <div style={{ color: '#666' }}>You have not added any restaurants yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {restaurants.map(r => (
              <div key={r._id} className="ff-card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: `url(${r.image || 'https://picsum.photos/160'}) center/cover`,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    {(r.cuisine || []).join(', ')}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    {r.address}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/owner/restaurants/${r._id}/categories`)}
                  className="ff-outline"
                  style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}
                >
                  Manage categories
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
