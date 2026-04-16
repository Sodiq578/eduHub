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
  HiOutlineQuestionMarkCircle,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineUsers,
  HiOutlineAcademicCap
} from 'react-icons/hi';
import './Navbar.css';

const Navbar = ({ toggleSidebar, onSearch }) => {
  const { user, logout, hasPermission, getUserMenus } = useAuth();

  const [notificationsCount, setNotificationsCount] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "To'lov muddati", message: "Dekabr oyi to'lovi 10-kungacha", time: "5 daqiqa oldin", read: false, icon: '💰', link: '/payments' },
    { id: 2, title: "Uy vazifasi", message: "Matematika fanidan test topshirish kerak", time: "1 soat oldin", read: false, icon: '📚', link: '/homework' },
    { id: 3, title: "Tadbir", message: "Yil yakuni bayrami 25-dekabr", time: "2 soat oldin", read: true, icon: '🎉', link: '/events' },
  ]);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Barcha sahifalar ro'yxati (qidiruv uchun)
  const allPages = [
    { id: 'dashboard', name: 'Dashboard', icon: <HiOutlineHome />, path: '/dashboard', keywords: ['dashboard', 'bosh sahifa', 'home'] },
    { id: 'students', name: "O'quvchilar", icon: <HiOutlineUsers />, path: '/students', keywords: ['students', 'oquvchilar', 'pupils'] },
    { id: 'teachers', name: "O'qituvchilar", icon: <HiOutlineUser />, path: '/teachers', keywords: ['teachers', 'oqituvchilar', 'staff'] },
    { id: 'classes', name: 'Sinflar', icon: <HiOutlineAcademicCap />, path: '/classes', keywords: ['classes', 'sinflar', 'groups'] },
    { id: 'attendance', name: 'Davomat', icon: <HiOutlineCalendar />, path: '/attendance', keywords: ['attendance', 'davomat', 'kelish'] },
    { id: 'grades', name: 'Baholar', icon: <HiOutlineChartBar />, path: '/grades', keywords: ['grades', 'baholar', 'scores'] },
    { id: 'payments', name: "To'lovlar", icon: <HiOutlineCreditCard />, path: '/payments', keywords: ['payments', 'tolovlar', 'fees'] },
    { id: 'reports', name: 'Hisobotlar', icon: <HiOutlineDocumentText />, path: '/reports', keywords: ['reports', 'hisobotlar', 'analytics'] },
    { id: 'library', name: 'Kutubxona', icon: <HiOutlineBookOpen />, path: '/library', keywords: ['library', 'kutubxona', 'books'] },
  ];

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileSearch(false);
        setShowMobileMenu(false);
      }
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
      if (searchResultsRef.current && !searchResultsRef.current.contains(e.target) && e.target !== searchInputRef.current) {
        setShowSearchResults(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.mobile-menu-trigger')) {
        setShowMobileMenu(false);
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
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        setSearchValue('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const filtered = allPages.filter(page => {
        const matchesName = page.name.toLowerCase().includes(searchValue.toLowerCase());
        const matchesKeywords = page.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchValue.toLowerCase())
        );
        return matchesName || matchesKeywords;
      });
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchValue]);

  const handleLogout = async () => {
    if (window.confirm('Tizimdan chiqishni xohlaysizmi?')) {
      await logout();
      window.location.href = '/';
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    window.location.href = '/profile';
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    window.location.href = '/settings';
  };

  const handleHelpClick = () => {
    setShowProfileMenu(false);
    window.location.href = '/help';
  };

  const handleSearchResultClick = (path) => {
    setSearchValue('');
    setShowSearchResults(false);
    window.location.href = path;
    if (onSearch) onSearch('');
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

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setShowNotifications(false);
    if (notif.link) {
      window.location.href = notif.link;
    }
  };

  const getRoleName = (role) => {
    const roles = {
      'admin': 'Administrator',
      'teacher': "O'qituvchi",
      'student': "O'quvchi",
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

  // Mobil menyu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Mobil search toggle
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <>
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

        {/* Center - Search (Desktop) */}
        {!isMobile && (
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
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
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
              {!searchValue && (
                <kbd className="search-box__shortcut" aria-hidden="true">⌘K</kbd>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results" ref={searchResultsRef}>
                <div className="search-results__header">
                  <span>Qidiruv natijalari ({searchResults.length})</span>
                </div>
                {searchResults.map(result => (
                  <div 
                    key={result.id}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(result.path)}
                  >
                    <div className="search-result-icon">{result.icon}</div>
                    <div className="search-result-info">
                      <div className="search-result-name">{result.name}</div>
                      <div className="search-result-path">{result.path}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchValue && (
              <div className="search-results search-results--empty" ref={searchResultsRef}>
                <div className="search-results__empty">
                  <HiOutlineSearch size={32} />
                  <p>"{searchValue}" bo'yicha hech narsa topilmadi</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Section */}
        <div className="navbar__right">
          {/* Mobile Search Button */}
          {isMobile && (
            <button 
              className="icon-button mobile-search-btn"
              onClick={toggleMobileSearch}
              aria-label="Qidirish"
            >
              <HiOutlineSearch />
            </button>
          )}

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
                        onClick={() => handleNotificationClick(notif)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && handleNotificationClick(notif)}
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
                        window.location.href = '/notifications';
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
              <div className="profile__avatar">
                <div className="profile__avatar-inner">
                  {getInitials(user?.name)}
                </div>
              </div>

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
                  <div className="profile__header-avatar">
                    <div className="profile__header-avatar-inner">
                      {getInitials(user?.name)}
                    </div>
                  </div>
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

          {/* Mobile Menu Button */}
          
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isMobile && showMobileSearch && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-header">
            <button className="mobile-search-back" onClick={toggleMobileSearch}>
              <HiOutlineX />
            </button>
            <div className="mobile-search-input-wrapper">
              <HiOutlineSearch className="mobile-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Qidirish..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                autoFocus
              />
              {searchValue && (
                <button className="mobile-search-clear" onClick={() => setSearchValue('')}>
                  <HiOutlineX />
                </button>
              )}
            </div>
          </div>
          <div className="mobile-search-results">
            {searchValue && searchResults.length > 0 && (
              <>
                <div className="mobile-search-results-header">
                  <span>Qidiruv natijalari ({searchResults.length})</span>
                </div>
                {searchResults.map(result => (
                  <div 
                    key={result.id}
                    className="mobile-search-result-item"
                    onClick={() => handleSearchResultClick(result.path)}
                  >
                    <div className="mobile-search-result-icon">{result.icon}</div>
                    <div className="mobile-search-result-info">
                      <div className="mobile-search-result-name">{result.name}</div>
                      <div className="mobile-search-result-path">{result.path}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {searchValue && searchResults.length === 0 && (
              <div className="mobile-search-empty">
                <HiOutlineSearch size={40} />
                <p>"{searchValue}" bo'yicha hech narsa topilmadi</p>
              </div>
            )}
            {!searchValue && (
              <div className="mobile-search-suggestions">
                <div className="mobile-search-suggestions-header">Takliflar</div>
                {allPages.slice(0, 6).map(page => (
                  <div 
                    key={page.id}
                    className="mobile-search-suggestion-item"
                    onClick={() => handleSearchResultClick(page.path)}
                  >
                    <div className="suggestion-icon">{page.icon}</div>
                    <div className="suggestion-name">{page.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-header">
             
            <button className="mobile-menu-close" onClick={toggleMobileMenu}>
              <HiOutlineX />
            </button>
          </div>
          <div className="mobile-menu-content">
            {getUserMenus().map(menu => (
              <div 
                key={menu.id}
                className="mobile-menu-item"
                onClick={() => {
                  window.location.href = `/${menu.id}`;
                  toggleMobileMenu();
                }}
              >
                <span className="mobile-menu-item-icon">{menu.icon}</span>
                <span className="mobile-menu-item-name">{menu.name}</span>
              </div>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <div className="mobile-menu-user">
              <div className="mobile-menu-user-avatar">
                {getInitials(user?.name)}
              </div>
              <div className="mobile-menu-user-info">
                <div className="mobile-menu-user-name">{user?.name}</div>
                <div className="mobile-menu-user-role">{getRoleName(user?.role)}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="mobile-menu-logout">
              <HiOutlineLogout /> Chiqish
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;