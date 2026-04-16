import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Subjects from './pages/Subjects';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Payments from './pages/Payments';
import Exams from './pages/Exams';
import Homework from './pages/Homework';
import Schedule from './pages/Schedule';
import Messages from './pages/Messages';
import Announcements from './pages/Announcements';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Users from './pages/Users';
import ParentPanel from './pages/ParentPanel';
import Library from './pages/Library';
import Cafeteria from './pages/Cafeteria';
import Health from './pages/Health';
import Transport from './pages/Transport';
import Surveys from './pages/Surveys';
import Notifications from './pages/Notifications';
import Staff from './pages/Staff';
import Alumni from './pages/Alumni';
import Discipline from './pages/Discipline';
import Analytics from './pages/Analytics';
import LiveChat from './pages/LiveChat';
import Admissions from './pages/Admissions';
import Parents from './pages/Parents';
import Events from './pages/Events';
import Documents from './pages/Documents';
import Payroll from './pages/Payroll';
import Inventory from './pages/Inventory';
import AiAssistant from './components/AiAssistant';
import { 
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineTable,
  HiOutlineChat,
  HiOutlineSpeakerphone,
  HiOutlineChartBar,
  HiOutlineUserCircle,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineTrendingUp,
  HiOutlineCube,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineSupport,
  HiOutlineInformationCircle
} from 'react-icons/hi';
import './App.css';

