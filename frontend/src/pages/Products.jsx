import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [filter, setFilter] = useState('All');
  const [added, setAdded] = useState(null);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    const newCart = existing
      ? cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our Menu
          </h1>
          <p className="text-gray-500">Handcrafted with passion, served with love</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 justify-center mb-10 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-amber-700/50 hover:text-amber-400'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-700/40 transition-all group hover:-translate-y-1">

              {/* Image placeholder */}
              <div className="bg-gradient-to-br from-amber-900/30 to-black rounded-xl h-40 flex items-center justify-center mb-5 group-hover:from-amber-900/50 transition-all">
                <span className="text-6xl group-hover:scale-110 transition-transform">☕</span>
              </div>

              {/* Badge */}
              <span className="text-xs bg-amber-900/30 text-amber-500 border border-amber-800/50 px-3 py-1 rounded-full">
                {p.category}
              </span>

              <h3 className="font-display text-lg font-semibold text-white mt-3 mb-1">
                {p.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold text-xl">${p.price}</span>
                <button onClick={() => addToCart(p)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    added === p.id
                      ? 'bg-green-600 text-white scale-95'
                      : 'bg-amber-600 hover:bg-amber-500 text-white hover:scale-105'
                  }`}>
                  {added === p.id ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            <div className="text-5xl mb-4">☕</div>
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}