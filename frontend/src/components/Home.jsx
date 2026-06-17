import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">

      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-black to-black" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl" />

        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/50 text-amber-400 text-sm px-4 py-2 rounded-full mb-8">
            <span>✨</span> Premium Coffee Experience
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Crafted for
            <span className="text-amber-400"> Coffee </span>
            Lovers
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium coffees, 
            guided by our AI advisor for the perfect cup every time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products"
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-600/25">
              Explore Menu ☕
            </Link>
            <Link to="/register"
              className="border border-amber-700/50 text-amber-300 hover:bg-amber-900/30 px-8 py-4 rounded-full text-lg font-medium transition-all">
              Join Us Free
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
          ↓
        </div>
      </div>

      {/* Features */}
      <div className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-500">The perfect blend of quality and technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: '🌿',
              title: 'Premium Beans',
              desc: 'Sourced directly from the finest farms around the world',
              color: 'from-green-900/20 to-transparent'
            },
            {
              icon: '🤖',
              title: 'AI Coffee Advisor',
              desc: 'Personal recommendations powered by advanced AI',
              color: 'from-blue-900/20 to-transparent'
            },
            {
              icon: '⚡',
              title: 'Fast Delivery',
              desc: 'Same-day delivery available in your area',
              color: 'from-amber-900/20 to-transparent'
            },
          ].map((f, i) => (
            <div key={i}
              className={`bg-gradient-to-br ${f.color} border border-white/5 rounded-2xl p-8 hover:border-amber-700/30 transition-all group`}>
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      {products.length > 0 && (
        <div className="py-16 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Coffees
            </h2>
            <p className="text-gray-500">Our most loved selections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-700/50 transition-all hover:-translate-y-1 group">
                <div className="text-6xl text-center mb-4 group-hover:scale-110 transition-transform">☕</div>
                <h3 className="font-display text-lg font-semibold text-white mb-1">{p.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold text-xl">${p.price}</span>
                  <Link to="/products"
                    className="text-sm bg-amber-600/20 text-amber-400 border border-amber-700/50 px-4 py-1.5 rounded-full hover:bg-amber-600/30 transition">
                    Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition">
              View Full Menu →
            </Link>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-amber-950/50 to-black border border-amber-800/30 rounded-3xl p-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to find your perfect coffee?
          </h2>
          <p className="text-gray-400 mb-8">
            Chat with our AI advisor and discover your ideal brew
          </p>
          <Link to="/products"
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105">
            Start Exploring ☕
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-gray-600 text-sm">
        © 2026 CoffeeBrand — Built with ❤️ and AI
      </footer>
    </div>
  );
}