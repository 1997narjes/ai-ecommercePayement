import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const updateQty = (id, qty) => {
    if (qty < 1) return remove(id);
    const newCart = cart.map(i => i.id === id ? { ...i, quantity: qty } : i);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const remove = (id) => {
    const newCart = cart.filter(i => i.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
const checkout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');
    return;
  }
  navigate('/checkout');
};
  // const checkout = async () => {
  //   setLoading(true);
  //   try {
  //     const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity }));
  //     await api.post('/orders', { items });
  //     localStorage.removeItem('cart');
  //     setCart([]);
  //     navigate('/orders');
  //   } catch {
  //     alert('Please login first!');
  //     navigate('/login');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="font-display text-4xl font-bold text-white mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-500 mb-6">Your cart is empty</p>
            <Link to="/products"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-full font-medium transition">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-900/30 rounded-xl flex items-center justify-center text-2xl">
                      ☕
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-amber-400 text-sm">${item.price} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center">
                        −
                      </button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center">
                        +
                      </button>
                    </div>
                    <span className="text-white font-semibold w-16 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button onClick={() => remove(item.id)}
                      className="text-red-500/70 hover:text-red-400 transition">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-amber-950/40 to-black border border-amber-800/30 rounded-2xl p-6">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 mb-4">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-white font-bold text-xl mb-6">
                <span>Total</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
              <button onClick={checkout} disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-4 rounded-full font-semibold text-lg transition-all hover:scale-[1.02]">
                {loading ? '⏳ Processing...' : 'Place Order 🎉'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}