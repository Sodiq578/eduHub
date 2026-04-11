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
  HiOutlineMail
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

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Tizimdan chiqishni xohlaysizmi?')) {
      logout();
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    window.location.hash = '#profile';
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    window.location.hash = '#settings';
  };

  const markAllAsRead = () => {
    setNotificationsCount(0);
    setShowNotifications(false);
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'O\'qituvchi';
      case 'student': return 'O\'quvchi';
      case 'parent': return 'Ota-ona';
      case 'finance': return 'Moliyachi';
      case 'librarian': return 'Kutubxonachi';
      default: return 'Foydalanuvchi';
    }
  };

  const notifications = [
    { id: 1, title: "To'lov muddati", message: "Dekabr oyi to'lovi 10-kungacha", time: "5 daqiqa oldin", read: false },
    { id: 2, title: "Uy vazifasi", message: "Matematika fanidan test topshirish kerak", time: "1 soat oldin", read: false },
    { id: 3, title: "Tadbir", message: "Yil yakuni bayrami 25-dekabr", time: "2 soat oldin", read: true },
  ];

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={toggleSidebar} aria-label="Menyu">
          <HiOutlineMenuAlt2 />
        </button>

        {!isMobile && (
          <div className="navbar__logo">
            <span className="navbar__logo-glow"></span>
            <span className="navbar__logo-icon">🌟</span>
            <span className="navbar__logo-text">Edu<span className="navbar__logo-highlight">Manage</span></span>
          </div>
        )}
      </div>

      {/* Center - Search */}
      <div className={`navbar__center ${searchFocused ? 'navbar__center--focused' : ''}`}>
        <div className="search-box">
          <HiOutlineSearch className="search-box__icon" />
          <input
            type="text"
            className="search-box__input"
            placeholder="Qidirish... (⌘K)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchValue && (
            <button className="search-box__clear" onClick={() => setSearchValue('')}>
              <HiOutlineX />
            </button>
          )}
          {!searchValue && !isMobile && <kbd className="search-box__shortcut">⌘K</kbd>}
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar__right">
        {/* Notifications */}
        <div className="notifications" ref={notificationsRef}>
          <button 
            className="icon-button notifications__trigger"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <HiOutlineBell className="icon-button__icon" />
            {notificationsCount > 0 && (
              <span className="notifications__badge">{notificationsCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications__dropdown">
              <div className="notifications__header">
                <h3>Bildirishnomalar</h3>
                <button className="notifications__mark-all" onClick={markAllAsRead}>
                  Hammasini o‘qildi
                </button>
              </div>

              <div className="notifications__list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${!notif.read ? 'notification-item--unread' : ''}`}>
                    <div className="notification-item__icon">
                      {notif.title.includes("To'lov") ? '💰' : notif.title.includes("Uy vazifasi") ? '📚' : '🎉'}
                    </div>
                    <div className="notification-item__content">
                      <div className="notification-item__title">{notif.title}</div>
                      <div className="notification-item__message">{notif.message}</div>
                      <div className="notification-item__time">{notif.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notifications__footer">
                <button className="notifications__view-all">Barchasini ko‘rish</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile" ref={profileRef}>
          <div className="profile__trigger" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="profile__avatar">
              <img 
                src={`https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(user?.name || 'User')}&size=40`} 
                alt="Avatar" 
              />
              <div className="profile__avatar-ring"></div>
            </div>

            {!isMobile && (
              <div className="profile__info">
                <span className="profile__name">{user?.name || 'Foydalanuvchi'}</span>
                <span className="profile__role">{getRoleName(user?.role)}</span>
              </div>
            )}

            <HiOutlineChevronDown className={`profile__arrow ${showProfileMenu ? 'profile__arrow--rotated' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="profile__dropdown">
              <div className="profile__header">
                <div className="profile__header-avatar">
                  <img 
                    src={`https://ui-avatars.com/api/?background=10b981&color=fff&name=${encodeURIComponent(user?.name || 'User')}&size=56`} 
                    alt="Avatar" 
                  />
                </div>
                <div className="profile__header-info">
                  <h4>{user?.name || 'Foydalanuvchi'}</h4>
                  <p>{user?.email || 'user@edumanage.uz'}</p>
                  <span className="profile__role-badge">{getRoleName(user?.role)}</span>
                </div>
              </div>

              <div className="profile__menu">
                <button onClick={handleProfileClick} className="profile__menu-item">
                  <HiOutlineUserCircle /> Profil
                </button>
                <button onClick={handleSettingsClick} className="profile__menu-item">
                  <HiOutlineCog /> Sozlamalar
                </button>
                <button className="profile__menu-item">
                  <HiOutlineMail /> Yordam
                </button>

                <hr className="profile__divider" />

                <button onClick={handleLogout} className="profile__menu-item profile__menu-item--logout">
                  <HiOutlineLogout /> Chiqish
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