import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineChartBar, HiOutlineCalendar, HiOutlineCreditCard, HiOutlineBell, HiOutlineStar } from 'react-icons/hi';
import './ParentPanel.css';

const ParentPanel = () => {
  const { user } = useAuth();
  const [childData, setChildData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const child = students.find(s => s.id === user?.childId);
    setChildData(child);
    
    const allGrades = JSON.parse(localStorage.getItem('grades') || '[]');
    setGrades(allGrades.filter(g => g.studentId === child?.id));
    
    const allAttendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    setAttendance(allAttendance.filter(a => a.studentId === child?.id));
    
    const allPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    setPayments(allPayments.filter(p => p.studentId === child?.id));
  }, [user]);

  const averageGrade = grades.length > 0 
    ? (grades.reduce((sum, g) => sum + (g.score || g.grade || 0), 0) / grades.length).toFixed(1)
    : 0;

  return (
    <div className="parent-panel">
      <div className="page-header">
        <h1>Ota-ona paneli</h1>
        <p>Farzandingizning o'quv faoliyatini kuzating</p>
      </div>

      <div className="child-info-card">
        <div className="child-avatar">{childData?.name?.charAt(0) || '?'}</div>
        <div className="child-details">
          <h2>{childData?.name || 'Ma\'lumot yo\'q'}</h2>
          <p>Sinf: {childData?.class || '-'} | O'quvchi ID: {childData?.id || '-'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{grades.length}</div>
          <div className="stat-label">Jami baholar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{attendance.filter(a => a.status === 'present').length}</div>
          <div className="stat-label">Kelgan kunlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{payments.filter(p => p.status === 'paid').length}</div>
          <div className="stat-label">To'lovlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageGrade}</div>
          <div className="stat-label">O'rtacha baho</div>
        </div>
      </div>

      <div className="recent-grades">
        <h3><HiOutlineStar /> So'nggi baholar</h3>
        <div className="grades-list">
          {grades.slice(0, 5).map(grade => (
            <div key={grade.id} className="grade-item">
              <span className="grade-subject">{grade.subject}</span>
              <span className={`grade-score score-${grade.score || grade.grade}`}>{grade.score || grade.grade}</span>
              <span className="grade-date">{grade.date}</span>
            </div>
          ))}
          {grades.length === 0 && <p className="no-data">Hali baholar mavjud emas</p>}
        </div>
      </div>

      <div className="recent-attendance">
        <h3><HiOutlineCalendar /> So'nggi davomat</h3>
        <div className="attendance-list">
          {attendance.slice(0, 5).map(att => (
            <div key={att.id} className="attendance-item">
              <span className="attendance-date">{att.date}</span>
              <span className={`attendance-status ${att.status}`}>
                {att.status === 'present' ? '✅ Kelgan' : att.status === 'late' ? '⏰ Kech' : '❌ Kelmagan'}
              </span>
            </div>
          ))}
          {attendance.length === 0 && <p className="no-data">Hali davomat ma'lumotlari mavjud emas</p>}
        </div>
      </div>
    </div>
  );
};

export default ParentPanel;