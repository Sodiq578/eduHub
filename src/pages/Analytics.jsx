import React, { useState, useEffect } from 'react';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineCalendar, HiOutlineStar, HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineDownload } from 'react-icons/hi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './Analytics.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setAttendance(JSON.parse(localStorage.getItem('attendance') || '[]'));
    setGrades(JSON.parse(localStorage.getItem('grades') || '[]'));
    setTeachers(JSON.parse(localStorage.getItem('teachers') || '[]'));
  }, []);

  const monthlyData = ['Sentabr', 'Oktabr', 'Noyabr', 'Dekabr', 'Yanvar', 'Fevral'];
  const studentGrowth = [850, 890, 920, 950, 980, 1234];
  const attendanceData = [92, 89, 94, 91, 93, 95];

  const growthChart = { labels: monthlyData, datasets: [{ label: "O'quvchilar soni", data: studentGrowth, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#10b981', pointBorderColor: 'white', pointBorderWidth: 2 }] };
  const attendanceChart = { labels: monthlyData, datasets: [{ label: 'Davomat %', data: attendanceData, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4 }] };
  
  const classData = { labels: ['10-A', '10-B', '9-A', '11-A'], datasets: [{ label: 'O\'rtacha baho', data: [87, 84, 82, 89], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'], borderRadius: 8 }] };
  const teacherPerformance = { labels: teachers.map(t => t.name), datasets: [{ label: 'O\'quvchilar natijasi', data: teachers.map(() => Math.floor(Math.random() * 30) + 70), backgroundColor: '#10b981' }] };

  const topStudents = students.sort((a,b) => b.grade - a.grade).slice(0,5);
  const lowStudents = students.sort((a,b) => a.grade - b.grade).slice(0,5);
  const avgAttendance = (attendanceData.reduce((a,b)=>a+b,0)/attendanceData.length).toFixed(1);
  const avgGrade = (students.reduce((s,st)=>s+st.grade,0)/students.length||0).toFixed(1);

  return (
    <div className="analytics-page">
      <div className="page-header"><div><h1>Analitika</h1><p>Ma'lumotlar tahlili va statistikalar</p></div><button className="btn-export"><HiOutlineDownload /> Hisobot yuklash</button></div>
      <div className="analytics-stats"><div className="stat-card"><div className="stat-value">{students.length}</div><div className="stat-label">Jami o'quvchilar</div><div className="stat-trend up"><HiOutlineTrendingUp /> +12%</div></div><div className="stat-card"><div className="stat-value">{avgAttendance}%</div><div className="stat-label">O'rtacha davomat</div><div className="stat-trend up"><HiOutlineTrendingUp /> +3%</div></div><div className="stat-card"><div className="stat-value">{avgGrade}%</div><div className="stat-label">O'rtacha baho</div><div className="stat-trend up"><HiOutlineTrendingUp /> +5%</div></div><div className="stat-card"><div className="stat-value">{teachers.length}</div><div className="stat-label">O'qituvchilar</div><div className="stat-trend down"><HiOutlineTrendingDown /> 0%</div></div></div>
      <div className="charts-grid"><div className="chart-card"><h3><HiOutlineUsers /> O'quvchilar o'sishi</h3><Line data={growthChart} options={{ responsive: true }} /></div><div className="chart-card"><h3><HiOutlineCalendar /> Davomat statistikasi</h3><Line data={attendanceChart} options={{ responsive: true }} /></div><div className="chart-card"><h3><HiOutlineStar /> Sinf kesimida baholar</h3><Bar data={classData} options={{ responsive: true }} /></div><div className="chart-card"><h3>🏆 Eng yaxshi o'quvchilar</h3><div className="top-list">{topStudents.map((s,idx) => (<div key={idx} className="rank-item"><span className="rank">{idx+1}</span><span className="name">{s.name}</span><span className="grade">{s.grade}%</span><div className="progress"><div className="progress-fill" style={{ width: `${s.grade}%` }}></div></div></div>))}</div></div><div className="chart-card"><h3>⚠️ Past o'quvchilar</h3><div className="low-list">{lowStudents.map((s,idx) => (<div key={idx} className="rank-item"><span className="rank">{idx+1}</span><span className="name">{s.name}</span><span className="grade low">{s.grade}%</span><div className="progress"><div className="progress-fill low" style={{ width: `${s.grade}%` }}></div></div></div>))}</div></div><div className="chart-card"><h3>👨‍🏫 O'qituvchilar samaradorligi</h3><Bar data={teacherPerformance} options={{ responsive: true, indexAxis: 'y' }} /></div></div>
    </div>
  );
};
export default Analytics;