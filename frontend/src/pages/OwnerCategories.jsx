import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../state/AuthContext.jsx';

export default function OwnerCategories() {
  const { user, authenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', image: '' });

  useEffect(() => {
    if (!authenticated) return;
    if (user?.role !== 'owner') {
      navigate('/');
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/owner/restaurants/${id}/categories`);
        setCategories(data || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [authenticated, user, id, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { name: form.name, image: form.image };
      const { data } = await api.post(`/owner/restaurants/${id}/categories`, payload);
      setCategories(prev => [...prev, data]);
      setForm({ name: '', image: '' });
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  }

  if (!authenticated || user?.role !== 'owner') {
    return <div style={{ padding: 24 }}>Only restaurant owners can access this page.</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 16px' }}>
      <button onClick={() => navigate(-1)} className="ff-outline" style={{ padding: '8px 10px', marginBottom: 16 }}>← Back</button>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Manage Categories</h1>
      <p style={{ color: '#555', marginBottom: 20 }}>Add and manage menu categories for this restaurant.</p>

      <div className="ff-card" style={{ padding: 20, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Add Category</h2>
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 10px', borderRadius: 8, marginBottom: 10 }}>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
          <input
            required
            placeholder="Category name (e.g. Starters, Main Course)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <input
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={e => setForm({ ...form, image: e.target.value })}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button
            type="submit"
            disabled={saving}
            className="ff-primary"
            style={{ padding: '10px 14px', borderRadius: 10, border: 'none', fontWeight: 700 }}
          >
            {saving ? 'Saving...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Existing Categories</h2>
        {loading ? (
          <div>Loading...</div>
        ) : categories.length === 0 ? (
          <div style={{ color: '#666' }}>No categories yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {categories.map(c => (
              <div key={c._id} className="ff-card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    background: `url(${c.image || 'https://picsum.photos/120'}) center/cover`,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Order: {c.order}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
