import React, { useState, useEffect } from 'react';
import { 
  HiOutlineDownload, 
  HiOutlineCalendar, 
  HiOutlineChartBar, 
  HiOutlineUsers, 
  HiOutlineBookOpen, 
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlinePrinter,
  HiOutlineDocumentText
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
import './Reports.css';

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

const Reports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({ start: '2024-09-01', end: '2024-12-31' });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [payments, setPayments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // LocalStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStudents(JSON.parse(localStorage.getItem('students') || '[]'));
    setTeachers(JSON.parse(localStorage.getItem('teachers') || '[]'));
    setAttendance(JSON.parse(localStorage.getItem('attendance') || '[]'));
    setGrades(JSON.parse(localStorage.getItem('grades') || '[]'));
    setPayments(JSON.parse(localStorage.getItem('payments') || '[]'));
    setClasses(JSON.parse(localStorage.getItem('classes') || '[]'));
  };

  // Davomat ma'lumotlarini tayyorlash
  const getAttendanceData = () => {
    const months = ['Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const monthlyData = months.map((_, idx) => {
      const monthAttendance = attendance.filter(a => {
        const date = new Date(a.date);
        return date.getMonth() === 8 + idx;
      });
      const present = monthAttendance.filter(a => a.status === 'present').length;
      const total = monthAttendance.length;
      return total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    });
    return {
      labels: months,
      datasets: [{
        label: 'Davomat %',
        data: monthlyData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    };
  };

  // Baholar ma'lumotlarini tayyorlash
  const getGradesData = () => {
    const classNames = classes.map(c => c.name);
    const classAverages = classes.map(c => {
      const classGrades = grades.filter(g => g.class === c.name);
      const avg = classGrades.reduce((sum, g) => sum + g.score, 0);
      return classGrades.length > 0 ? (avg / classGrades.length).toFixed(1) : 0;
    });
    return {
      labels: classNames,
      datasets: [{
        label: "O'rtacha baho",
        data: classAverages,
        backgroundColor: '#10b981',
        borderRadius: 8,
        barPercentage: 0.7
      }]
    };
  };

  // To'lov ma'lumotlarini tayyorlash
  const getPaymentsData = () => {
    const paid = payments.filter(p => p.status === 'paid').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const overdue = payments.filter(p => p.status === 'overdue').length;
    const total = payments.length;
    return {
      labels: ["To'langan", 'Kutilmoqda', "Muddati o'tgan"],
      datasets: [{
        data: total > 0 ? [(paid / total * 100).toFixed(1), (pending / total * 100).toFixed(1), (overdue / total * 100).toFixed(1)] : [0, 0, 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  };

  // O'quvchilar o'sishi ma'lumotlari
  const getGrowthData = () => {
    const months = ['Sentabr', 'Oktabr', 'Noyabr', 'Dekabr', 'Yanvar', 'Fevral', 'Mart', 'Apr', 'May'];
    const growthData = [850, 890, 920, 950, 980, 1010, 1050, 1080, students.length];
    return {
      labels: months.slice(0, growthData.length),
      datasets: [{
        label: "O'quvchilar soni",
        data: growthData,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981'
      }]
    };
  };

  // O'qituvchilar samaradorligi
  const getTeacherPerformanceData = () => {
    const teacherNames = teachers.slice(0, 6).map(t => t.name);
    const teacherData = teachers.slice(0, 6).map(t => t.rating || (t.experience * 0.5 + 3));
    return {
      labels: teacherNames,
      datasets: [{
        label: 'Samaradorlik',
        data: teacherData,
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }]
    };
  };

  // Statistikalar
  const stats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    avgAttendance: attendance.length > 0 ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0,
    avgGrade: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : 0,
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
    paidPayments: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    collectionRate: payments.length > 0 ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1) : 0
  };

  // Hisobot yuklash
  const downloadReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reportData = {
        type: reportType,
        dateRange,
        stats,
        generatedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportType}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsLoading(false);
      alert('Hisobot muvaffaqiyatli yuklandi!');
    }, 1000);
  };

  // Chop etish
  const printReport = () => {
    window.print();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: { backgroundColor: 'white', titleColor: '#1e293b', bodyColor: '#64748b', borderColor: '#e2e8f0', borderWidth: 1 }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, max: 100, grid: { color: '#e2e8f0' } } }
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Statistik hisobotlar</h1>
          <p>Ma'lumotlar tahlili va grafiklar | {new Date().toLocaleDateString('uz-UZ')}</p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={printReport}>
            <HiOutlinePrinter /> Chop etish
          </button>
          <button className="btn-primary" onClick={downloadReport} disabled={isLoading}>
            <HiOutlineDownload /> {isLoading ? 'Yuklanmoqda...' : 'Hisobot yuklash'}
          </button>
        </div>
      </div>

      {/* Umumiy statistika kartalari */}
      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineUsers />
          </div>
          <div className="stat-info">
            <h3>Jami o'quvchilar</h3>
            <p>{stats.totalStudents}</p>
            <small>+12% o'sish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineBookOpen />
          </div>
          <div className="stat-info">
            <h3>O'rtacha baho</h3>
            <p>{stats.avgGrade}%</p>
            <small>+5% yaxshilanish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineCalendar />
          </div>
          <div className="stat-info">
            <h3>Davomat</h3>
            <p>{stats.avgAttendance}%</p>
            <small>+3% o'sish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineCurrencyDollar />
          </div>
          <div className="stat-info">
            <h3>To'lov ko'rsatkichi</h3>
            <p>{stats.collectionRate}%</p>
            <small>{stats.paidPayments.toLocaleString()} so'm</small>
          </div>
        </div>
      </div>

      {/* Kontrollerlar */}
      <div className="reports-controls">
        <div className="report-tabs">
          <button className={reportType === 'attendance' ? 'active' : ''} onClick={() => setReportType('attendance')}>
            📅 Davomat
          </button>
          <button className={reportType === 'grades' ? 'active' : ''} onClick={() => setReportType('grades')}>
            ⭐ Baholar
          </button>
          <button className={reportType === 'payments' ? 'active' : ''} onClick={() => setReportType('payments')}>
            💰 To'lovlar
          </button>
          <button className={reportType === 'growth' ? 'active' : ''} onClick={() => setReportType('growth')}>
            📈 O'sish
          </button>
          <button className={reportType === 'teachers' ? 'active' : ''} onClick={() => setReportType('teachers')}>
            👩‍🏫 O'qituvchilar
          </button>
        </div>
        <div className="date-range">
          <HiOutlineCalendar />
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span>-</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      {/* Grafiklar */}
      <div className="reports-grid">
        {reportType === 'attendance' && (
          <div className="report-card">
            <h3><HiOutlineCalendar /> Davomat statistikasi</h3>
            <div className="chart-container">
              <Line data={getAttendanceData()} options={chartOptions} />
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{stats.avgAttendance}%</div>
                <div className="summary-label">O'rtacha davomat</div>
                <div className="summary-trend up"><HiOutlineTrendingUp /> +3%</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{attendance.length}</div>
                <div className="summary-label">Jami yozuvlar</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{attendance.filter(a => a.status === 'present').length}</div>
                <div className="summary-label">Kelganlar</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'grades' && (
          <div className="report-card">
            <h3><HiOutlineChartBar /> Baholar statistikasi</h3>
            <div className="chart-container">
              <Bar data={getGradesData()} options={barOptions} />
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{stats.avgGrade}%</div>
                <div className="summary-label">O'rtacha baho</div>
                <div className="summary-trend up"><HiOutlineTrendingUp /> +5%</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{grades.filter(g => g.score === 5).length}</div>
                <div className="summary-label">A'lo baholar</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{grades.length}</div>
                <div className="summary-label">Jami baholar</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'payments' && (
          <div className="report-card">
            <h3><HiOutlineCurrencyDollar /> To'lov statistikasi</h3>
            <div className="payment-charts">
              <div className="doughnut-container">
                <Doughnut data={getPaymentsData()} options={chartOptions} />
              </div>
              <div className="payment-summary">
                <div className="summary-item">
                  <div className="summary-value">{stats.collectionRate}%</div>
                  <div className="summary-label">To'lov ko'rsatkichi</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">{stats.paidPayments.toLocaleString()} so'm</div>
                  <div className="summary-label">Yig'ilgan summa</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">{stats.totalPayments.toLocaleString()} so'm</div>
                  <div className="summary-label">Jami summa</div>
                </div>
                <div className="summary-item">
                  <div className="summary-value">{payments.filter(p => p.status === 'paid').length}</div>
                  <div className="summary-label">To'lovlar soni</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'growth' && (
          <div className="report-card">
            <h3><HiOutlineTrendingUp /> O'quvchilar o'sishi</h3>
            <div className="chart-container">
              <Line data={getGrowthData()} options={chartOptions} />
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{stats.totalStudents}</div>
                <div className="summary-label">Jami o'quvchilar</div>
                <div className="summary-trend up"><HiOutlineTrendingUp /> +12%</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{classes.length}</div>
                <div className="summary-label">Jami sinflar</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{(stats.totalStudents / classes.length || 0).toFixed(0)}</div>
                <div className="summary-label">O'rtacha sinf</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'teachers' && (
          <div className="report-card">
            <h3><HiOutlineUsers /> O'qituvchilar samaradorligi</h3>
            <div className="chart-container">
              <Bar data={getTeacherPerformanceData()} options={{ ...barOptions, indexAxis: 'y' }} />
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{stats.totalTeachers}</div>
                <div className="summary-label">Jami o'qituvchilar</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{(teachers.reduce((sum, t) => sum + (t.rating || 0), 0) / stats.totalTeachers || 0).toFixed(1)}</div>
                <div className="summary-label">O'rtacha reyting</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{teachers.filter(t => t.experience >= 10).length}</div>
                <div className="summary-label">Tajribali (10+ yil)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Qo'shimcha ma'lumotlar jadvali */}
      <div className="data-table-container">
        <h3><HiOutlineDocumentText /> Batafsil ma'lumotlar</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ko'rsatkich</th>
              <th>Qiymat</th>
              <th>O'zgarish</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jami o'quvchilar</td>
              <td>{stats.totalStudents} nafar</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +12%</td>
            </tr>
            <tr>
              <td>Jami o'qituvchilar</td>
              <td>{stats.totalTeachers} nafar</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +5%</td>
            </tr>
            <tr>
              <td>Jami sinflar</td>
              <td>{stats.totalClasses} ta</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +2%</td>
            </tr>
            <tr>
              <td>O'rtacha davomat</td>
              <td>{stats.avgAttendance}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +3%</td>
            </tr>
            <tr>
              <td>O'rtacha baho</td>
              <td>{stats.avgGrade}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +5%</td>
            </tr>
            <tr>
              <td>To'lov ko'rsatkichi</td>
              <td>{stats.collectionRate}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;