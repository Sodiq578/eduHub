import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, HiOutlineMail, HiOutlineChat, 
  HiOutlineQuestionMarkCircle, HiOutlinePlus, 
  HiOutlineCheckCircle, HiOutlineClock, HiOutlineUser,
  HiOutlinePaperAirplane, HiOutlineEmojiHappy 
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './LiveChat.css';


const SupportCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('faq'); // faq, tickets, chat
  const [faqs, setFaqs] = useState([
    { id: 1, question: "To'lovni qanday amalga oshirish mumkin?", answer: "To'lovni Click, Payme yoki bank kartasi orqali amalga oshirishingiz mumkin.", category: "to'lov" },
    { id: 2, question: "Dars jadvalini qayerdan ko'rish mumkin?", answer: "Dashboard -> Mening darslarim bo'limida jadval mavjud.", category: "darslar" },
    { id: 3, question: "Darsni qoldirgan bo'lsam nima qilishim kerak?", answer: "O'qituvchingiz bilan bog'lanib, qoldirilgan darsni muhokama qiling.", category: "darslar" },
    { id: 4, question: "Sertifikatni qanday olish mumkin?", answer: "Kursni muvaffaqiyatli tugatgach, sertifikat avtomatik ravishda yuboriladi.", category: "sertifikat" },
  ]);
  const [searchFaq, setSearchFaq] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Ticket state
  const [tickets, setTickets] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'medium' });
  
  // Chat state
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedTickets = localStorage.getItem('support_tickets');
    if (savedTickets) setTickets(JSON.parse(savedTickets));
    else {
      const defaultTickets = [
        { id: 1, title: "To'lov amalga oshmadi", description: "Click orqali to'lov qilmoqchi edim, xatolik yuz berdi", status: 'open', priority: 'high', createdAt: new Date().toISOString(), user: user?.name || 'User' },
        { id: 2, title: "Darsga kira olmayapman", description: "Zoom link ishlamayapti", status: 'in_progress', priority: 'medium', createdAt: new Date().toISOString(), user: user?.name || 'User' },
      ];
      setTickets(defaultTickets);
      localStorage.setItem('support_tickets', JSON.stringify(defaultTickets));
    }

    const savedChats = localStorage.getItem('support_conversations');
    if (savedChats) setConversations(JSON.parse(savedChats));
    else {
      const defaultChats = [
        { id: 1, name: 'Admin Support', avatar: 'S', lastMessage: 'Salom! Qanday yordam bera olaman?', time: '10:30', unread: 0, online: true, role: 'Admin' },
        { id: 2, name: 'Texnik Yordam', avatar: 'T', lastMessage: 'Texnik muammo bormi?', time: '09:15', unread: 0, online: false, role: 'Support' },
      ];
      setConversations(defaultChats);
      localStorage.setItem('support_conversations', JSON.stringify(defaultChats));
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      const savedMsgs = localStorage.getItem(`support_chat_${selectedChat.id}`);
      setMessages(savedMsgs ? JSON.parse(savedMsgs) : []);
    }
  }, [selectedChat]);

  // Ticket functions
  const createTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;
    const ticket = {
      id: Date.now(),
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString(),
      user: user?.name || 'User'
    };
    const updated = [ticket, ...tickets];
    setTickets(updated);
    localStorage.setItem('support_tickets', JSON.stringify(updated));
    setNewTicket({ title: '', description: '', priority: 'medium' });
    setShowTicketForm(false);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    const updated = tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t);
    setTickets(updated);
    localStorage.setItem('support_tickets', JSON.stringify(updated));
  };

  // Chat functions
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg = {
      id: Date.now(),
      text: newMessage,
      sender: user?.name || 'Me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(`support_chat_${selectedChat.id}`, JSON.stringify(updated));
    setNewMessage('');
    
    // Update last message in conversations
    const updatedConv = conversations.map(c => 
      c.id === selectedChat.id ? { ...c, lastMessage: newMessage, time: msg.time } : c
    );
    setConversations(updatedConv);
    localStorage.setItem('support_conversations', JSON.stringify(updatedConv));
  };

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchFaq.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(faqs.map(f => f.category))];
  const filteredChats = conversations.filter(c => 
    c.name.toLowerCase().includes(chatSearch.toLowerCase())
  );

  return (
    <div className="support-center">
      <div className="support-container">
        {/* Sidebar */}
        <div className="support-sidebar">
          <div className="sidebar-header">
            <h2>Yordam Markazi</h2>
          </div>
          
          <div className="sidebar-nav">
            <button 
              className={`nav-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <HiOutlineQuestionMarkCircle /> Savol-Javob
            </button>
            <button 
              className={`nav-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <HiOutlineMail /> Murojaatlar
              {tickets.filter(t => t.status === 'open').length > 0 && (
                <span className="badge">{tickets.filter(t => t.status === 'open').length}</span>
              )}
            </button>
            
          </div>

          <div className="sidebar-footer">
            <div className="support-contact">
              <p>📞 +998 71 123 45 67</p>
              <p>✉️ support@eduplatform.uz</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="support-main">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="faq-section">
              <div className="faq-header">
                <h2>Ko'p beriladigan savollar</h2>
                <div className="faq-search">
                  <HiOutlineSearch />
                  <input 
                    type="text" 
                    placeholder="Savol izlash..." 
                    value={searchFaq}
                    onChange={(e) => setSearchFaq(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="faq-categories">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'all' ? 'Barchasi' : cat}
                  </button>
                ))}
              </div>

              <div className="faq-list">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <div className="faq-question">
                      <span className="q-icon">❓</span>
                      <h4>{faq.question}</h4>
                    </div>
                    <div className="faq-answer">
                      <span className="a-icon">💡</span>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="empty-state">
                    <p>Hech qanday savol topilmadi</p>
                  </div>
                )}
              </div>

              <div className="faq-footer">
                <p>Javob topolmadingizmi?</p>
                <button 
                  className="create-ticket-btn"
                  onClick={() => setActiveTab('tickets')}
                >
                  Murojaat yaratish
                </button>
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="tickets-section">
              <div className="tickets-header">
                <h2>Murojaatlarim</h2>
                <button 
                  className="new-ticket-btn"
                  onClick={() => setShowTicketForm(true)}
                >
                  <HiOutlinePlus /> Yangi murojaat
                </button>
              </div>

              {showTicketForm && (
                <div className="ticket-form">
                  <h3>Yangi murojaat</h3>
                  <input 
                    type="text"
                    placeholder="Mavzu"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  />
                  <textarea
                    placeholder="Muammoingizni batafsil yozing..."
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  />
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option value="low">Past</option>
                    <option value="medium">O'rta</option>
                    <option value="high">Yuqori</option>
                  </select>
                  <div className="form-actions">
                    <button onClick={() => setShowTicketForm(false)}>Bekor qilish</button>
                    <button className="submit-btn" onClick={createTicket}>Yuborish</button>
                  </div>
                </div>
              )}

              <div className="tickets-list">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <h4>{ticket.title}</h4>
                      <span className={`priority ${ticket.priority}`}>
                        {ticket.priority === 'high' ? 'Yuqori' : ticket.priority === 'medium' ? 'O\'rta' : 'Past'}
                      </span>
                    </div>
                    <p className="ticket-desc">{ticket.description}</p>
                    <div className="ticket-meta">
                      <span className={`status ${ticket.status}`}>
                        {ticket.status === 'open' ? '✉️ Ochilgan' : 
                         ticket.status === 'in_progress' ? '⚙️ Ko\'rib chiqilmoqda' : '✅ Yopilgan'}
                      </span>
                      <span className="date">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {ticket.status !== 'closed' && (
                      <button 
                        className="close-ticket-btn"
                        onClick={() => updateTicketStatus(ticket.id, 'closed')}
                      >
                        <HiOutlineCheckCircle /> Yopish
                      </button>
                    )}
                  </div>
                ))}
                {tickets.length === 0 && (
                  <div className="empty-state">
                    <p>Hech qanday murojaat yo'q</p>
                    <button onClick={() => setShowTicketForm(true)}>Birinchi murojaatni yozish</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="chat-section">
              <div className="chat-sidebar-panel">
                <div className="chat-search">
                  <HiOutlineSearch />
                  <input 
                    type="text"
                    placeholder="Suhbat izlash..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                  />
                </div>
                <div className="chat-conversations">
                  {filteredChats.map(conv => (
                    <div 
                      key={conv.id}
                      className={`conv-item ${selectedChat?.id === conv.id ? 'active' : ''}`}
                      onClick={() => setSelectedChat(conv)}
                    >
                      <div className="conv-avatar">
                        <span>{conv.avatar}</span>
                        <span className={`online-status ${conv.online ? 'online' : 'offline'}`}></span>
                      </div>
                      <div className="conv-info">
                        <div className="conv-name">{conv.name}</div>
                        <div className="conv-last">{conv.lastMessage}</div>
                      </div>
                      <div className="conv-meta">
                        <div className="conv-time">{conv.time}</div>
                        {conv.unread > 0 && <div className="unread">{conv.unread}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chat-main-panel">
                {selectedChat ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-user">
                        <div className="chat-avatar">{selectedChat.avatar}</div>
                        <div>
                          <h3>{selectedChat.name}</h3>
                          <p>{selectedChat.online ? '🟢 Online' : '⚫ Offline'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="chat-messages">
                      {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.isUser ? 'sent' : 'received'}`}>
                          <div className="message-bubble">
                            <div className="message-text">{msg.text}</div>
                            <div className="message-time">{msg.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="chat-input">
                      <textarea
                        placeholder="Xabar yozing..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      />
                      <button className="send-btn" onClick={sendMessage}>
                        <HiOutlinePaperAirplane />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-chat-selected">
                    <div className="no-chat-icon">💬</div>
                    <h3>Suhbatni tanlang</h3>
                    <p>Yordam olish uchun chapdagi suhbatlardan birini tanlang</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;