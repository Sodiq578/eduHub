import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCalendar, 
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineUpload,
  HiOutlineChat,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineX
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Attendance.css';


const StudentDashboard = () => {
  const { user } = useAuth();
  
  // Student ma'lumotlari
  const [studentInfo, setStudentInfo] = useState({
    name: user?.name || 'Ali Valiyev',
    class: user?.class || '10-A',
    avatar: user?.avatar || 'A'
  });
  
  // Davomat ma'lumotlari
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Uy vazifalari
  const [homeworks, setHomeworks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [fileUpload, setFileUpload] = useState(null);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showHomeworkDetails, setShowHomeworkDetails] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [selectedHomeworkForComment, setSelectedHomeworkForComment] = useState(null);
  const [comments, setComments] = useState([]);
  
  // Statistika
  const [stats, setStats] = useState({
    totalDays: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    attendanceRate: 0
  });

  // Load data
  useEffect(() => {
    loadAttendanceData();
    loadHomeworks();
    loadSubmissions();
    loadComments();
  }, [studentInfo.class, selectedMonth, selectedYear]);

  const loadAttendanceData = () => {
    // Haqiqiy ma'lumotlar localStorage dan olinadi
    const stored = localStorage.getItem(`attendance_${studentInfo.class}`);
    if (stored) {
      const allRecords = JSON.parse(stored);
      // Faqat joriy oy va yil uchun filter
      const filtered = allRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === selectedMonth && 
               recordDate.getFullYear() === selectedYear;
      });
      setAttendanceRecords(filtered);
      calculateStats(filtered);
    } else {
      // Test ma'lumotlar
      const demoRecords = generateDemoAttendance();
      setAttendanceRecords(demoRecords);
      calculateStats(demoRecords);
    }
  };

  const generateDemoAttendance = () => {
    const records = [];
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const studentName = studentInfo.name;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dayOfWeek = date.getDay();
      
      // Faqat ish kunlari (1-5, dushanba-juma)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        let status = 'present';
        let arrival = '08:00';
        let note = '';
        
        // Random holatlar (demo uchun)
        const random = Math.random();
        if (random < 0.1) {
          status = 'absent';
          arrival = '-';
          note = 'Kasallik sababli';
        } else if (random < 0.15) {
          status = 'late';
          arrival = `08:${15 + Math.floor(Math.random() * 30)}`;
          note = 'Kechikish';
        } else if (random < 0.18) {
          status = 'excused';
          arrival = '09:00';
          note = 'Shifokor qabulida';
        } else {
          status = 'present';
          arrival = `07:${45 + Math.floor(Math.random() * 15)}`;
        }
        
        records.push({
          id: day,
          date: date.toISOString().split('T')[0],
          status,
          arrival: arrival,
          departure: '14:30',
          note
        });
      }
    }
    return records;
  };

  const calculateStats = (records) => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const late = records.filter(r => r.status === 'late').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const excused = records.filter(r => r.status === 'excused').length;
    const attendanceRate = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    
    setStats({ totalDays: total, present, late, absent, excused, attendanceRate });
  };

  const loadHomeworks = () => {
    const stored = localStorage.getItem('homeworks');
    if (stored) {
      const allHomeworks = JSON.parse(stored);
      // Faqat o'quvchining sinfiga tegishli va o'chirilmagan vazifalar
      const filtered = allHomeworks.filter(hw => 
        hw.class === studentInfo.class && 
        !hw.isDeleted
      );
      setHomeworks(filtered);
    } else {
      // Demo ma'lumotlar
      const demoHomeworks = [
        { id: 1, title: 'Matematika 5-misol', subject: 'Matematika', class: studentInfo.class, dueDate: '2024-12-20', status: 'pending', description: '5-misolni yechish. 45-50 betlar.', teacher: 'Shahzoda Ahmedova', priority: 'high', createdAt: '2024-12-15' },
        { id: 2, title: 'Fizika laboratoriya ishi', subject: 'Fizika', class: studentInfo.class, dueDate: '2024-12-18', status: 'submitted', description: 'Elektr zanjirlarini yig\'ish va hisoblash', teacher: 'Rustam Karimov', priority: 'medium', createdAt: '2024-12-14' },
        { id: 3, title: 'Ingliz tili matn o\'qish', subject: 'Ingliz tili', class: studentInfo.class, dueDate: '2024-12-22', status: 'pending', description: 'Matnni o\'qish va tarjima qilish', teacher: 'Gulnora Saidova', priority: 'low', createdAt: '2024-12-16' }
      ];
      setHomeworks(demoHomeworks);
    }
  };

  const loadSubmissions = () => {
    const stored = localStorage.getItem('homework_submissions');
    if (stored) {
      const allSubmissions = JSON.parse(stored);
      const mySubmissions = allSubmissions.filter(s => s.studentId === user?.id);
      setSubmissions(mySubmissions);
    } else {
      setSubmissions([]);
    }
  };

  const loadComments = () => {
    const stored = localStorage.getItem('homework_comments');
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      setComments([]);
    }
  };

  const getDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      fileUrl: fileUrl,
      fileName: fileUpload.name
    };
    
    const updatedSubmissions = [...submissions, newSubmission];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('homework_submissions', JSON.stringify(updatedSubmissions));
    
    // Update homework status
    const updatedHomeworks = homeworks.map(h => 
      h.id === homeworkId ? { ...h, status: 'submitted' } : h
    );
    setHomeworks(updatedHomeworks);
    localStorage.setItem('homeworks', JSON.stringify(updatedHomeworks));
    
    alert('Uy vazifasi muvaffaqiyatli topshirildi!');
    setFileUpload(null);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      homeworkId: selectedHomeworkForComment.id,
      text: commentText,
      author: user?.name,
      role: user?.role,
      createdAt: new Date().toISOString()
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('homework_comments', JSON.stringify(updatedComments));
    setCommentText('');
    setShowCommentModal(false);
    alert('Izoh qo\'shildi!');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <HiOutlineCheckCircle className="status-icon present" />;
      case 'late': return <HiOutlineClock className="status-icon late" />;
      case 'absent': return <HiOutlineXCircle className="status-icon absent" />;
      case 'excused': return <HiOutlineCalendar className="status-icon excused" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'present': return 'Kelgan';
      case 'late': return 'Kech kelgan';
      case 'absent': return 'Kelmagan';
      case 'excused': return 'Uzrli';
      default: return status;
    }
  };

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="student-header">
        <div className="student-welcome">
          <div className="student-avatar">
            {studentInfo.avatar}
          </div>
          <div>
            <h1>Assalomu alaykum, {studentInfo.name}!</h1>
            <p className="student-class">
              <HiOutlineAcademicCap /> {studentInfo.class} sinf o'quvchisi
            </p>
          </div>
        </div>
        <div className="current-date">
          <HiOutlineCalendar />
          {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Davomat bo'limi */}
      <div className="section-card">
        <div className="section-header">
          <h2><HiOutlineCalendar /> Mening davomatim</h2>
          <div className="month-selector">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Davomat statistikasi */}
        <div className="attendance-stats-grid">
          <div className="stat-card-small">
            <div className="stat-value">{stats.attendanceRate}%</div>
            <div className="stat-label">Davomat foizi</div>
          </div>
          <div className="stat-card-small present">
            <div className="stat-value">{stats.present}</div>
            <div className="stat-label">Kelgan</div>
          </div>
          <div className="stat-card-small late">
            <div className="stat-value">{stats.late}</div>
            <div className="stat-label">Kech kelgan</div>
          </div>
          <div className="stat-card-small absent">
            <div className="stat-value">{stats.absent}</div>
            <div className="stat-label">Kelmagan</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="attendance-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.attendanceRate}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Jami {stats.totalDays} kundan {stats.present + stats.late} kun qatnashgan
          </p>
        </div>

        {/* Davomat jadvali */}
        <div className="attendance-calendar">
          <div className="calendar-grid">
            {attendanceRecords.map(record => (
              <div 
                key={record.id} 
                className={`calendar-day ${record.status}`}
                title={`${record.date}: ${getStatusText(record.status)}${record.note ? ` - ${record.note}` : ''}`}
              >
                <span className="day-number">{new Date(record.date).getDate()}</span>
                {getStatusIcon(record.status)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uy vazifalari bo'limi */}
      <div className="section-card">
        <div className="section-header">
          <h2><HiOutlineDocumentText /> Uy vazifalarim</h2>
          <p className="section-subtitle">
            {homeworks.filter(h => h.status === 'pending').length} ta bajarilmagan vazifa
          </p>
        </div>

        <div className="homework-list">
          {homeworks.length === 0 ? (
            <div className="empty-state">
              <HiOutlineBookOpen size={48} />
              <p>Hozircha uy vazifalari yo'q</p>
            </div>
          ) : (
            homeworks.map(hw => {
              const daysLeft = getDaysLeft(hw.dueDate);
              const isOverdue = daysLeft < 0 && hw.status === 'pending';
              const submission = submissions.find(s => s.homeworkId === hw.id);
              const homeworkComments = comments.filter(c => c.homeworkId === hw.id);
              
              return (
                <div key={hw.id} className={`homework-item ${hw.priority} ${hw.status === 'submitted' ? 'submitted' : ''}`}>
                  <div className="homework-item-header">
                    <div>
                      <h3>{hw.title}</h3>
                      <div className="homework-meta">
                        <span className="subject">{hw.subject}</span>
                        <span className="teacher">
                          <HiOutlineUser /> {hw.teacher}
                        </span>
                      </div>
                    </div>
                    <div className="homework-badges">
                      <span className={`priority-badge ${hw.priority}`}>
                        {hw.priority === 'high' ? '🔴 Muhim' : hw.priority === 'medium' ? '🟡 O\'rta' : '🟢 Oddiy'}
                      </span>
                      <span className={`status-badge ${hw.status}`}>
                        {hw.status === 'pending' ? '⏳ Bajarilmagan' : '✅ Topshirilgan'}
                      </span>
                      {isOverdue && (
                        <span className="overdue-badge">
                          <HiOutlineExclamationCircle /> Muddati o'tgan
                        </span>
                      )}
                      {!isOverdue && daysLeft <= 3 && daysLeft > 0 && hw.status === 'pending' && (
                        <span className="deadline-badge">
                          <HiOutlineClock /> {daysLeft} kun qoldi
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="homework-description">{hw.description}</p>
                  
                  <div className="homework-footer">
                    <div className="homework-date">
                      <HiOutlineCalendar /> 
                      Muddati: {new Date(hw.dueDate).toLocaleDateString('uz-UZ')}
                    </div>
                    
                    <div className="homework-actions">
                      <button 
                        className="view-btn"
                        onClick={() => {
                          setSelectedHomework(hw);
                          setShowHomeworkDetails(true);
                        }}
                      >
                        <HiOutlineEye /> Ko'rish
                      </button>
                      
                      {hw.status === 'pending' && !submission && (
                        <>
                          <input 
                            type="file" 
                            id={`file-${hw.id}`}
                            onChange={(e) => setFileUpload(e.target.files[0])}
                            className="file-input"
                            accept=".pdf,.doc,.docx,.jpg,.png"
                          />
                          <label htmlFor={`file-${hw.id}`} className="file-label">
                            📎 Fayl tanlash
                          </label>
                          {fileUpload && (
                            <button 
                              className="submit-btn"
                              onClick={() => handleSubmitHomework(hw.id)}
                            >
                              <HiOutlineUpload /> Topshirish
                            </button>
                          )}
                        </>
                      )}
                      
                      {submission && (
                        <div className="submitted-info">
                          ✅ Topshirilgan: {submission.submittedAt}
                          {submission.fileUrl && (
                            <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                              Faylni ko'rish
                            </a>
                          )}
                        </div>
                      )}
                      
                      <button 
                        className="comment-btn"
                        onClick={() => {
                          setSelectedHomeworkForComment(hw);
                          setShowCommentModal(true);
                        }}
                      >
                        <HiOutlineChat /> Izoh ({homeworkComments.length})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Homework Details Modal */}
      {showHomeworkDetails && selectedHomework && (
        <div className="modal-overlay" onClick={() => setShowHomeworkDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 {selectedHomework.title}</h2>
              <button className="modal-close" onClick={() => setShowHomeworkDetails(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Fan:</span>
                <span className="detail-value">{selectedHomework.subject}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">O'qituvchi:</span>
                <span className="detail-value">{selectedHomework.teacher}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Muddati:</span>
                <span className="detail-value">{selectedHomework.dueDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tavsif:</span>
                <p className="detail-description">{selectedHomework.description}</p>
              </div>
              
              <div className="comments-section">
                <h4>💬 Izohlar</h4>
                {comments.filter(c => c.homeworkId === selectedHomework.id).length === 0 ? (
                  <p className="no-comments">Hech qanday izoh yo'q</p>
                ) : (
                  comments.filter(c => c.homeworkId === selectedHomework.id).map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">{c.author}</span>
                        <span className="comment-date">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="comment-text">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowHomeworkDetails(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="modal-overlay" onClick={() => setShowCommentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 Izoh qoldirish</h2>
              <button className="modal-close" onClick={() => setShowCommentModal(false)}>
                <HiOutlineX />
              </button>
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
              <button className="btn-primary" onClick={handleAddComment}>
                Yuborish
              </button>
              <button className="btn-secondary" onClick={() => setShowCommentModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;