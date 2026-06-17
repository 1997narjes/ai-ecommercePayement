import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero */}
      <div className="bg-amber-900 text-white text-center py-24 px-6">
        <h1 className="text-5xl font-bold mb-4">Premium Coffee Experience</h1>
        <p className="text-xl text-amber-200 mb-8">
          Discover our handcrafted coffees, delivered to your door
        </p>
        <Link to="/products"
          className="bg-amber-500 hover:bg-amber-400 text-white px-8 py-3 rounded-full text-lg font-semibold">
          Order Now ☕
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto py-16 px-6">
        {[
          { icon: '🌱', title: 'Fresh Beans', desc: 'Sourced from the best farms' },
          { icon: '🤖', title: 'AI Advisor', desc: 'Personal coffee recommendations' },
          { icon: '🚚', title: 'Fast Delivery', desc: 'Same day delivery available' },
        ].map((f, i) => (
          <div key={i} className="text-center p-6 bg-white rounded-xl shadow">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg text-amber-900">{f.title}</h3>
            <p className="text-gray-600 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}