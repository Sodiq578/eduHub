import React, { useState, useEffect } from 'react';
import { 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap, 
  HiOutlineCurrencyDollar,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineDownload
} from 'react-icons/hi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Card from '../components/Card';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = ({ onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isLoading, setIsLoading] = useState(false);

  // Statistik ma'lumotlar - navigatsiya qo'shilgan
  const stats = [
    { 
      title: 'Jami o\'quvchilar', 
      value: '1,234', 
      icon: HiOutlineUsers, 
      color: '#10b981', 
      trend: { type: 'up', value: 12 },
      navigateTo: 'students'  // Qaysi sahifaga o'tish
    },
    { 
      title: 'Jami o\'qituvchilar', 
      value: '48', 
      icon: HiOutlineUserGroup, 
      color: '#3b82f6', 
      trend: { type: 'up', value: 5 },
      navigateTo: 'teachers'
    },
    { 
      title: 'Jami sinflar', 
      value: '24', 
      icon: HiOutlineAcademicCap, 
      color: '#f59e0b', 
      trend: { type: 'down', value: 2 },
      navigateTo: 'classes'
    },
    { 
      title: 'Oylik daromad', 
      value: '$12,345', 
      icon: HiOutlineCurrencyDollar, 
      color: '#8b5cf6', 
      trend: { type: 'up', value: 18 },
      navigateTo: 'payments'
    },
  ];

  // Karta bosilganda ishlaydigan funksiya
  const handleStatClick = (navigateTo) => {
    if (onNavigate && navigateTo) {
      onNavigate(navigateTo);
    }
  };

  // O'quvchilar o'sishi chart
  const growthChartData = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    datasets: [
      {
        label: 'O\'quvchilar soni',
        data: [850, 890, 920, 950, 980, 1010, 1050, 1080, 1120, 1150, 1180, 1234],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Davomat chart
  const attendanceChartData = {
    labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
    datasets: [
      {
        label: 'Davomat %',
        data: [92, 88, 95, 91],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  // Baholar taqsimoti chart
  const gradeDistributionData = {
    labels: ['5', '4', '3', '2'],
    datasets: [
      {
        data: [45, 30, 20, 5],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          stepSize: 200,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const attendanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#e2e8f0' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8 },
      },
    },
  };

  const activities = [
    { icon: HiOutlineUsers, text: 'Ali Valiyev darsga keldi', time: '2 soat oldin', color: '#10b981' },
    { icon: HiOutlineStar, text: 'Matematika fanidan test', time: '5 soat oldin', color: '#f59e0b' },
    { icon: HiOutlineCurrencyDollar, text: 'To\'lov qabul qilindi', time: '1 kun oldin', color: '#8b5cf6' },
    { icon: HiOutlineCalendar, text: 'Dars jadvali yangilandi', time: '2 kun oldin', color: '#3b82f6' },
  ];

  const topStudents = [
    { rank: 1, name: 'Sardor Rahimov', grade: 98, points: 2450, improvement: '+5%' },
    { rank: 2, name: 'Dilnoza Karimova', grade: 95, points: 2380, improvement: '+3%' },
    { rank: 3, name: 'Jasur Aliyev', grade: 92, points: 2310, improvement: '+2%' },
    { rank: 4, name: 'Zarina Toshpulatova', grade: 89, points: 2225, improvement: '+1%' },
    { rank: 5, name: 'Bobur Sattorov', grade: 87, points: 2180, improvement: '-1%' },
  ];

  const upcomingEvents = [
    { title: 'Ota-onalar yig\'ilishi', date: '2024-12-15', time: '15:00', type: 'meeting' },
    { title: 'Yil yakuni bayrami', date: '2024-12-25', time: '10:00', type: 'event' },
    { title: 'Imtihon haftaligi', date: '2024-12-20', time: '09:00', type: 'exam' },
  ];

  const exportReport = () => {
    alert('Hisobot yuklanmoqda...');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Xush kelibsiz! Bugun {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="header-actions">
          <div className="header-badge">
            <span className="live-badge"></span>
            Live
          </div>
          <button className="export-btn" onClick={exportReport}>
            <HiOutlineDownload /> Hisobot
          </button>
        </div>
      </div>

      {/* Statistik kartalar - onClick qo'shildi */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} onClick={() => handleStatClick(stat.navigateTo)} style={{ cursor: 'pointer' }}>
            <Card {...stat} />
          </div>
        ))}
      </div>

      {/* Grafiklar grid */}
      <div className="dashboard-grid">
        {/* O'quvchilar o'sishi */}
        <div className="chart-card">
          <div className="card-header">
            <h3><HiOutlineChartBar /> O'quvchilar statistikasi</h3>
            <select className="chart-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
          <div className="chart-container">
            <Line data={growthChartData} options={chartOptions} />
          </div>
          <div className="chart-footer">
            <button 
              className="chart-nav-btn" 
              onClick={() => onNavigate && onNavigate('students')}
            >
              <HiOutlineTrendingUp /> Batafsil ma'lumot
            </button>
          </div>
        </div>

        {/* Davomat statistikasi */}
        <div className="chart-card">
          <h3><HiOutlineCalendar /> Davomat statistikasi</h3>
          <div className="chart-container small">
            <Bar data={attendanceChartData} options={attendanceOptions} />
          </div>
          <div className="attendance-summary">
            <div className="summary-item">
              <span className="summary-label">O'rtacha davomat</span>
              <span className="summary-value">91.5%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Eng yuqori</span>
              <span className="summary-value">95%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Eng past</span>
              <span className="summary-value">88%</span>
            </div>
          </div>
          <button 
            className="chart-nav-btn" 
            onClick={() => onNavigate && onNavigate('attendance')}
          >
            Batafsil
          </button>
        </div>

        {/* Baholar taqsimoti */}
        <div className="chart-card">
          <h3><HiOutlineStar /> Baholar taqsimoti</h3>
          <div className="chart-container doughnut">
            <Doughnut data={gradeDistributionData} options={doughnutOptions} />
          </div>
          <div className="grade-stats">
            <div className="grade-item good">A'lo (5) - 45%</div>
            <div className="grade-item normal">Yaxshi (4) - 30%</div>
            <div className="grade-item bad">Qoniqarli (3) - 20%</div>
            <div className="grade-item worst">Qoniqarsiz (2) - 5%</div>
          </div>
          <button 
            className="chart-nav-btn" 
            onClick={() => onNavigate && onNavigate('grades')}
          >
            Batafsil
          </button>
        </div>

        {/* So'nggi faoliyat */}
        <div className="chart-card">
          <h3><HiOutlineClock /> So'nggi faoliyat</h3>
          <div className="activity-list">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="activity-item">
                  <div className="activity-icon" style={{ background: `${activity.color}15`, color: activity.color }}>
                    <Icon />
                  </div>
                  <div className="activity-details">
                    <p>{activity.text}</p>
                    <small>
                      <HiOutlineClock />
                      {activity.time}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Eng yaxshi o'quvchilar */}
        <div className="chart-card full-width">
          <div className="card-header">
            <h3><HiOutlineStar /> Eng yaxshi o'quvchilar</h3>
            <button 
              className="view-all-btn" 
              onClick={() => onNavigate && onNavigate('students')}
            >
              Barchasini ko'rish
            </button>
          </div>
          <div className="top-students">
            {topStudents.map((student, index) => (
              <div 
                key={index} 
                className="student-rank"
                onClick={() => onNavigate && onNavigate('students')}
                style={{ cursor: 'pointer' }}
              >
                <div className={`rank rank-${student.rank}`}>
                  {student.rank === 1 && '🥇'}
                  {student.rank === 2 && '🥈'}
                  {student.rank === 3 && '🥉'}
                  {student.rank > 3 && student.rank}
                </div>
                <div className="student-info">
                  <span className="student-name">{student.name}</span>
                  <div className="student-stats">
                    <span className="grade">{student.grade}%</span>
                    <span className="points">{student.points} ball</span>
                    <span className={`improvement ${student.improvement.includes('+') ? 'up' : 'down'}`}>
                      {student.improvement}
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${student.grade}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tadbirlar */}
        <div className="chart-card">
          <h3><HiOutlineCalendar /> Kutilayotgan tadbirlar</h3>
          <div className="events-list">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className={`event-item ${event.type}`}
                onClick={() => onNavigate && onNavigate('events')}
                style={{ cursor: 'pointer' }}
              >
                <div className="event-date">
                  <span className="event-day">{new Date(event.date).getDate()}</span>
                  <span className="event-month">{new Date(event.date).toLocaleString('uz', { month: 'short' })}</span>
                </div>
                <div className="event-info">
                  <h4>{event.title}</h4>
                  <p><HiOutlineClock /> {event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;