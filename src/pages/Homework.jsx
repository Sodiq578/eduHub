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
  HiOutlineDownload,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUpload,
  HiOutlineChat
} from 'react-icons/hi';
import './Homework.css';

const Homework = () => {
  // ========== STATE'LAR ==========
  const [homeworks, setHomeworks] = useState([]);        // Uy vazifalari
  const [lessons, setLessons] = useState([]);            // Dars rejalari
  const [searchTerm, setSearchTerm] = useState('');      // Qidiruv
  const [classFilter, setClassFilter] = useState('');    // Sinf filtri
  const [statusFilter, setStatusFilter] = useState('');  // Holat filtri
  const [showModal, setShowModal] = useState(false);     // Modal oyna
  const [showLessonModal, setShowLessonModal] = useState(false); // Dars modal
  const [showDetailsModal, setShowDetailsModal] = useState(false); // Detallar modal
  const [editingHomework, setEditingHomework] = useState(null);   // Tahrirlanayotgan vazifa
  const [editingLesson, setEditingLesson] = useState(null);       // Tahrirlanayotgan dars
  const [selectedHomework, setSelectedHomework] = useState(null); // Tanlangan vazifa
  const [fileUpload, setFileUpload] = useState(null);     // Yuklangan fayl

  // Sinf va fanlar ro'yxati
  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  const subjects = ['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', "O'zbek tili", 'Adabiyot', 'Geografiya'];

  // ========== MA'LUMOTLARNI YUKLASH ==========
  useEffect(() => {
    loadHomeworks();
    loadLessons();
  }, []);

  // Uy vazifalarini yuklash
  const loadHomeworks = () => {
    const stored = localStorage.getItem('homeworks');
    if (stored) {
      setHomeworks(JSON.parse(stored));
    } else {
      // Default ma'lumotlar
      const defaultHomeworks = [
        { 
          id: 1, 
          title: 'Matematika 5-misol', 
          subject: 'Matematika', 
          class: '10-A', 
          dueDate: '2024-12-20', 
          status: 'pending', 
          description: '5-misolni yechish va tushuntirish',
          teacher: 'Shahzoda Ahmedova',
          priority: 'high'
        },
        { 
          id: 2, 
          title: 'Fizika laboratoriya', 
          subject: 'Fizika', 
          class: '10-B', 
          dueDate: '2024-12-18', 
          status: 'submitted', 
          description: 'Laboratoriya ishini bajarish',
          teacher: 'Rustam Karimov',
          priority: 'medium'
        },
        { 
          id: 3, 
          title: 'Ingliz tili matn', 
          subject: 'Ingliz tili', 
          class: '9-A', 
          dueDate: '2024-12-22', 
          status: 'pending', 
          description: 'Matnni o\'qish va tarjima qilish',
          teacher: 'Gulnora Saidova',
          priority: 'low'
        },
      ];
      setHomeworks(defaultHomeworks);
      localStorage.setItem('homeworks', JSON.stringify(defaultHomeworks));
    }
  };

  // Dars rejalarini yuklash
  const loadLessons = () => {
    const stored = localStorage.getItem('lessons');
    if (stored) {
      setLessons(JSON.parse(stored));
    } else {
      const defaultLessons = [
        { id: 1, title: 'Algebraik ifodalar', subject: 'Matematika', class: '10-A', date: '2024-12-15', teacher: 'Shahzoda Ahmedova', status: 'planned', objectives: 'Algebraik ifodalarni soddalashtirish', resources: 'Darslik 45-50 betlar' },
        { id: 2, title: 'Elektr zanjirlari', subject: 'Fizika', class: '10-B', date: '2024-12-14', teacher: 'Rustam Karimov', status: 'done', objectives: 'Elektr zanjirlarini yig\'ish', resources: 'Laboratoriya jihozlari' },
        { id: 3, title: 'Present Simple', subject: 'Ingliz tili', class: '9-A', date: '2024-12-16', teacher: 'Gulnora Saidova', status: 'planned', objectives: 'Present Simple zamonini o\'rganish', resources: 'Grammatika jadvali' },
      ];
      setLessons(defaultLessons);
      localStorage.setItem('lessons', JSON.stringify(defaultLessons));
    }
  };

  // ========== SAQLASH FUNKSIYALARI ==========
  const saveHomeworks = (data) => {
    setHomeworks(data);
    localStorage.setItem('homeworks', JSON.stringify(data));
  };

  const saveLessons = (data) => {
    setLessons(data);
    localStorage.setItem('lessons', JSON.stringify(data));
  };

  // ========== UY VAZIFASI AMALLARI ==========
  // Yangi vazifa qo'shish
  const handleAddHomework = () => {
    setEditingHomework({
      id: null,
      title: '',
      subject: '',
      class: '',
      dueDate: '',
      description: '',
      teacher: 'Admin',
      priority: 'medium',
      status: 'pending'
    });
    setShowModal(true);
  };

  // Vazifani tahrirlash
  const handleEditHomework = (homework) => {
    setEditingHomework({ ...homework });
    setShowModal(true);
  };

  // Vazifani saqlash (yangi yoki tahrirlangan)
  const handleSaveHomework = () => {
    if (!editingHomework.title || !editingHomework.subject || !editingHomework.class || !editingHomework.dueDate) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedHomeworks;
    if (editingHomework.id) {
      // Tahrirlash
      updatedHomeworks = homeworks.map(h => h.id === editingHomework.id ? editingHomework : h);
      alert('Uy vazifasi yangilandi!');
    } else {
      // Yangi qo'shish
      const newHomework = { ...editingHomework, id: Date.now() };
      updatedHomeworks = [newHomework, ...homeworks];
      alert('Yangi uy vazifasi qo\'shildi!');
    }
    
    saveHomeworks(updatedHomeworks);
    setShowModal(false);
    setEditingHomework(null);
    setFileUpload(null);
  };

  // Vazifani o'chirish
  const handleDeleteHomework = (id) => {
    if (window.confirm('Uy vazifasini o\'chirmoqchimisiz?')) {
      const updatedHomeworks = homeworks.filter(h => h.id !== id);
      saveHomeworks(updatedHomeworks);
      alert('Uy vazifasi o\'chirildi!');
    }
  };

  // Vazifani topshirish (talaba uchun)
  const handleSubmitHomework = (homeworkId) => {
    if (!fileUpload) {
      alert('Iltimos, fayl tanlang!');
      return;
    }
    
    const updatedHomeworks = homeworks.map(h => 
      h.id === homeworkId ? { ...h, status: 'submitted' } : h
    );
    saveHomeworks(updatedHomeworks);
    alert('Uy vazifasi topshirildi!');
    setFileUpload(null);
  };

  // ========== DARS REJASI AMALLARI ==========
  const handleAddLesson = () => {
    setEditingLesson({
      id: null,
      title: '',
      subject: '',
      class: '',
      date: '',
      teacher: 'Admin',
      status: 'planned',
      objectives: '',
      resources: ''
    });
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson({ ...lesson });
    setShowLessonModal(true);
  };

  const handleSaveLesson = () => {
    if (!editingLesson.title || !editingLesson.subject || !editingLesson.class || !editingLesson.date) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedLessons;
    if (editingLesson.id) {
      updatedLessons = lessons.map(l => l.id === editingLesson.id ? editingLesson : l);
      alert('Dars rejasi yangilandi!');
    } else {
      const newLesson = { ...editingLesson, id: Date.now() };
      updatedLessons = [newLesson, ...lessons];
      alert('Yangi dars rejasi qo\'shildi!');
    }
    
    saveLessons(updatedLessons);
    setShowLessonModal(false);
    setEditingLesson(null);
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm('Dars rejasini o\'chirmoqchimisiz?')) {
      const updatedLessons = lessons.filter(l => l.id !== id);
      saveLessons(updatedLessons);
      alert('Dars rejasi o\'chirildi!');
    }
  };

  // ========== YORDAMCHI FUNKSIYALAR ==========
  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filtrlangan vazifalar
  const filteredHomeworks = homeworks.filter(hw => {
    const matchSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        hw.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === '' || hw.class === classFilter;
    const matchStatus = statusFilter === '' || hw.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  // Filtrlangan darslar
  const filteredLessons = lessons.filter(lesson => {
    const matchSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        lesson.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === '' || lesson.class === classFilter;
    return matchSearch && matchClass;
  });

  // Statistikalar
  const totalHomeworks = homeworks.length;
  const pendingHomeworks = homeworks.filter(h => h.status === 'pending').length;
  const submittedHomeworks = homeworks.filter(h => h.status === 'submitted').length;
  const overdueHomeworks = homeworks.filter(h => h.status === 'pending' && getDaysLeft(h.dueDate) < 0).length;

  // Eksport qilish
  const exportToExcel = () => {
    const headers = ['ID', 'Vazifa nomi', 'Fan', 'Sinf', 'Muddati', 'Holat', 'O\'qituvchi'];
    const rows = filteredHomeworks.map(h => [
      h.id, h.title, h.subject, h.class, h.dueDate, 
      h.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan', h.teacher
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homeworks_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="homework-page">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div>
          <h1>📚 Uy vazifalari va Dars rejalari</h1>
          <p>Jami {totalHomeworks} ta vazifa | {pendingHomeworks} ta bajarilmagan | {submittedHomeworks} ta topshirilgan | {overdueHomeworks} ta muddati o'tgan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToExcel}>
            <HiOutlineDownload /> Excel
          </button>
          <button className="btn-primary" onClick={handleAddLesson}>
            <HiOutlineBookOpen /> Dars rejasi
          </button>
          <button className="btn-primary" onClick={handleAddHomework}>
            <HiOutlinePlus /> Yangi vazifa
          </button>
        </div>
      </div>

      {/* ========== STATISTIKA KARTALARI ========== */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{totalHomeworks}</div>
          <div className="stat-label">Jami vazifalar</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{pendingHomeworks}</div>
          <div className="stat-label">Bajarilmagan</div>
        </div>
        <div className="stat-card submitted">
          <div className="stat-value">{submittedHomeworks}</div>
          <div className="stat-label">Topshirilgan</div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-value">{overdueHomeworks}</div>
          <div className="stat-label">Muddati o'tgan</div>
        </div>
      </div>

      {/* ========== FILTRLAR ========== */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Vazifa nomi yoki fan bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="pending">Bajarilmagan</option>
            <option value="submitted">Topshirilgan</option>
          </select>
        </div>
      </div>

      {/* ========== DARS REJALARI BO'LIMI ========== */}
      <div className="section-header">
        <h2><HiOutlineBookOpen /> Dars rejalari</h2>
        <p>Jami {lessons.length} ta dars rejasi</p>
      </div>

      <div className="lessons-list">
        {filteredLessons.length === 0 ? (
          <div className="empty-state">
            <HiOutlineBookOpen size={48} />
            <p>Hech qanday dars rejasi topilmadi</p>
            <button className="btn-primary" onClick={handleAddLesson}>+ Dars rejasi qo'shish</button>
          </div>
        ) : (
          filteredLessons.map(lesson => (
            <div key={lesson.id} className={`lesson-card ${lesson.status}`}>
              <div className="lesson-header">
                <div>
                  <h3>{lesson.title}</h3>
                  <p className="lesson-meta">
                    <HiOutlineBookOpen /> {lesson.subject} | 
                    <HiOutlineAcademicCap /> {lesson.class} | 
                    <HiOutlineUser /> {lesson.teacher}
                  </p>
                </div>
                <div className="lesson-badges">
                  <span className={`lesson-status ${lesson.status}`}>
                    {lesson.status === 'planned' ? '📅 Rejalashtirilgan' : '✅ O\'tilgan'}
                  </span>
                  <button className="view-btn" onClick={() => { setSelectedHomework(lesson); setShowDetailsModal(true); }}>
                    <HiOutlineEye /> Ko'rish
                  </button>
                  <button className="edit-btn" onClick={() => handleEditLesson(lesson)}>
                    <HiOutlinePencil /> Tahrirlash
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteLesson(lesson.id)}>
                    <HiOutlineTrash /> O'chirish
                  </button>
                </div>
              </div>
              <div className="lesson-description">
                <div className="lesson-objectives">
                  <strong>🎯 Maqsad:</strong> {lesson.objectives}
                </div>
                <div className="lesson-resources">
                  <strong>📚 Resurslar:</strong> {lesson.resources}
                </div>
                <div className="lesson-date">
                  <HiOutlineCalendar /> Sana: {lesson.date}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== UY VAZIFALARI BO'LIMI ========== */}
      <div className="section-header">
        <h2><HiOutlineDocumentText /> Uy vazifalari</h2>
      </div>

      <div className="homework-list">
        {filteredHomeworks.length === 0 ? (
          <div className="empty-state">
            <HiOutlineCalendar size={48} />
            <p>Hech qanday uy vazifasi topilmadi</p>
          </div>
        ) : (
          filteredHomeworks.map(hw => {
            const daysLeft = getDaysLeft(hw.dueDate);
            const isOverdue = daysLeft < 0 && hw.status === 'pending';
            
            return (
              <div key={hw.id} className={`homework-card ${hw.status} ${isOverdue ? 'overdue' : ''} ${hw.priority}`}>
                <div className="homework-header">
                  <div>
                    <h3>{hw.title}</h3>
                    <p className="homework-meta">
                      <HiOutlineBookOpen /> {hw.subject} | 
                      <HiOutlineAcademicCap /> {hw.class} | 
                      <HiOutlineUser /> {hw.teacher}
                    </p>
                  </div>
                  <div className="homework-badges">
                    <span className={`priority-badge ${hw.priority}`}>
                      {hw.priority === 'high' ? '🔴 Yuqori' : hw.priority === 'medium' ? '🟡 O\'rta' : '🟢 Past'}
                    </span>
                    <span className={`status-badge ${hw.status}`}>
                      {hw.status === 'pending' ? <HiOutlineXCircle /> : <HiOutlineCheckCircle />}
                      {hw.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan'}
                    </span>
                    {isOverdue && <span className="overdue-badge">⏰ Muddati o'tgan</span>}
                    {daysLeft <= 2 && daysLeft > 0 && hw.status === 'pending' && (
                      <span className="deadline-badge"><HiOutlineClock /> {daysLeft} kun qoldi</span>
                    )}
                    <button className="view-btn" onClick={() => { setSelectedHomework(hw); setShowDetailsModal(true); }}>
                      <HiOutlineEye /> Ko'rish
                    </button>
                  </div>
                </div>
                <div className="homework-description">{hw.description}</div>
                <div className="homework-date">
                  <HiOutlineCalendar /> Topshiriq muddati: {hw.dueDate}
                </div>
                
                <div className="homework-actions">
                  {hw.status === 'pending' && (
                    <>
                      <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} className="file-input" />
                      <button className="submit-btn" onClick={() => handleSubmitHomework(hw.id)}>
                        <HiOutlineUpload /> Topshirish
                      </button>
                    </>
                  )}
                  <button className="edit-btn" onClick={() => handleEditHomework(hw)}>
                    <HiOutlinePencil /> Tahrirlash
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteHomework(hw.id)}>
                    <HiOutlineTrash /> O'chirish
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========== MODAL OYNALAR ========== */}
      
      {/* Uy vazifasi modal */}
      {showModal && editingHomework && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingHomework.id ? '✏️ Vazifani tahrirlash' : '➕ Yangi vazifa'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Vazifa nomi *</label>
                <input 
                  type="text" 
                  value={editingHomework.title} 
                  onChange={(e) => setEditingHomework({...editingHomework, title: e.target.value})}
                  placeholder="Masalan: Matematika 5-misol"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fan *</label>
                  <select value={editingHomework.subject} onChange={(e) => setEditingHomework({...editingHomework, subject: e.target.value})}>
                    <option value="">Tanlang</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <select value={editingHomework.class} onChange={(e) => setEditingHomework({...editingHomework, class: e.target.value})}>
                    <option value="">Tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Muddat *</label>
                  <input 
                    type="date" 
                    value={editingHomework.dueDate} 
                    onChange={(e) => setEditingHomework({...editingHomework, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ahamiyati</label>
                  <select value={editingHomework.priority} onChange={(e) => setEditingHomework({...editingHomework, priority: e.target.value})}>
                    <option value="low">🟢 Past</option>
                    <option value="medium">🟡 O'rta</option>
                    <option value="high">🔴 Yuqori</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tavsif</label>
                <textarea 
                  rows="4" 
                  value={editingHomework.description} 
                  onChange={(e) => setEditingHomework({...editingHomework, description: e.target.value})}
                  placeholder="Vazifa haqida batafsil..."
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveHomework}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Dars rejasi modal */}
      {showLessonModal && editingLesson && (
        <div className="modal-overlay" onClick={() => setShowLessonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLesson.id ? '✏️ Dars rejasini tahrirlash' : '➕ Yangi dars rejasi'}</h2>
              <button className="modal-close" onClick={() => setShowLessonModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dars nomi *</label>
                <input 
                  type="text" 
                  value={editingLesson.title} 
                  onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                  placeholder="Masalan: Algebraik ifodalar"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Fan *</label>
                  <select value={editingLesson.subject} onChange={(e) => setEditingLesson({...editingLesson, subject: e.target.value})}>
                    <option value="">Tanlang</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <select value={editingLesson.class} onChange={(e) => setEditingLesson({...editingLesson, class: e.target.value})}>
                    <option value="">Tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sana *</label>
                  <input 
                    type="date" 
                    value={editingLesson.date} 
                    onChange={(e) => setEditingLesson({...editingLesson, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Holati</label>
                  <select value={editingLesson.status} onChange={(e) => setEditingLesson({...editingLesson, status: e.target.value})}>
                    <option value="planned">📅 Rejalashtirilgan</option>
                    <option value="done">✅ O'tilgan</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>🎯 Dars maqsadlari</label>
                <textarea 
                  rows="3" 
                  value={editingLesson.objectives} 
                  onChange={(e) => setEditingLesson({...editingLesson, objectives: e.target.value})}
                  placeholder="Darsning asosiy maqsadlari..."
                />
              </div>
              <div className="form-group">
                <label>📚 Resurslar va materiallar</label>
                <textarea 
                  rows="3" 
                  value={editingLesson.resources} 
                  onChange={(e) => setEditingLesson({...editingLesson, resources: e.target.value})}
                  placeholder="Darsda ishlatiladigan resurslar..."
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveLesson}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowLessonModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Detallar modal */}
      {showDetailsModal && selectedHomework && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 {selectedHomework.title}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Fan:</span>
                  <span className="detail-value">{selectedHomework.subject}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sinf:</span>
                  <span className="detail-value">{selectedHomework.class}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">O'qituvchi:</span>
                  <span className="detail-value">{selectedHomework.teacher}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Muddati:</span>
                  <span className="detail-value">{selectedHomework.dueDate}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Tavsif:</span>
                  <span className="detail-value">{selectedHomework.description}</span>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homework;