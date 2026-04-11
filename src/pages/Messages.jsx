import React, { useState, useEffect, useRef } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePaperAirplane, 
  HiOutlinePaperClip, 
  HiOutlinePhone, 
  HiOutlineVideoCamera, 
  HiOutlineDotsVertical,
  HiOutlineArrowLeft,
  HiOutlineEmojiHappy,
  HiOutlineMicrophone,
  HiOutlineCheck,
  HiOutlineCheckCircle,
  HiOutlineTrash,
  HiOutlineReply
} from 'react-icons/hi';
import './Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // LocalStorage dan suhbatlarni yuklash
  useEffect(() => {
    const storedConv = localStorage.getItem('conversations');
    if (storedConv) {
      setConversations(JSON.parse(storedConv));
    } else {
      const defaultConv = [
        { id: 1, name: 'Ali Valiyev', role: 'Ota-ona', avatar: 'A', lastMessage: 'Salom, darslar qanday?', time: '10:30', unread: 2, online: true, lastSeen: 'Online' },
        { id: 2, name: 'Shahzoda Ahmedova', role: 'O\'qituvchi', avatar: 'S', lastMessage: 'Ertaga test bo\'ladi', time: '09:15', unread: 0, online: true, lastSeen: 'Online' },
        { id: 3, name: 'Dilnoza Karimova', role: 'O\'quvchi', avatar: 'D', lastMessage: 'Rahmat!', time: 'Kecha', unread: 1, online: false, lastSeen: '2 soat oldin' },
        { id: 4, name: 'Jasur Aliyev', role: 'O\'quvchi', avatar: 'J', lastMessage: 'Vazifani tushunmadim', time: 'Dushanba', unread: 0, online: false, lastSeen: '1 kun oldin' },
      ];
      setConversations(defaultConv);
      localStorage.setItem('conversations', JSON.stringify(defaultConv));
    }
  }, []);

  // LocalStorage dan xabarlarni yuklash
  useEffect(() => {
    const storedMsg = localStorage.getItem(`messages_${selectedChat?.id}`);
    if (storedMsg && selectedChat) {
      setMessages(JSON.parse(storedMsg));
    } else if (selectedChat) {
      const defaultMessages = [
        { id: 1, text: 'Salom! Qanday yordam kerak?', sender: 'other', time: '10:00', date: '2024-12-10', read: true },
        { id: 2, text: 'Assalomu alaykum, matematikadan yordam kerak edi', sender: 'me', time: '10:05', date: '2024-12-10', read: true },
        { id: 3, text: 'Albatta, qaysi mavzuda?', sender: 'other', time: '10:06', date: '2024-12-10', read: true },
        { id: 4, text: '5-misolni tushunmadim', sender: 'me', time: '10:10', date: '2024-12-10', read: false },
      ];
      setMessages(defaultMessages);
      localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(defaultMessages));
    }
  }, [selectedChat]);

  // Xabarlar o'zgarganda avtomatik scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Typing indikatori
  useEffect(() => {
    let timeout;
    if (isTyping) {
      timeout = setTimeout(() => setIsTyping(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Xabar yuborish
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = { 
      id: Date.now(), 
      text: newMessage, 
      sender: 'me', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');
    
    // Suhbatlar ro'yxatini yangilash
    updateConversationLastMessage(selectedChat.id, newMessage, newMsg.time);
    
    // Simulate reply (demo uchun)
    setTimeout(() => {
      simulateReply();
    }, 2000);
  };

  // Avtomatik javob (demo)
  const simulateReply = () => {
    const replyMsg = {
      id: Date.now() + 1,
      text: 'Xabaringiz uchun rahmat! Tez orada javob beraman.',
      sender: 'other',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      read: false
    };
    const updatedMessages = [...messages, replyMsg];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(updatedMessages));
    updateConversationLastMessage(selectedChat.id, replyMsg.text, replyMsg.time);
  };

  // Suhbatdagi oxirgi xabarni yangilash
  const updateConversationLastMessage = (chatId, message, time) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === chatId 
        ? { ...conv, lastMessage: message.length > 30 ? message.substring(0, 30) + '...' : message, time: time, unread: conv.unread + 1 }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  };

  // Xabarni o'qilgan deb belgilash
  const markAsRead = (chatId) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === chatId ? { ...conv, unread: 0 } : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  };

  // Suhbatni tanlash
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    markAsRead(chat.id);
    if (window.innerWidth <= 768) {
      document.querySelector('.conversations-panel')?.classList.add('hidden');
      document.querySelector('.chat-panel')?.classList.add('active');
    }
  };

  // Mobile da orqaga qaytish
  const handleBack = () => {
    if (window.innerWidth <= 768) {
      document.querySelector('.conversations-panel')?.classList.remove('hidden');
      document.querySelector('.chat-panel')?.classList.remove('active');
    }
    setSelectedChat(null);
  };

  // Xabarni o'chirish
  const deleteMessage = (msgId) => {
    if (window.confirm('Xabarni o\'chirmoqchimisiz?')) {
      const updatedMessages = messages.filter(m => m.id !== msgId);
      setMessages(updatedMessages);
      localStorage.setItem(`messages_${selectedChat.id}`, JSON.stringify(updatedMessages));
    }
  };

  // Xabarni nusxalash
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert('Xabar nusxalandi!');
  };

  // Emoji qo'shish (simple version)
  const addEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Suhbatlar paneli */}
        <div className="conversations-panel">
          <div className="panel-header">
            <h2>Xabarlar</h2>
            <div className="search-wrapper">
              <HiOutlineSearch />
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                <p>Hech qanday suhbat topilmadi</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`conversation-item ${selectedChat?.id === conv.id ? 'active' : ''}`} 
                  onClick={() => handleSelectChat(conv)}
                >
                  <div className="conv-avatar">
                    {conv.avatar}
                    <span className={`online-status ${conv.online ? 'online' : 'offline'}`}></span>
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.name}</div>
                    <div className="conv-role">{conv.role}</div>
                    <div className="conv-last-msg">{conv.lastMessage}</div>
                  </div>
                  <div className="conv-meta">
                    <div className="conv-time">{conv.time}</div>
                    {conv.unread > 0 && <div className="unread-badge">{conv.unread}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat paneli */}
        <div className="chat-panel">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-user">
                  <button className="back-btn" onClick={handleBack}>
                    <HiOutlineArrowLeft />
                  </button>
                  <div className="chat-avatar">{selectedChat.avatar}</div>
                  <div className="chat-user-info">
                    <h3>{selectedChat.name}</h3>
                    <p className="chat-status">
                      {selectedChat.online ? '🟢 Online' : `⚫ ${selectedChat.lastSeen}`}
                    </p>
                  </div>
                </div>
                <div className="chat-actions">
                  <button title="Qo'ng'iroq qilish"><HiOutlinePhone /></button>
                  <button title="Video qo'ng'iroq"><HiOutlineVideoCamera /></button>
                  <button title="Ko'proq"><HiOutlineDotsVertical /></button>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, index) => {
                  const showDate = index === 0 || messages[index - 1].date !== msg.date;
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="date-divider">
                          <span>{msg.date === new Date().toISOString().split('T')[0] ? 'Bugun' : msg.date}</span>
                        </div>
                      )}
                      <div className={`message ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`}>
                        <div className="message-bubble">
                          <div className="message-text">{msg.text}</div>
                          <div className="message-time">
                            {msg.time}
                            {msg.sender === 'me' && (
                              <span className="message-status">
                                {msg.read ? <HiOutlineCheckCircle /> : <HiOutlineCheck />}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="message-actions">
                          <button onClick={() => copyMessage(msg.text)} title="Nusxalash">📋</button>
                          {msg.sender === 'me' && (
                            <button onClick={() => deleteMessage(msg.id)} title="O'chirish">🗑️</button>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                {isTyping && (
                  <div className="typing-indicator">
                    <span>{selectedChat.name} yozmoqda</span>
                    <span className="typing-dots">...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-container">
                <div className="chat-input">
                  <button className="emoji-btn" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <HiOutlineEmojiHappy />
                  </button>
                  <textarea 
                    ref={inputRef}
                    placeholder="Xabar yozing..." 
                    value={newMessage} 
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      setIsTyping(true);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    rows="1"
                  />
                  <button className="attach-btn">
                    <HiOutlinePaperClip />
                  </button>
                  <button className="mic-btn">
                    <HiOutlineMicrophone />
                  </button>
                  <button className="send-btn" onClick={sendMessage} disabled={!newMessage.trim()}>
                    <HiOutlinePaperAirplane />
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="emoji-picker">
                    <button onClick={() => addEmoji('😊')}>😊</button>
                    <button onClick={() => addEmoji('👍')}>👍</button>
                    <button onClick={() => addEmoji('❤️')}>❤️</button>
                    <button onClick={() => addEmoji('😂')}>😂</button>
                    <button onClick={() => addEmoji('🎉')}>🎉</button>
                    <button onClick={() => addEmoji('✅')}>✅</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Chatni tanlang</h3>
              <p>Xabar yozish uchun chapdagi suhbatlardan birini tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;