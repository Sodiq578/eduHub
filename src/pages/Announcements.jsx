import React, { useState, useEffect } from 'react';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineBell, 
  HiOutlineCalendar, 
  HiOutlineEye,
  HiOutlineX,
  HiOutlineSpeakerphone,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineFilter,
  HiOutlineDownload
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Announcements.css';

const Announcements = () => {
  const { user, roles } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Load announcements
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    const stored = localStorage.getItem('announcements');
    if (stored) {
      setAnnouncements(JSON.parse(stored));
    } else {
      const defaultAnnouncements = [
        { 
          id: 1, 
          title: '1-chorak yakunlandi', 
          content: 'Hurmatli o\'quvchilar va ota-onalar! 1-chorak muvaffaqiyatli yakunlandi. Barcha o\'quvchilarni tabriklaymiz!', 
          date: '2024-11-30', 
          priority: 'high', 
          views: 45,
          author: 'Administrator',
          authorRole: 'admin'
        },
        { 
          id: 2, 
          title: 'Ota-onalar yig\'ilishi', 
          content: '10-dekabr kuni soat 15:00 da onlayn ota-onalar yig\'ilishi bo\'lib o\'tadi. Havola keyinroq beriladi.', 
          date: '2024-12-05', 
          priority: 'medium', 
          views: 28,
          author: 'Administrator',
          authorRole: 'admin'
        },
        { 
          id: 3, 
          title: 'Yangi dars jadvali', 
          content: '2-chorak uchun yangi dars jadvali tayyor. Batafsil ma\'lumot uchun Dars jadvali bo\'limiga qarang.', 
          date: '2024-12-01', 
          priority: 'low', 
          views: 32,
          author: 'Administrator',
          authorRole: 'admin'
        },
      ];
      setAnnouncements(defaultAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(defaultAnnouncements));
    }
  };

  // Save announcements
  const saveAnnouncements = (updatedAnnouncements) => {
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
  };

  // Faqat admin e'lon qo'sha oladi
  const isAdmin = user?.role === roles.ADMIN;

  const handleSave = () => {
    if (!editingAnnouncement.title || !editingAnnouncement.title.trim()) {
      alert('Iltimos, sarlavhani kiriting!');
      return;
    }
    if (!editingAnnouncement.content || !editingAnnouncement.content.trim()) {
      alert('Iltimos, e\'lon matnini kiriting!');
      return;
    }
    
    let updatedAnnouncements;
    if (editingAnnouncement.id) {
      // Tahrirlash
      updatedAnnouncements = announcements.map(a => 
        a.id === editingAnnouncement.id ? { ...editingAnnouncement, title: editingAnnouncement.title.trim(), content: editingAnnouncement.content.trim() } : a
      );
      alert("E'lon yangilandi!");
    } else {
      // Yangi qo'shish
      const newAnnouncement = { 
        ...editingAnnouncement, 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0], 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        views: 0,
        author: user?.name || 'Administrator',
        authorRole: user?.role || 'admin'
      };
      updatedAnnouncements = [newAnnouncement, ...announcements];
      alert("Yangi e'lon qo'shildi!");
    }
    
    saveAnnouncements(updatedAnnouncements);
    setShowModal(false);
    setEditingAnnouncement(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('E\'lonni o\'chirmoqchimisiz?')) {
      const updatedAnnouncements = announcements.filter(a => a.id !== id);
      saveAnnouncements(updatedAnnouncements);
      alert("E'lon o'chirildi!");
    }
  };

  const handleView = (ann) => {
    const updated = { ...ann, views: ann.views + 1 };
    const updatedAnnouncements = announcements.map(a => a.id === ann.id ? updated : a);
    saveAnnouncements(updatedAnnouncements);
  };

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case 'high': return 'Yuqori';
      case 'medium': return 'O\'rta';
      case 'low': return 'Past';
      default: return 'O\'rta';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#f59e0b';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <HiOutlineBell />;
      case 'medium': return <HiOutlineClock />;
      case 'low': return <HiOutlineCalendar />;
      default: return <HiOutlineBell />;
    }
  };

  // Filter va search
  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || ann.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Statistikalar
  const stats = {
    total: announcements.length,
    high: announcements.filter(a => a.priority === 'high').length,
    medium: announcements.filter(a => a.priority === 'medium').length,
    low: announcements.filter(a => a.priority === 'low').length,
    totalViews: announcements.reduce((sum, a) => sum + a.views, 0)
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Sarlavha', 'Matn', 'Sana', 'Ahamiyati', "Ko'rishlar soni", 'Muallif'];
    const csvData = announcements.map(a => [
      a.id, a.title, a.content, a.date, getPriorityLabel(a.priority), a.views, a.author
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `announcements_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div>
          <h1>E'lonlar va Yangiliklar</h1>
          <p>Jami {stats.total} ta e'lon | {stats.totalViews} marta ko'rilgan</p>
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button 
              className="btn-primary" 
              onClick={() => { 
                setEditingAnnouncement({ title: '', content: '', priority: 'medium' }); 
                setShowModal(true); 
              }}
            >
              <HiOutlinePlus /> Yangi e'lon
            </button>
          )}
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="announcements-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami e'lonlar</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <div className="stat-value">{stats.high}</div>
          <div className="stat-label">Muhim</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value">{stats.medium}</div>
          <div className="stat-label">O'rta</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">{stats.low}</div>
          <div className="stat-label">Past</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value">{stats.totalViews}</div>
          <div className="stat-label">Jami ko'rishlar</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="E'lon qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <HiOutlineFilter />
          <select 
            className="filter-select" 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Barcha ahamiyatlar</option>
            <option value="high">Yuqori ahamiyatli</option>
            <option value="medium">O'rta ahamiyatli</option>
            <option value="low">Past ahamiyatli</option>
          </select>
        </div>
      </div>

      {/* E'lonlar ro'yxati */}
      <div className="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <HiOutlineSpeakerphone size={48} />
            <h3>Hech qanday e'lon yo'q</h3>
            <p>Hali hech qanday e'lon qo'shilmagan</p>
            {isAdmin && (
              <button 
                className="btn-primary" 
                onClick={() => { 
                  setEditingAnnouncement({ title: '', content: '', priority: 'medium' }); 
                  setShowModal(true); 
                }}
              >
                <HiOutlinePlus /> Birinchi e'lonni qo'shish
              </button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map(ann => (
            <div key={ann.id} className={`announcement-card priority-${ann.priority}`}>
              <div className="announcement-icon" style={{ background: `${getPriorityColor(ann.priority)}15`, color: getPriorityColor(ann.priority) }}>
                {getPriorityIcon(ann.priority)}
              </div>
              <div className="announcement-content">
                <div className="announcement-header">
                  <h3>{ann.title}</h3>
                  <span className={`priority-badge priority-${ann.priority}`} style={{ background: `${getPriorityColor(ann.priority)}15`, color: getPriorityColor(ann.priority) }}>
                    {getPriorityLabel(ann.priority)}
                  </span>
                </div>
                <p>{ann.content}</p>
                <div className="announcement-meta">
                  <span><HiOutlineCalendar /> {new Date(ann.date).toLocaleDateString('uz-UZ')}</span>
                  <span><HiOutlineEye /> {ann.views} marta ko'rilgan</span>
                  <span><HiOutlineUserGroup /> {ann.author}</span>
                </div>
              </div>
              <div className="announcement-actions">
                <button className="view-btn" onClick={() => handleView(ann)}>
                  <HiOutlineEye /> Ko'rish
                </button>
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => { setEditingAnnouncement(ann); setShowModal(true); }}>
                      <HiOutlinePencil /> Tahrirlash
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(ann.id)}>
                      <HiOutlineTrash /> O'chirish
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal oyna */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAnnouncement?.id ? 'E\'lon tahrirlash' : 'Yangi e\'lon'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="info-message">
                <HiOutlineBell /> Bu e'lon BARCHA foydalanuvchilarga ko'rsatiladi
              </div>
              <div className="form-group">
                <label>Sarlavha *</label>
                <input 
                  type="text" 
                  placeholder="E'lon sarlavhasi" 
                  value={editingAnnouncement?.title || ''} 
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>E'lon matni *</label>
                <textarea 
                  placeholder="E'lon matnini kiriting..." 
                  rows="5" 
                  value={editingAnnouncement?.content || ''} 
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                ></textarea>
              </div>
              <div className="form-group">
                <label>Ahamiyat darajasi</label>
                <select 
                  value={editingAnnouncement?.priority || 'medium'} 
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value })}
                >
                  <option value="high">🔴 Yuqori ahamiyatli</option>
                  <option value="medium">🟡 O'rta ahamiyatli</option>
                  <option value="low">🟢 Past ahamiyatli</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingAnnouncement?.id ? 'Yangilash' : 'E\'lon berish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;