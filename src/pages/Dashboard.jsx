import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineViewGrid,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineTable,
  HiOutlineChat,
  HiOutlineSpeakerphone,
  HiOutlineCreditCard,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineCube,
  HiOutlineUserCircle,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineInformationCircle
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

// O'zbekcha hafta kunlari
const WEEKDAYS_UZ = {
  Monday: 'Dushanba',
  Tuesday: 'Seshanba',
  Wednesday: 'Chorshanba',
  Thursday: 'Payshanba',
  Friday: 'Juma',
  Saturday: 'Shanba',
  Sunday: 'Yakshanba'
};

// O'zbekcha oy nomlari
const MONTHS_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
];

// Navigatsiya konfiguratsiyasi
const pageConfig = {
  dashboard: { name: 'Boshqaruv paneli', icon: HiOutlineViewGrid, roles: ['admin', 'teacher', 'student', 'parent', 'finance', 'librarian'] },
  students: { name: "O'quvchilar", icon: HiOutlineUsers, roles: ['admin', 'teacher'] },
  teachers: { name: "O'qituvchilar", icon: HiOutlineUserGroup, roles: ['admin'] },
  classes: { name: 'Sinflar', icon: HiOutlineAcademicCap, roles: ['admin', 'teacher'] },
  subjects: { name: 'Fanlar', icon: HiOutlineBookOpen, roles: ['admin', 'teacher'] },
  attendance: { name: 'Davomat', icon: HiOutlineCalendar, roles: ['admin', 'teacher', 'student', 'parent'] },
  grades: { name: 'Baholar', icon: HiOutlineStar, roles: ['admin', 'teacher', 'student', 'parent'] },
  exams: { name: 'Imtihonlar', icon: HiOutlineDocumentText, roles: ['admin', 'teacher'] },
  homework: { name: 'Uy vazifalari', icon: HiOutlineClipboardList, roles: ['admin', 'teacher', 'student'] },
  schedule: { name: 'Dars jadvali', icon: HiOutlineTable, roles: ['admin', 'teacher', 'student', 'parent'] },
  messages: { name: 'Xabarlar', icon: HiOutlineChat, roles: ['admin', 'teacher', 'student', 'parent'] },
  announcements: { name: "E'lonlar", icon: HiOutlineSpeakerphone, roles: ['admin', 'teacher', 'student', 'parent'] },
  payments: { name: "To'lovlar", icon: HiOutlineCreditCard, roles: ['admin', 'finance', 'parent'] },
  reports: { name: 'Hisobotlar', icon: HiOutlineChartBar, roles: ['admin', 'finance'] },
  payroll: { name: 'Oyliklar', icon: HiOutlineCreditCard, roles: ['admin', 'finance'] },
  library: { name: 'Kutubxona', icon: HiOutlineBookOpen, roles: ['admin', 'librarian', 'teacher', 'student'] },
  cafeteria: { name: 'Ovqatlanish', icon: HiOutlineCreditCard, roles: ['admin', 'finance', 'teacher', 'student', 'parent'] },
  health: { name: "Sog'liq", icon: HiOutlineHeart, roles: ['admin', 'teacher', 'student', 'parent'] },
  transport: { name: 'Transport', icon: HiOutlineTruck, roles: ['admin', 'teacher', 'student', 'parent'] },
  surveys: { name: "So'rovnomalar", icon: HiOutlineChartBar, roles: ['admin', 'teacher', 'student', 'parent'] },
  notifications: { name: 'Ogohlantirishlar', icon: HiOutlineBell, roles: ['admin', 'teacher', 'student', 'parent'] },
  discipline: { name: 'Mukofot/Intizom', icon: HiOutlineStar, roles: ['admin', 'teacher'] },
  livechat: { name: 'Jonli chat', icon: HiOutlineChat, roles: ['admin', 'teacher', 'student', 'parent'] },
  staff: { name: 'Xodimlar', icon: HiOutlineBriefcase, roles: ['admin'] },
  alumni: { name: 'Bitiruvchilar', icon: HiOutlineAcademicCap, roles: ['admin'] },
  analytics: { name: 'Analitika', icon: HiOutlineTrendingUp, roles: ['admin', 'teacher'] },
  admissions: { name: 'Qabul', icon: HiOutlineDocumentText, roles: ['admin'] },
  parents: { name: 'Ota-onalar', icon: HiOutlineUsers, roles: ['admin'] },
  events: { name: 'Tadbirlar', icon: HiOutlineCalendar, roles: ['admin', 'teacher', 'student', 'parent'] },
  documents: { name: 'Hujjatlar', icon: HiOutlineDocumentText, roles: ['admin', 'teacher', 'student', 'parent'] },
  inventory: { name: 'Inventar', icon: HiOutlineCube, roles: ['admin'] },
  users: { name: 'Foydalanuvchilar', icon: HiOutlineUserGroup, roles: ['admin'] },
  profile: { name: 'Profil', icon: HiOutlineUserCircle, roles: ['admin', 'teacher', 'student', 'parent', 'finance', 'librarian'] },
  settings: { name: 'Sozlamalar', icon: HiOutlineCog, roles: ['admin', 'teacher', 'student', 'parent'] },
  help: { name: 'Yordam', icon: HiOutlineSupport, roles: ['admin', 'teacher', 'student', 'parent'] },
  about: { name: "Dastur haqida", icon: HiOutlineInformationCircle, roles: ['admin', 'teacher', 'student', 'parent'] }
};

