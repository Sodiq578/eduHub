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
  HiOutlineDocumentText,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineGlobe,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineTemplate,
  HiOutlineViewGrid,
  HiOutlineTable,
  HiOutlinePieChart,
  HiOutlineChartPie,
  HiOutlineChartSquareBar,
  HiOutlineChartBar as HiOutlineChartBarIcon,
  HiOutlineChartLine,
  HiOutlineChartPie as HiOutlineChartPieIcon,
  HiOutlineArrowNarrowRight,
  HiOutlineArrowNarrowUp,
  HiOutlineArrowNarrowDown,
  HiOutlineDotsVertical,
  HiOutlineDotsHorizontal,
  HiOutlinePlusCircle,
  HiOutlineMinusCircle,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineSupport,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineSearch as HiOutlineSearchIcon,
  HiOutlineFilter as HiOutlineFilterIcon,
  HiOutlineRefresh as HiOutlineRefreshIcon
} from 'react-icons/hi';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedStudents = localStorage.getItem('students');
    const storedTeachers = localStorage.getItem('teachers');
    const storedAttendance = localStorage.getItem('attendance');
    const storedGrades = localStorage.getItem('grades');
    const storedPayments = localStorage.getItem('payments');
    const storedClasses = localStorage.getItem('classes');

    setStudents(storedStudents ? JSON.parse(storedStudents) : generateDefaultStudents());
    setTeachers(storedTeachers ? JSON.parse(storedTeachers) : generateDefaultTeachers());
    setAttendance(storedAttendance ? JSON.parse(storedAttendance) : generateDefaultAttendance());
    setGrades(storedGrades ? JSON.parse(storedGrades) : generateDefaultGrades());
    setPayments(storedPayments ? JSON.parse(storedPayments) : generateDefaultPayments());
    setClasses(storedClasses ? JSON.parse(storedClasses) : generateDefaultClasses());
  };

  const generateDefaultStudents = () => {
    const studentsList = [];
    const names = ['Ali Valiyev', 'Dilnoza Karimova', 'Jasur Aliyev', 'Zarina Toshpulatova', 'Bobur Sattorov', 'Madina Rahimova', 'Shohruh Akbarov', 'Gulnora Saidova', 'Olimjon Xolmatov', 'Nigora Ahmedova'];
    const classesList = ['10-A', '10-B', '9-A', '11-A', '8-A', '10-A', '9-B', '11-B', '7-A', '8-B'];
    for (let i = 0; i < 10; i++) {
      studentsList.push({
        id: i + 1,
        name: names[i],
        class: classesList[i],
        phone: `+99890${String(1234567 + i).slice(0, 7)}`,
        parentPhone: `+99890${String(2345678 + i).slice(0, 7)}`,
        address: 'Toshkent shahri',
        status: 'active',
        enrolledDate: '2024-09-01'
      });
    }
    return studentsList;
  };

  const generateDefaultTeachers = () => {
    const teachersList = [];
    const names = ['Shahzoda Ahmedova', 'Jasur Rahimov', 'Gulchehra Saidova', 'Bobur Aliyev', 'Dilshod Karimov', 'Nodira Ismoilova'];
    const subjects = ['Matematika', 'Fizika', 'Ona tili', 'Ingliz tili', 'Tarix', 'Biologiya'];
    for (let i = 0; i < 6; i++) {
      teachersList.push({
        id: i + 1,
        name: names[i],
        subject: subjects[i],
        experience: [3, 5, 8, 10, 12, 15][i],
        rating: [4.5, 4.8, 4.7, 4.9, 4.6, 4.8][i],
        phone: `+99890${String(3456789 + i).slice(0, 7)}`,
        email: `${names[i].toLowerCase().replace(' ', '.')}@school.uz`
      });
    }
    return teachersList;
  };

  const generateDefaultAttendance = () => {
    const attendanceList = [];
    const dates = ['2024-09-15', '2024-10-15', '2024-11-15', '2024-12-15'];
    const statuses = ['present', 'absent', 'late', 'present'];
    for (let i = 0; i < 40; i++) {
      attendanceList.push({
        id: i + 1,
        studentId: (i % 10) + 1,
        date: dates[i % 4],
        status: statuses[i % 4]
      });
    }
    return attendanceList;
  };

  const generateDefaultGrades = () => {
    const gradesList = [];
    const subjects = ['Matematika', 'Fizika', 'Ona tili', 'Ingliz tili', 'Tarix'];
    for (let i = 0; i < 50; i++) {
      gradesList.push({
        id: i + 1,
        studentId: (i % 10) + 1,
        subject: subjects[i % 5],
        score: [3, 4, 5][Math.floor(Math.random() * 3)],
        date: `2024-${Math.floor(Math.random() * 3) + 10}-${Math.floor(Math.random() * 28) + 1}`,
        class: `${Math.floor(Math.random() * 5) + 7}-${['A', 'B'][Math.floor(Math.random() * 2)]}`
      });
    }
    return gradesList;
  };

  const generateDefaultPayments = () => {
    const paymentsList = [];
    const statuses = ['paid', 'pending', 'overdue'];
    const methods = ['Naqd', 'Plastik', 'Click', 'Payme'];
    for (let i = 0; i < 30; i++) {
      paymentsList.push({
        id: i + 1,
        studentId: (i % 10) + 1,
        amount: [300000, 400000, 500000, 550000, 600000][Math.floor(Math.random() * 5)],
        date: `2024-${Math.floor(Math.random() * 3) + 9}-${Math.floor(Math.random() * 28) + 1}`,
        method: methods[Math.floor(Math.random() * 4)],
        status: statuses[Math.floor(Math.random() * 3)],
        type: "Oylik to'lov",
        receiptNo: `RCT-${String(2024000 + i).slice(-6)}`
      });
    }
    return paymentsList;
  };

  const generateDefaultClasses = () => {
    return [
      { id: 1, name: '7-A', studentCount: 25, teacher: 'Shahzoda Ahmedova' },
      { id: 2, name: '7-B', studentCount: 23, teacher: 'Jasur Rahimov' },
      { id: 3, name: '8-A', studentCount: 28, teacher: 'Gulchehra Saidova' },
      { id: 4, name: '8-B', studentCount: 26, teacher: 'Bobur Aliyev' },
      { id: 5, name: '9-A', studentCount: 30, teacher: 'Dilshod Karimov' },
      { id: 6, name: '9-B', studentCount: 27, teacher: 'Nodira Ismoilova' },
      { id: 7, name: '10-A', studentCount: 32, teacher: 'Shahzoda Ahmedova' },
      { id: 8, name: '10-B', studentCount: 29, teacher: 'Jasur Rahimov' },
      { id: 9, name: '11-A', studentCount: 24, teacher: 'Gulchehra Saidova' },
      { id: 10, name: '11-B', studentCount: 22, teacher: 'Bobur Aliyev' }
    ];
  };

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

  const getGradesData = () => {
    const classNames = classes.map(c => c.name);
    const classAverages = classes.map(c => {
      const classGrades = grades.filter(g => g.class === c.name);
      const avg = classGrades.reduce((sum, g) => sum + g.score, 0);
      return classGrades.length > 0 ? (avg / classGrades.length * 20).toFixed(1) : 0;
    });
    return {
      labels: classNames,
      datasets: [{
        label: "O'rtacha baho (%)",
        data: classAverages,
        backgroundColor: '#10b981',
        borderRadius: 8,
        barPercentage: 0.7
      }]
    };
  };

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

  const getPaymentsAmountData = () => {
    const paidAmount = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
    const total = paidAmount + pendingAmount + overdueAmount;
    return {
      labels: ["To'langan", 'Kutilmoqda', "Muddati o'tgan"],
      datasets: [{
        data: [paidAmount, pendingAmount, overdueAmount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  };

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
        pointBackgroundColor: '#10b981',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  };

  const getTeacherPerformanceData = () => {
    const teacherNames = teachers.map(t => t.name.split(' ')[0]);
    const teacherData = teachers.map(t => t.rating * 20);
    return {
      labels: teacherNames,
      datasets: [{
        label: 'Samaradorlik (%)',
        data: teacherData,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        barPercentage: 0.7
      }]
    };
  };

  const getMethodStats = () => {
    const methods = ['Naqd', 'Plastik', 'Click', 'Payme'];
    const methodData = methods.map(m => payments.filter(p => p.method === m).length);
    return {
      labels: methods,
      datasets: [{
        data: methodData,
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  };

  const stats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    avgAttendance: attendance.length > 0 ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0,
    avgGrade: grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length * 20).toFixed(1) : 0,
    totalPayments: payments.reduce((sum, p) => sum + p.amount, 0),
    paidPayments: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    collectionRate: payments.length > 0 ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1) : 0,
    excellentGrades: grades.filter(g => g.score === 5).length,
    goodGrades: grades.filter(g => g.score === 4).length,
    averageGrades: grades.filter(g => g.score === 3).length
  };

  const downloadReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const reportData = {
        type: reportType,
        dateRange,
        stats,
        generatedAt: new Date().toISOString(),
        data: {
          students: students.length,
          teachers: teachers.length,
          classes: classes.length,
          attendance: stats.avgAttendance,
          grades: stats.avgGrade,
          payments: stats.collectionRate
        }
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

  const printReport = () => {
    window.print();
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          usePointStyle: true, 
          boxWidth: 8,
          font: { size: 11 }
        } 
      },
      tooltip: { 
        backgroundColor: 'white', 
        titleColor: '#1e293b', 
        bodyColor: '#64748b', 
        borderColor: '#e2e8f0', 
        borderWidth: 1 
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { position: 'bottom' } 
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        max: 100, 
        grid: { color: '#e2e8f0' },
        title: { display: true, text: 'Foiz (%)' }
      } 
    }
  };

  const paymentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  const reportTabs = [
    { id: 'attendance', label: 'Davomat', icon: <HiOutlineCalendar /> },
    { id: 'grades', label: 'Baholar', icon: <HiOutlineStar /> },
    { id: 'payments', label: "To'lovlar", icon: <HiOutlineCurrencyDollar /> },
    { id: 'growth', label: "O'sish", icon: <HiOutlineTrendingUp /> },
    { id: 'teachers', label: "O'qituvchilar", icon: <HiOutlineUserGroup /> }
  ];

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1><HiOutlineChartBarIcon /> Statistik hisobotlar</h1>
          <p><HiOutlineCalendar /> {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })} | So'nggi yangilanish</p>
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
            <small><HiOutlineTrendingUp /> +12% o'sish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineAcademicCap />
          </div>
          <div className="stat-info">
            <h3>O'rtacha baho</h3>
            <p>{stats.avgGrade}%</p>
            <small><HiOutlineTrendingUp /> +5% yaxshilanish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineCalendar />
          </div>
          <div className="stat-info">
            <h3>Davomat</h3>
            <p>{stats.avgAttendance}%</p>
            <small><HiOutlineTrendingUp /> +3% o'sish</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineCurrencyDollar />
          </div>
          <div className="stat-info">
            <h3>To'lov ko'rsatkichi</h3>
            <p>{stats.collectionRate}%</p>
            <small>{formatMoney(stats.paidPayments)}</small>
          </div>
        </div>
      </div>

      {/* Kontrollerlar */}
      <div className="reports-controls">
        <div className="report-tabs">
          {reportTabs.map(tab => (
            <button 
              key={tab.id}
              className={reportType === tab.id ? 'active' : ''} 
              onClick={() => setReportType(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <div className="date-range">
          <HiOutlineCalendar />
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
          />
          <span>-</span>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
          />
        </div>
      </div>

      {/* Grafiklar */}
      <div className="reports-grid">
        {reportType === 'attendance' && (
          <div className="report-card">
            <div className="card-header">
              <h3><HiOutlineCalendar /> Davomat statistikasi</h3>
              <div className="card-badge">O'quv yili 2024-2025</div>
            </div>
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
              <div className="summary-item">
                <div className="summary-value">{attendance.filter(a => a.status === 'absent').length}</div>
                <div className="summary-label">Kelmagamlar</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'grades' && (
          <div className="report-card">
            <div className="card-header">
              <h3><HiOutlineChartBarIcon /> Baholar statistikasi</h3>
              <div className="card-badge">Sinf kesimida</div>
            </div>
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
                <div className="summary-value">{stats.excellentGrades}</div>
                <div className="summary-label">A'lo baholar (5)</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{stats.goodGrades}</div>
                <div className="summary-label">Yaxshi baholar (4)</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{stats.averageGrades}</div>
                <div className="summary-label">O'rtacha baholar (3)</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'payments' && (
          <div className="report-card">
            <div className="card-header">
              <h3><HiOutlineCurrencyDollar /> To'lov statistikasi</h3>
              <div className="card-badge">2024-2025 o'quv yili</div>
            </div>
            <div className="payment-charts">
              <div className="doughnut-container">
                <h4>To'lov holati (%)</h4>
                <Doughnut data={getPaymentsData()} options={paymentChartOptions} />
              </div>
              <div className="doughnut-container">
                <h4>To'lov miqdori</h4>
                <Doughnut data={getPaymentsAmountData()} options={paymentChartOptions} />
              </div>
              <div className="doughnut-container">
                <h4>To'lov usullari</h4>
                <Pie data={getMethodStats()} options={paymentChartOptions} />
              </div>
            </div>
            <div className="stats-summary">
              <div className="summary-item">
                <div className="summary-value">{stats.collectionRate}%</div>
                <div className="summary-label">To'lov ko'rsatkichi</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{formatMoney(stats.paidPayments)}</div>
                <div className="summary-label">Yig'ilgan summa</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{formatMoney(stats.totalPayments)}</div>
                <div className="summary-label">Jami summa</div>
              </div>
              <div className="summary-item">
                <div className="summary-value">{payments.filter(p => p.status === 'paid').length}</div>
                <div className="summary-label">To'lovlar soni</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'growth' && (
          <div className="report-card">
            <div className="card-header">
              <h3><HiOutlineTrendingUp /> O'quvchilar o'sishi</h3>
              <div className="card-badge">2024-2025</div>
            </div>
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
              <div className="summary-item">
                <div className="summary-value">{(stats.totalStudents * 1.12).toFixed(0)}</div>
                <div className="summary-label">Keyingi yil prognoz</div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'teachers' && (
          <div className="report-card">
            <div className="card-header">
              <h3><HiOutlineUserGroup /> O'qituvchilar samaradorligi</h3>
              <div className="card-badge">Reyting asosida</div>
            </div>
            <div className="chart-container">
              <Bar data={getTeacherPerformanceData()} options={{ ...barOptions, indexAxis: 'y', scales: { x: { max: 100, title: { display: true, text: 'Samaradorlik (%)' } } } }} />
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
              <div className="summary-item">
                <div className="summary-value">{teachers.filter(t => t.experience < 5).length}</div>
                <div className="summary-label">Yosh mutaxassislar</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Qo'shimcha ma'lumotlar jadvali */}
      <div className="data-table-container">
        <div className="table-header">
          <h3><HiOutlineDocumentText /> Batafsil ma'lumotlar</h3>
          <button className="refresh-btn" onClick={loadData}>
            <HiOutlineRefreshIcon /> Yangilash
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th><HiOutlineChartBarIcon /> Ko'rsatkich</th>
              <th><HiOutlineChartPieIcon /> Qiymat</th>
              <th><HiOutlineTrendingUp /> O'zgarish</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><HiOutlineUsers /> Jami o'quvchilar</td>
              <td>{stats.totalStudents} nafar</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +12%</td>
            </tr>
            <tr>
              <td><HiOutlineUserGroup /> Jami o'qituvchilar</td>
              <td>{stats.totalTeachers} nafar</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +5%</td>
            </tr>
            <tr>
              <td><HiOutlineAcademicCap /> Jami sinflar</td>
              <td>{stats.totalClasses} ta</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +2%</td>
            </tr>
            <tr>
              <td><HiOutlineCalendar /> O'rtacha davomat</td>
              <td>{stats.avgAttendance}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +3%</td>
            </tr>
            <tr>
              <td><HiOutlineStar /> O'rtacha baho</td>
              <td>{stats.avgGrade}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +5%</td>
            </tr>
            <tr>
              <td><HiOutlineCurrencyDollar /> To'lov ko'rsatkichi</td>
              <td>{stats.collectionRate}%</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +8%</td>
            </tr>
            <tr>
              <td><HiOutlineCreditCard /> Yig'ilgan summa</td>
              <td>{formatMoney(stats.paidPayments)}</td>
              <td className="trend-up"><HiOutlineTrendingUp /> +15%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="reports-footer">
        <p><HiOutlineInformationCircle /> Hisobot avtomatik ravishda yangilanadi. Ma'lumotlar {new Date().toLocaleDateString('uz-UZ')} holatiga ko'ra.</p>
      </div>
    </div>
  );
};

export default Reports;