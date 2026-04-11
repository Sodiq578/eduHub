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
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineX,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardList,
  HiOutlineStar,           
  HiOutlineChartBar as HiOutlineChartBarIcon,
  HiOutlineClock as HiOutlineTime
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Exams.css';

const Exams = () => {
  const { user, roles } = useAuth();
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showExamTaking, setShowExamTaking] = useState(false);
  const [currentTakingExam, setCurrentTakingExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  const subjects = ['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', "O'zbek tili", 'Adabiyot', 'Geografiya'];

  const isAdmin = user?.role === roles.ADMIN;
  const isTeacher = user?.role === roles.TEACHER;
  const isStudent = user?.role === roles.STUDENT;

  useEffect(() => {
    loadExams();
    loadNotifications();
  }, []);

  const loadExams = () => {
    const stored = localStorage.getItem('exams');
    if (stored) {
      const parsedExams = JSON.parse(stored);
      // Ensure all exams have results array
      const examsWithResults = parsedExams.map(exam => ({
        ...exam,
        results: exam.results || []
      }));
      setExams(examsWithResults);
    } else {
      const defaultExams = [
        { 
          id: 1, 
          title: 'Matematika 1-chorak', 
          subject: 'Matematika', 
          class: '10-A',
          teacher: 'Shahzoda Ahmedova',
          teacherId: 1,
          type: 'test',
          date: '2024-12-15', 
          duration: 60, 
          totalScore: 50, 
          status: 'upcoming',
          questions: [
            { id: 1, question: '2 + 2 = ?', options: ['3', '4', '5', '6'], answer: '4' },
            { id: 2, question: '5 * 3 = ?', options: ['10', '12', '15', '18'], answer: '15' },
            { id: 3, question: '10 / 2 = ?', options: ['2', '3', '4', '5'], answer: '5' }
          ],
          results: [],
          createdAt: '2024-12-01'
        },
        { 
          id: 2, 
          title: 'Fizika O\'rtacha', 
          subject: 'Fizika', 
          class: '10-B',
          teacher: 'Rustam Karimov',
          teacherId: 2,
          type: 'test',
          date: '2024-12-10', 
          duration: 45, 
          totalScore: 40, 
          status: 'completed',
          questions: [
            { id: 1, question: 'Elektr tokining birligi?', options: ['Amper', 'Volt', 'Om', 'Vatt'], answer: 'Amper' }
          ],
          results: [
            { studentId: 1, studentName: 'Ali Valiyev', score: 35, percentage: 87.5, grade: 'B', submittedAt: '2024-12-10' },
            { studentId: 2, studentName: 'Dilnoza Karimova', score: 38, percentage: 95, grade: 'A', submittedAt: '2024-12-10' }
          ],
          createdAt: '2024-12-01'
        },
        { 
          id: 3, 
          title: 'Ingliz tili Test', 
          subject: 'Ingliz tili', 
          class: '9-A',
          teacher: 'Gulnora Saidova',
          teacherId: 3,
          type: 'test',
          date: '2024-12-20', 
          duration: 30, 
          totalScore: 30, 
          status: 'upcoming',
          questions: [
            { id: 1, question: '"Hello" so\'zi qaysi tilda?', options: ['Rus', 'Ingliz', 'Nemis', 'Fransuz'], answer: 'Ingliz' }
          ],
          results: [],
          createdAt: '2024-12-05'
        }
      ];
      setExams(defaultExams);
      localStorage.setItem('exams', JSON.stringify(defaultExams));
    }
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem('exam_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const defaultNotifications = [
        { id: 1, title: 'Yangi imtihon', message: 'Matematika fanidan imtihon e\'lon qilindi', type: 'new', date: '2024-12-15', read: false, examId: 1 },
        { id: 2, title: 'Imtihon yaqinlashmoqda', message: 'Fizika imtihoniga 2 kun qoldi', type: 'reminder', date: '2024-12-08', read: false, examId: 2 }
      ];
      setNotifications(defaultNotifications);
      localStorage.setItem('exam_notifications', JSON.stringify(defaultNotifications));
    }
  };

  const saveExams = (updated) => {
    setExams(updated);
    localStorage.setItem('exams', JSON.stringify(updated));
  };

  const saveNotifications = (updated) => {
    setNotifications(updated);
    localStorage.setItem('exam_notifications', JSON.stringify(updated));
  };

  const handleSaveExam = () => {
    if (!editingExam.title || !editingExam.subject || !editingExam.class || !editingExam.date) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedExams;
    if (editingExam.id) {
      updatedExams = exams.map(e => e.id === editingExam.id ? { ...editingExam, results: e.results || [] } : e);
      alert('Imtihon yangilandi!');
    } else {
      const newExam = { 
        ...editingExam, 
        id: Date.now(),
        status: 'upcoming',
        questions: editingExam.type === 'test' ? [] : null,
        results: [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      updatedExams = [newExam, ...exams];
      
      const newNotification = {
        id: Date.now(),
        title: 'Yangi imtihon',
        message: `${newExam.subject} fanidan yangi imtihon e\'lon qilindi`,
        type: 'new',
        date: new Date().toISOString().split('T')[0],
        read: false,
        examId: newExam.id
      };
      saveNotifications([newNotification, ...notifications]);
      alert('Yangi imtihon qo\'shildi!');
    }
    
    saveExams(updatedExams);
    setShowModal(false);
    setEditingExam(null);
  };

  const handleDeleteExam = (id) => {
    if (window.confirm('Imtihonni o\'chirmoqchimisiz?')) {
      saveExams(exams.filter(exam => exam.id !== id));
      alert('Imtihon o\'chirildi!');
    }
  };

  const handleAddQuestion = () => {
    if (!editingExam.questions) {
      setEditingExam({ ...editingExam, questions: [] });
    }
    setEditingExam({
      ...editingExam,
      questions: [...(editingExam.questions || []), { id: Date.now(), question: '', options: ['', '', '', ''], answer: '' }]
    });
  };

  const handleUpdateQuestion = (index, field, value) => {
    const updatedQuestions = [...editingExam.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setEditingExam({ ...editingExam, questions: updatedQuestions });
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = editingExam.questions.filter((_, i) => i !== index);
    setEditingExam({ ...editingExam, questions: updatedQuestions });
  };

  const handleStartExam = (exam) => {
    setCurrentTakingExam(exam);
    setTimeLeft(exam.duration * 60);
    setStudentAnswers({});
    setShowExamTaking(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    window.examTimer = timer;
  };

  const handleSubmitExam = () => {
    clearInterval(window.examTimer);
    
    let score = 0;
    if (currentTakingExam.questions && currentTakingExam.questions.length > 0) {
      currentTakingExam.questions.forEach((q, index) => {
        if (studentAnswers[index] === q.answer) {
          score += currentTakingExam.totalScore / currentTakingExam.questions.length;
        }
      });
    }
    
    const percentage = (score / currentTakingExam.totalScore) * 100;
    let grade = '';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    else grade = 'F';
    
    const result = {
      studentId: user?.id || Date.now(),
      studentName: user?.name || 'Student',
      score: Math.round(score),
      percentage: Math.round(percentage),
      grade,
      submittedAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedExams = exams.map(e => 
      e.id === currentTakingExam.id 
        ? { ...e, results: [...(e.results || []), result] }
        : e
    );
    saveExams(updatedExams);
    
    alert(`Imtihon yakunlandi! Sizning natijangiz: ${Math.round(percentage)}% (${grade})`);
    setShowExamTaking(false);
    setCurrentTakingExam(null);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setStudentAnswers({ ...studentAnswers, [questionIndex]: answer });
  };

  const markNotificationAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  };

  const getExamStats = () => {
    if (!exams || exams.length === 0) {
      return { totalExams: 0, upcomingExams: 0, completedExams: 0, totalScore: 0, averageScore: 0 };
    }
    
    const totalExams = exams.length;
    const upcomingExams = exams.filter(e => e.status === 'upcoming').length;
    const completedExams = exams.filter(e => e.status === 'completed').length;
    const totalScore = exams.reduce((sum, e) => sum + (e.totalScore || 0), 0);
    
    let totalResults = 0;
    let sumPercentages = 0;
    exams.forEach(exam => {
      if (exam.results && Array.isArray(exam.results)) {
        exam.results.forEach(result => {
          totalResults++;
          sumPercentages += result.percentage || 0;
        });
      }
    });
    const averageScore = totalResults > 0 ? Math.round(sumPercentages / totalResults) : 0;
    
    return { totalExams, upcomingExams, completedExams, totalScore, averageScore };
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exam.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === '' || exam.subject === filterSubject;
    const matchesStatus = filterStatus === '' || exam.status === filterStatus;
    const matchesClass = filterClass === '' || exam.class === filterClass;
    const matchesDate = (!dateRange.start || exam.date >= dateRange.start) &&
                        (!dateRange.end || exam.date <= dateRange.end);
    return matchesSearch && matchesSubject && matchesStatus && matchesClass && matchesDate;
  });

  const stats = getExamStats();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="exams-page">
      <div className="page-header">
        <div>
          <h1>📋 Imtihonlar va Testlar</h1>
          <p>Jami {stats.totalExams} ta imtihon | {stats.upcomingExams} ta kutilayotgan | {stats.completedExams} ta tugallangan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
            <HiOutlineBell />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
          <button className="btn-icon" onClick={() => setShowAnalytics(!showAnalytics)}>
            <HiOutlineChartBarIcon />
          </button>
          {(isAdmin || isTeacher) && (
            <button className="btn-primary" onClick={() => { setEditingExam({ type: 'test', duration: 60, totalScore: 100 }); setShowModal(true); }}>
              <HiOutlinePlus /> Yangi imtihon
            </button>
          )}
        </div>
      </div>

      <div className="exams-stats">
        <div className="stat-card total">
          <div className="stat-value">{stats.totalExams}</div>
          <div className="stat-label">Jami imtihonlar</div>
        </div>
        <div className="stat-card upcoming">
          <div className="stat-value">{stats.upcomingExams}</div>
          <div className="stat-label">Kutilayotgan</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-value">{stats.completedExams}</div>
          <div className="stat-label">Tugallangan</div>
        </div>
        <div className="stat-card score">
          <div className="stat-value">{stats.averageScore}%</div>
          <div className="stat-label">O'rtacha natija</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input type="text" placeholder="Imtihon qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">Barcha fanlar</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="upcoming">Kutilayotgan</option>
            <option value="ongoing">Jarayonda</option>
            <option value="completed">Tugallangan</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
          <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="date-range">
          <input type="date" placeholder="Boshlanish" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span>-</span>
          <input type="date" placeholder="Tugash" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      {showAnalytics && (
        <div className="analytics-view">
          <div className="analytics-header">
            <h3>📊 Imtihonlar statistikasi</h3>
            <button onClick={() => setShowAnalytics(false)}><HiOutlineX /></button>
          </div>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Fanlar bo'yicha imtihonlar</h4>
              <div className="subject-stats">
                {subjects.map(s => {
                  const count = exams.filter(e => e.subject === s).length;
                  if (count > 0) {
                    return (
                      <div key={s} className="subject-stat-item">
                        <span className="subject-name">{s}</span>
                        <div className="subject-bar-bg">
                          <div className="subject-bar-fill" style={{ width: `${(count / stats.totalExams) * 100}%` }}></div>
                        </div>
                        <span className="subject-count">{count}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            <div className="analytics-card">
              <h4>Sinf bo'yicha natijalar</h4>
              {classes.map(c => {
                const classExams = exams.filter(e => e.class === c);
                let totalPercentage = 0;
                let resultCount = 0;
                classExams.forEach(exam => {
                  if (exam.results && Array.isArray(exam.results)) {
                    exam.results.forEach(result => {
                      totalPercentage += result.percentage || 0;
                      resultCount++;
                    });
                  }
                });
                const avgPercentage = resultCount > 0 ? Math.round(totalPercentage / resultCount) : 0;
                return (
                  <div key={c} className="class-stat-item">
                    <span className="class-name">{c}</span>
                    <div className="class-bar-bg">
                      <div className="class-bar-fill" style={{ width: `${avgPercentage}%`, backgroundColor: avgPercentage >= 70 ? '#10b981' : avgPercentage >= 50 ? '#f59e0b' : '#ef4444' }}></div>
                    </div>
                    <span className="class-percent">{avgPercentage}%</span>
                  </div>
                );
              })}
            </div>
            <div className="analytics-card">
              <h4>Eng yaxshi natijalar</h4>
              {exams.flatMap(e => e.results || []).sort((a, b) => (b.percentage || 0) - (a.percentage || 0)).slice(0, 5).map((result, idx) => (
                <div key={idx} className="top-result-item">
                  <span className="top-rank">#{idx + 1}</span>
                  <span className="top-name">{result.studentName}</span>
                  <span className="top-percent">{result.percentage}%</span>
                  <span className="top-grade">{result.grade}</span>
                </div>
              ))}
            </div>
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
                  <div className="notification-icon">{n.type === 'new' ? '📝' : '⏰'}</div>
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

      <div className="exams-grid">
        {filteredExams.map(exam => {
          const userResult = isStudent && exam.results ? exam.results.find(r => r.studentId === user?.id) : null;
          const canTake = isStudent && exam.status === 'upcoming' && !userResult;
          
          return (
            <div key={exam.id} className={`exam-card ${exam.status}`}>
              <div className="exam-card-header">
                <div className="exam-icon">
                  {exam.type === 'test' ? <HiOutlineClipboardList /> : <HiOutlineDocumentText />}
                </div>
                <div className="exam-info">
                  <h3>{exam.title}</h3>
                  <p>{exam.subject} | {exam.class}</p>
                  <p className="exam-teacher"><HiOutlineUser /> {exam.teacher}</p>
                </div>
                {(isAdmin || isTeacher) && (
                  <div className="card-actions">
                    <button className="card-menu-btn" onClick={() => { setEditingExam(exam); setShowModal(true); }}>
                      <HiOutlinePencil />
                    </button>
                    <button className="card-delete-btn" onClick={() => handleDeleteExam(exam.id)}>
                      <HiOutlineTrash />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="exam-card-body">
                <div className="exam-detail"><HiOutlineCalendar /> Sana: {exam.date}</div>
                <div className="exam-detail"><HiOutlineClock /> Davomiyligi: {exam.duration} daqiqa</div>
                <div className="exam-detail"><HiOutlineChartBarIcon /> Maksimal ball: {exam.totalScore}</div>
                <div className="exam-detail"><HiOutlineQuestionMarkCircle /> Savollar soni: {exam.questions?.length || 0}</div>
              </div>
              
              {userResult && (
                <div className="exam-result">
                  <div className="result-score">
                    <HiOutlineStar />
                    <span>Sizning natijangiz: {userResult.score} / {exam.totalScore} ({userResult.percentage}%)</span>
                    <span className={`result-grade grade-${userResult.grade}`}>Baho: {userResult.grade}</span>
                  </div>
                </div>
              )}
              
              <div className="exam-card-footer">
                <span className={`status-badge ${exam.status}`}>
                  {exam.status === 'upcoming' ? '⏳ Kutilmoqda' : exam.status === 'ongoing' ? '▶️ Jarayonda' : exam.status === 'completed' ? '✅ Tugallangan' : '❌ Bekor qilingan'}
                </span>
                <div className="footer-buttons">
                  <button className="view-btn" onClick={() => { setSelectedExam(exam); setShowResultsModal(true); }}>
                    <HiOutlineEye /> Natijalar
                  </button>
                  {canTake && (
                    <button className="take-exam-btn" onClick={() => handleStartExam(exam)}>
                      Boshlash
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Exam Taking Modal */}
      {showExamTaking && currentTakingExam && (
        <div className="modal-overlay exam-taking-modal">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h2>📝 {currentTakingExam.title}</h2>
              <div className="exam-timer">
                <HiOutlineTime /> Qolgan vaqt: {formatTime(timeLeft)}
              </div>
              <button className="modal-close" onClick={() => { clearInterval(window.examTimer); setShowExamTaking(false); }}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="exam-questions">
                {currentTakingExam.questions?.map((q, idx) => (
                  <div key={q.id} className="exam-question">
                    <h4>{idx + 1}. {q.question}</h4>
                    <div className="exam-options">
                      {q.options?.map((opt, optIdx) => (
                        <label key={optIdx} className="exam-option">
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            value={opt}
                            checked={studentAnswers[idx] === opt}
                            onChange={() => handleAnswerSelect(idx, opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSubmitExam}>Imtihonni yakunlash</button>
              <button className="btn-secondary" onClick={() => { clearInterval(window.examTimer); setShowExamTaking(false); }}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResultsModal && selectedExam && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h2>📊 {selectedExam.title} - Natijalar</h2>
              <button className="modal-close" onClick={() => setShowResultsModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="results-summary">
                <div className="summary-stat">
                  <span className="stat-label">Jami qatnashchilar:</span>
                  <span className="stat-value">{selectedExam.results?.length || 0}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">O'rtacha ball:</span>
                  <span className="stat-value">
                    {selectedExam.results?.length > 0 
                      ? Math.round(selectedExam.results.reduce((sum, r) => sum + (r.percentage || 0), 0) / selectedExam.results.length) 
                      : 0}%
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Eng yaxshi natija:</span>
                  <span className="stat-value">
                    {selectedExam.results?.length > 0 
                      ? Math.max(...selectedExam.results.map(r => r.percentage || 0)) 
                      : 0}%
                  </span>
                </div>
              </div>
              
              <div className="results-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>O'quvchi</th>
                      <th>Ball</th>
                      <th>Foiz</th>
                      <th>Baho</th>
                      <th>Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExam.results?.map((result, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{result.studentName}</td>
                        <td>{result.score} / {selectedExam.totalScore}</td>
                        <td>{result.percentage}%</td>
                        <td><span className={`grade-badge grade-${result.grade}`}>{result.grade}</span></td>
                        <td>{result.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowResultsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {showModal && editingExam && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h2>{editingExam.id ? '✏️ Imtihon tahrirlash' : '➕ Yangi imtihon'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Imtihon nomi *</label>
                <input type="text" value={editingExam.title || ''} onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Fan *</label>
                  <select value={editingExam.subject || ''} onChange={(e) => setEditingExam({ ...editingExam, subject: e.target.value })}>
                    <option value="">Tanlang</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <select value={editingExam.class || ''} onChange={(e) => setEditingExam({ ...editingExam, class: e.target.value })}>
                    <option value="">Tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Imtihon turi</label>
                  <select value={editingExam.type || 'test'} onChange={(e) => setEditingExam({ ...editingExam, type: e.target.value })}>
                    <option value="test">Test</option>
                    <option value="written">Yozma</option>
                    <option value="oral">Og'zaki</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Holati</label>
                  <select value={editingExam.status || 'upcoming'} onChange={(e) => setEditingExam({ ...editingExam, status: e.target.value })}>
                    <option value="upcoming">Kutilayotgan</option>
                    <option value="ongoing">Jarayonda</option>
                    <option value="completed">Tugallangan</option>
                    <option value="cancelled">Bekor qilingan</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Sana *</label>
                  <input type="date" value={editingExam.date || ''} onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Davomiyligi (daqiqa)</label>
                  <input type="number" value={editingExam.duration || 60} onChange={(e) => setEditingExam({ ...editingExam, duration: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Umumiy ball</label>
                  <input type="number" value={editingExam.totalScore || 100} onChange={(e) => setEditingExam({ ...editingExam, totalScore: parseInt(e.target.value) })} />
                </div>
              </div>
              
              {editingExam.type === 'test' && (
                <div className="questions-section">
                  <div className="questions-header">
                    <label>Savollar</label>
                    <button type="button" className="btn-add-question" onClick={handleAddQuestion}>
                      <HiOutlinePlus /> Savol qo'shish
                    </button>
                  </div>
                  {editingExam.questions?.map((q, idx) => (
                    <div key={q.id} className="question-item">
                      <div className="question-header">
                        <h4>Savol {idx + 1}</h4>
                        <button type="button" className="remove-question" onClick={() => handleRemoveQuestion(idx)}>
                          <HiOutlineTrash />
                        </button>
                      </div>
                      <input type="text" placeholder="Savol matni" value={q.question} onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)} />
                      <div className="options-group">
                        {q.options?.map((opt, optIdx) => (
                          <input key={optIdx} type="text" placeholder={`Variant ${optIdx + 1}`} value={opt} onChange={(e) => {
                            const newOptions = [...q.options];
                            newOptions[optIdx] = e.target.value;
                            handleUpdateQuestion(idx, 'options', newOptions);
                          }} />
                        ))}
                      </div>
                      <input type="text" placeholder="To'g'ri javob" value={q.answer} onChange={(e) => handleUpdateQuestion(idx, 'answer', e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveExam}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;