// Kun vaqtiga qarab tabrik so'zi
const getGreeting = (date) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Xayrli ertalab!';
  if (hour >= 12 && hour < 18) return 'Xayrli kun!';
  if (hour >= 18 && hour < 22) return 'Xayrli kech!';
  return 'Xayrli tun!';
};

// Vaqtni o'zbekcha formatda chiqarish
const formatTime = (date) => {
  return date.toLocaleTimeString('uz-UZ', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

// Sanani o'zbekcha formatda chiqarish
const formatDateUz = (date) => {
  const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const weekday = weekdays[date.getDay()];
  
  return `${weekday}, ${day}-${month} ${year}`;
};

// Qisqa sana formati
const formatDateShort = (date) => {
  const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

const Dashboard = ({ onNavigate, userRole = 'admin' }) => {
  // State'lar
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [chartView, setChartView] = useState('year');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: 24, condition: 'Quyoshli' });
  const [dashboardData, setDashboardData] = useState({
    students: { total: 1234, active: 1180, new: 45, growth: 12 },
    teachers: { total: 48, active: 46, new: 2, growth: 5 },
    classes: { total: 24, active: 22, new: 1, growth: -2 },
    revenue: { total: 12345, monthly: 12345, growth: 18, pending: 3450 }
  });

  useEffect(() => {
    // Real vaqt yangilanishlari uchun interval
    const realTimeInterval = setInterval(() => {
      setCurrentTime(new Date());
      setDashboardData(prev => ({
        ...prev,
        students: { ...prev.students, active: prev.students.active + Math.floor(Math.random() * 3) - 1 },
        revenue: { ...prev.revenue, total: prev.revenue.total + Math.floor(Math.random() * 100) - 50 }
      }));
    }, 30000);
    
    return () => clearInterval(realTimeInterval);
  }, []);

  // Statistik ma'lumotlar
  const stats = useMemo(() => [
    { 
      title: "Jami o'quvchilar", 
      value: dashboardData.students.total.toLocaleString(), 
      icon: HiOutlineUsers, 
      color: '#10b981', 
      bgColor: '#d1fae5',
      trend: { type: 'up', value: dashboardData.students.growth },
      navigateTo: 'students',
      description: "Aktiv o'quvchilar soni",
      secondaryValue: `${dashboardData.students.active} nafar aktiv`
    },
    { 
      title: "Jami o'qituvchilar", 
      value: dashboardData.teachers.total.toString(), 
      icon: HiOutlineUserGroup, 
      color: '#3b82f6', 
      bgColor: '#dbeafe',
      trend: { type: 'up', value: dashboardData.teachers.growth },
      navigateTo: 'teachers',
      description: "Shtatdagi xodimlar",
      secondaryValue: `${dashboardData.teachers.active} nafar aktiv`
    },
    { 
      title: "Jami sinflar", 
      value: dashboardData.classes.total.toString(), 
      icon: HiOutlineAcademicCap, 
      color: '#f59e0b', 
      bgColor: '#fed7aa',
      trend: { type: dashboardData.classes.growth >= 0 ? 'up' : 'down', value: Math.abs(dashboardData.classes.growth) },
      navigateTo: 'classes',
      description: "Faol sinflar",
      secondaryValue: `${dashboardData.classes.active} ta aktiv`
    },
    { 
      title: "Oylik daromad", 
      value: `${dashboardData.revenue.monthly.toLocaleString()} so'm`, 
      icon: HiOutlineCurrencyDollar, 
      color: '#8b5cf6', 
      bgColor: '#e9d5ff',
      trend: { type: 'up', value: dashboardData.revenue.growth },
      navigateTo: 'payments',
      description: "Joriy oy uchun",
      secondaryValue: `${dashboardData.revenue.pending.toLocaleString()} so'm kutilmoqda`
    },
  ], [dashboardData]);

  // O'quvchilar o'sishi chart ma'lumotlari
  const growthChartData = useMemo(() => {
    const baseData = {
      year: [850, 890, 920, 950, 980, 1010, 1050, 1080, 1120, 1150, 1180, dashboardData.students.total],
      month: [1120, 1140, 1150, 1160, 1180, 1200, 1210, 1220, 1230, dashboardData.students.total],
      week: [1210, 1218, 1225, 1230, 1232, dashboardData.students.active]
    };

    const labels = {
      year: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
      month: ['1-hfta', '2-hfta', '3-hfta', '4-hfta', '5-hfta', '6-hfta', '7-hfta', '8-hfta', '9-hfta', '10-hfta'],
      week: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']
    };

    return {
      labels: labels[chartView] || labels.year,
      datasets: [
        {
          label: "O'quvchilar soni",
          data: baseData[chartView] || baseData.year,
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
  }, [chartView, dashboardData.students]);

  // Davomat chart ma'lumotlari
  const attendanceChartData = useMemo(() => ({
    labels: ['1-hafta', '2-hafta', '3-hafta', '4-hafta'],
    datasets: [
      {
        label: 'Davomat foizi',
        data: [92, 88, 95, 91],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
        hoverBackgroundColor: '#10b981',
      },
    ],
  }), []);

  // Baholar taqsimoti
  const gradeDistributionData = useMemo(() => ({
    labels: ['Aʼlo (5)', 'Yaxshi (4)', "Qoniqarli (3)", "Qoniqarsiz (2)"],
    datasets: [
      {
        data: [45, 30, 20, 5],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  }), []);

  // Chart sozlamalari
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => `${context.raw.toLocaleString()} nafar o'quvchi`
        }
      },
    },
    scales: {
      y: {
        grid: { color: '#e2e8f0', drawBorder: false },
        ticks: { stepSize: 200, callback: (value) => value.toLocaleString() },
      },
      x: { grid: { display: false } },
    },
    interaction: { mode: 'index', intersect: false },
  }), []);

  const attendanceOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: { callbacks: { label: (context) => `${context.raw}%` } }
    },
    scales: { y: { beginAtZero: true, max: 100, grid: { color: '#e2e8f0' } } },
  }), []);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: { callbacks: { label: (context) => `${context.raw}%` } }
    },
  }), []);

  // Faoliyatlar ro'yxati
  const activities = useMemo(() => [
    { 
      id: 1,
      icon: HiOutlineUsers, 
      text: "Ali Valiyev darsga keldi", 
      time: "2 soat oldin", 
      color: "#10b981",
      type: "attendance",
      user: "Ali Valiyev",
      details: "Matematika darsi"
    },
    { 
      id: 2,
      icon: HiOutlineStar, 
      text: "Matematika fanidan test", 
      time: "5 soat oldin", 
      color: "#f59e0b",
      type: "exam",
      user: "Sardor Rahimov",
      details: "85 ball to'pladi"
    },
    { 
      id: 3,
      icon: HiOutlineCurrencyDollar, 
      text: "To'lov qabul qilindi", 
      time: "1 kun oldin", 
      color: "#8b5cf6",
      type: "payment",
      user: "Dilnoza Karimova",
      details: "250 000 so'm to'lov amalga oshirildi"
    },
    { 
      id: 4,
      icon: HiOutlineCalendar, 
      text: "Dars jadvali yangilandi", 
      time: "2 kun oldin", 
      color: "#3b82f6",
      type: "schedule",
      user: "Administrator",
      details: "Yangi semestr jadvali"
    },
    { 
      id: 5,
      icon: HiOutlineBell, 
      text: "Yangi e'lon", 
      time: "3 kun oldin", 
      color: "#ef4444",
      type: "announcement",
      user: "Direktor",
      details: "Yangi yil bayrami haqida"
    },
  ], []);

  // Eng yaxshi o'quvchilar
  const topStudents = useMemo(() => [
    { rank: 1, name: 'Sardor Rahimov', grade: 98, points: 2450, improvement: '+5%', avatar: 'https://i.pravatar.cc/150?img=1', class: '11-A' },
    { rank: 2, name: 'Dilnoza Karimova', grade: 95, points: 2380, improvement: '+3%', avatar: 'https://i.pravatar.cc/150?img=2', class: '11-A' },
    { rank: 3, name: 'Jasur Aliyev', grade: 92, points: 2310, improvement: '+2%', avatar: 'https://i.pravatar.cc/150?img=3', class: '11-B' },
    { rank: 4, name: 'Zarina Toshpo\'latova', grade: 89, points: 2225, improvement: '+1%', avatar: 'https://i.pravatar.cc/150?img=4', class: '10-A' },
    { rank: 5, name: 'Bobur Sattorov', grade: 87, points: 2180, improvement: '-1%', avatar: 'https://i.pravatar.cc/150?img=5', class: '10-B' },
  ], []);

  // Tadbirlar
  const upcomingEvents = useMemo(() => [
    { id: 1, title: "Ota-onalar yig'ilishi", date: "2024-12-15", time: "15:00", type: "meeting", location: "Majlislar zali", description: "Semestr yakunlari bo'yicha" },
    { id: 2, title: "Yil yakuni bayrami", date: "2024-12-25", time: "10:00", type: "event", location: "Aktlar zali", description: "Yangi yil bayrami" },
    { id: 3, title: "Imtihon haftaligi", date: "2024-12-20", time: "09:00", type: "exam", location: "Sinflar", description: "Yarim yillik imtihonlar" },
    { id: 4, title: "Sport musobaqasi", date: "2024-12-18", time: "14:00", type: "event", location: "Sport zali", description: "Maktablararo musobaqa" },
  ], []);

  // Tezkor aksiyalar
  const quickActions = useMemo(() => [
    { name: "O'quvchi qo'shish", icon: HiOutlineUsers, navigateTo: "students/new", color: "#10b981" },
    { name: "Davomat belgilash", icon: HiOutlineCalendar, navigateTo: "attendance/mark", color: "#3b82f6" },
    { name: "To'lov qabul qilish", icon: HiOutlineCurrencyDollar, navigateTo: "payments/new", color: "#8b5cf6" },
    { name: "Hisobot yaratish", icon: HiOutlineChartBar, navigateTo: "reports/new", color: "#f59e0b" },
    { name: "Xabar yuborish", icon: HiOutlineChat, navigateTo: "messages/new", color: "#ec4899" },
    { name: "E'lon qo'shish", icon: HiOutlineSpeakerphone, navigateTo: "announcements/new", color: "#ef4444" },
  ], []);

  // Filterlangan faoliyatlar
  const filteredActivities = useMemo(() => {
    let filtered = activities;
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(activity => 
        activity.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [activities, selectedFilter, searchQuery]);

  // Ma'lumotlarni yangilash
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(prev => ({
        students: { ...prev.students, total: prev.students.total + Math.floor(Math.random() * 5) - 2 },
        teachers: { ...prev.teachers, total: prev.teachers.total + (Math.random() > 0.7 ? 1 : 0) },
        classes: { ...prev.classes, total: prev.classes.total + (Math.random() > 0.8 ? 1 : 0) },
        revenue: { ...prev.revenue, monthly: prev.revenue.monthly + Math.floor(Math.random() * 500) - 200 }
      }));
      
      setLastUpdated(new Date());
      addNotification("Ma'lumotlar muvaffaqiyatli yangilandi", 'success');
    } catch (error) {
      addNotification("Ma'lumotlarni yangilashda xatolik yuz berdi", 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Notifikatsiya qo'shish
  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, {
      id,
      message,
      type,
      time: new Date()
    }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(refreshData, 300000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Eksport funksiyasi
  const exportReport = useCallback(async (format = 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const exportData = {
        stats: stats,
        growthData: growthChartData,
        attendanceData: attendanceChartData,
        gradeData: gradeDistributionData,
        activities: filteredActivities,
        topStudents: topStudents,
        events: upcomingEvents,
        exportedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `dashboard_hisobot_${new Date().toISOString()}.${format}`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      addNotification(`Hisobot ${format.toUpperCase()} formatida yuklandi`, 'success');
      setShowExportModal(false);
    } catch (error) {
      addNotification("Hisobot yuklashda xatolik yuz berdi", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [stats, growthChartData, attendanceChartData, gradeDistributionData, filteredActivities, topStudents, upcomingEvents]);

  const handleStatClick = useCallback((navigateTo) => {
    if (onNavigate && navigateTo) {
      onNavigate(navigateTo);
    }
  }, [onNavigate]);

  const handleNavigate = useCallback((page, params = {}) => {
    if (onNavigate) {
      onNavigate(page, params);
    }
  }, [onNavigate]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <HiOutlineCheckCircle />;
      case 'error': return <HiOutlineXCircle />;
      default: return <HiOutlineExclamationCircle />;
    }
  };

  // Hafta kunini o'zbekcha olish
  const getWeekdayUz = (date) => {
    const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    return weekdays[date.getDay()];
  };

  const currentDate = new Date();
  const currentWeekday = getWeekdayUz(currentDate);
  const currentDateFormatted = formatDateUz(currentDate);
  const greeting = getGreeting(currentDate);

  return (
    <div className="dashboard">
      {/* Notifikatsiyalar */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map(notif => (
            <div key={notif.id} className={`notification-toast notification-toast--${notif.type}`}>
              <div className="notification-toast__icon">{getNotificationIcon(notif.type)}</div>
              <div className="notification-toast__content">
                <p>{notif.message}</p>
                <small>{formatTime(notif.time)}</small>
              </div>
              <button className="notification-toast__close" onClick={() => removeNotification(notif.id)}>
                <HiOutlineXCircle />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>📊 Boshqaruv paneli</h1>
          <p className="greeting-message">
            👋 {greeting} Bugun {currentWeekday}, {currentDateFormatted}
          </p>
          <div className="header-time">
            <span className="current-time">
              🕐 {formatTime(currentTime)}
            </span>
            <span className="weather-info">
              {weather.condition === 'Quyoshli' ? '☀️' : 
               weather.condition === 'Bulutli' ? '☁️' :
               weather.condition === 'Yomg\'irli' ? '🌧️' :
               weather.condition === 'Qorli' ? '❄️' :
               weather.condition === 'Shamolli' ? '💨' : '🌡️'} 
              {weather.temp}°C, {weather.condition}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-badge">
            <span className="live-badge"></span>
            Jonli
          </div>
          <div className="search-bar">
            <HiOutlineSearch />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className={`icon-btn ${isLoading ? 'loading' : ''}`} 
            onClick={refreshData}
            disabled={isLoading}
            title="Yangilash"
          >
            <HiOutlineRefresh className={isLoading ? 'spin' : ''} />
          </button>
          <button 
            className={`icon-btn ${showFilters ? 'active' : ''}`} 
            onClick={() => setShowFilters(!showFilters)}
            title="Filter"
          >
            <HiOutlineFilter />
          </button>
          <div className="export-dropdown">
            <button className="export-btn" onClick={() => setShowExportModal(true)}>
              <HiOutlineDownload /> Hisobot
            </button>
            {showExportModal && (
              <div className="export-menu">
                <button onClick={() => exportReport('pdf')}>PDF format</button>
                <button onClick={() => exportReport('excel')}>Excel format</button>
                <button onClick={() => exportReport('csv')}>CSV format</button>
                <button onClick={() => exportReport('json')}>JSON format</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Yil:</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Oy:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {MONTHS_UZ.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Chart ko'rinishi:</label>
            <div className="view-toggle">
              <button className={chartView === 'year' ? 'active' : ''} onClick={() => setChartView('year')}>Yillik</button>
              <button className={chartView === 'month' ? 'active' : ''} onClick={() => setChartView('month')}>Oylik</button>
              <button className={chartView === 'week' ? 'active' : ''} onClick={() => setChartView('week')}>Haftalik</button>
            </div>
          </div>
          <div className="filter-group">
            <label>Filtr turi:</label>
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option value="all">Hammasi</option>
              <option value="attendance">Davomat</option>
              <option value="exam">Imtihonlar</option>
              <option value="payment">To'lovlar</option>
              <option value="schedule">Dars jadvali</option>
              <option value="announcement">E'lonlar</option>
            </select>
          </div>
        </div>
      )}

      {/* Statistik kartalar */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card"
              onClick={() => handleStatClick(stat.navigateTo)}
              style={{ cursor: 'pointer' }}
            >
              <div className="stat-card__icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                <Icon />
              </div>
              <div className="stat-card__content">
                <h3>{stat.title}</h3>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__trend">
                  <span className={`trend-badge trend-${stat.trend.type}`}>
                    {stat.trend.type === 'up' ? '↑' : '↓'} {stat.trend.value}%
                  </span>
                  <span className="stat-card__description">{stat.description}</span>
                </div>
                {stat.secondaryValue && (
                  <div className="stat-card__secondary">{stat.secondaryValue}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Faoliyat filter tabs */}
      <div className="activity-tabs">
        <button className={selectedFilter === 'all' ? 'active' : ''} onClick={() => setSelectedFilter('all')}>
          Hammasi
        </button>
        <button className={selectedFilter === 'attendance' ? 'active' : ''} onClick={() => setSelectedFilter('attendance')}>
           Davomat
        </button>
        <button className={selectedFilter === 'exam' ? 'active' : ''} onClick={() => setSelectedFilter('exam')}>
           Imtihonlar
        </button>
        <button className={selectedFilter === 'payment' ? 'active' : ''} onClick={() => setSelectedFilter('payment')}>
           To'lovlar
        </button>
        <button className={selectedFilter === 'schedule' ? 'active' : ''} onClick={() => setSelectedFilter('schedule')}>
           Dars jadvali
        </button>
        <button className={selectedFilter === 'announcement' ? 'active' : ''} onClick={() => setSelectedFilter('announcement')}>
           E'lonlar
        </button>
      </div>

      {/* Grafiklar grid */}
      <div className="dashboard-grid">
        {/* O'quvchilar o'sishi */}
        <div className="chart-card">
          <div className="card-header">
            <h3><HiOutlineChartBar /> O'quvchilar statistikasi</h3>
            <span className="last-updated">Yangilangan: {formatTime(lastUpdated)}</span>
          </div>
          <div className="chart-container">
            {isLoading ? (
              <div className="chart-loading">
                <div className="spinner"></div>
                <p>Ma'lumotlar yuklanmoqda...</p>
              </div>
            ) : (
              <Line data={growthChartData} options={chartOptions} />
            )}
          </div>
          <div className="chart-footer">
            <button className="chart-nav-btn" onClick={() => handleNavigate('students')}>
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
          <button className="chart-nav-btn" onClick={() => handleNavigate('attendance')}>
            Batafsil ma'lumot
          </button>
        </div>

        {/* Baholar taqsimoti */}
        <div className="chart-card">
          <h3><HiOutlineStar /> Baholar taqsimoti</h3>
          <div className="chart-container doughnut">
            <Doughnut data={gradeDistributionData} options={doughnutOptions} />
          </div>
          <div className="grade-stats">
            <div className="grade-item good">
              <span className="grade-color" style={{ backgroundColor: '#10b981' }}></span>
              A'lo (5) - 45%
            </div>
            <div className="grade-item normal">
              <span className="grade-color" style={{ backgroundColor: '#3b82f6' }}></span>
              Yaxshi (4) - 30%
            </div>
            <div className="grade-item bad">
              <span className="grade-color" style={{ backgroundColor: '#f59e0b' }}></span>
              Qoniqarli (3) - 20%
            </div>
            <div className="grade-item worst">
              <span className="grade-color" style={{ backgroundColor: '#ef4444' }}></span>
              Qoniqarsiz (2) - 5%
            </div>
          </div>
          <button className="chart-nav-btn" onClick={() => handleNavigate('grades')}>
            Batafsil ma'lumot
          </button>
        </div>

        {/* So'nggi faoliyat */}
        <div className="chart-card">
          <h3><HiOutlineClock /> So'nggi faoliyatlar</h3>
          <div className="activity-list">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon" style={{ background: `${activity.color}15`, color: activity.color }}>
                      <Icon />
                    </div>
                    <div className="activity-details">
                      <p>{activity.text}</p>
                      <small>
                        <HiOutlineClock />
                        {activity.time}
                      </small>
                      {activity.details && <small className="activity-details-text">{activity.details}</small>}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-activities">
                <p>Hech qanday faoliyat topilmadi</p>
              </div>
            )}
          </div>
        </div>

        {/* Eng yaxshi o'quvchilar */}
        <div className="chart-card full-width">
          <div className="card-header">
            <h3><HiOutlineStar /> Eng yaxshi o'quvchilar</h3>
            <button className="view-all-btn" onClick={() => handleNavigate('students')}>
              Barchasini ko'rish →
            </button>
          </div>
          <div className="top-students">
            {topStudents.map((student, index) => (
              <div 
                key={index} 
                className="student-rank"
                onClick={() => handleNavigate(`student/${student.name}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="rank-badge">
                  <div className={`rank rank-${student.rank}`}>
                    {student.rank === 1 && '🥇'}
                    {student.rank === 2 && '🥈'}
                    {student.rank === 3 && '🥉'}
                    {student.rank > 3 && student.rank}
                  </div>
                </div>
                <img src={student.avatar} alt={student.name} className="student-avatar" />
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  <div className="student-class">{student.class}-sinf</div>
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
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.date);
              return (
                <div 
                  key={event.id} 
                  className={`event-item ${event.type}`}
                  onClick={() => handleNavigate(`event/${event.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="event-date">
                    <span className="event-day">{eventDate.getDate()}</span>
                    <span className="event-month">{MONTHS_UZ[eventDate.getMonth()]}</span>
                  </div>
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p><HiOutlineClock /> {event.time}</p>
                    <p className="event-location">📍 {event.location}</p>
                    <p className="event-description">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tezkor aksiyalar */}
        <div className="quick-actions">
          <h3>⚡ Tezkor aksiyalar</h3>
          <div className="actions-grid">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button 
                  key={index} 
                  className="quick-action"
                  onClick={() => handleNavigate(action.navigateTo)}
                  style={{ '--action-color': action.color }}
                >
                  <Icon /> {action.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tez navigatsiya */}
        <div className="quick-navigation">
          <h3>🚀 Tez navigatsiya</h3>
          <div className="nav-grid">
            {Object.entries(pageConfig).slice(0, 12).map(([key, config]) => {
              const Icon = config.icon;
              if (!config.roles.includes(userRole) && userRole !== 'admin') return null;
              return (
                <button 
                  key={key} 
                  className="nav-item"
                  onClick={() => handleNavigate(key)}
                >
                  <Icon />
                  <span>{config.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;