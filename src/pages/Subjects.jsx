import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineX
} from 'react-icons/hi';
import './Subjects.css';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    loadSubjects();
    loadTeachers();
  }, []);

  const loadSubjects = () => {
    const stored = localStorage.getItem('subjects');
    if (stored) {
      setSubjects(JSON.parse(stored));
    } else {
      const defaultSubjects = [
        { id: 1, name: 'Matematika', code: 'MTH101', credits: 5, hours: 120, students: 180, teacher: 'Shahzoda Ahmedova', average: 85, status: 'active' },
        { id: 2, name: 'Fizika', code: 'PHY101', credits: 4, hours: 96, students: 150, teacher: 'Rustam Karimov', average: 82, status: 'active' },
        { id: 3, name: 'Ingliz tili', code: 'ENG101', credits: 3, hours: 72, students: 200, teacher: 'Gulnora Saidova', average: 88, status: 'active' },
        { id: 4, name: 'Tarix', code: 'HIS101', credits: 3, hours: 72, students: 140, teacher: 'Alisher Tursunov', average: 86, status: 'active' },
        { id: 5, name: 'Biologiya', code: 'BIO101', credits: 4, hours: 96, students: 120, teacher: 'Nilufar Rahimova', average: 84, status: 'active' },
        { id: 6, name: 'Kimyo', code: 'CHE101', credits: 4, hours: 96, students: 115, teacher: 'Dilbar To\'xtayeva', average: 80, status: 'inactive' },
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
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

  const saveSubjects = (updatedSubjects) => {
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
  };

  const handleAdd = () => {
    setEditingSubject({
      name: '',
      code: '',
      credits: 3,
      hours: 72,
      students: 0,
      teacher: '',
      average: 0,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject({ ...subject });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingSubject.name || !editingSubject.code || !editingSubject.teacher) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedSubjects;
    if (editingSubject.id) {
      updatedSubjects = subjects.map(s => s.id === editingSubject.id ? editingSubject : s);
      alert('Fan ma\'lumotlari yangilandi!');
    } else {
      const newSubject = { ...editingSubject, id: Date.now() };
      updatedSubjects = [...subjects, newSubject];
      alert('Yangi fan qo\'shildi!');
    }
    
    saveSubjects(updatedSubjects);
    setShowModal(false);
    setEditingSubject(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Fanni o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      const updatedSubjects = subjects.filter(s => s.id !== id);
      saveSubjects(updatedSubjects);
      alert('Fan o\'chirildi!');
    }
  };

  const filteredSubjects = subjects.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStudents = subjects.reduce((sum, sub) => sum + sub.students, 0);
  const totalHours = subjects.reduce((sum, sub) => sum + sub.hours, 0);
  const avgGrade = Math.round(subjects.reduce((sum, sub) => sum + sub.average, 0) / subjects.length) || 0;

  return (
    <div className="subjects-page">
      <div className="page-header">
        <div>
          <h1>Fanlar</h1>
          <p>Jami {filteredSubjects.length} ta fan | {totalStudents} nafar o'quvchi</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <HiOutlinePlus /> Yangi fan
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Fan nomi, kod yoki o'qituvchi bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Barcha fanlar</option>
          <option value="active">Aktiv</option>
          <option value="inactive">Noaktiv</option>
        </select>
      </div>

      <div className="subjects-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineBookOpen />
          </div>
          <div className="stat-info">
            <h3>Jami fanlar</h3>
            <p>{subjects.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineUsers />
          </div>
          <div className="stat-info">
            <h3>Jami o'quvchilar</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>Jami soatlar</h3>
            <p>{totalHours}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineChartBar />
          </div>
          <div className="stat-info">
            <h3>O'rtacha baho</h3>
            <p>{avgGrade}%</p>
          </div>
        </div>
      </div>

      <div className="subjects-table-container">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Fan nomi</th>
              <th>Kod</th>
              <th>Kredit</th>
              <th>Soat</th>
              <th>O'quvchilar</th>
              <th>O'qituvchi</th>
              <th>O'rtacha</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineBookOpen size={48} />
                    <p>Hech qanday fan topilmadi</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubjects.map(subject => (
                <tr key={subject.id}>
                  <td>
                    <div className="subject-cell">
                      <div className="subject-icon">
                        <HiOutlineBookOpen />
                      </div>
                      <div>
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-code">{subject.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="code-cell">{subject.code}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.hours} h</td>
                  <td>{subject.students}</td>
                  <td>{subject.teacher}</td>
                  <td>
                    <div className="average-circle" style={{ 
                      background: subject.average >= 85 ? '#10b981' : subject.average >= 70 ? '#f59e0b' : '#ef4444' 
                    }}>
                      {subject.average}%
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${subject.status}`}>
                      {subject.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEdit(subject)}>
                        <HiOutlinePencil />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(subject.id)}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSubject?.id ? 'Fan ma\'lumotlarini tahrirlash' : 'Yangi fan qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Fan nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Matematika" 
                    value={editingSubject?.name || ''} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fan kodi *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: MTH101" 
                    value={editingSubject?.code || ''} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kredit soni</label>
                  <input 
                    type="number" 
                    placeholder="3" 
                    value={editingSubject?.credits || 3} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Jami soatlar</label>
                  <input 
                    type="number" 
                    placeholder="72" 
                    value={editingSubject?.hours || 72} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, hours: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'qituvchi *</label>
                  <select 
                    value={editingSubject?.teacher || ''} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, teacher: e.target.value })}
                  >
                    <option value="">O'qituvchi tanlang</option>
                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingSubject?.status || 'active'} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, status: e.target.value })}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Noaktiv</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchilar soni</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={editingSubject?.students || 0} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, students: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>O'rtacha baho (%)</label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    value={editingSubject?.average || 0} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, average: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingSubject?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Subjects;