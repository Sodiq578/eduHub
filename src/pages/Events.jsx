import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineLocationMarker, 
  HiOutlineUser, 
  HiOutlineX, 
  HiOutlineStar,
  HiOutlineBell,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlinePrinter,
  HiOutlineEye,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineFlag,
  HiOutlineCheckCircle,
  HiOutlineClock as HiOutlineReminder
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Events.css';

const Events = () => {
  const { user, roles } = useAuth();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showReminder, setShowReminder] = useState(false);
  const [reminderEvents, setReminderEvents] = useState([]);

  const isAdmin = user?.role === roles.ADMIN;

  useEffect(() => {
    loadEvents();
    checkReminders();
  }, []);

  const loadEvents = () => {
    const stored = localStorage.getItem('events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      const defaultEvents = [
        { id: 1, title: "Ota-onalar yig'ilishi", description: '1-chorak yakunlari bo\'yicha', date: '2025-04-20', time: '15:00', location: 'Maktab majlislar zali', type: 'meeting', participants: 120, isImportant: true, createdAt: '2024-12-01', createdBy: 'Admin', views: 45 },
        { id: 2, title: 'Yil yakuni bayrami', description: 'Yangi yil tadbiri', date: '2025-04-25', time: '10:00', location: 'Maktab sport zali', type: 'holiday', participants: 300, isImportant: false, createdAt: '2024-12-01', createdBy: 'Admin', views: 89 },
        { id: 3, title: 'Imtihon haftaligi', description: 'Yakuniy imtihonlar', date: '2025-04-22', time: '09:00', location: 'Sinflar', type: 'exam', participants: 150, isImportant: true, createdAt: '2024-12-01', createdBy: 'Admin', views: 234 },
        { id: 4, title: 'Sport musobaqasi', description: 'Maktablararo futbol turniri', date: '2025-04-28', time: '14:00', location: 'Sport maydoni', type: 'sport', participants: 200, isImportant: false, createdAt: '2024-12-01', createdBy: 'Admin', views: 67 },
      ];
      setEvents(defaultEvents);
      localStorage.setItem('events', JSON.stringify(defaultEvents));
    }
  };

  const checkReminders = () => {
    const today = new Date();
    const upcoming = events.filter(e => {
      const eventDate = new Date(e.date);
      const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    });
    setReminderEvents(upcoming);
    if (upcoming.length > 0) {
      setShowReminder(true);
      setTimeout(() => setShowReminder(false), 5000);
    }
  };

  const saveEvents = (updated) => { 
    setEvents(updated); 
    localStorage.setItem('events', JSON.stringify(updated)); 
    checkReminders();
  };

  const handleAdd = () => {
    setEditingEvent({ 
      type: 'meeting', 
      participants: 0, 
      isImportant: false,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: user?.name || 'Admin'
    });
    setShowModal(true);
  };

  const handleEdit = (event) => {
    setEditingEvent({ ...event });
    setShowModal(true);
  };

  const handleView = (event) => {
    const updated = events.map(e => e.id === event.id ? { ...e, views: (e.views || 0) + 1 } : e);
    saveEvents(updated);
    setSelectedEvent({ ...event, views: (event.views || 0) + 1 });
    setShowDetailsModal(true);
  };

  const handleSave = () => {
    if (!editingEvent.title || !editingEvent.date) { 
      alert('Iltimos, sarlavha va sanani kiriting!'); 
      return; 
    }
    if (editingEvent.id) { 
      saveEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e)); 
      alert("Tadbir yangilandi!"); 
    } else { 
      saveEvents([{ 
        ...editingEvent, 
        id: Date.now(), 
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: user?.name || 'Admin',
        views: 0
      }, ...events]); 
      alert("Yangi tadbir qo'shildi!"); 
    }
    setShowModal(false); 
    setEditingEvent(null);
  };

  const handleDelete = (id) => { 
    if (window.confirm("Tadbirni o'chirmoqchimisiz?")) { 
      saveEvents(events.filter(e => e.id !== id)); 
      alert("Tadbir o'chirildi!");
    } 
  };

  const toggleImportant = (id) => {
    saveEvents(events.map(e => e.id === id ? { ...e, isImportant: !e.isImportant } : e));
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Sarlavha', 'Sana', 'Vaqt', 'Joy', 'Tur', 'Ishtirokchilar', 'Muhim', "Ko'rishlar"];
    const csvData = filtered.map(e => [
      e.id, e.title, e.date, e.time, e.location, e.type, e.participants, e.isImportant ? 'Ha' : "Yo'q", e.views || 0
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `events_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareEvent = (event) => {
    const text = `${event.title}\nSana: ${event.date} ${event.time || 'Vaqt belgilanmagan'}\nJoy: ${event.location || 'Joy belgilanmagan'}\nTavsif: ${event.description || 'Tavsif mavjud emas'}`;
    navigator.clipboard.writeText(text);
    alert("Tadbir ma'lumotlari nusxalandi!");
  };

  const printCalendar = () => {
    window.print();
  };

  const filtered = events
    .filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            e.location?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === '' || e.type === filterType;
      const matchesDate = filterDate === '' || e.date === filterDate;
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'date') {
        aVal = new Date(a.date);
        bVal = new Date(b.date);
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const upcoming = events.filter(e => new Date(e.date) > new Date()).length;
  const pastEvents = events.filter(e => new Date(e.date) < new Date()).length;
  const totalParticipants = events.reduce((sum, e) => sum + (e.participants || 0), 0);
  const totalViews = events.reduce((sum, e) => sum + (e.views || 0), 0);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'meeting': return <HiOutlineUserGroup />;
      case 'holiday': return <HiOutlineFlag />;
      case 'exam': return <HiOutlineDocumentText />;
      case 'sport': return <HiOutlineCheckCircle />;
      default: return <HiOutlineCalendar />;
    }
  };

  const getTypeClass = (type) => {
    switch(type) {
      case 'meeting': return 'event-type-meeting';
      case 'holiday': return 'event-type-holiday';
      case 'exam': return 'event-type-exam';
      case 'sport': return 'event-type-sport';
      default: return '';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'meeting': return 'Uchrashuv';
      case 'holiday': return 'Bayram';
      case 'exam': return 'Imtihon';
      case 'sport': return 'Sport';
      default: return 'Tadbir';
    }
  };

  const daysLeft = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'O\'tgan';
    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return 'Ertaga';
    return `${diffDays} kun qoldi`;
  };

  const eventTypes = [
    { value: 'meeting', label: 'Uchrashuv', icon: <HiOutlineUserGroup /> },
    { value: 'holiday', label: 'Bayram', icon: <HiOutlineFlag /> },
    { value: 'exam', label: 'Imtihon', icon: <HiOutlineDocumentText /> },
    { value: 'sport', label: 'Sport', icon: <HiOutlineCheckCircle /> }
  ];

  return (
    <div className="events-page">
      {/* Reminder Toast */}
      {showReminder && reminderEvents.length > 0 && (
        <div className="reminder-toast">
          <HiOutlineBell />
          <div className="reminder-content">
            <strong>Eslatma!</strong> {reminderEvents.length} ta tadbir yaqinlashmoqda
          </div>
          <button onClick={() => setShowReminder(false)}><HiOutlineX /></button>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Tadbirlar</h1>
          <p>Jami {events.length} ta tadbir | {upcoming} ta bo'lajak | {pastEvents} ta o'tgan | {totalParticipants} ishtirokchi | {totalViews} ta ko'rish</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-export" onClick={printCalendar}>
            <HiOutlinePrinter /> Chop etish
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlinePlus /> Yangi tadbir
            </button>
          )}
        </div>
      </div>

      <div className="events-stats">
        <div className="stat-card">
          <div className="stat-value">{events.length}</div>
          <div className="stat-label">Jami tadbirlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{upcoming}</div>
          <div className="stat-label">Bo'lajak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{events.filter(e => e.type === 'exam').length}</div>
          <div className="stat-label">Imtihonlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalParticipants}</div>
          <div className="stat-label">Jami ishtirokchilar</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="view-toggle">
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <HiOutlineViewList />
          </button>
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <HiOutlineViewGrid />
          </button>
          <button className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>
            <HiOutlineCalendar />
          </button>
        </div>
        <div className="filter-group">
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Barcha turlar</option>
            {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <input type="date" className="filter-date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} placeholder="Sana bo'yicha" />
        </div>
        <div className="sort-buttons">
          <button className={`sort-btn ${sortBy === 'date' ? 'active' : ''}`} onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
            <HiOutlineCalendar /> Sana bo'yicha {sortBy === 'date' && (sortOrder === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
          </button>
          <button className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`} onClick={() => { setSortBy('title'); setSortOrder('asc'); }}>
            <HiOutlineDocumentText /> Nomi bo'yicha
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="calendar-view">
          <div className="calendar-header">
            {['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 35 }).map((_, idx) => {
              const date = new Date(2025, 3, idx - 2);
              const dateStr = date.toISOString().split('T')[0];
              const dayEvents = events.filter(e => e.date === dateStr);
              return (
                <div key={idx} className="calendar-day">
                  <div className="calendar-date">{date.getDate()}</div>
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className={`calendar-event ${getTypeClass(event.type)}`} onClick={() => handleView(event)}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="calendar-more">+{dayEvents.length - 2}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List/Grid View */}
      <div className={`events-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <HiOutlineCalendar size={48} />
            <p>Hech qanday tadbir topilmadi</p>
            {isAdmin && <button className="btn-primary" onClick={handleAdd}>Yangi tadbir qo'shish</button>}
          </div>
        ) : (
          filtered.map(event => {
            const daysLeftValue = daysLeft(event.date);
            const isPast = daysLeftValue === 'O\'tgan';
            return (
              <div key={event.id} className={`event-card ${getTypeClass(event.type)} ${event.isImportant ? 'important' : ''} ${isPast ? 'past' : ''}`}>
                <div className="event-date">
                  <div className="event-day">{new Date(event.date).getDate()}</div>
                  <div className="event-month">{new Date(event.date).toLocaleString('uz', { month: 'short' })}</div>
                  <div className="event-days-left">{daysLeftValue}</div>
                </div>
                <div className="event-info">
                  <div className="event-header">
                    <h3>
                      <span className="event-type-icon">{getTypeIcon(event.type)}</span>
                      {event.title}
                    </h3>
                    <div className="event-badges">
                      {event.isImportant && <span className="important-badge"><HiOutlineStar /> Muhim</span>}
                      {isPast && <span className="past-badge"><HiOutlineCalendar /> O'tgan</span>}
                      <button className="important-btn" onClick={() => toggleImportant(event.id)}>
                        <HiOutlineStar className={event.isImportant ? 'active' : ''} />
                      </button>
                    </div>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <span><HiOutlineClock /> {event.time || 'Vaqt belgilanmagan'}</span>
                    <span><HiOutlineLocationMarker /> {event.location || 'Joy belgilanmagan'}</span>
                    <span><HiOutlineUser /> {event.participants || 0} kishi</span>
                    <span><HiOutlineCalendar /> {event.date}</span>
                    <span><HiOutlineEye /> {event.views || 0} ko'rish</span>
                  </div>
                  <div className="event-footer">
                    <span className="event-type-badge">{getTypeIcon(event.type)} {getTypeLabel(event.type)}</span>
                    <span className="event-created"><HiOutlineCalendar /> Yaratilgan: {event.createdAt}</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="view-btn" onClick={() => handleView(event)} title="Ko'rish">
                    <HiOutlineEye />
                  </button>
                  <button className="share-btn" onClick={() => shareEvent(event)} title="Ulashish">
                    <HiOutlineShare />
                  </button>
                  {isAdmin && (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(event)} title="Tahrirlash">
                        <HiOutlinePencil />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(event.id)} title="O'chirish">
                        <HiOutlineTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item"><span className="detail-label">Tur:</span><span className="detail-value">{getTypeIcon(selectedEvent.type)} {getTypeLabel(selectedEvent.type)}</span></div>
                <div className="detail-item"><span className="detail-label">Sana:</span><span className="detail-value">{selectedEvent.date}</span></div>
                <div className="detail-item"><span className="detail-label">Vaqt:</span><span className="detail-value">{selectedEvent.time || 'Vaqt belgilanmagan'}</span></div>
                <div className="detail-item"><span className="detail-label">Joy:</span><span className="detail-value">{selectedEvent.location || 'Joy belgilanmagan'}</span></div>
                <div className="detail-item"><span className="detail-label">Ishtirokchilar:</span><span className="detail-value">{selectedEvent.participants || 0} kishi</span></div>
                <div className="detail-item"><span className="detail-label">Ko'rishlar:</span><span className="detail-value">{selectedEvent.views || 0}</span></div>
                <div className="detail-item"><span className="detail-label">Muhimlik:</span><span className="detail-value">{selectedEvent.isImportant ? 'Muhim' : 'Oddiy'}</span></div>
                <div className="detail-item full-width"><span className="detail-label">Tavsif:</span><span className="detail-value">{selectedEvent.description || 'Tavsif mavjud emas'}</span></div>
                <div className="detail-item full-width"><span className="detail-label">Yaratilgan:</span><span className="detail-value">{selectedEvent.createdAt} | {selectedEvent.createdBy}</span></div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent?.id ? 'Tadbir tahrirlash' : 'Yangi tadbir'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Sarlavha *</label>
                <input type="text" value={editingEvent?.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} placeholder="Tadbir sarlavhasi" />
              </div>
              <div className="form-group">
                <label>Tavsif</label>
                <textarea rows="3" value={editingEvent?.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} placeholder="Tadbir haqida qisqacha" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sana *</label>
                  <input type="date" value={editingEvent?.date || ''} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Vaqt</label>
                  <input type="time" value={editingEvent?.time || ''} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Joy</label>
                  <input type="text" value={editingEvent?.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} placeholder="Tadbir joyi" />
                </div>
                <div className="form-group">
                  <label>Tur</label>
                  <select value={editingEvent?.type || 'meeting'} onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}>
                    {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ishtirokchilar soni</label>
                  <input type="number" value={editingEvent?.participants || 0} onChange={(e) => setEditingEvent({ ...editingEvent, participants: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={editingEvent?.isImportant || false} onChange={(e) => setEditingEvent({ ...editingEvent, isImportant: e.target.checked })} />
                    <HiOutlineStar /> Muhim tadbir
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;