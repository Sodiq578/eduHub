import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineMenuAlt2, 
  HiOutlineSearch, 
  HiOutlineBell, 
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineUserCircle,
  HiOutlineChevronDown,
  HiOutlineX,
  HiOutlineMail,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: "To'lov muddati", message: "Dekabr oyi to'lovi 10-kungacha", time: "5 daqiqa oldin", read: false, icon: '💰' },
    { id: 2, title: "Uy vazifasi", message: "Matematika fanidan test topshirish kerak", time: "1 soat oldin", read: false, icon: '📚' },
    { id: 3, title: "Tadbir", message: "Yil yakuni bayrami 25-dekabr", time: "2 soat oldin", read: true, icon: '🎉' },
  ]);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchInputRef = useRef(null);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Tizimdan chiqishni xohlaysizmi?')) {
      await logout();
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    // Navigate to profile page
    window.location.hash = '#profile';
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    window.location.hash = '#settings';
  };

  const handleHelpClick = () => {
    setShowProfileMenu(false);
    window.location.hash = '#help';
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationsCount(0);
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = updated.filter(n => !n.read).length;
      setNotificationsCount(unreadCount);
      return updated;
    });
  };

  const getRoleName = (role) => {
    const roles = {
      'admin': 'Administrator',
      'teacher': 'O\'qituvchi',
      'student': 'O\'quvchi',
      'parent': 'Ota-ona',
      'finance': 'Moliyachi',
      'librarian': 'Kutubxonachi'
    };
    return roles[role] || 'Foydalanuvchi';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <nav className="navbar" role="navigation" aria-label="Asosiy navigatsiya">
      {/* Left Section */}
      <div className="navbar__left">
        <button 
          className="navbar__menu-btn" 
          onClick={toggleSidebar} 
          aria-label="Menyuni ochish/yopish"
          title="Menyu"
        >
          <HiOutlineMenuAlt2 />
        </button>
 
      </div>

      {/* Center - Search */}
      <div className={`navbar__center ${searchFocused ? 'navbar__center--focused' : ''}`}>
        <div className="search-box">
          <HiOutlineSearch className="search-box__icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-box__input"
            placeholder="Qidirish... (⌘K)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Qidirish"
          />
          {searchValue && (
            <button 
              className="search-box__clear" 
              onClick={() => setSearchValue('')}
              aria-label="Qidiruvni tozalash"
            >
              <HiOutlineX />
            </button>
          )}
          {!searchValue && !isMobile && (
            <kbd className="search-box__shortcut" aria-hidden="true">⌘K</kbd>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar__right">
        {/* Notifications */}
        <div className="notifications-wrapper" ref={notificationsRef}>
          <button 
            className={`icon-button notifications__trigger ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Bildirishnomalar"
            aria-expanded={showNotifications}
          >
            <HiOutlineBell className="icon-button__icon" />
            {unreadNotifications > 0 && (
              <span className="notifications__badge">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3>Bildirishnomalar</h3>
                {unreadNotifications > 0 && (
                  <button 
                    className="notifications__mark-all" 
                    onClick={markAllAsRead}
                    aria-label="Hammasini o'qilgan deb belgilash"
                  >
                    Hammasini o‘qildi
                  </button>
                )}
              </div>

              <div className="notifications__list">
                {notifications.length === 0 ? (
                  <div className="notifications__empty">
                    <div className="notifications__empty-icon">🔔</div>
                    <p className="notifications__empty-text">Bildirishnomalar yo‘q</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.read ? 'notification-item--unread' : ''}`}
                      onClick={() => markAsRead(notif.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === 'Enter' && markAsRead(notif.id)}
                    >
                      <div className="notification-item__icon" aria-hidden="true">
                        {notif.icon}
                      </div>
                      <div className="notification-item__content">
                        <div className="notification-item__title">{notif.title}</div>
                        <div className="notification-item__message">{notif.message}</div>
                        <div className="notification-item__time">{notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="notifications__footer">
                  <button 
                    className="notifications__view-all"
                    onClick={() => {
                      setShowNotifications(false);
                      window.location.hash = '#notifications';
                    }}
                  >
                    Barchasini ko‘rish
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-wrapper" ref={profileRef}>
          <button 
            className={`profile__trigger ${showProfileMenu ? 'active' : ''}`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="Profil menyusi"
            aria-expanded={showProfileMenu}
          >
            

            {!isMobile && (
              <div className="profile__info">
                <span className="profile__name">{user?.name || 'Foydalanuvchi'}</span>
                <span className="profile__role">{getRoleName(user?.role)}</span>
              </div>
            )}

            <HiOutlineChevronDown 
              className={`profile__arrow ${showProfileMenu ? 'profile__arrow--rotated' : ''}`} 
              aria-hidden="true"
            />
          </button>

          {showProfileMenu && (
            <div className="profile__dropdown">
              <div className="profile__header">
              
                <div className="profile__header-info">
                  <h4>{user?.name || 'Foydalanuvchi'}</h4>
                  <p>{user?.email || 'user@edumanage.uz'}</p>
                  <span className="profile__role-badge">{getRoleName(user?.role)}</span>
                </div>
              </div>

              <div className="profile__menu">
                <button onClick={handleProfileClick} className="profile__menu-item">
                  <HiOutlineUserCircle aria-hidden="true" /> 
                  <span>Profil</span>
                </button>
                <button onClick={handleSettingsClick} className="profile__menu-item">
                  <HiOutlineCog aria-hidden="true" /> 
                  <span>Sozlamalar</span>
                </button>
                <button onClick={handleHelpClick} className="profile__menu-item">
                  <HiOutlineQuestionMarkCircle aria-hidden="true" /> 
                  <span>Yordam</span>
                </button>

                <hr className="profile__divider" />

                <button onClick={handleLogout} className="profile__menu-item profile__menu-item--logout">
                  <HiOutlineLogout aria-hidden="true" /> 
                  <span>Chiqish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;