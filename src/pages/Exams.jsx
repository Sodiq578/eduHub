import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi';
import './Exams.css';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    const storedExams = localStorage.getItem('exams');
    if (storedExams) {
      setExams(JSON.parse(storedExams));
    } else {
      const defaultExams = [
        { id: 1, title: 'Matematika 1-chorak', subject: 'Matematika', date: '2024-12-15', duration: 60, totalScore: 50, status: 'upcoming', questions: 25 },
        { id: 2, title: 'Fizika O\'rtacha', subject: 'Fizika', date: '2024-12-10', duration: 45, totalScore: 40, status: 'completed', questions: 20 },
        { id: 3, title: 'Ingliz tili Test', subject: 'Ingliz tili', date: '2024-12-20', duration: 30, totalScore: 30, status: 'upcoming', questions: 15 },
      ];
      setExams(defaultExams);
      localStorage.setItem('exams', JSON.stringify(defaultExams));
    }
  }, []);

  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem('exams', JSON.stringify(exams));
    }
  }, [exams]);

  const handleSaveExam = () => {
    if (editingExam) {
      setExams(exams.map(exam => exam.id === editingExam.id ? editingExam : exam));
    } else {
      setExams([...exams, { ...editingExam, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingExam(null);
  };

  const handleDeleteExam = (id) => {
    if (window.confirm('Imtihonni o\'chirmoqchimisiz?')) {
      setExams(exams.filter(exam => exam.id !== id));
    }
  };

  const filteredExams = exams.filter(exam => {
    return exam.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSubject === '' || exam.subject === filterSubject);
  });

  const subjects = ['Hammasi', 'Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya'];

  return (
    <div className="exams-page">
      <div className="page-header">
        <div>
          <h1>Imtihonlar va Testlar</h1>
          <p>Jami {filteredExams.length} ta imtihon</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingExam({}); setShowModal(true); }}>
          <HiOutlinePlus /> Yangi imtihon
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input type="text" placeholder="Imtihon qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="filter-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
      </div>

      <div className="exams-stats">
        <div className="stat-card">
          <div className="stat-value">{exams.filter(e => e.status === 'upcoming').length}</div>
          <div className="stat-label">Kutilayotgan</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{exams.filter(e => e.status === 'completed').length}</div>
          <div className="stat-label">Tugallangan</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{exams.reduce((sum, e) => sum + e.totalScore, 0)}</div>
          <div className="stat-label">Jami ball</div>
        </div>
      </div>

      <div className="exams-grid">
        {filteredExams.map(exam => (
          <div key={exam.id} className={`exam-card ${exam.status}`}>
            <div className="exam-card-header">
              <div className="exam-icon"><HiOutlineDocumentText /></div>
              <div className="exam-info">
                <h3>{exam.title}</h3>
                <p>{exam.subject}</p>
              </div>
              <button className="card-menu-btn" onClick={() => { setEditingExam(exam); setShowModal(true); }}><HiOutlinePencil /></button>
            </div>
            <div className="exam-card-body">
              <div className="exam-detail"><HiOutlineCalendar /> {exam.date}</div>
              <div className="exam-detail"><HiOutlineClock /> {exam.duration} daqiqa</div>
              <div className="exam-detail"><HiOutlineChartBar /> {exam.totalScore} ball</div>
            </div>
            <div className="exam-card-footer">
              <span className={`status-badge ${exam.status}`}>{exam.status === 'upcoming' ? 'Kutilmoqda' : 'Tugallangan'}</span>
              <button className="view-btn"><HiOutlineEye /> Ko'rish</button>
              <button className="delete-btn" onClick={() => handleDeleteExam(exam.id)}><HiOutlineTrash /> O'chirish</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingExam?.id ? 'Imtihon tahrirlash' : 'Yangi imtihon'}</h2>
            <input type="text" placeholder="Imtihon nomi" value={editingExam?.title || ''} onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })} />
            <select value={editingExam?.subject || ''} onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}>
              <option value="">Fan tanlang</option>
              <option>Matematika</option><option>Fizika</option><option>Ingliz tili</option>
            </select>
            <input type="date" value={editingExam?.date || ''} onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })} />
            <input type="number" placeholder="Davomiyligi (daqiqa)" value={editingExam?.duration || ''} onChange={(e) => setEditingExam({ ...editingExam, duration: parseInt(e.target.value) })} />
            <input type="number" placeholder="Umumiy ball" value={editingExam?.totalScore || ''} onChange={(e) => setEditingExam({ ...editingExam, totalScore: parseInt(e.target.value) })} />
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveExam}>Saqlash</button>
              <button className="btn-secondary" onClick={() => { setShowModal(false); setEditingExam(null); }}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;