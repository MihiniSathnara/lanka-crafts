import { useEffect, useState, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import api from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import Spinner from '../../components/Spinner.jsx';
import { format, formatTime, getErrorMessage } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

export default function TouristChats() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    api.get('/chats').then(({ data }) => { setChats(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeChat) {
      setMsgLoading(true);
      api.get(`/chats/${activeChat._id}/messages`).then(({ data }) => setMessages(data)).finally(() => setMsgLoading(false));
    }
  }, [activeChat]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handler = ({ chatId, message }) => {
      if (activeChat?._id === chatId) {
        setMessages(prev => [...prev, message]);
      }
      setChats(prev => prev.map(c => c._id === chatId ? { ...c, lastMessage: message.content, lastMessageAt: message.createdAt } : c));
    };
    socket.on('newMessage', handler);
    return () => socket.off('newMessage', handler);
  }, [socket, activeChat]);

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || !activeChat) return;
    setSending(true);
    setInput('');
    try {
      const { data } = await api.post(`/chats/${activeChat._id}/messages`, { content });
      setMessages(prev => [...prev, data]);
      setChats(prev => prev.map(c => c._id === activeChat._id ? { ...c, lastMessage: content, lastMessageAt: new Date() } : c));
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSending(false); }
  };

  if (loading) return <div className="py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Conversations</h1>

      <div className="card flex h-[600px] overflow-hidden">
        {/* Chat list */}
        <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600">Artists ({chats.length})</h3>
          </div>
          <div className="overflow-y-auto flex-1">
            {chats.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">No conversations yet.<br />Chat with an artist from their profile.</div>
            ) : (
              chats.map(chat => (
                <button key={chat._id} onClick={() => setActiveChat(chat)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeChat?._id === chat._id ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''}`}>
                  <div className="flex items-center gap-2">
                    <img src={chat.artist?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.artist?.name || 'A')}&background=f97316&color=fff`}
                      alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{chat.artist?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{chat.lastMessage || 'No messages yet'}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {!activeChat ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={40} className="mx-auto mb-2 text-gray-300" />
                <p>Select a conversation</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                <img src={activeChat.artist?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.artist?.name || 'A')}&background=f97316&color=fff`}
                  alt="" className="w-8 h-8 rounded-full" />
                <span className="font-semibold text-gray-900">{activeChat.artist?.name}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {msgLoading ? <Spinner /> : messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">Start the conversation!</p>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {!isMine && (
                          <img src={msg.sender?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || 'A')}&background=f97316&color=fff`}
                            alt="" className="w-7 h-7 rounded-full mr-2 self-end flex-shrink-0" />
                        )}
                        <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 text-sm ${isMine ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                          {msg.content}
                          <span className={`block text-xs mt-0.5 ${isMine ? 'text-orange-100' : 'text-gray-400'}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 input-field text-sm" />
                <button onClick={sendMessage} disabled={!input.trim() || sending}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg flex items-center justify-center">
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
