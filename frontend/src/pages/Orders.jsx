import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="font-display text-4xl font-bold text-white mb-8">My Orders</h1>

        {loading ? (
          <div className="text-center py-20 text-amber-600">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 mb-6">No orders yet</p>
            <Link to="/products"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-medium transition">
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-700/30 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">Order #{order.id}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'paid'
                      ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                      : 'bg-amber-900/30 text-amber-400 border border-amber-700/50'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Total amount</span>
                  <span className="text-amber-400 font-bold text-lg">${order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}