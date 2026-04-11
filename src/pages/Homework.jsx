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
  HiOutlineDownload,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineExclamationCircle,
  HiOutlineUpload,
  HiOutlineChat,
  HiOutlinePrinter,
  HiOutlineTable,
  HiOutlineCog,
  HiOutlineLink,
  HiOutlineDocument,
  HiOutlineFolder,
  HiOutlineSave,
  HiOutlineTrash as HiOutlineSoftDelete
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './Homework.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Homework = () => {
  const { user, roles } = useAuth();
  const [homeworks, setHomeworks] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLessonDetailsModal, setShowLessonDetailsModal] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingHomework, setEditingHomework] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedHomeworkForComment, setSelectedHomeworkForComment] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);
  const [fileUploadLesson, setFileUploadLesson] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  const subjects = ['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', "O'zbek tili", 'Jismoniy tarbiya', 'Adabiyot', 'Geografiya'];
  const [teachers, setTeachers] = useState([]);

  const isAdmin = user?.role === roles.ADMIN;
  const isTeacher = user?.role === roles.TEACHER;
  const isStudent = user?.role === roles.STUDENT;

  useEffect(() => {
    loadHomeworks();
    loadLessons();
    loadTeachers();
    loadNotifications();
    loadComments();
    loadSubmissions();
    loadHistory();
    
    // Cleanup function to revoke object URLs
    return () => {
      homeworks.forEach(hw => {
        if (hw.fileUrl && typeof hw.fileUrl === 'string' && hw.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(hw.fileUrl);
        }
      });
      lessons.forEach(lesson => {
        if (lesson.fileUrl && typeof lesson.fileUrl === 'string' && lesson.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(lesson.fileUrl);
        }
      });
      submissions.forEach(sub => {
        if (sub.fileUrl && sub.fileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(sub.fileUrl);
        }
      });
    };
  }, []);

  const loadHomeworks = () => {
    const stored = localStorage.getItem('homeworks');
    if (stored) {
      setHomeworks(JSON.parse(stored));
    } else {
      const defaultHomeworks = [
        { id: 1, title: 'Matematika 5-misol', subject: 'Matematika', class: '10-A', dueDate: '2024-12-20', status: 'pending', description: '5-misolni yechish', createdAt: '2024-12-15', teacher: 'Shahzoda Ahmedova', teacherId: 1, lessonId: 1, isDeleted: false, priority: 'high', attachments: [], fileUrl: null },
        { id: 2, title: 'Fizika 10-topshiriq', subject: 'Fizika', class: '10-B', dueDate: '2024-12-18', status: 'submitted', description: 'Laboratoriya ishi', createdAt: '2024-12-14', teacher: 'Rustam Karimov', teacherId: 2, lessonId: 2, isDeleted: false, priority: 'medium', attachments: [], fileUrl: null },
        { id: 3, title: 'Ingliz tili matn', subject: 'Ingliz tili', class: '9-A', dueDate: '2024-12-22', status: 'pending', description: 'Matn o\'qish va tarjima qilish', createdAt: '2024-12-16', teacher: 'Gulnora Saidova', teacherId: 3, lessonId: 3, isDeleted: false, priority: 'low', attachments: [], fileUrl: null },
      ];
      setHomeworks(defaultHomeworks);
      localStorage.setItem('homeworks', JSON.stringify(defaultHomeworks));
    }
  };

  const loadLessons = () => {
    const stored = localStorage.getItem('lessons');
    if (stored) {
      setLessons(JSON.parse(stored));
    } else {
      const defaultLessons = [
        { id: 1, title: 'Algebraik ifodalar', subject: 'Matematika', class: '10-A', date: '2024-12-15', teacher: 'Shahzoda Ahmedova', status: 'planned', homeworkId: 1, objectives: 'Algebraik ifodalarni soddalashtirish', resources: 'Darslik 45-50 betler', fileUrl: null, attachments: [], videoUrl: '', lessonPlan: '' },
        { id: 2, title: 'Elektr zanjirlari', subject: 'Fizika', class: '10-B', date: '2024-12-14', teacher: 'Rustam Karimov', status: 'done', homeworkId: 2, objectives: 'Zanjirlarni yig\'ish', resources: 'Laboratoriya jihozlari', fileUrl: null, attachments: [], videoUrl: '', lessonPlan: '' },
        { id: 3, title: 'Present Simple', subject: 'Ingliz tili', class: '9-A', date: '2024-12-16', teacher: 'Gulnora Saidova', status: 'planned', homeworkId: 3, objectives: 'Zamonlarni o\'rganish', resources: 'Grammatika jadvali', fileUrl: null, attachments: [], videoUrl: '', lessonPlan: '' },
      ];
      setLessons(defaultLessons);
      localStorage.setItem('lessons', JSON.stringify(defaultLessons));
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
      ];
      setTeachers(defaultTeachers);
      localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    }
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem('homework_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      setNotifications([]);
      localStorage.setItem('homework_notifications', JSON.stringify([]));
    }
  };

  const loadComments = () => {
    const stored = localStorage.getItem('homework_comments');
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      setComments([]);
      localStorage.setItem('homework_comments', JSON.stringify([]));
    }
  };

  const loadSubmissions = () => {
    const stored = localStorage.getItem('homework_submissions');
    if (stored) {
      setSubmissions(JSON.parse(stored));
    } else {
      setSubmissions([]);
      localStorage.setItem('homework_submissions', JSON.stringify([]));
    }
  };

  const loadHistory = () => {
    const stored = localStorage.getItem('homework_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      setHistory([]);
      localStorage.setItem('homework_history', JSON.stringify([]));
    }
  };

  const saveHomeworks = (updated) => {
    setHomeworks(updated);
    localStorage.setItem('homeworks', JSON.stringify(updated));
  };

  const saveLessons = (updated) => {
    setLessons(updated);
    localStorage.setItem('lessons', JSON.stringify(updated));
  };

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem('homework_notifications', JSON.stringify(updated));
  };

  const saveComments = (updated) => {
    setComments(updated);
    localStorage.setItem('homework_comments', JSON.stringify(updated));
  };

  const saveSubmissions = (updated) => {
    setSubmissions(updated);
    localStorage.setItem('homework_submissions', JSON.stringify(updated));
  };

  const saveHistory = (updated) => {
    setHistory(updated);
    localStorage.setItem('homework_history', JSON.stringify(updated));
  };

  const addToHistory = (action, data) => {
    const newHistory = {
      id: Date.now(),
      action,
      data,
      user: user?.name,
      role: user?.role,
      timestamp: new Date().toISOString()
    };
    saveHistory([newHistory, ...history]);
  };

  const handleAddHomework = () => {
    setEditingHomework({
      title: '',
      subject: '',
      class: '',
      dueDate: '',
      status: 'pending',
      description: '',
      createdAt: new Date().toISOString().split('T')[0],
      teacher: user?.name || 'Admin',
      teacherId: user?.id,
      lessonId: '',
      priority: 'medium',
      attachments: [],
      isDeleted: false,
      fileUrl: null
    });
    setShowModal(true);
  };

  const handleAddLesson = () => {
    setEditingLesson({
      title: '',
      subject: '',
      class: '',
      date: '',
      teacher: user?.name,
      teacherId: user?.id,
      status: 'planned',
      homeworkId: '',
      objectives: '',
      resources: '',
      fileUrl: null,
      attachments: [],
      videoUrl: '',
      lessonPlan: ''
    });
    setShowLessonModal(true);
  };

  const handleSaveHomework = () => {
    if (!editingHomework.title || !editingHomework.subject || !editingHomework.class || !editingHomework.dueDate) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedHomeworks;
    if (editingHomework.id) {
      updatedHomeworks = homeworks.map(h => h.id === editingHomework.id ? editingHomework : h);
      addToHistory('update', { homeworkId: editingHomework.id, changes: editingHomework });
      alert('Uy vazifasi yangilandi!');
    } else {
      const newHomework = { 
        ...editingHomework, 
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        teacher: editingHomework.teacher || user?.name || 'Admin',
        teacherId: user?.id,
        attachments: editingHomework.fileUrl ? [{ name: editingHomework.fileUrl.name, url: URL.createObjectURL(editingHomework.fileUrl) }] : [],
        isDeleted: false
      };
      updatedHomeworks = [newHomework, ...homeworks];
      addToHistory('create', { homeworkId: newHomework.id, data: newHomework });
      
      const newNotification = {
        id: Date.now(),
        title: 'Yangi uy vazifasi',
        message: `${newHomework.subject} fanidan yangi uy vazifasi berildi`,
        type: 'new',
        date: new Date().toISOString().split('T')[0],
        read: false,
        homeworkId: newHomework.id
      };
      saveNotifications([newNotification, ...notifications]);
      
      alert('Yangi uy vazifasi qo\'shildi!');
    }
    
    saveHomeworks(updatedHomeworks);
    setShowModal(false);
    setEditingHomework(null);
    setFileUpload(null);
  };

  const handleSaveLesson = () => {
    if (!editingLesson.title || !editingLesson.subject || !editingLesson.class || !editingLesson.date) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedLessons;
    if (editingLesson.id) {
      updatedLessons = lessons.map(l => l.id === editingLesson.id ? editingLesson : l);
      addToHistory('update_lesson', { lessonId: editingLesson.id, changes: editingLesson });
      alert('Dars rejasi yangilandi!');
    } else {
      const newLesson = { 
        ...editingLesson, 
        id: Date.now(),
        attachments: editingLesson.fileUrl ? [{ name: editingLesson.fileUrl.name, url: URL.createObjectURL(editingLesson.fileUrl) }] : []
      };
      updatedLessons = [newLesson, ...lessons];
      addToHistory('create_lesson', { lessonId: newLesson.id, data: newLesson });
      alert('Yangi dars rejasi qo\'shildi!');
    }
    
    saveLessons(updatedLessons);
    setShowLessonModal(false);
    setEditingLesson(null);
    setFileUploadLesson(null);
  };

  const handleEdit = (homework) => {
    setEditingHomework({ ...homework, fileUrl: null });
    setShowModal(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson({ ...lesson, fileUrl: null });
    setShowLessonModal(true);
  };

  const handleSoftDelete = (id) => {
    if (window.confirm('Uy vazifasini o\'chirmoqchimisiz? (Qayta tiklash mumkin)')) {
      const updatedHomeworks = homeworks.map(h => h.id === id ? { ...h, isDeleted: true } : h);
      saveHomeworks(updatedHomeworks);
      addToHistory('soft_delete', { homeworkId: id });
      alert('Uy vazifasi o\'chirildi!');
    }
  };

  const handleDeleteLesson = (id) => {
    if (window.confirm('Dars rejasini o\'chirmoqchimisiz?')) {
      saveLessons(lessons.filter(l => l.id !== id));
      addToHistory('delete_lesson', { lessonId: id });
      alert('Dars rejasi o\'chirildi!');
    }
  };

  const handleRestore = (id) => {
    const updatedHomeworks = homeworks.map(h => h.id === id ? { ...h, isDeleted: false } : h);
    saveHomeworks(updatedHomeworks);
    addToHistory('restore', { homeworkId: id });
    alert('Uy vazifasi qayta tiklandi!');
  };

  const handleDeletePermanent = (id) => {
    if (window.confirm('Uy vazifasini butunlay o\'chirmoqchimisiz? (Qayta tiklash mumkin emas)')) {
      saveHomeworks(homeworks.filter(h => h.id !== id));
      addToHistory('permanent_delete', { homeworkId: id });
      alert('Uy vazifasi butunlay o\'chirildi!');
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      homeworkId: selectedHomeworkForComment.id,
      text: commentText,
      author: user?.name,
      role: user?.role,
      createdAt: new Date().toISOString(),
      parentId: null
    };
    
    saveComments([newComment, ...comments]);
    setCommentText('');
    setShowCommentModal(false);
    alert('Izoh qo\'shildi!');
  };

  const handleSubmitHomework = (homeworkId) => {
    if (!fileUpload) {
      alert('Iltimos, fayl tanlang!');
      return;
    }

    const fileUrl = URL.createObjectURL(fileUpload);
    const newSubmission = {
      id: Date.now(),
      homeworkId,
      studentId: user?.id,
      studentName: user?.name,
      submittedAt: new Date().toISOString().split('T')[0],
      score: null,
      feedback: null,
      fileUrl: fileUrl,
      fileName: fileUpload.name
    };
    
    saveSubmissions([...submissions, newSubmission]);
    
    const updatedHomeworks = homeworks.map(h => 
      h.id === homeworkId ? { ...h, status: 'submitted' } : h
    );
    saveHomeworks(updatedHomeworks);
    
    alert('Uy vazifasi topshirildi!');
    setFileUpload(null);
  };

  const markNotificationAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUpload(file);
      setEditingHomework({ ...editingHomework, fileUrl: file });
    }
  };

  const handleLessonFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileUploadLesson(file);
      setEditingLesson({ ...editingLesson, fileUrl: file });
    }
  };

  const getFileUrl = (fileData) => {
    if (!fileData) return null;
    if (typeof fileData === 'string') return fileData;
    if (fileData instanceof File) return URL.createObjectURL(fileData);
    return null;
  };

  const activeHomeworks = homeworks.filter(h => !h.isDeleted);
  const deletedHomeworks = homeworks.filter(h => h.isDeleted);

  const filteredHomeworks = activeHomeworks
    .filter(hw => {
      if (isTeacher && hw.teacherId !== user?.id) return false;
      const matchesSearch = hw.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hw.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hw.class.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || hw.status === statusFilter;
      const matchesClass = classFilter === '' || hw.class === classFilter;
      const matchesSubject = subjectFilter === '' || hw.subject === subjectFilter;
      const matchesTeacher = teacherFilter === '' || hw.teacher === teacherFilter;
      const matchesDate = (!dateRange.start || hw.dueDate >= dateRange.start) &&
                          (!dateRange.end || hw.dueDate <= dateRange.end);
      return matchesSearch && matchesStatus && matchesClass && matchesSubject && matchesTeacher && matchesDate;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'dueDate') {
        aVal = new Date(a.dueDate);
        bVal = new Date(b.dueDate);
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const filteredLessons = lessons.filter(lesson => {
    if (isTeacher && lesson.teacherId !== user?.id) return false;
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === '' || lesson.class === classFilter;
    const matchesSubject = subjectFilter === '' || lesson.subject === subjectFilter;
    return matchesSearch && matchesClass && matchesSubject;
  });

  const totalHomeworks = activeHomeworks.length;
  const pendingHomeworks = activeHomeworks.filter(h => h.status === 'pending').length;
  const submittedHomeworks = activeHomeworks.filter(h => h.status === 'submitted').length;
  const overdueHomeworks = activeHomeworks.filter(h => h.status === 'pending' && getDaysLeft(h.dueDate) < 0).length;
  const upcomingDeadlines = activeHomeworks.filter(h => h.status === 'pending' && getDaysLeft(h.dueDate) >= 1 && getDaysLeft(h.dueDate) <= 2).length;

  const totalLessons = lessons.length;
  const plannedLessons = lessons.filter(l => l.status === 'planned').length;
  const doneLessons = lessons.filter(l => l.status === 'done').length;

  const classProgress = classes.map(c => ({
    class: c,
    total: activeHomeworks.filter(h => h.class === c).length,
    submitted: activeHomeworks.filter(h => h.class === c && h.status === 'submitted').length,
    percentage: activeHomeworks.filter(h => h.class === c).length > 0 
      ? (activeHomeworks.filter(h => h.class === c && h.status === 'submitted').length / activeHomeworks.filter(h => h.class === c).length * 100).toFixed(1)
      : 0
  }));

  const subjectStats = subjects.map(s => ({
    subject: s,
    count: activeHomeworks.filter(h => h.subject === s).length,
    submitted: activeHomeworks.filter(h => h.subject === s && h.status === 'submitted').length
  }));

  const statusChartData = {
    labels: ['Bajarilmagan', 'Topshirilgan', 'Muddati o\'tgan'],
    datasets: [{
      data: [Math.max(0, pendingHomeworks - overdueHomeworks), submittedHomeworks, overdueHomeworks],
      backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
      borderWidth: 0
    }]
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToExcel = () => {
    const headers = ['ID', 'Vazifa nomi', 'Fan', 'Sinf', 'Muddati', 'Holat', 'O\'qituvchi'];
    const csvData = filteredHomeworks.map(h => [
      h.id, h.title, h.subject, h.class, h.dueDate, 
      h.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan', h.teacher
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homeworks_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="homework-page">
      <div className="page-header">
        <div>
          <h1>📚 Uy vazifalari va Dars rejalari</h1>
          <p>Jami {totalHomeworks} ta vazifa | {pendingHomeworks} ta bajarilmagan | {submittedHomeworks} ta topshirilgan | {overdueHomeworks} ta muddati o'tgan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
            <HiOutlineBell />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
          <button className="btn-icon" onClick={() => setShowAnalytics(!showAnalytics)}>
            <HiOutlineChartBar />
          </button>
          <button className="btn-icon" onClick={() => setShowCalendarView(!showCalendarView)}>
            <HiOutlineCalendar />
          </button>
          <button className="btn-export" onClick={exportToExcel}>
            <HiOutlineTable /> Excel
          </button>
          <button className="btn-export" onClick={exportToPDF}>
            <HiOutlinePrinter /> PDF
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAddLesson}>
              <HiOutlineBookOpen /> Dars rejasi
            </button>
          )}
          {(isAdmin || isTeacher) && (
            <button className="btn-primary" onClick={handleAddHomework}>
              <HiOutlinePlus /> Yangi vazifa
            </button>
          )}
        </div>
      </div>

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
        <div className="stat-card warning">
          <div className="stat-value">{upcomingDeadlines}</div>
          <div className="stat-label">2 kun ichida</div>
        </div>
      </div>

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
          {isAdmin && (
            <select className="filter-select" value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
              <option value="">Barcha o'qituvchilar</option>
              {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          )}
        </div>
        <div className="date-range">
          <input type="date" placeholder="Boshlanish" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span>-</span>
          <input type="date" placeholder="Tugash" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      <div className="sort-bar">
        <span className="sort-label">Saralash:</span>
        <div className="sort-buttons">
          <button className={`sort-btn ${sortBy === 'dueDate' ? 'active' : ''}`} onClick={() => { setSortBy('dueDate'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
            {sortOrder === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />} Muddat
          </button>
          <button className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`} onClick={() => { setSortBy('title'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
            {sortOrder === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />} Nomi
          </button>
        </div>
        {isAdmin && (
          <button className="view-deleted-btn" onClick={() => setShowDeleted(!showDeleted)}>
            <HiOutlineSoftDelete /> {showDeleted ? 'Aktiv vazifalar' : 'O\'chirilganlar'}
          </button>
        )}
      </div>

      {showAnalytics && (
        <div className="analytics-view">
          <div className="analytics-grid">
            <div className="chart-card">
              <h3>Sinf bo'yicha progress</h3>
              <div className="progress-bars">
                {classProgress.map(c => (
                  <div key={c.class} className="progress-item">
                    <span className="progress-label">{c.class}</span>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, backgroundColor: c.percentage > 70 ? '#10b981' : c.percentage > 40 ? '#f59e0b' : '#ef4444' }}></div>
                    </div>
                    <span className="progress-percent">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-card">
              <h3>Fanlar bo'yicha vazifalar</h3>
              <div className="subject-stats">
                {subjectStats.filter(s => s.count > 0).map(s => (
                  <div key={s.subject} className="subject-item">
                    <span className="subject-name">{s.subject}</span>
                    <div className="subject-bar-bg">
                      <div className="subject-bar-fill" style={{ width: `${(s.count / totalHomeworks) * 100}%` }}></div>
                    </div>
                    <span className="subject-count">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-card">
              <h3>Umumiy holat</h3>
              <div className="status-doughnut">
                <Doughnut data={statusChartData} options={{ responsive: true, maintainAspectRatio: true }} />
                <div className="status-labels">
                  <div><span className="color-box pending-box"></span> Bajarilmagan: {Math.max(0, pendingHomeworks - overdueHomeworks)}</div>
                  <div><span className="color-box submitted-box"></span> Topshirilgan: {submittedHomeworks}</div>
                  <div><span className="color-box overdue-box"></span> Muddati o'tgan: {overdueHomeworks}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCalendarView && (
        <div className="calendar-view">
          <div className="calendar-header">
            <h3>📅 Kalendar</h3>
            <button className="close-calendar" onClick={() => setShowCalendarView(false)}><HiOutlineX /></button>
          </div>
          <div className="calendar-grid">
            {[...activeHomeworks.map(h => ({
              id: h.id,
              title: h.title,
              date: h.dueDate,
              type: 'homework',
              status: h.status
            })), ...lessons.map(l => ({
              id: l.id,
              title: l.title,
              date: l.date,
              type: 'lesson',
              status: l.status
            }))].sort((a,b) => new Date(a.date) - new Date(b.date)).map(event => (
              <div key={event.id} className={`calendar-event ${event.type} ${event.status}`}>
                <div className="event-date">{new Date(event.date).getDate()}</div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-type">{event.type === 'homework' ? '📝 Uy vazifasi' : '📖 Dars rejasi'}</div>
                  <div className="event-date-full">{new Date(event.date).toLocaleDateString('uz-UZ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>🔔 Bildirishnomalar</h3>
            <button onClick={() => setShowNotifications(false)}><HiOutlineX /></button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">Hech qanday bildirishnoma yo'q</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotificationAsRead(n.id)}>
                  <div className="notification-icon">{n.type === 'new' ? '📚' : '⏰'}</div>
                  <div className="notification-content">
                    <div className="notification-title">{n.title}</div>
                    <div className="notification-message">{n.message}</div>
                    <div className="notification-date">{n.date}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Dars rejalari bo'limi */}
      <div className="section-header">
        <h2><HiOutlineBookOpen /> Dars rejalari</h2>
        <p>Jami {totalLessons} ta dars | {plannedLessons} ta rejalashtirilgan | {doneLessons} ta o'tilgan</p>
      </div>

      <div className="lessons-list">
        {filteredLessons.length === 0 ? (
          <div className="empty-state">
            <HiOutlineBookOpen size={48} />
            <p>Hech qanday dars rejasi topilmadi</p>
            {(isAdmin || isTeacher) && (
              <button className="btn-primary" onClick={handleAddLesson}>+ Dars rejasi qo'shish</button>
            )}
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
                  <span className={`lesson-status-badge ${lesson.status}`}>
                    {lesson.status === 'planned' ? '📅 Rejalashtirilgan' : '✅ O\'tilgan'}
                  </span>
                  <button className="view-btn" onClick={() => { setSelectedLesson(lesson); setShowLessonDetailsModal(true); }}>
                    <HiOutlineEye /> Ko'rish
                  </button>
                  {(isAdmin || isTeacher) && (
                    <>
                      <button className="edit-btn" onClick={() => handleEditLesson(lesson)}>
                        <HiOutlinePencil /> Tahrirlash
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteLesson(lesson.id)}>
                        <HiOutlineTrash /> O'chirish
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="lesson-description">
                <div className="lesson-objectives">
                  <strong>🎯 Maqsadlar:</strong> {lesson.objectives || "Ma'lumot kiritilmagan"}
                </div>
                <div className="lesson-resources">
                  <strong>📚 Resurslar:</strong> {lesson.resources || "Ma'lumot kiritilmagan"}
                </div>
                <div className="lesson-date">
                  <HiOutlineCalendar /> Sana: {lesson.date}
                </div>
                {lesson.fileUrl && (
                  <div className="lesson-attachment">
                    <HiOutlineDocument /> Fayl mavjud
                  </div>
                )}
                {lesson.videoUrl && (
                  <div className="lesson-video">
                    <HiOutlineLink /> Video: <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer">Ko'rish</a>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Uy vazifalari bo'limi */}
      <div className="section-header">
        <h2><HiOutlineDocumentText /> Uy vazifalari</h2>
      </div>

      <div className="homework-list">
        {(showDeleted ? deletedHomeworks : filteredHomeworks).length === 0 ? (
          <div className="empty-state">
            <HiOutlineCalendar size={48} />
            <p>Hech qanday uy vazifasi topilmadi</p>
          </div>
        ) : (
          (showDeleted ? deletedHomeworks : filteredHomeworks).map(hw => {
            const daysLeft = getDaysLeft(hw.dueDate);
            const isOverdue = daysLeft < 0 && hw.status === 'pending';
            const submission = submissions.find(s => s.homeworkId === hw.id && s.studentId === user?.id);
            const homeworkComments = comments.filter(c => c.homeworkId === hw.id);
            
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
                    {isOverdue && <span className="overdue-badge"><HiOutlineExclamationCircle /> Muddati o'tgan</span>}
                    {daysLeft <= 2 && daysLeft > 0 && hw.status === 'pending' && (
                      <span className="deadline-badge"><HiOutlineClock /> {daysLeft} kun qoldi</span>
                    )}
                    <button className="view-btn" onClick={() => { setSelectedHomework(hw); setShowDetailsModal(true); }}>
                      <HiOutlineEye />
                    </button>
                  </div>
                </div>
                <div className="homework-description">{hw.description}</div>
                <div className="homework-date">
                  <HiOutlineCalendar /> Topshiriq muddati: {hw.dueDate}
                </div>
                
                {homeworkComments.length > 0 && (
                  <div className="homework-comments-preview">
                    <HiOutlineChat /> {homeworkComments.length} ta izoh
                  </div>
                )}
                
                <div className="homework-actions">
                  {isStudent && !submission && hw.status === 'pending' && (
                    <>
                      <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} className="file-input" />
                      <button className="submit-btn" onClick={() => handleSubmitHomework(hw.id)}>
                        <HiOutlineUpload /> Topshirish
                      </button>
                      <button className="comment-btn" onClick={() => { setSelectedHomeworkForComment(hw); setShowCommentModal(true); }}>
                        <HiOutlineChat /> Izoh
                      </button>
                    </>
                  )}
                  {isStudent && submission && (
                    <div className="submitted-info">
                      ✅ Siz topshirgansiz - {submission.submittedAt}
                      {submission.fileUrl && (
                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="submission-file">Faylni ko'rish</a>
                      )}
                    </div>
                  )}
                  {(isAdmin || isTeacher) && !showDeleted && (
                    <>
                      <button className="edit-btn" onClick={() => handleEdit(hw)}>
                        <HiOutlinePencil /> Tahrirlash
                      </button>
                      <button className="soft-delete-btn" onClick={() => handleSoftDelete(hw.id)}>
                        <HiOutlineSoftDelete /> O'chirish
                      </button>
                    </>
                  )}
                  {showDeleted && (
                    <>
                      <button className="restore-btn" onClick={() => handleRestore(hw.id)}>
                        Qayta tiklash
                      </button>
                      <button className="delete-permanent-btn" onClick={() => handleDeletePermanent(hw.id)}>
                        Butunlay o'chirish
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {isAdmin && history.length > 0 && (
        <div className="history-section">
          <h3><HiOutlineClock /> O'zgartirishlar tarixi</h3>
          <div className="history-list">
            {history.slice(0, 10).map(h => (
              <div key={h.id} className="history-item">
                <span className="history-action">{h.action === 'create' ? '➕ Yaratildi' : h.action === 'update' ? '✏️ Yangilandi' : h.action === 'soft_delete' ? '🗑 O\'chirildi' : h.action === 'restore' ? '🔄 Tiklandi' : h.action}</span>
                <span className="history-user">{h.user} ({h.role})</span>
                <span className="history-time">{new Date(h.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="modal-overlay" onClick={() => setShowCommentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 Izoh qoldirish</h2>
              <button className="modal-close" onClick={() => setShowCommentModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <textarea 
                rows="4" 
                placeholder="Izohingizni yozing..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddComment}>Yuborish</button>
              <button className="btn-secondary" onClick={() => setShowCommentModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Details Modal */}
      {showDetailsModal && selectedHomework && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 {selectedHomework.title}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item"><span className="detail-label">Fan:</span><span className="detail-value">{selectedHomework.subject}</span></div>
                <div className="detail-item"><span className="detail-label">Sinf:</span><span className="detail-value">{selectedHomework.class}</span></div>
                <div className="detail-item"><span className="detail-label">O'qituvchi:</span><span className="detail-value">{selectedHomework.teacher}</span></div>
                <div className="detail-item"><span className="detail-label">Muddati:</span><span className="detail-value">{selectedHomework.dueDate}</span></div>
                <div className="detail-item"><span className="detail-label">Holat:</span><span className={`status-badge ${selectedHomework.status}`}>{selectedHomework.status === 'pending' ? 'Bajarilmagan' : 'Topshirilgan'}</span></div>
                <div className="detail-item"><span className="detail-label">Yaratilgan:</span><span className="detail-value">{selectedHomework.createdAt}</span></div>
                <div className="detail-item full-width"><span className="detail-label">Tavsif:</span><span className="detail-value">{selectedHomework.description}</span></div>
                
                <div className="detail-item full-width">
                  <span className="detail-label">📝 Topshirgan o'quvchilar:</span>
                  <div className="submissions-list">
                    {submissions.filter(s => s.homeworkId === selectedHomework.id).map(s => (
                      <div key={s.id} className="submission-item">
                        <span className="submission-name">{s.studentName}</span>
                        <span className="submission-date">{s.submittedAt}</span>
                        {s.fileUrl && <a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="submission-file">Fayl</a>}
                        {s.score && <span className="submission-score">Baho: {s.score}%</span>}
                      </div>
                    ))}
                    {submissions.filter(s => s.homeworkId === selectedHomework.id).length === 0 && (
                      <span>Hech kim topshirmagan</span>
                    )}
                  </div>
                </div>
                
                <div className="detail-item full-width">
                  <span className="detail-label">💬 Izohlar:</span>
                  <div className="comments-list">
                    {comments.filter(c => c.homeworkId === selectedHomework.id).map(c => (
                      <div key={c.id} className="comment-item">
                        <span className="comment-author">{c.author}</span>
                        <span className="comment-text">{c.text}</span>
                        <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {comments.filter(c => c.homeworkId === selectedHomework.id).length === 0 && (
                      <span>Hech qanday izoh yo'q</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Details Modal */}
      {showLessonDetailsModal && selectedLesson && (
        <div className="modal-overlay" onClick={() => setShowLessonDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📖 {selectedLesson.title}</h2>
              <button className="modal-close" onClick={() => setShowLessonDetailsModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item"><span className="detail-label">Fan:</span><span className="detail-value">{selectedLesson.subject}</span></div>
                <div className="detail-item"><span className="detail-label">Sinf:</span><span className="detail-value">{selectedLesson.class}</span></div>
                <div className="detail-item"><span className="detail-label">O'qituvchi:</span><span className="detail-value">{selectedLesson.teacher}</span></div>
                <div className="detail-item"><span className="detail-label">Sana:</span><span className="detail-value">{selectedLesson.date}</span></div>
                <div className="detail-item"><span className="detail-label">Holat:</span><span className={`lesson-status-badge ${selectedLesson.status}`}>{selectedLesson.status === 'planned' ? 'Rejalashtirilgan' : 'O\'tilgan'}</span></div>
                <div className="detail-item full-width"><span className="detail-label">🎯 Maqsadlar:</span><span className="detail-value">{selectedLesson.objectives || "Ma'lumot kiritilmagan"}</span></div>
                <div className="detail-item full-width"><span className="detail-label">📚 Resurslar:</span><span className="detail-value">{selectedLesson.resources || "Ma'lumot kiritilmagan"}</span></div>
                
                {selectedLesson.videoUrl && (
                  <div className="detail-item full-width">
                    <span className="detail-label">🎥 Video:</span>
                    <a href={selectedLesson.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link">Videoni ko'rish</a>
                  </div>
                )}
                
                {selectedLesson.lessonPlan && (
                  <div className="detail-item full-width">
                    <span className="detail-label">📋 Dars ishlanmasi:</span>
                    <div className="lesson-plan-content">{selectedLesson.lessonPlan}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-buttons">
              {(isAdmin || isTeacher) && (
                <>
                  <button className="btn-primary" onClick={() => { setShowLessonDetailsModal(false); handleEditLesson(selectedLesson); }}>Tahrirlash</button>
                </>
              )}
              <button className="btn-secondary" onClick={() => setShowLessonDetailsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* Homework Modal */}
      {showModal && editingHomework && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingHomework.id ? '✏️ Uy vazifasini tahrirlash' : '➕ Yangi uy vazifasi'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Vazifa nomi *</label>
                <input type="text" value={editingHomework.title} onChange={(e) => setEditingHomework({...editingHomework, title: e.target.value})} placeholder="Masalan: Matematika 5-misol" />
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
                  <input type="date" value={editingHomework.dueDate} onChange={(e) => setEditingHomework({...editingHomework, dueDate: e.target.value})} />
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
                <textarea rows="4" value={editingHomework.description} onChange={(e) => setEditingHomework({...editingHomework, description: e.target.value})} placeholder="Vazifa haqida batafsil..." />
              </div>
              <div className="form-group">
                <label>Fayl (PDF, DOC, DOCX, JPG, PNG)</label>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" />
                {editingHomework.fileUrl && <span className="file-name">Tanlangan: {editingHomework.fileUrl.name}</span>}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveHomework}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && editingLesson && (
        <div className="modal-overlay" onClick={() => setShowLessonModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLesson.id ? '✏️ Dars rejasini tahrirlash' : '➕ Yangi dars rejasi'}</h2>
              <button className="modal-close" onClick={() => setShowLessonModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dars nomi *</label>
                <input type="text" value={editingLesson.title} onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})} placeholder="Masalan: Algebraik ifodalar" />
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
                  <input type="date" value={editingLesson.date} onChange={(e) => setEditingLesson({...editingLesson, date: e.target.value})} />
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
                <textarea rows="3" value={editingLesson.objectives} onChange={(e) => setEditingLesson({...editingLesson, objectives: e.target.value})} placeholder="Darsning asosiy maqsadlari..." />
              </div>
              <div className="form-group">
                <label>📚 Resurslar va materiallar</label>
                <textarea rows="3" value={editingLesson.resources} onChange={(e) => setEditingLesson({...editingLesson, resources: e.target.value})} placeholder="Darsda ishlatiladigan resurslar..." />
              </div>
              <div className="form-group">
                <label>📎 Fayl biriktirish (PDF, DOC, PPT, etc.)</label>
                <input type="file" onChange={handleLessonFileChange} accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png" />
                {editingLesson.fileUrl && <span className="file-name">Tanlangan: {editingLesson.fileUrl.name}</span>}
              </div>
              <div className="form-group">
                <label>🔗 Video link (YouTube, Loom, etc.)</label>
                <input type="url" value={editingLesson.videoUrl || ''} onChange={(e) => setEditingLesson({...editingLesson, videoUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>📋 Dars ishlanmasi (batafsil reja)</label>
                <textarea rows="5" value={editingLesson.lessonPlan || ''} onChange={(e) => setEditingLesson({...editingLesson, lessonPlan: e.target.value})} placeholder="Darsning batafsil rejasi..." />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveLesson}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowLessonModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homework;