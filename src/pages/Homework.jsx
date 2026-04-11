import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineCalendar, 
  HiOutlineClock, 
  HiOutlineCheckCircle, 
  HiOutlineXCircle,
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineDownload
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Homework.css';

const Homework = () => {
  const { user, roles } = useAuth();
  const [homeworks, setHomeworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [classes, setClasses] = useState(['9-A', '9-B', '10-A', '10-B', '11-A']);
  const [subjects, setSubjects] = useState(['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', "O'zbek tili", 'Jismoniy tarbiya']);

  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.TEACHER;

  useEffect(() => {
    loadHomeworks();
  }, []);

  const loadHomeworks = () => {
    const stored = localStorage.getItem('homeworks');
    if (stored) {
      setHomeworks(JSON.parse(stored));
    } else {
      const defaultHomeworks = [
        { id: 1, title: 'Matematika 5-misol', subject: 'Matematika', class: '10-A', dueDate: '2024-12-20', status: 'pending', description: '5-misolni yechish. 1-5 misollar. Har bir misolni batafsil yechish.', createdAt: '2024-12-15', teacher: 'Shahzoda Ahmedova' },
        { id: 2, title: 'Fizika 10-topshiriq', subject: 'Fizika', class: '10-B', dueDate: '2024-12-18', status: 'submitted', description: 'Laboratoriya ishi. Elektr zanjirlarini yig\'ish va o\'lchash.', createdAt: '2024-12-14', teacher: 'Rustam Karimov' },
        { id: 3, title: 'Ingliz tili matn', subject: 'Ingliz tili', class: '9-A', dueDate: '2024-12-22', status: 'pending', description: 'Matn o\'qish va tarjima qilish. 10 ta yangi so\'z yodlash.', createdAt: '2024-12-16', teacher: 'Gulnora Saidova' },
        { id: 4, title: 'Tarix referat', subject: 'Tarix', class: '11-A', dueDate: '2024-12-25', status: 'pending', description: 'Amir Temur hayoti va faoliyati haqida referat yozish.', createdAt: '2024-12-17', teacher: 'Alisher Tursunov' },
        { id: 5, title: 'Biologiya test', subject: 'Biologiya', class: '10-A', dueDate: '2024-12-19', status: 'submitted', description: '20 ta test topshirig\'ini bajarish.', createdAt: '2024-12-13', teacher: 'Nilufar Rahimova' },
      ];
      setHomeworks(defaultHomeworks);
      localStorage.setItem('homeworks', JSON.stringify(defaultHomeworks));
    }
  };

  useEffect(() => {
    if (homeworks.length > 0) {
      localStorage.setItem('homeworks', JSON.stringify(homeworks));
    }
  }, [homeworks]);

  const handleAdd = () => {
    setEditingHomework({
      title: '',
      subject: '',
      class: '',
      dueDate: '',
      status: 'pending',
      description: '',
      createdAt: new Date().toISOString().split('T')[0],
      teacher: user?.name || 'Admin'
    });
    setShowModal(true);
  };

  const handleEdit = (hw) => {
    setEditingHomework({ ...hw });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingHomework.title || !editingHomework.subject || !editingHomework.class || !editingHomework.dueDate) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedHomeworks;
    if (editingHomework.id) {
      updatedHomeworks = homeworks.map(h => h.id === editingHomework.id ? editingHomework : h);
      alert('Uy vazifasi yangilandi!');
    } else {
      const newHomework = { 
        ...editingHomework, 
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        teacher: user?.name || 'Admin'
      };
      updatedHomeworks = [newHomework, ...homeworks];
      alert('Yangi uy vazifasi qo\'shildi!');
    }
    
    setHomeworks(updatedHomeworks);
    setShowModal(false);
    setEditingHomework(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Uy vazifasini o\'chirmoqchimisiz?')) {
      setHomeworks(homeworks.filter(h => h.id !== id));
      alert('Uy vazifasi o\'chirildi!');
    }
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'submitted' : 'pending';
    setHomeworks(homeworks.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  // Filtrlash va tartiblash
  const filteredHomeworks = homeworks
    .filter(hw => {
      const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hw.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hw.class.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || hw.status === statusFilter;
      const matchesClass = classFilter === '' || hw.class === classFilter;
      const matchesSubject = subjectFilter === '' || hw.subject === subjectFilter;
      return matchesSearch && matchesStatus && matchesClass && matchesSubject;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'dueDate') {
        aVal = new Date(a.dueDate);
        bVal = new Date(b.dueDate);
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const pendingCount = homeworks.filter(h => h.status === 'pending').length;
  const submittedCount = homeworks.filter(h => h.status === 'submitted').length;

  // Eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', 'Vazifa nomi', 'Fan', 'Sinf', 'Muddati', 'Holat', 'Tavsif', "Yaratilgan sana", "O'qituvchi"];
    const csvData = filteredHomeworks.map(h => [
      h.id, h.title, h.subject, h.class, h.dueDate, 
      h.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan',
      h.description, h.createdAt, h.teacher
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homeworks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Muddati o\'tgan';
    if (diffDays === 0) return 'Bugun';
    if (diffDays === 1) return '1 kun qoldi';
    return `${diffDays} kun qoldi`;
  };

  return (
    <div className="homework-page">
      <div className="page-header">
        <div>
          <h1>Uy vazifalari</h1>
          <p>Jami {homeworks.length} ta vazifa | {pendingCount} ta bajarilmagan, {submittedCount} ta topshirilgan</p>
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlinePlus /> Yangi vazifa
            </button>
          )}
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Vazifa nomi, fan yoki sinf bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="">Barcha fanlar</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="pending">Bajarilmagan</option>
            <option value="submitted">Topshirilgan</option>
          </select>
        </div>
      </div>

      {/* Tartiblash */}
      <div className="sort-bar">
        <span className="sort-label">Tartiblash:</span>
        <div className="sort-buttons">
          <button className={`sort-btn ${sortBy === 'dueDate' ? 'active' : ''}`} onClick={() => { setSortBy('dueDate'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
            Muddati bo'yicha {sortBy === 'dueDate' && (sortOrder === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
          </button>
          <button className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`} onClick={() => { setSortBy('title'); setSortOrder('asc'); }}>
            Nomi bo'yicha
          </button>
          <button className={`sort-btn ${sortBy === 'class' ? 'active' : ''}`} onClick={() => { setSortBy('class'); setSortOrder('asc'); }}>
            Sinf bo'yicha
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="homework-stats">
        <div className="stat-card pending">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Bajarilmagan</div>
        </div>
        <div className="stat-card submitted">
          <div className="stat-value">{submittedCount}</div>
          <div className="stat-label">Topshirilgan</div>
        </div>
        <div className="stat-card total">
          <div className="stat-value">{homeworks.length}</div>
          <div className="stat-label">Jami vazifalar</div>
        </div>
      </div>

      {/* Uy vazifalari ro'yxati */}
      <div className="homework-list">
        {filteredHomeworks.length === 0 ? (
          <div className="empty-state">
            <HiOutlineCalendar size={48} />
            <p>Hech qanday uy vazifasi topilmadi</p>
            {isAdmin && (
              <button className="btn-primary" onClick={handleAdd}>Yangi vazifa qo'shish</button>
            )}
          </div>
        ) : (
          filteredHomeworks.map(hw => (
            <div key={hw.id} className={`homework-card ${hw.status}`}>
              <div className="homework-header">
                <div>
                  <h3>{hw.title}</h3>
                  <p className="homework-meta">{hw.subject} | {hw.class} | {hw.teacher}</p>
                </div>
                {isAdmin && (
                  <button 
                    className={`status-toggle ${hw.status}`}
                    onClick={() => toggleStatus(hw.id, hw.status)}
                    title={hw.status === 'pending' ? 'Topshirildi deb belgilash' : 'Bajarilmadi deb belgilash'}
                  >
                    {hw.status === 'pending' ? <HiOutlineXCircle /> : <HiOutlineCheckCircle />}
                    <span>{hw.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan'}</span>
                  </button>
                )}
              </div>
              <div className="homework-description">{hw.description}</div>
              <div className="homework-date">
                <HiOutlineCalendar /> Topshiriq muddati: {hw.dueDate}
                <span className={`days-left ${hw.status === 'pending' ? (new Date(hw.dueDate) < new Date() ? 'expired' : '') : ''}`}>
                  ({getDaysLeft(hw.dueDate)})
                </span>
              </div>
              <div className="homework-actions">
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(hw)}>
                      <HiOutlinePencil /> Tahrirlash
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(hw.id)}>
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
              <h2>{editingHomework?.id ? 'Uy vazifasini tahrirlash' : 'Yangi uy vazifasi'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Vazifa nomi *</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Matematika 5-misol" 
                  value={editingHomework?.title || ''} 
                  onChange={(e) => setEditingHomework({ ...editingHomework, title: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fan *</label>
                  <select 
                    value={editingHomework?.subject || ''} 
                    onChange={(e) => setEditingHomework({ ...editingHomework, subject: e.target.value })}
                  >
                    <option value="">Fan tanlang</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <select 
                    value={editingHomework?.class || ''} 
                    onChange={(e) => setEditingHomework({ ...editingHomework, class: e.target.value })}
                  >
                    <option value="">Sinf tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Topshiriq muddati *</label>
                  <input 
                    type="date" 
                    value={editingHomework?.dueDate || ''} 
                    onChange={(e) => setEditingHomework({ ...editingHomework, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingHomework?.status || 'pending'} 
                    onChange={(e) => setEditingHomework({ ...editingHomework, status: e.target.value })}
                  >
                    <option value="pending">Bajarilmagan</option>
                    <option value="submitted">Topshirilgan</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Vazifa tavsifi</label>
                <textarea 
                  placeholder="Vazifa haqida batafsil..." 
                  rows="4"
                  value={editingHomework?.description || ''} 
                  onChange={(e) => setEditingHomework({ ...editingHomework, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingHomework?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Homework;