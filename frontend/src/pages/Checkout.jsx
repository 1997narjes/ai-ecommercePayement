import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import api from '../api/axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Formulaire de paiement
function CheckoutForm({ cart, total }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    try {
      // 1. Crée le PaymentIntent côté backend
      const { data } = await api.post('/payments/create-intent', { amount: total });

      // 2. Confirme le paiement avec Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // 3. Crée la commande en base
      const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity }));
      await api.post('/orders', { items, status: 'paid' });

      // 4. Vide le panier
      localStorage.removeItem('cart');
      setSuccess(true);

      setTimeout(() => navigate('/orders'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-gray-400">Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Element */}
      <div>
        <label className="text-gray-400 text-sm mb-2 block">Card Details</label>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 focus-within:border-amber-600 transition">
          <CardElement options={{
            style: {
              base: {
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#6b7280' }
              },
              invalid: { color: '#ef4444' }
            }
          }} />
        </div>
      </div>

      {/* Test card hint */}
      <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-4 text-sm">
        <p className="text-amber-400 font-semibold mb-1">🧪 Test Mode</p>
        <p className="text-gray-400">Use card: <span className="text-white font-mono">4242 4242 4242 4242</span></p>
        <p className="text-gray-400">Expiry: <span className="text-white">Any future date</span> — CVC: <span className="text-white">Any 3 digits</span></p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700/50 text-red-400 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading || !stripe}
        className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold text-lg transition-all">
        {loading ? '⏳ Processing...' : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

// Page principale
export default function Checkout() {
  const [cart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-6">
      <div className="max-w-lg mx-auto">

        <h1 className="font-display text-4xl font-bold text-white mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{item.name} x{item.quantity}</span>
              <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="text-amber-400">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm cart={cart} total={total} />
          </Elements>
        </div>
      </div>
    </div>
  );
}