import React, { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineBriefcase, HiOutlineAcademicCap, HiOutlineX, HiOutlineDownload, HiOutlineChartBar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Alumni.css';

const Alumni = () => {
  const { user, roles } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const isAdmin = user?.role === roles.ADMIN;

  useEffect(() => {
    const stored = localStorage.getItem('alumni');
    if (stored) setAlumni(JSON.parse(stored));
    else {
      const defaultAlumni = [
        { id: 1, name: 'Sardor Rahimov', graduationYear: 2023, currentStudy: 'Toshkent Davlat Universiteti', currentWork: 'Dasturchi', phone: '+998 90 111 2233', email: 'sardor@example.com', major: 'Matematika', grade: 92, status: 'active' },
        { id: 2, name: 'Madina Azimova', graduationYear: 2023, currentStudy: 'Inha Universiteti', currentWork: '', phone: '+998 91 222 3344', email: 'madina@example.com', major: 'Ingliz tili', grade: 95, status: 'active' },
        { id: 3, name: 'Jasur Akbarov', graduationYear: 2022, currentStudy: '', currentWork: 'Google', phone: '+998 93 333 4455', email: 'jasur@example.com', major: 'Informatika', grade: 98, status: 'active' },
      ];
      setAlumni(defaultAlumni);
      localStorage.setItem('alumni', JSON.stringify(defaultAlumni));
    }
  }, []);

  const saveAlumni = (updated) => { setAlumni(updated); localStorage.setItem('alumni', JSON.stringify(updated)); };

  const handleSave = () => {
    if (!editingAlumni.name || !editingAlumni.graduationYear) { alert('Iltimos, ism va bitiruv yilini kiriting!'); return; }
    if (editingAlumni.id) { saveAlumni(alumni.map(a => a.id === editingAlumni.id ? editingAlumni : a)); alert("Ma'lumot yangilandi!"); }
    else { saveAlumni([{ ...editingAlumni, id: Date.now() }, ...alumni]); alert("Bitiruvchi qo'shildi!"); }
    setShowModal(false); setEditingAlumni(null);
  };

  const handleDelete = (id) => { if (window.confirm('O\'chirmoqchimisiz?')) { saveAlumni(alumni.filter(a => a.id !== id)); alert("O'chirildi!"); } };

  const filtered = alumni.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || (filterYear === '' || a.graduationYear === parseInt(filterYear)));
  const years = [...new Set(alumni.map(a => a.graduationYear))].sort((a,b)=>b-a);
  const stats = { total: alumni.length, university: alumni.filter(a => a.currentStudy).length, employed: alumni.filter(a => a.currentWork).length, avgGrade: (alumni.reduce((s,a)=>s+a.grade,0)/alumni.length||0).toFixed(1) };

  return (
    <div className="alumni-page">
      <div className="page-header"><div><h1>Bitiruvchilar</h1><p>Jami {stats.total} nafar bitiruvchi | {stats.university} ta universitet | {stats.employed} ta ish bilan band</p></div>{isAdmin && <button className="btn-primary" onClick={() => { setEditingAlumni({}); setShowModal(true); }}><HiOutlinePlus /> Bitiruvchi qo'shish</button>}</div>
      <div className="alumni-stats"><div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Jami bitiruvchilar</div></div><div className="stat-card"><div className="stat-value">{stats.university}</div><div className="stat-label">O'qiyotganlar</div></div><div className="stat-card"><div className="stat-value">{stats.employed}</div><div className="stat-label">Ishlayotganlar</div></div><div className="stat-card"><div className="stat-value">{stats.avgGrade}%</div><div className="stat-label">O'rtacha baho</div></div></div>
      <div className="filters-bar"><div className="search-wrapper"><HiOutlineSearch /><input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}><option value="">Barcha yillar</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
      <div className="alumni-grid">{filtered.map(a => (<div key={a.id} className="alumni-card"><div className="alumni-avatar">{a.name.charAt(0)}</div><div className="alumni-info"><h3>{a.name}</h3><p className="alumni-year"><HiOutlineCalendar /> Bitirgan: {a.graduationYear} | Fan: {a.major} | Baho: {a.grade}%</p>{a.currentStudy && <p className="alumni-study"><HiOutlineAcademicCap /> {a.currentStudy}</p>}{a.currentWork && <p className="alumni-work"><HiOutlineBriefcase /> {a.currentWork}</p>}<div className="alumni-contacts"><HiOutlinePhone /> {a.phone} | <HiOutlineMail /> {a.email}</div></div>{isAdmin && <div className="alumni-actions"><button className="edit-btn" onClick={() => { setEditingAlumni(a); setShowModal(true); }}><HiOutlinePencil /></button><button className="delete-btn" onClick={() => handleDelete(a.id)}><HiOutlineTrash /></button></div>}</div>))}</div>
      {showModal && (<div className="modal-overlay"><div className="modal-content"><div className="modal-header"><h2>{editingAlumni?.id ? 'Tahrirlash' : 'Yangi bitiruvchi'}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div><div className="modal-body"><div className="form-row"><div className="form-group"><label>Ism *</label><input type="text" value={editingAlumni?.name || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, name: e.target.value })} /></div><div className="form-group"><label>Bitiruv yili *</label><input type="number" value={editingAlumni?.graduationYear || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, graduationYear: parseInt(e.target.value) })} /></div></div><div className="form-row"><div className="form-group"><label>Mutaxassislik</label><input type="text" value={editingAlumni?.major || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, major: e.target.value })} /></div><div className="form-group"><label>O'rtacha baho</label><input type="number" value={editingAlumni?.grade || 0} onChange={(e) => setEditingAlumni({ ...editingAlumni, grade: parseInt(e.target.value) })} /></div></div><div className="form-group"><label>O'qish joyi</label><input type="text" placeholder="Universitet nomi" value={editingAlumni?.currentStudy || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, currentStudy: e.target.value })} /></div><div className="form-group"><label>Ish joyi</label><input type="text" placeholder="Kompaniya nomi" value={editingAlumni?.currentWork || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, currentWork: e.target.value })} /></div><div className="form-row"><div className="form-group"><label>Telefon</label><input type="tel" value={editingAlumni?.phone || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, phone: e.target.value })} /></div><div className="form-group"><label>Email</label><input type="email" value={editingAlumni?.email || ''} onChange={(e) => setEditingAlumni({ ...editingAlumni, email: e.target.value })} /></div></div></div><div className="modal-buttons"><button className="btn-primary" onClick={handleSave}>Saqlash</button><button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button></div></div></div>)}
    </div>
  );
};
export default Alumni;