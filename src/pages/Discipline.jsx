import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineStar, 
  HiOutlineExclamationCircle, 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineX, 
  HiOutlineFilter, 
  HiOutlineDownload
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Discipline.css';

const Discipline = () => {
  const { user, roles } = useAuth();
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.TEACHER;

  useEffect(() => {
    const stored = localStorage.getItem('discipline_records');
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      const defaultRecords = [
        { id: 1, studentName: 'Ali Valiyev', type: 'award', title: 'Matematika olimpiadasi g\'olibi', description: 'Shahar bosqichi 1-o\'rin', date: '2024-11-15', points: 10, teacher: 'Shahzoda Ahmedova' },
        { id: 2, studentName: 'Dilnoza Karimova', type: 'award', title: 'Eng yaxshi o\'quvchi', description: '1-chorak yakunlari bo\'yicha', date: '2024-11-30', points: 5, teacher: 'Shahzoda Ahmedova' },
        { id: 3, studentName: 'Jasur Aliyev', type: 'warning', title: 'Darsga kech qolish', description: '3-marta ogohlantirish', date: '2024-12-01', points: -2, teacher: 'Rustam Karimov' },
      ];
      setRecords(defaultRecords);
      localStorage.setItem('discipline_records', JSON.stringify(defaultRecords));
    }
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);
  }, []);

  const saveRecords = (updated) => { 
    setRecords(updated); 
    localStorage.setItem('discipline_records', JSON.stringify(updated)); 
  };

  const handleSave = () => {
    if (!editingRecord.studentName || !editingRecord.title) { 
      alert('Iltimos, o\'quvchi va sarlavhani kiriting!'); 
      return; 
    }
    if (editingRecord.id) { 
      saveRecords(records.map(r => r.id === editingRecord.id ? editingRecord : r)); 
      alert("Yangilandi!"); 
    } else { 
      saveRecords([{ ...editingRecord, id: Date.now() }, ...records]); 
      alert("Qo'shildi!"); 
    }
    setShowModal(false); 
    setEditingRecord(null);
  };

  const handleDelete = (id) => { 
    if (window.confirm('O\'chirmoqchimisiz?')) { 
      saveRecords(records.filter(r => r.id !== id)); 
      alert("O'chirildi!"); 
    } 
  };

  const filtered = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterType === 'all' || r.type === filterType)
  );
  
  const awards = records.filter(r => r.type === 'award').length;
  const warnings = records.filter(r => r.type === 'warning').length;
  const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0);

  const studentPoints = students.map(s => ({ 
    name: s.name, 
    points: records.filter(r => r.studentName === s.name).reduce((p, r) => p + (r.points || 0), 0) 
  })).sort((a,b) => b.points - a.points).slice(0,5);

  const exportToCSV = () => {
    const headers = ['ID', 'O\'quvchi', 'Tur', 'Sarlavha', 'Tavsif', 'Sana', 'Ball', 'O\'qituvchi'];
    const csvData = records.map(r => [r.id, r.studentName, r.type === 'award' ? 'Mukofot' : 'Ogohlantirish', r.title, r.description, r.date, r.points, r.teacher]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discipline_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="discipline-page">
      <div className="page-header">
        <div><h1>Mukofotlar va Intizom</h1><p>Jami {records.length} ta yozuv | {awards} ta mukofot | {warnings} ta ogohlantirish | Umumiy ball: {totalPoints}</p></div>
        <div className="header-buttons">
          {isAdmin && <button className="btn-primary" onClick={() => { setEditingRecord({}); setShowModal(true); }}><HiOutlinePlus /> Yangi yozuv</button>}
          <button className="btn-export" onClick={exportToCSV}><HiOutlineDownload /> Hisobot</button>
        </div>
      </div>

      <div className="discipline-stats">
        <div className="stat-card award"><div className="stat-value">{awards}</div><div className="stat-label"><HiOutlineStar /> Mukofotlar</div></div>
        <div className="stat-card warning"><div className="stat-value">{warnings}</div><div className="stat-label"><HiOutlineExclamationCircle /> Ogohlantirishlar</div></div>
        <div className="stat-card"><div className="stat-value">{totalPoints}</div><div className="stat-label">Umumiy ball</div></div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper"><HiOutlineSearch /><input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Barcha</option><option value="award">🏆 Mukofotlar</option><option value="warning">⚠️ Ogohlantirishlar</option>
        </select>
      </div>

      <div className="discipline-grid">
        {filtered.map(r => (
          <div key={r.id} className={`record-card ${r.type}`}>
            <div className="record-icon">{r.type === 'award' ? <HiOutlineStar /> : <HiOutlineExclamationCircle />}</div>
            <div className="record-info">
              <h3>{r.title}</h3>
              <p className="record-student"><HiOutlineUser /> {r.studentName}</p>
              <p className="record-desc">{r.description}</p>
              <div className="record-meta"><HiOutlineCalendar /> {r.date} | {r.type === 'award' ? `+${r.points} ball` : `${r.points} ball`} | 👨‍🏫 {r.teacher}</div>
            </div>
            {isAdmin && (
              <div className="record-actions">
                <button className="edit-btn" onClick={() => { setEditingRecord(r); setShowModal(true); }}><HiOutlinePencil /></button>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}><HiOutlineTrash /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="top-students">
        <h3><HiOutlineStar /> Eng yaxshi o'quvchilar</h3>
        <div className="top-list">{studentPoints.map((s,idx) => (<div key={idx} className="top-item"><span className="top-rank">{idx+1}</span><span className="top-name">{s.name}</span><span className="top-points">{s.points} ball</span></div>))}</div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{editingRecord?.id ? 'Tahrirlash' : 'Yangi yozuv'}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div>
            <div className="modal-body">
              <div className="form-row"><div className="form-group"><label>O'quvchi *</label><select value={editingRecord?.studentName || ''} onChange={(e) => setEditingRecord({ ...editingRecord, studentName: e.target.value })}><option value="">Tanlang</option>{students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}</select></div>
              <div className="form-group"><label>Tur *</label><select value={editingRecord?.type || 'award'} onChange={(e) => setEditingRecord({ ...editingRecord, type: e.target.value, points: e.target.value === 'award' ? 5 : -2 })}><option value="award">🏆 Mukofot</option><option value="warning">⚠️ Ogohlantirish</option></select></div></div>
              <div className="form-group"><label>Sarlavha *</label><input type="text" value={editingRecord?.title || ''} onChange={(e) => setEditingRecord({ ...editingRecord, title: e.target.value })} /></div>
              <div className="form-group"><label>Tavsif</label><textarea rows="3" value={editingRecord?.description || ''} onChange={(e) => setEditingRecord({ ...editingRecord, description: e.target.value })} /></div>
              <div className="form-row"><div className="form-group"><label>Sana</label><input type="date" value={editingRecord?.date || ''} onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })} /></div>
              <div className="form-group"><label>Ball</label><input type="number" value={editingRecord?.points || 0} onChange={(e) => setEditingRecord({ ...editingRecord, points: parseInt(e.target.value) })} /></div></div>
              <div className="form-group"><label>O'qituvchi</label><input type="text" value={editingRecord?.teacher || ''} onChange={(e) => setEditingRecord({ ...editingRecord, teacher: e.target.value })} /></div>
            </div>
            <div className="modal-buttons"><button className="btn-primary" onClick={handleSave}>Saqlash</button><button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Discipline;