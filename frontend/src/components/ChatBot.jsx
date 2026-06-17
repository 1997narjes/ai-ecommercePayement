import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI coffee advisor. How can I help you find the perfect brew? ☕' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: input,
        history: messages
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {open && (
        <div className="absolute bottom-16 right-0 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-amber-900/50 border-b border-amber-800/30 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-sm">☕</div>
              <div>
                <p className="text-white text-sm font-semibold">AI Coffee Advisor</p>
                <p className="text-amber-400 text-xs">Always here to help</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white">✕</button>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white rounded-br-sm'
                    : 'bg-white/10 text-gray-200 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} style={{ animationDelay: `${i * 0.2}s` }}
                        className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5 flex gap-2">
            <input value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about our coffees..."
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-600 transition" />
            <button onClick={sendMessage} disabled={loading}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white w-10 h-10 rounded-xl flex items-center justify-center transition">
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:scale-110 ${
          open
            ? 'bg-gray-800 text-gray-400 border border-white/10'
            : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/25'
        }`}>
        {open ? '✕' : '☕'}
      </button>
    </div>
  );
}