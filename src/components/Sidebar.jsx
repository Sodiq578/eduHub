import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap,
  HiOutlineBookOpen, 
  HiOutlineCalendar, 
  HiOutlineStar, 
  HiOutlineDocumentText,
  HiOutlineClipboardList, 
  HiOutlineTable, 
  HiOutlineChat, 
  HiOutlineSpeakerphone,
  HiOutlineCreditCard, 
  HiOutlineChartBar, 
  HiOutlineUserCircle, 
  HiOutlineUser,
  HiOutlineHeart, 
  HiOutlineTruck, 
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineTrendingUp,
  HiOutlineChevronRight, 
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineTemplate,
  HiOutlineClipboard,
  HiOutlineCash,
  HiOutlineCog,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar as HiOutlineEvent,
  HiOutlineDocumentSearch,
  HiOutlineCash as HiOutlinePayroll,
  HiOutlineCube
} from 'react-icons/hi';
import './Sidebar.css';

// Icon map - YANGI ICOONLAR QO'SHILDI
const iconMap = {
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap,
  HiOutlineBookOpen, 
  HiOutlineCalendar, 
  HiOutlineStar, 
  HiOutlineDocumentText,
  HiOutlineClipboardList, 
  HiOutlineTable, 
  HiOutlineChat, 
  HiOutlineSpeakerphone,
  HiOutlineCreditCard, 
  HiOutlineChartBar, 
  HiOutlineUserCircle, 
  HiOutlineUser,
  HiOutlineHeart, 
  HiOutlineTruck, 
  HiOutlineBell, 
  HiOutlineBriefcase, 
  HiOutlineTrendingUp,
  HiOutlineOfficeBuilding,
  HiOutlineEvent,
  HiOutlineDocumentSearch,
  HiOutlinePayroll,
  HiOutlineCube
};

// Kategoriyalar va ularning menyulari
const menuCategories = {
  main: { name: 'Asosiy', icon: HiOutlineTemplate, order: 1 },
  academic: { name: 'Akademik', icon: HiOutlineBookOpen, order: 2 },
  finance: { name: 'Moliyaviy', icon: HiOutlineCash, order: 3 },
  services: { name: 'Xizmatlar', icon: HiOutlineClipboard, order: 4 },
  communication: { name: 'Kommunikatsiya', icon: HiOutlineChat, order: 5 },
  management: { name: 'Boshqaruv', icon: HiOutlineOfficeBuilding, order: 6 },
  settings: { name: 'Sozlamalar', icon: HiOutlineCog, order: 7 }
};

// Menyularni kategoriyalarga ajratish - YANGI MENYULAR QO'SHILDI
const getMenuCategory = (menuId) => {
  const categories = {
    // Asosiy
    dashboard: 'main',
    
    // Akademik
    students: 'academic',
    teachers: 'academic',
    classes: 'academic',
    subjects: 'academic',
    attendance: 'academic',
    grades: 'academic',
    exams: 'academic',
    homework: 'academic',
    schedule: 'academic',
    
    // Moliyaviy
    payments: 'finance',
    reports: 'finance',
    payroll: 'finance',     // YANGI
    
    // Xizmatlar
    library: 'services',
    cafeteria: 'services',
    health: 'services',
    transport: 'services',
    
    // Kommunikatsiya
    messages: 'communication',
    announcements: 'communication',
    notifications: 'communication',
    livechat: 'communication',
    surveys: 'communication',
    discipline: 'communication',
    
    // Boshqaruv (YANGI KATEGORIYA)
    admissions: 'management',   // YANGI
    parents: 'management',      // YANGI
    events: 'management',       // YANGI
    documents: 'management',    // YANGI
    inventory: 'management',    // YANGI
    staff: 'management',
    alumni: 'management',
    
    // Sozlamalar
    analytics: 'settings',
    users: 'settings',
    profile: 'settings'
  };
  return categories[menuId] || 'main';
};

const Sidebar = ({ isOpen, activePage, setActivePage, toggleSidebar }) => {
  const { getUserMenus, user } = useAuth();
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const menuItems = getUserMenus();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768 && isOpen === false) {
        toggleSidebar();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  const toggleCategory = (categoryKey) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const handleNavClick = (id) => {
    setActivePage(id);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const getIconComponent = (iconName) => {
    return iconMap[iconName] || HiOutlineViewGrid;
  };

  // Menyularni kategoriyalarga ajratish
  const categorizedMenus = {};
  Object.keys(menuCategories).forEach(cat => {
    categorizedMenus[cat] = [];
  });

  menuItems.forEach(item => {
    const category = getMenuCategory(item.id);
    if (categorizedMenus[category]) {
      categorizedMenus[category].push(item);
    }
  });

  // Kategoriyalarni order bo'yicha tartiblash
  const sortedCategories = Object.keys(menuCategories)
    .filter(cat => categorizedMenus[cat] && categorizedMenus[cat].length > 0)
    .sort((a, b) => menuCategories[a].order - menuCategories[b].order);

  const getRoleName = (role) => {
    switch(role) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'O\'qituvchi';
      case 'student': return 'O\'quvchi';
      case 'parent': return 'Ota-ona';
      case 'finance': return 'Moliyachi';
      case 'librarian': return 'Kutubxonachi';
      default: return 'Foydalanuvchi';
    }
  };

  return (
    <>
      {isOpen && isMobile && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-glow"></div>
            <span className="sidebar-logo-icon">📚</span>
            <span className="sidebar-logo-text">Edu<span>Manage</span></span>
          </div>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <HiOutlineX />
          </button>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            <img src={`https://ui-avatars.com/api/?background=10b981&color=fff&name=${user?.name || 'User'}&size=40`} alt="User" />
            <div className="user-status"></div>
          </div>
          <div className="user-info">
            <h4>{user?.name || 'User'}</h4>
            <p>{getRoleName(user?.role)}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sortedCategories.map(categoryKey => {
            const category = menuCategories[categoryKey];
            const CategoryIcon = category.icon;
            const isCollapsed = collapsedCategories[categoryKey];
            const items = categorizedMenus[categoryKey];

            return (
              <div key={categoryKey} className="sidebar-category">
                <div 
                  className={`category-header ${isCollapsed ? 'collapsed' : ''}`}
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <CategoryIcon className="category-icon" />
                  <span className="category-name">{category.name}</span>
                  <HiOutlineChevronDown className={`category-arrow ${isCollapsed ? 'rotated' : ''}`} />
                </div>
                <div className={`category-items ${isCollapsed ? 'hidden' : ''}`}>
                  {items.map(item => {
                    const Icon = getIconComponent(item.icon);
                    return (
                      <div
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                      >
                        <Icon className="nav-icon" />
                        <span className="nav-name">{item.name}</span>
                        {activePage === item.id && <HiOutlineChevronRight className="nav-indicator" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-version">Version 2.0.0</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;