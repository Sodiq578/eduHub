import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineSearch, HiOutlinePaperAirplane, HiOutlineUser, HiOutlinePhone, HiOutlineVideoCamera, HiOutlineDotsVertical, HiOutlineCheckCircle, HiOutlineX, HiOutlineEmojiHappy } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './LiveChat.css';

const LiveChat = () => {
  const { user, roles } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('live_chat_conversations');
    if (stored) setConversations(JSON.parse(stored));
    else {
      const defaultConv = [
        { id: 1, name: 'Shahzoda Ahmedova', role: 'O\'qituvchi', avatar: 'S', lastMessage: 'Salom, yordam kerakmi?', time: '10:30', unread: 0, online: true },
        { id: 2, name: 'Ali Valiyev', role: 'O\'quvchi', avatar: 'A', lastMessage: 'Dars jadvali haqida', time: '09:15', unread: 2, online: true },
        { id: 3, name: 'Vali Valiyev', role: 'Ota-ona', avatar: 'V', lastMessage: 'To\'lov haqida', time: 'Kecha', unread: 0, online: false },
      ];
      setConversations(defaultConv);
      localStorage.setItem('live_chat_conversations', JSON.stringify(defaultConv));
    }
    setOnlineUsers(['Shahzoda Ahmedova', 'Ali Valiyev']);
  }, []);

  useEffect(() => {
    const storedMsg = localStorage.getItem(`live_chat_${selectedChat?.id}`);
    if (storedMsg && selectedChat) setMessages(JSON.parse(storedMsg));
    else if (selectedChat) setMessages([]);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const newMsg = { id: Date.now(), text: newMessage, sender: user?.name || 'Me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(`live_chat_${selectedChat.id}`, JSON.stringify(updated));
    setNewMessage('');
    const updatedConv = conversations.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMessage, time: newMsg.time, unread: c.unread + 1 } : c);
    setConversations(updatedConv);
    localStorage.setItem('live_chat_conversations', JSON.stringify(updatedConv));
  };

  const filtered = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="livechat-page">
      <div className="livechat-container">
        <div className="conversations-panel"><div className="panel-header"><h2>Yordam / Support</h2><div className="search-wrapper"><HiOutlineSearch /><input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div><div className="conversations-list">{filtered.map(c => (<div key={c.id} className={`conv-item ${selectedChat?.id === c.id ? 'active' : ''}`} onClick={() => setSelectedChat(c)}><div className="conv-avatar">{c.avatar}<span className={`online-dot ${c.online ? 'online' : 'offline'}`}></span></div><div className="conv-info"><div className="conv-name">{c.name}</div><div className="conv-role">{c.role}</div><div className="conv-last">{c.lastMessage}</div></div><div className="conv-meta"><div className="conv-time">{c.time}</div>{c.unread > 0 && <div className="unread">{c.unread}</div>}</div></div>))}</div></div>
        <div className="chat-panel">{selectedChat ? (<><div className="chat-header"><div className="chat-user"><div className="chat-avatar">{selectedChat.avatar}</div><div><h3>{selectedChat.name}</h3><p>{selectedChat.role} • {selectedChat.online ? '🟢 Online' : '⚫ Offline'}</p></div></div><div className="chat-actions"><button><HiOutlinePhone /></button><button><HiOutlineVideoCamera /></button><button><HiOutlineDotsVertical /></button></div></div><div className="chat-messages">{messages.map(m => (<div key={m.id} className={`message ${m.sender === (user?.name || 'Me') ? 'sent' : 'received'}`}><div className="message-bubble"><div className="message-text">{m.text}</div><div className="message-time">{m.time}</div></div></div>))}<div ref={messagesEndRef} /></div><div className="chat-input"><textarea placeholder="Xabar yozing..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()} /><button className="send-btn" onClick={sendMessage}><HiOutlinePaperAirplane /></button></div></>) : (<div className="no-chat"><div className="no-chat-icon">💬</div><h3>Suhbatni tanlang</h3><p>Yordam olish uchun chapdagi suhbatlardan birini tanlang</p></div>)}</div>
      </div>
    </div>
  );
};
export default LiveChat;