function AppContent() {
  const { isAuthenticated, user, roles, logout, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) return JSON.parse(saved);
    return window.innerWidth > 768;
  });
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'dashboard';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sahifa nomlari va iconlari
  const pageConfig = useMemo(() => ({
    dashboard: { name: 'Dashboard', icon: HiOutlineViewGrid, roles: ['admin', 'teacher', 'student', 'parent', 'finance', 'librarian'] },
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
    livechat: { name: 'Live Chat', icon: HiOutlineChat, roles: ['admin', 'teacher', 'student', 'parent'] },
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
  }), []);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileSidebar(false);
        const saved = localStorage.getItem('sidebarOpen');
        if (saved === null) {
          setSidebarOpen(true);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Save active page
  useEffect(() => {
    localStorage.setItem('activePage', activePage);
    updateBreadcrumbs(activePage);
  }, [activePage]);

  // Update breadcrumbs
  const updateBreadcrumbs = useCallback((pageId) => {
    const config = pageConfig[pageId];
    if (config) {
      setBreadcrumbs([
        { id: 'dashboard', name: 'Dashboard', path: '/' },
        { id: pageId, name: config.name, path: `/${pageId}` }
      ]);
    }
  }, [pageConfig]);

  // Toggle favorite
  const toggleFavorite = useCallback((pageId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Navigate function with loading
  const handleNavigate = useCallback((pageId, options = {}) => {
    if (pageLoading) return;
    
    setPageLoading(true);
    setActivePage(pageId);
    
    if (options.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (isMobile) {
      setShowMobileSidebar(false);
    }
    
    setTimeout(() => setPageLoading(false), 300);
  }, [pageLoading, isMobile]);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setShowMobileSidebar(prev => !prev);
    } else {
      setSidebarOpen(prev => !prev);
    }
  }, [isMobile]);

  // Get sidebar items based on user role
  const getSidebarItems = useCallback(() => {
    const allItems = [];
    
    // Dashboard har doim
    allItems.push({ id: 'dashboard', name: 'Dashboard', icon: HiOutlineViewGrid });
    
    // Asosiy bo'limlar
    if (hasPermission('students')) allItems.push({ id: 'students', name: "O'quvchilar", icon: HiOutlineUsers });
    if (hasPermission('teachers')) allItems.push({ id: 'teachers', name: "O'qituvchilar", icon: HiOutlineUserGroup });
    if (hasPermission('classes')) allItems.push({ id: 'classes', name: 'Sinflar', icon: HiOutlineAcademicCap });
    if (hasPermission('subjects')) allItems.push({ id: 'subjects', name: 'Fanlar', icon: HiOutlineBookOpen });
    
    // Akademik bo'lim
    if (hasPermission('attendance')) allItems.push({ id: 'attendance', name: 'Davomat', icon: HiOutlineCalendar });
    if (hasPermission('grades')) allItems.push({ id: 'grades', name: 'Baholar', icon: HiOutlineStar });
    if (hasPermission('exams')) allItems.push({ id: 'exams', name: 'Imtihonlar', icon: HiOutlineDocumentText });
    if (hasPermission('homework')) allItems.push({ id: 'homework', name: 'Uy vazifalari', icon: HiOutlineClipboardList });
    if (hasPermission('schedule')) allItems.push({ id: 'schedule', name: 'Dars jadvali', icon: HiOutlineTable });
    
    // Moliya bo'limi
    if (hasPermission('payments')) allItems.push({ id: 'payments', name: "To'lovlar", icon: HiOutlineCreditCard });
    if (hasPermission('reports')) allItems.push({ id: 'reports', name: 'Hisobotlar', icon: HiOutlineChartBar });
    if (hasPermission('payroll')) allItems.push({ id: 'payroll', name: 'Oyliklar', icon: HiOutlineCreditCard });
    
    // Xizmatlar
    if (hasPermission('library')) allItems.push({ id: 'library', name: 'Kutubxona', icon: HiOutlineBookOpen });
    if (hasPermission('cafeteria')) allItems.push({ id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard });
    if (hasPermission('health')) allItems.push({ id: 'health', name: "Sog'liq", icon: HiOutlineHeart });
    if (hasPermission('transport')) allItems.push({ id: 'transport', name: 'Transport', icon: HiOutlineTruck });
    
    // Kommunikatsiya
    if (hasPermission('messages')) allItems.push({ id: 'messages', name: 'Xabarlar', icon: HiOutlineChat });
    if (hasPermission('announcements')) allItems.push({ id: 'announcements', name: "E'lonlar", icon: HiOutlineSpeakerphone });
    if (hasPermission('notifications')) allItems.push({ id: 'notifications', name: 'Ogohlantirishlar', icon: HiOutlineBell });
    if (hasPermission('livechat')) allItems.push({ id: 'livechat', name: 'Live Chat', icon: HiOutlineChat });
    if (hasPermission('events')) allItems.push({ id: 'events', name: 'Tadbirlar', icon: HiOutlineCalendar });
    
    // Admin bo'limi
    if (user?.role === 'admin') {
      allItems.push({ id: 'staff', name: 'Xodimlar', icon: HiOutlineBriefcase });
      allItems.push({ id: 'alumni', name: 'Bitiruvchilar', icon: HiOutlineAcademicCap });
      allItems.push({ id: 'analytics', name: 'Analitika', icon: HiOutlineTrendingUp });
      allItems.push({ id: 'admissions', name: 'Qabul', icon: HiOutlineDocumentText });
      allItems.push({ id: 'parents', name: 'Ota-onalar', icon: HiOutlineUsers });
      allItems.push({ id: 'documents', name: 'Hujjatlar', icon: HiOutlineDocumentText });
      allItems.push({ id: 'inventory', name: 'Inventar', icon: HiOutlineCube });
      allItems.push({ id: 'users', name: 'Foydalanuvchilar', icon: HiOutlineUserGroup });
      allItems.push({ id: 'surveys', name: "So'rovnomalar", icon: HiOutlineChartBar });
      allItems.push({ id: 'discipline', name: 'Mukofot/Intizom', icon: HiOutlineStar });
    }
    
    // Teacher qo'shimcha
    if (user?.role === 'teacher') {
      allItems.push({ id: 'discipline', name: 'Mukofot/Intizom', icon: HiOutlineStar });
      allItems.push({ id: 'analytics', name: 'Analitika', icon: HiOutlineTrendingUp });
    }
    
    // Profil va sozlamalar
    allItems.push({ id: 'profile', name: 'Profil', icon: HiOutlineUserCircle });
    allItems.push({ id: 'settings', name: 'Sozlamalar', icon: HiOutlineCog });
    allItems.push({ id: 'help', name: 'Yordam', icon: HiOutlineSupport });
    
    return allItems;
  }, [user, hasPermission]);

  // Filter sidebar items by search
  const filteredSidebarItems = useMemo(() => {
    const items = getSidebarItems();
    if (!searchQuery) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [getSidebarItems, searchQuery]);

  // Access denied component
  const AccessDenied = useCallback(() => (
    <div className="access-denied">
      <div className="access-denied-icon">
        <HiOutlineUserCircle />
      </div>
      <div className="access-denied-content">
        <h2>Kirish huquqi yo'q</h2>
        <p>Sizga bu sahifani ko'rish uchun ruxsat berilmagan.</p>
        <div className="access-denied-actions">
          <button className="btn-primary" onClick={() => handleNavigate('dashboard')}>
            Dashboardga qaytish
          </button>
          <button className="btn-secondary" onClick={() => handleNavigate('profile')}>
            Profilim
          </button>
        </div>
      </div>
    </div>
  ), [handleNavigate]);

  // Check page permission
  const hasPagePermission = useCallback((pageId) => {
    const config = pageConfig[pageId];
    if (!config) return false;
    if (!config.roles) return true;
    return config.roles.includes(user?.role);
  }, [user, pageConfig]);

  // Render current page
  const renderPage = useCallback(() => {
    if (!hasPagePermission(activePage)) {
      return <AccessDenied />;
    }

    const commonProps = { 
      onNavigate: handleNavigate,
      user,
      roles,
      hasPermission
    };

    const pageMap = {
      dashboard: <Dashboard {...commonProps} />,
      students: <Students {...commonProps} />,
      teachers: <Teachers {...commonProps} />,
      classes: <Classes {...commonProps} />,
      subjects: <Subjects {...commonProps} />,
      attendance: <Attendance {...commonProps} />,
      grades: user?.role === 'parent' ? <ParentPanel {...commonProps} /> : <Grades {...commonProps} />,
      payments: <Payments {...commonProps} />,
      exams: <Exams {...commonProps} />,
      homework: <Homework {...commonProps} />,
      schedule: <Schedule {...commonProps} />,
      messages: <Messages {...commonProps} />,
      announcements: <Announcements {...commonProps} />,
      profile: <Profile {...commonProps} />,
      reports: <Reports {...commonProps} />,
      users: <Users {...commonProps} />,
      library: <Library {...commonProps} />,
      cafeteria: <Cafeteria {...commonProps} />,
      health: <Health {...commonProps} />,
      transport: <Transport {...commonProps} />,
      surveys: <Surveys {...commonProps} />,
      notifications: <Notifications {...commonProps} />,
      staff: <Staff {...commonProps} />,
      alumni: <Alumni {...commonProps} />,
      discipline: <Discipline {...commonProps} />,
      analytics: <Analytics {...commonProps} />,
      livechat: <LiveChat {...commonProps} />,
      admissions: <Admissions {...commonProps} />,
      parents: <Parents {...commonProps} />,
      events: <Events {...commonProps} />,
      documents: <Documents {...commonProps} />,
      payroll: <Payroll {...commonProps} />,
      inventory: <Inventory {...commonProps} />,
      settings: <Settings {...commonProps} />,
      help: <Help {...commonProps} />,
      about: <About {...commonProps} />
    };

    return pageMap[activePage] || <Dashboard {...commonProps} />;
  }, [activePage, user, roles, hasPermission, handleNavigate, AccessDenied, hasPagePermission]);

  // Loading screen
  if (pageLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => handleNavigate('dashboard')} />;
  }

  return (
    <div className="app">
      {/* Sidebar Overlay for mobile */}
      {isMobile && showMobileSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowMobileSidebar(false)} />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobile ? showMobileSidebar : sidebarOpen}
        activePage={activePage}
        setActivePage={handleNavigate}
        toggleSidebar={toggleSidebar}
        menuItems={filteredSidebarItems}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <div className={`main-content ${sidebarOpen && !isMobile ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar 
          toggleSidebar={toggleSidebar}
          onSearch={(query) => setSearchQuery(query)}
          activePage={activePage}
          pageTitle={pageConfig[activePage]?.name}
          breadcrumbs={breadcrumbs}
          onNavigate={handleNavigate}
          favorites={favorites}
          toggleFavorite={() => toggleFavorite(activePage)}
        />
        
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </div>
      
      {/* AI Assistant */}
      <AiAssistant user={user} onNavigate={handleNavigate} />
    </div>
  );
}

// Settings Page Component
const Settings = ({ onNavigate, user }) => {
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'uz',
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    sound: JSON.parse(localStorage.getItem('sound') || 'true'),
    autoRefresh: JSON.parse(localStorage.getItem('autoRefresh') || 'true'),
    compactMode: JSON.parse(localStorage.getItem('compactMode') || 'false')
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
    
    if (key === 'theme') {
      document.body.setAttribute('data-theme', value);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Sozlamalar</h1>
        <p>Hisobingiz va ilova sozlamalarini boshqaring</p>
      </div>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Ko'rinish</h3>
          <div className="setting-item">
            <label>Mavzu</label>
            <select value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)}>
              <option value="light">Yorug'</option>
              <option value="dark">Qorong'u</option>
              <option value="auto">Avto</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Til</label>
            <select value={settings.language} onChange={(e) => handleChange('language', e.target.value)}>
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Yilni rejim</label>
            <input 
              type="checkbox" 
              checked={settings.compactMode} 
              onChange={(e) => handleChange('compactMode', e.target.checked)}
            />
          </div>
        </div>
        
        <div className="settings-card">
          <h3>Bildirishnomalar</h3>
          <div className="setting-item">
            <label>Bildirishnomalarni yoqish</label>
            <input 
              type="checkbox" 
              checked={settings.notifications} 
              onChange={(e) => handleChange('notifications', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Ovozli bildirishnomalar</label>
            <input 
              type="checkbox" 
              checked={settings.sound} 
              onChange={(e) => handleChange('sound', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Avto yangilash</label>
            <input 
              type="checkbox" 
              checked={settings.autoRefresh} 
              onChange={(e) => handleChange('autoRefresh', e.target.checked)}
            />
          </div>
        </div>
        
        <div className="settings-card">
          <h3>Hisob</h3>
          <div className="setting-item">
            <label>Ism</label>
            <input type="text" value={user?.name || ''} readOnly disabled />
          </div>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" value={user?.email || ''} readOnly disabled />
          </div>
          <div className="setting-item">
            <label>Rol</label>
            <input type="text" value={user?.role || ''} readOnly disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Page Component
const Help = ({ onNavigate }) => {
  const helpTopics = [
    { title: "Qanday qilib o'quvchi qo'shish mumkin?", page: "students" },
    { title: "Davomatni qanday belgilash mumkin?", page: "attendance" },
    { title: "Baholarni qanday kiritish mumkin?", page: "grades" },
    { title: "To'lovlarni qanday qabul qilish mumkin?", page: "payments" },
    { title: "Hisobotlarni qanday yuklab olish mumkin?", page: "reports" }
  ];

  return (
    <div className="help-page">
      <div className="page-header">
        <h1>Yordam</h1>
        <p>Tez-tez beriladigan savollar va qo'llanmalar</p>
      </div>
      
      <div className="help-grid">
        {helpTopics.map((topic, index) => (
          <div key={index} className="help-card" onClick={() => onNavigate(topic.page)}>
            <div className="help-icon">❓</div>
            <h3>{topic.title}</h3>
            <p>Batafsil ma'lumot olish uchun bosing</p>
          </div>
        ))}
      </div>
      
      <div className="contact-support">
        <h3>Yordam kerakmi?</h3>
        <p>Qo'llab-quvvatlash xizmatiga murojaat qiling</p>
        <button className="btn-primary" onClick={() => onNavigate('messages')}>
          Xabar yuborish
        </button>
      </div>
    </div>
  );
};

// About Page Component
const About = () => (
  <div className="about-page">
    <div className="page-header">
      <h1>Dastur haqida</h1>
      <p>EduManage - zamonaviy ta'lim boshqaruvi tizimi</p>
    </div>
    
    <div className="about-content">
      <div className="about-logo">
        <div className="logo-icon">📚</div>
        <h2>EduManage</h2>
        <p>Version 2.0.0</p>
      </div>
      
      <div className="about-features">
        <h3>Asosiy xususiyatlar</h3>
        <ul>
          <li>✓ O'quvchilar va o'qituvchilarni boshqarish</li>
          <li>✓ Davomat va baholarni kuzatish</li>
          <li>✓ To'lovlarni boshqarish</li>
          <li>✓ Hisobotlar va analitika</li>
          <li>✓ Xabarlar va bildirishnomalar</li>
          <li>✓ AI yordamchi</li>
        </ul>
      </div>
      
      <div className="about-contact">
        <h3>Bog'lanish</h3>
        <p>Email: support@edumanage.uz</p>
        <p>Tel: +998 71 123 45 67</p>
        <p>© 2024 EduManage. Barcha huquqlar himoyalangan.</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;