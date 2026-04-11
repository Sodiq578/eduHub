import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCalendar, 
  HiOutlineCheckCircle, 
  HiOutlineTrash, 
  HiOutlineBell,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineUserGroup,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineMail,
  HiOutlineCash,
  HiOutlineBookOpen,
  HiOutlineSparkles,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

const Notifications = () => {
  const { user, roles } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'announcement'
  });

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const defaultNotifications = [
        { id: 1, title: "To'lov muddati", message: 'Dekabr oyi to\'lovi 10-kungacha amalga oshirilishi kerak', type: 'payment', date: '2024-12-01', read: false, author: 'Admin', authorRole: 'admin' },
        { id: 2, title: 'Uy vazifasi muddati', message: 'Matematika fanidan uy vazifasi ertaga topshirilishi kerak', type: 'homework', date: '2024-12-03', read: false, author: 'Admin', authorRole: 'admin' },
        { id: 3, title: 'Tadbir eslatmasi', message: '15-dekabr kuni maktab bayrami bo\'lib o\'tadi', type: 'event', date: '2024-12-05', read: true, author: 'Admin', authorRole: 'admin' },
        { id: 4, title: "Ota-onalar yig'ilishi", message: '20-dekabr kuni soat 15:00 da onlayn yig\'ilish', type: 'event', date: '2024-12-10', read: false, author: 'Admin', authorRole: 'admin' },
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
    }
  };

  // Save notifications
  const saveNotifications = (updatedNotifications) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'payment': return <HiOutlineCash />;
      case 'homework': return <HiOutlineBookOpen />;
      case 'event': return <HiOutlineSparkles />;
      case 'announcement': return <HiOutlineMail />;
      case 'alert': return <HiOutlineExclamationCircle />;
      default: return <HiOutlineBell />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'payment': return '#f59e0b';
      case 'homework': return '#3b82f6';
      case 'event': return '#10b981';
      case 'announcement': return '#8b5cf6';
      case 'alert': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTypeName = (type) => {
    switch(type) {
      case 'payment': return "To'lov";
      case 'homework': return 'Uy vazifasi';
      case 'event': return 'Tadbir';
      case 'announcement': return "E'lon";
      case 'alert': return 'Ogohlantirish';
      default: return 'Xabar';
    }
  };

  // Yangi e'lon qo'shish (faqat admin)
  const handleAddAnnouncement = () => {
    // Tekshirish
    if (!newAnnouncement.title || !newAnnouncement.title.trim()) {
      alert('Iltimos, sarlavhani kiriting!');
      return;
    }
    if (!newAnnouncement.message || !newAnnouncement.message.trim()) {
      alert('Iltimos, e\'lon matnini kiriting!');
      return;
    }

    // Yangi e'lon yaratish
    const newNotif = {
      id: Date.now(),
      title: newAnnouncement.title.trim(),
      message: newAnnouncement.message.trim(),
      type: newAnnouncement.type,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      author: user?.name || 'Administrator',
      authorRole: user?.role || 'admin'
    };

    // Yangi e'loni qo'shish
    const updatedNotifications = [newNotif, ...notifications];
    saveNotifications(updatedNotifications);
    
    // Modalni yopish va formani tozalash
    setShowAnnounceModal(false);
    setNewAnnouncement({ title: '', message: '', type: 'announcement' });
    
    alert("E'lon muvaffaqiyatli qo'shildi!");
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    if (window.confirm('Ushbu ogohlantirishni o\'chirmoqchimisiz?')) {
      const updated = notifications.filter(n => n.id !== id);
      saveNotifications(updated);
    }
  };

  const deleteAllRead = () => {
    if (window.confirm('Barcha o\'qilgan ogohlantirishlarni o\'chirmoqchimisiz?')) {
      const updated = notifications.filter(n => !n.read);
      saveNotifications(updated);
    }
  };

  // Faqat admin e'lon qo'sha oladi
  const isAdmin = user?.role === roles.ADMIN;
  
  // Debug uchun
  console.log('User role:', user?.role);
  console.log('Is Admin:', isAdmin);

  // Barcha xabarlarni ko'rsatish
  const filtered = notifications.filter(n => {
    return filter === 'all' || n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Statistikalar
  const stats = {
    total: notifications.length,
    unread: unreadCount,
    read: notifications.length - unreadCount,
    announcement: notifications.filter(n => n.type === 'announcement').length,
    payment: notifications.filter(n => n.type === 'payment').length,
    homework: notifications.filter(n => n.type === 'homework').length,
    event: notifications.filter(n => n.type === 'event').length,
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Ogohlantirishlar</h1>
          <p>Jami {stats.total} ta ogohlantirish, {stats.unread} ta o'qilmagan</p>
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button className="btn-announce" onClick={() => setShowAnnounceModal(true)}>
              <HiOutlinePlus /> E'lon berish
            </button>
          )}
          {unreadCount > 0 && (
            <button className="btn-mark-all" onClick={markAllAsRead}>
              <HiOutlineCheckCircle /> Hammasini o'qilgan deb belgilash
            </button>
          )}
          <button className="btn-delete-all" onClick={deleteAllRead}>
            <HiOutlineTrash /> O'qilganlarni o'chirish
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="notifications-stats">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value">{stats.unread}</div>
          <div className="stat-label">O'qilmagan</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value">{stats.read}</div>
          <div className="stat-label">O'qilgan</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value">{stats.announcement}</div>
          <div className="stat-label">E'lonlar</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="notifications-filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          <HiOutlineBell /> Barchasi
        </button>
        <button className={filter === 'announcement' ? 'active' : ''} onClick={() => setFilter('announcement')}>
          <HiOutlineMail /> E'lonlar
        </button>
        <button className={filter === 'payment' ? 'active' : ''} onClick={() => setFilter('payment')}>
          <HiOutlineCash /> To'lov
        </button>
        <button className={filter === 'homework' ? 'active' : ''} onClick={() => setFilter('homework')}>
          <HiOutlineBookOpen /> Uy vazifasi
        </button>
        <button className={filter === 'event' ? 'active' : ''} onClick={() => setFilter('event')}>
          <HiOutlineSparkles /> Tadbir
        </button>
      </div>

      {/* Xabarlar ro'yxati */}
      <div className="notifications-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <HiOutlineBell size={48} />
            <h3>Hech qanday ogohlantirish yo'q</h3>
            <p>Barcha xabarlarni o'qib bo'ldingiz</p>
            {isAdmin && (
              <button className="btn-announce-empty" onClick={() => setShowAnnounceModal(true)}>
                <HiOutlinePlus /> Yangi e'lon berish
              </button>
            )}
          </div>
        ) : (
          filtered.map(notif => (
            <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
              <div className="notification-icon" style={{ background: `${getTypeColor(notif.type)}15`, color: getTypeColor(notif.type) }}>
                {getTypeIcon(notif.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notif.title}</h3>
                  <span className="type-badge" style={{ background: `${getTypeColor(notif.type)}15`, color: getTypeColor(notif.type) }}>
                    {getTypeName(notif.type)}
                  </span>
                </div>
                <p>{notif.message}</p>
                <div className="notification-meta">
                  <span><HiOutlineCalendar /> {notif.date}</span>
                  <span><HiOutlineClock /> {notif.time || '10:00'}</span>
                  <span><HiOutlineUserGroup /> {notif.author}</span>
                  {notif.authorRole === 'admin' && (
                    <span><HiOutlineShieldCheck /> Admin tomonidan</span>
                  )}
                </div>
              </div>
              <div className="notification-actions">
                {!notif.read && (
                  <button className="mark-read" onClick={() => markAsRead(notif.id)} title="O'qildi deb belgilash">
                    <HiOutlineCheckCircle /> O'qildi
                  </button>
                )}
                {isAdmin && (
                  <button className="delete-btn" onClick={() => deleteNotification(notif.id)} title="O'chirish">
                    <HiOutlineTrash /> O'chirish
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* E'lon berish modal */}
      {showAnnounceModal && (
        <div className="modal-overlay" onClick={() => setShowAnnounceModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineMail /> Yangi e'lon berish</h2>
              <button className="modal-close" onClick={() => setShowAnnounceModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="info-message">
                <HiOutlineGlobe /> Bu e'lon BARCHA foydalanuvchilarga ko'rsatiladi
              </div>
              <div className="form-group">
                <label>Sarlavha *</label>
                <input 
                  type="text" 
                  placeholder="E'lon sarlavhasi" 
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>E'lon matni *</label>
                <textarea 
                  placeholder="E'lon matnini kiriting..." 
                  rows="4"
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>E'lon turi</label>
                <select 
                  value={newAnnouncement.type}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                >
                  <option value="announcement">📢 E'lon</option>
                  <option value="event">🎉 Tadbir</option>
                  <option value="alert">⚠️ Ogohlantirish</option>
                  <option value="payment">💰 To'lov</option>
                  <option value="homework">📚 Uy vazifasi</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddAnnouncement}>
                <HiOutlinePlus /> E'lon berish
              </button>
              <button className="btn-secondary" onClick={() => setShowAnnounceModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;