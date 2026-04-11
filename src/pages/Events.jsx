import React, { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker, HiOutlineUser, HiOutlineX, HiOutlineFilter } from 'react-icons/hi';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('events');
    if (stored) setEvents(JSON.parse(stored));
    else {
      const defaultEvents = [
        { id: 1, title: 'Ota-onalar yig\'ilishi', description: '1-chorak yakunlari bo\'yicha', date: '2024-12-15', time: '15:00', location: 'Maktab majlislar zali', type: 'meeting', participants: 120 },
        { id: 2, title: 'Yil yakuni bayrami', description: 'Yangi yil tadbiri', date: '2024-12-25', time: '10:00', location: 'Maktab sport zali', type: 'holiday', participants: 300 },
        { id: 3, title: 'Imtihon haftaligi', description: 'Yakuniy imtihonlar', date: '2024-12-20', time: '09:00', location: 'Sinflar', type: 'exam', participants: 150 },
      ];
      setEvents(defaultEvents);
      localStorage.setItem('events', JSON.stringify(defaultEvents));
    }
  }, []);

  const saveEvents = (updated) => { setEvents(updated); localStorage.setItem('events', JSON.stringify(updated)); };

  const handleSave = () => {
    if (!editingEvent.title || !editingEvent.date) { alert('Iltimos, sarlavha va sanani kiriting!'); return; }
    if (editingEvent.id) { saveEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e)); alert("Yangilandi!"); }
    else { saveEvents([{ ...editingEvent, id: Date.now() }, ...events]); alert("Qo'shildi!"); }
    setShowModal(false); setEditingEvent(null);
  };

  const handleDelete = (id) => { if (window.confirm("O'chirmoqchimisiz?")) { saveEvents(events.filter(e => e.id !== id)); } };

  const filtered = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType === '' || e.type === filterType));
  const upcoming = events.filter(e => new Date(e.date) > new Date()).length;

  return (
    <div className="events-page">
      <div className="page-header"><div><h1>Tadbirlar</h1><p>Jami {events.length} ta tadbir | {upcoming} ta bo'lajak</p></div><button className="btn-primary" onClick={() => { setEditingEvent({}); setShowModal(true); }}><HiOutlinePlus /> Yangi tadbir</button></div>
      <div className="events-stats"><div className="stat-card"><div className="stat-value">{events.length}</div><div className="stat-label">Jami tadbirlar</div></div><div className="stat-card"><div className="stat-value">{upcoming}</div><div className="stat-label">Bo'lajak</div></div></div>
      <div className="filters-bar"><div className="search-wrapper"><HiOutlineSearch /><input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="">Barcha turlar</option><option value="meeting">Uchrashuv</option><option value="holiday">Bayram</option><option value="exam">Imtihon</option><option value="sport">Sport</option></select></div>
      <div className="events-list">{filtered.map(e => (<div key={e.id} className={`event-card ${e.type}`}><div className="event-date"><div className="event-day">{new Date(e.date).getDate()}</div><div className="event-month">{new Date(e.date).toLocaleString('uz', { month: 'short' })}</div></div><div className="event-info"><h3>{e.title}</h3><p>{e.description}</p><div className="event-meta"><HiOutlineClock /> {e.time} | <HiOutlineLocationMarker /> {e.location} | <HiOutlineUser /> {e.participants} kishi</div></div><div className="event-actions"><button className="edit-btn" onClick={() => { setEditingEvent(e); setShowModal(true); }}><HiOutlinePencil /></button><button className="delete-btn" onClick={() => handleDelete(e.id)}><HiOutlineTrash /></button></div></div>))}</div>
      {showModal && (<div className="modal-overlay"><div className="modal-content"><div className="modal-header"><h2>{editingEvent?.id ? 'Tahrirlash' : 'Yangi tadbir'}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div><div className="modal-body"><div className="form-group"><label>Sarlavha *</label><input type="text" value={editingEvent?.title || ''} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} /></div><div className="form-group"><label>Tavsif</label><textarea rows="3" value={editingEvent?.description || ''} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} /></div><div className="form-row"><div className="form-group"><label>Sana *</label><input type="date" value={editingEvent?.date || ''} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} /></div><div className="form-group"><label>Vaqt</label><input type="time" value={editingEvent?.time || ''} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} /></div></div><div className="form-row"><div className="form-group"><label>Joy</label><input type="text" value={editingEvent?.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} /></div><div className="form-group"><label>Tur</label><select value={editingEvent?.type || 'meeting'} onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}><option value="meeting">Uchrashuv</option><option value="holiday">Bayram</option><option value="exam">Imtihon</option><option value="sport">Sport</option></select></div></div><div className="form-group"><label>Ishtirokchilar soni</label><input type="number" value={editingEvent?.participants || 0} onChange={(e) => setEditingEvent({ ...editingEvent, participants: parseInt(e.target.value) })} /></div></div><div className="modal-buttons"><button className="btn-primary" onClick={handleSave}>Saqlash</button><button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button></div></div></div>)}
    </div>
  );
};
export default Events;