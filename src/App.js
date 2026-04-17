import React from 'react';
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
  HiOutlineCube
} from 'react-icons/hi';
import './App.css';

function AppContent() {
  const { isAuthenticated, user, roles } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth > 768);
  const [activePage, setActivePage] = React.useState('dashboard');

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return <Login />;

  // Barcha sahifalar uchun umumiy props
  const commonProps = { onNavigate: setActivePage };

  const renderPage = () => {
    switch(activePage) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'students': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Students {...commonProps} /> : <AccessDenied />;
      case 'teachers': return user?.role === roles.ADMIN ? <Teachers {...commonProps} /> : <AccessDenied />;
      case 'classes': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Classes {...commonProps} /> : <AccessDenied />;
      case 'subjects': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Subjects {...commonProps} /> : <AccessDenied />;
      case 'attendance': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Attendance {...commonProps} /> : <AccessDenied />;
      case 'grades': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Grades {...commonProps} /> : user?.role === roles.STUDENT || user?.role === roles.PARENT ? <ParentPanel {...commonProps} /> : <AccessDenied />;
      case 'exams': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Exams {...commonProps} /> : <AccessDenied />;
      case 'homework': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Homework {...commonProps} /> : <AccessDenied />;
      case 'schedule': return <Schedule {...commonProps} />;
      case 'payments': return user?.role === roles.ADMIN || user?.role === roles.FINANCE || user?.role === roles.PARENT ? <Payments {...commonProps} /> : <AccessDenied />;
      case 'reports': return user?.role === roles.ADMIN || user?.role === roles.FINANCE ? <Reports {...commonProps} /> : <AccessDenied />;
      case 'payroll': return user?.role === roles.ADMIN || user?.role === roles.FINANCE ? <Payroll {...commonProps} /> : <AccessDenied />;
      case 'library': return <Library {...commonProps} />;
      case 'cafeteria': return <Cafeteria {...commonProps} />;
      case 'health': return <Health {...commonProps} />;
      case 'transport': return <Transport {...commonProps} />;
      case 'messages': return <Messages {...commonProps} />;
      case 'announcements': return <Announcements {...commonProps} />;
      case 'surveys': return <Surveys {...commonProps} />;
      case 'notifications': return <Notifications {...commonProps} />;
      case 'discipline': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Discipline {...commonProps} /> : <AccessDenied />;
      case 'livechat': return <LiveChat {...commonProps} />;
      case 'staff': return user?.role === roles.ADMIN ? <Staff {...commonProps} /> : <AccessDenied />;
      case 'alumni': return user?.role === roles.ADMIN ? <Alumni {...commonProps} /> : <AccessDenied />;
      case 'admissions': return user?.role === roles.ADMIN ? <Admissions {...commonProps} /> : <AccessDenied />;
      case 'parents': return user?.role === roles.ADMIN ? <Parents {...commonProps} /> : <AccessDenied />;
      case 'events': return <Events {...commonProps} />;
      case 'documents': return <Documents {...commonProps} />;
      case 'inventory': return user?.role === roles.ADMIN ? <Inventory {...commonProps} /> : <AccessDenied />;
      case 'users': return user?.role === roles.ADMIN ? <Users {...commonProps} /> : <AccessDenied />;
      case 'analytics': return user?.role === roles.ADMIN || user?.role === roles.TEACHER ? <Analytics {...commonProps} /> : <AccessDenied />;
      case 'profile': return <Profile {...commonProps} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  const AccessDenied = () => (
    <div className="access-denied">
      <div className="access-denied-icon">🔒</div>
      <h2>Kirish huquqi yo'q</h2>
      <p>Sizga bu sahifani ko'rish uchun ruxsat berilmagan.</p>
      <button className="btn-primary" onClick={() => setActivePage('dashboard')}>
        Dashboardga qaytish
      </button>
    </div>
  );

  const getSidebarItems = () => {
    const items = [
      { id: 'dashboard', name: 'Dashboard', icon: HiOutlineViewGrid },
      { id: 'students', name: 'O\'quvchilar', icon: HiOutlineUsers },
      { id: 'attendance', name: 'Davomat', icon: HiOutlineCalendar },
      { id: 'grades', name: 'Baholar', icon: HiOutlineStar },
      { id: 'schedule', name: 'Dars jadvali', icon: HiOutlineTable },
      { id: 'messages', name: 'Xabarlar', icon: HiOutlineChat },
      { id: 'announcements', name: 'E\'lonlar', icon: HiOutlineSpeakerphone },
      { id: 'notifications', name: 'Ogohlantirishlar', icon: HiOutlineBell },
      { id: 'livechat', name: 'Live Chat', icon: HiOutlineChat },
      { id: 'events', name: 'Tadbirlar', icon: HiOutlineCalendar },
      { id: 'profile', name: 'Profil', icon: HiOutlineUserCircle },
    ];

    if (user?.role === roles.ADMIN) {
      items.splice(2, 0, { id: 'teachers', name: 'O\'qituvchilar', icon: HiOutlineUserGroup });
      items.splice(3, 0, { id: 'classes', name: 'Sinflar', icon: HiOutlineAcademicCap });
      items.splice(4, 0, { id: 'subjects', name: 'Fanlar', icon: HiOutlineBookOpen });
      items.push({ id: 'exams', name: 'Imtihonlar', icon: HiOutlineDocumentText });
      items.push({ id: 'homework', name: 'Uy vazifalari', icon: HiOutlineClipboardList });
      items.push({ id: 'payments', name: 'To\'lovlar', icon: HiOutlineCreditCard });
      items.push({ id: 'reports', name: 'Hisobotlar', icon: HiOutlineChartBar });
      items.push({ id: 'payroll', name: 'Oyliklar', icon: HiOutlineCreditCard });
      items.push({ id: 'users', name: 'Foydalanuvchilar', icon: HiOutlineUserGroup });
      items.push({ id: 'library', name: 'Kutubxona', icon: HiOutlineBookOpen });
      items.push({ id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard });
      items.push({ id: 'health', name: 'Sog\'liq', icon: HiOutlineHeart });
      items.push({ id: 'transport', name: 'Transport', icon: HiOutlineTruck });
      items.push({ id: 'surveys', name: 'So\'rovnomalar', icon: HiOutlineChartBar });
      items.push({ id: 'staff', name: 'Xodimlar', icon: HiOutlineBriefcase });
      items.push({ id: 'alumni', name: 'Bitiruvchilar', icon: HiOutlineAcademicCap });
      items.push({ id: 'discipline', name: 'Mukofot/Intizom', icon: HiOutlineStar });
      items.push({ id: 'analytics', name: 'Analitika', icon: HiOutlineTrendingUp });
      items.push({ id: 'admissions', name: 'Qabul', icon: HiOutlineDocumentText });
      items.push({ id: 'parents', name: 'Ota-onalar', icon: HiOutlineUsers });
      items.push({ id: 'documents', name: 'Hujjatlar', icon: HiOutlineDocumentText });
      items.push({ id: 'inventory', name: 'Inventar', icon: HiOutlineCube });
    }

    if (user?.role === roles.TEACHER) {
      items.push({ id: 'exams', name: 'Imtihonlar', icon: HiOutlineDocumentText });
      items.push({ id: 'homework', name: 'Uy vazifalari', icon: HiOutlineClipboardList });
      items.push({ id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard });
      items.push({ id: 'health', name: 'Sog\'liq', icon: HiOutlineHeart });
      items.push({ id: 'discipline', name: 'Mukofot/Intizom', icon: HiOutlineStar });
      items.push({ id: 'analytics', name: 'Analitika', icon: HiOutlineTrendingUp });
    }

    if (user?.role === roles.PARENT) {
      return [
        { id: 'dashboard', name: 'Farzandim', icon: HiOutlineUser },
        { id: 'grades', name: 'Baholar', icon: HiOutlineStar },
        { id: 'attendance', name: 'Davomat', icon: HiOutlineCalendar },
        { id: 'payments', name: 'To\'lovlar', icon: HiOutlineCreditCard },
        { id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard },
        { id: 'notifications', name: 'Ogohlantirishlar', icon: HiOutlineBell },
        { id: 'announcements', name: 'E\'lonlar', icon: HiOutlineSpeakerphone },
        { id: 'events', name: 'Tadbirlar', icon: HiOutlineCalendar },
        { id: 'livechat', name: 'Live Chat', icon: HiOutlineChat },
        { id: 'profile', name: 'Profil', icon: HiOutlineUserCircle }
      ];
    }

    if (user?.role === roles.FINANCE) {
      return [
        { id: 'dashboard', name: 'Dashboard', icon: HiOutlineViewGrid },
        { id: 'payments', name: 'To\'lovlar', icon: HiOutlineCreditCard },
        { id: 'reports', name: 'Hisobotlar', icon: HiOutlineChartBar },
        { id: 'payroll', name: 'Oyliklar', icon: HiOutlineCreditCard },
        { id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard },
        { id: 'profile', name: 'Profil', icon: HiOutlineUserCircle }
      ];
    }

    if (user?.role === roles.LIBRARIAN) {
      return [
        { id: 'dashboard', name: 'Dashboard', icon: HiOutlineViewGrid },
        { id: 'library', name: 'Kutubxona', icon: HiOutlineBookOpen },
        { id: 'profile', name: 'Profil', icon: HiOutlineUserCircle }
      ];
    }

    if (user?.role === roles.STUDENT) {
      return [
        { id: 'dashboard', name: 'Dashboard', icon: HiOutlineViewGrid },
        { id: 'grades', name: 'Baholarim', icon: HiOutlineStar },
        { id: 'attendance', name: 'Davomatim', icon: HiOutlineCalendar },
        { id: 'homework', name: 'Uy vazifalari', icon: HiOutlineClipboardList },
        { id: 'schedule', name: 'Dars jadvali', icon: HiOutlineTable },
        { id: 'cafeteria', name: 'Ovqatlanish', icon: HiOutlineCreditCard },
        { id: 'notifications', name: 'Ogohlantirishlar', icon: HiOutlineBell },
        { id: 'messages', name: 'Xabarlar', icon: HiOutlineChat },
        { id: 'announcements', name: 'E\'lonlar', icon: HiOutlineSpeakerphone },
        { id: 'events', name: 'Tadbirlar', icon: HiOutlineCalendar },
        { id: 'livechat', name: 'Live Chat', icon: HiOutlineChat },
        { id: 'profile', name: 'Profil', icon: HiOutlineUserCircle }
      ];
    }

    return items;
  };

  return (
    <div className="app">
      <Sidebar 
        isOpen={sidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        menuItems={getSidebarItems()} 
      />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-wrapper">{renderPage()}</div>
      </div>
      <AiAssistant />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
