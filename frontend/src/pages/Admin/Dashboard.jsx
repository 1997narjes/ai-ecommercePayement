import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: '', stock: '', image_url: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadProducts();
    loadOrders();
  }, []);

  const loadProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      });
      setShowForm(false);
      setForm({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
      loadProducts();
      alert('✅ Product added!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-amber-900 text-white p-18">
        <h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1>
        <p className="text-amber-300 text-sm mt-1">Manage your coffee brand</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-6">
        {[
          { label: 'Total Products', value: products.length, icon: '☕' },
          { label: 'Total Orders', value: orders.length, icon: '📦' },
          { label: 'Revenue', value: '$' + orders.reduce((s, o) => s + parseFloat(o.total || 0), 0).toFixed(2), icon: '💰' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-amber-900">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex gap-4 mb-6">
          {['products', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-semibold capitalize transition ${
                activeTab === tab
                  ? 'bg-amber-900 text-white'
                  : 'bg-white text-amber-900 border border-amber-900'
              }`}>
              {tab === 'products' ? '☕ Products' : '📦 Orders'}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button onClick={() => setShowForm(!showForm)}
              className="mb-4 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-500 font-semibold">
              {showForm ? '✕ Cancel' : '+ Add Product'}
            </button>

            {/* Add Product Form */}
            {showForm && (
              <div className="bg-black rounded-xl p-6 shadow mb-6">
                <h3 className="font-bold text-amber-900 text-lg mb-4">New Product</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name', color: 'red', placeholder: 'Product name', type: 'text' },
                    { key: 'category', placeholder: 'Category (Hot Drinks...)', type: 'text' },
                    { key: 'price', placeholder: 'Price (4.99)', type: 'number' },
                    { key: 'stock', placeholder: 'Stock quantity', type: 'number' },
                  ].map(field => (
                    <input key={field.key} type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      className="border p-3 rounded-lg focus:outline-amber-500" />
                  ))}
                  <input type="text" placeholder="Image URL (optional)"
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="border p-3 rounded-lg focus:outline-amber-500 col-span-2" />
                  <textarea placeholder="Description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="border p-3 rounded-lg focus:outline-amber-500 col-span-2"
                    rows={2} />
                </div>
                <button onClick={handleSubmit}
                  className="mt-4 bg-amber-900 text-white px-8 py-3 rounded-lg hover:bg-amber-800 font-semibold">
                  ✅ Save Product
                </button>
              </div>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">☕</div>
                    <div>
                      <h3 className="font-bold text-amber-900">{p.name}</h3>
                      <p className="text-gray-500 text-sm">{p.category} — Stock: {p.stock}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-amber-700 text-lg">${p.price}</span>
                    <button onClick={() => handleDelete(p.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 text-sm">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 gap-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders yet</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-amber-900">Order #{order.id}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-amber-700">${order.total}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}