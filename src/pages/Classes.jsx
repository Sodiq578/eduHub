import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineDotsVertical,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineBookOpen
} from 'react-icons/hi';
import './Classes.css';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [teachers, setTeachers] = useState([]);

  // LocalStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    loadClasses();
    loadTeachers();
  }, []);

  const loadClasses = () => {
    const stored = localStorage.getItem('classes');
    if (stored) {
      setClasses(JSON.parse(stored));
    } else {
      const defaultClasses = [
        { id: 1, name: '10-A', grade: 10, section: 'A', students: 28, teacher: 'Shahzoda Ahmedova', room: '201', schedule: '08:00 - 14:30', average: 87 },
        { id: 2, name: '10-B', grade: 10, section: 'B', students: 26, teacher: 'Rustam Karimov', room: '202', schedule: '08:00 - 14:30', average: 84 },
        { id: 3, name: '9-A', grade: 9, section: 'A', students: 30, teacher: 'Gulnora Saidova', room: '101', schedule: '08:00 - 14:30', average: 82 },
        { id: 4, name: '11-A', grade: 11, section: 'A', students: 24, teacher: 'Alisher Tursunov', room: '301', schedule: '08:00 - 14:30', average: 89 },
        { id: 5, name: '8-A', grade: 8, section: 'A', students: 32, teacher: 'Nilufar Rahimova', room: '102', schedule: '08:00 - 14:30', average: 79 },
      ];
      setClasses(defaultClasses);
      localStorage.setItem('classes', JSON.stringify(defaultClasses));
    }
  };

  const loadTeachers = () => {
    const stored = localStorage.getItem('teachers');
    if (stored) {
      setTeachers(JSON.parse(stored));
    } else {
      const defaultTeachers = [
        { id: 1, name: 'Shahzoda Ahmedova', subject: 'Matematika' },
        { id: 2, name: 'Rustam Karimov', subject: 'Fizika' },
        { id: 3, name: 'Gulnora Saidova', subject: 'Ingliz tili' },
        { id: 4, name: 'Alisher Tursunov', subject: 'Tarix' },
        { id: 5, name: 'Nilufar Rahimova', subject: 'Biologiya' },
        { id: 6, name: 'Dilbar To\'xtayeva', subject: 'Kimyo' },
      ];
      setTeachers(defaultTeachers);
      localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    }
  };

  // Ma'lumotlarni saqlash
  const saveClasses = (updatedClasses) => {
    setClasses(updatedClasses);
    localStorage.setItem('classes', JSON.stringify(updatedClasses));
  };

  // Yangi sinf qo'shish
  const handleAdd = () => {
    setEditingClass({
      name: '',
      grade: 5,
      section: 'A',
      students: 0,
      teacher: '',
      room: '',
      schedule: '08:00 - 14:30',
      average: 0
    });
    setShowModal(true);
  };

  // Sinfni tahrirlash
  const handleEdit = (cls) => {
    setEditingClass({ ...cls });
    setShowModal(true);
  };

  // Sinfni saqlash
  const handleSave = () => {
    if (!editingClass.name || !editingClass.teacher || !editingClass.room) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedClasses;
    if (editingClass.id) {
      // Tahrirlash
      updatedClasses = classes.map(c => c.id === editingClass.id ? editingClass : c);
      alert('Sinf ma\'lumotlari yangilandi!');
    } else {
      // Yangi qo'shish
      const newClass = { ...editingClass, id: Date.now() };
      updatedClasses = [...classes, newClass];
      alert('Yangi sinf qo\'shildi!');
    }
    
    saveClasses(updatedClasses);
    setShowModal(false);
    setEditingClass(null);
  };

  // Sinfni o'chirish
  const handleDelete = (id) => {
    if (window.confirm('Sinfni o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      const updatedClasses = classes.filter(c => c.id !== id);
      saveClasses(updatedClasses);
      alert('Sinf o\'chirildi!');
    }
  };

  // Filtrlash
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || cls.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  // Statistikalar
  const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
  const avgStudents = Math.round(totalStudents / classes.length) || 0;
  const avgGrade = Math.round(classes.reduce((sum, cls) => sum + cls.average, 0) / classes.length) || 0;
  const totalClasses = classes.length;

  const grades = [5, 6, 7, 8, 9, 10, 11];
  const sections = ['A', 'B', 'C', 'D'];
  const timeSlots = ['08:00 - 14:30', '08:30 - 15:00', '09:00 - 15:30'];

  return (
    <div className="classes-page">
      <div className="page-header">
        <div>
          <h1>Sinflar</h1>
          <p>Jami {totalClasses} ta sinf | {totalStudents} nafar o'quvchi</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <HiOutlinePlus /> Yangi sinf
        </button>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Sinf nomi yoki o'qituvchi bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select" 
          value={selectedGrade} 
          onChange={(e) => setSelectedGrade(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">Barcha sinflar</option>
          {grades.map(grade => (
            <option key={grade} value={grade}>{grade}-sinf</option>
          ))}
        </select>
      </div>

      {/* Statistik kartalar */}
      <div className="classes-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineUsers />
          </div>
          <div className="stat-info">
            <h3>Jami o'quvchilar</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineAcademicCap />
          </div>
          <div className="stat-info">
            <h3>O'rtacha o'quvchilar</h3>
            <p>{avgStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineChartBar />
          </div>
          <div className="stat-info">
            <h3>O'rtacha baho</h3>
            <p>{avgGrade}%</p>
          </div>
        </div>
      </div>

      {/* Sinflar grid */}
      <div className="classes-grid">
        {filteredClasses.length === 0 ? (
          <div className="empty-state">
            <HiOutlineAcademicCap size={48} />
            <p>Hech qanday sinf topilmadi</p>
            <button className="btn-primary" onClick={handleAdd}>Yangi sinf qo'shish</button>
          </div>
        ) : (
          filteredClasses.map(cls => (
            <div key={cls.id} className="class-card">
              <div className="class-card-header">
                <div className="class-name">
                  <span className="class-grade">{cls.grade}</span>
                  <span className="class-section">{cls.section}</span>
                </div>
                <button className="card-menu-btn">
                  <HiOutlineDotsVertical />
                </button>
              </div>
              <div className="class-card-body">
                <div className="class-info-row">
                  <HiOutlineUsers />
                  <span>{cls.students} o'quvchi</span>
                </div>
                <div className="class-info-row">
                  <HiOutlineAcademicCap />
                  <span>{cls.teacher}</span>
                </div>
                <div className="class-info-row">
                  <HiOutlineCalendar />
                  <span>{cls.schedule}</span>
                </div>
                <div className="class-info-row">
                  <HiOutlineBookOpen />
                  <span>Xona: {cls.room}</span>
                </div>
                <div className="class-progress">
                  <div className="progress-label">
                    <span>O'rtacha baho</span>
                    <span className="progress-value">{cls.average}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${cls.average}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="class-card-footer">
                <button className="card-btn view-btn">Ko'rish</button>
                <button className="card-btn edit-btn" onClick={() => handleEdit(cls)}>
                  <HiOutlinePencil /> Tahrirlash
                </button>
                <button className="card-btn delete-btn" onClick={() => handleDelete(cls.id)}>
                  <HiOutlineTrash /> O'chirish
                </button>
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
              <h2>{editingClass?.id ? 'Sinf ma\'lumotlarini tahrirlash' : 'Yangi sinf qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Sinf raqami *</label>
                  <select 
                    value={editingClass?.grade || 5} 
                    onChange={(e) => setEditingClass({ ...editingClass, grade: parseInt(e.target.value), name: `${e.target.value}-${editingClass?.section || 'A'}` })}
                  >
                    {grades.map(g => <option key={g} value={g}>{g}-sinf</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf harfi *</label>
                  <select 
                    value={editingClass?.section || 'A'} 
                    onChange={(e) => setEditingClass({ ...editingClass, section: e.target.value, name: `${editingClass?.grade || 5}-${e.target.value}` })}
                  >
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sinf nomi</label>
                  <input 
                    type="text" 
                    value={editingClass?.name || ''} 
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group">
                  <label>Xona raqami *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: 201" 
                    value={editingClass?.room || ''} 
                    onChange={(e) => setEditingClass({ ...editingClass, room: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sinf rahbari *</label>
                  <select 
                    value={editingClass?.teacher || ''} 
                    onChange={(e) => setEditingClass({ ...editingClass, teacher: e.target.value })}
                  >
                    <option value="">O'qituvchi tanlang</option>
                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Dars vaqti</label>
                  <select 
                    value={editingClass?.schedule || '08:00 - 14:30'} 
                    onChange={(e) => setEditingClass({ ...editingClass, schedule: e.target.value })}
                  >
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchilar soni</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={editingClass?.students || 0} 
                    onChange={(e) => setEditingClass({ ...editingClass, students: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>O'rtacha baho (%)</label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    value={editingClass?.average || 0} 
                    onChange={(e) => setEditingClass({ ...editingClass, average: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingClass?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Classes;