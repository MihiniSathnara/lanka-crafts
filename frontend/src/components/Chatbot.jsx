import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import api from '../api/axios.js';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m the LankaCrafts assistant. Ask me anything about the platform!' }
  ]);
  const [allQA, setAllQA] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    api.get('/chatbot').then(({ data }) => setAllQA(data)).catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { from: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.get(`/chatbot/search?q=${encodeURIComponent(q)}`);
      if (data.length > 0) {
        setMessages((prev) => [...prev, { from: 'bot', text: data[0].answer }]);
      } else {
        setMessages((prev) => [...prev, {
          from: 'bot',
          text: "I'm sorry, I don't have an answer for that. Try asking about registration, workshop booking, or how to chat with artists."
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleSuggest = (qa) => {
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: qa.question },
      { from: 'bot', text: qa.answer },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden">
          <div className="bg-orange-500 text-white px-4 py-3 flex items-center gap-2">
            <Bot size={20} />
            <div>
              <p className="font-semibold text-sm">LankaCrafts Assistant</p>
              <p className="text-xs text-orange-100">Always here to help</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 h-64">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.from === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-3 py-2 text-sm text-gray-500">Typing...</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {allQA.length > 0 && messages.length < 3 && (
            <div className="px-3 pb-2">
              <p className="text-xs text-gray-400 mb-1">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {allQA.slice(0, 3).map((qa) => (
                  <button key={qa._id} onClick={() => handleSuggest(qa)}
                    className="text-xs bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5 hover:bg-orange-100 truncate max-w-full">
                    {qa.question.length > 30 ? qa.question.slice(0, 30) + '...' : qa.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-orange-400"
            />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="w-8 h-8 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-full flex items-center justify-center">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
