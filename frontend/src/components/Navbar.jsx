import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center text-lg">
            ☕
          </div>
          <span className="font-display text-xl font-bold text-amber-100 tracking-wide">
            CoffeeBrand
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { path: '/', label: 'Home' },
            { path: '/products', label: 'Menu' },
            { path: '/cart', label: '🛒 Cart' },
          ].map(link => (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'text-amber-400'
                  : 'text-gray-300 hover:text-amber-400'
              }`}>
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/orders"
                className={`text-sm font-medium transition-colors ${
                  isActive('/orders') ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'
                }`}>
                My Orders
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300">
                  ⚙️ Admin
                </Link>
              )}
              <div className="flex items-center gap-3">
                <span className="text-sm text-amber-500 font-medium">
                  {user.name?.split(' ')[0]}
                </span>
                <button onClick={logout}
                  className="text-sm bg-amber-900/50 border border-amber-700 text-amber-300 px-4 py-1.5 rounded-full hover:bg-amber-800/50 transition">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="text-sm text-gray-300 hover:text-amber-400 transition">
                Login
              </Link>
              <Link to="/register"
                className="text-sm bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-full font-medium transition">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-amber-900/30 px-6 py-4 flex flex-col gap-4">
          {[
            { path: '/', label: 'Home' },
            { path: '/products', label: 'Menu' },
            { path: '/cart', label: '🛒 Cart' },
          ].map(link => (
            <Link key={link.path} to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-amber-400">My Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}
                  className="text-purple-400">⚙️ Admin</Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }}
                className="text-left text-amber-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="text-gray-300">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="text-amber-400">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}