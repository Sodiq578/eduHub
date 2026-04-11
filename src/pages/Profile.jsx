import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineBell, 
  HiOutlineGlobe, 
  HiOutlineSave,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineCalendar
} from 'react-icons/hi';
import './Profile.css';
// O'CHIRILDI: HiOutlineLock

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: '+998 90 123 4567', 
    role: user?.role || '',
    avatar: user?.avatar || ''
  });
  const [settings, setSettings] = useState({ 
    language: 'uz', 
    notifications: true, 
    emailNotifications: true, 
    theme: 'light' 
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const storedSettings = localStorage.getItem('userSettings');
    if (storedProfile) setProfile(JSON.parse(storedProfile));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const saveProfile = () => { 
    localStorage.setItem('userProfile', JSON.stringify(profile)); 
    alert('Profil saqlandi!'); 
  };

  const saveSettings = () => { 
    localStorage.setItem('userSettings', JSON.stringify(settings)); 
    alert('Sozlamalar saqlandi!'); 
  };

  const handleLogout = () => {
    if (window.confirm('Tizimdan chiqishni xohlaysizmi?')) {
      logout();
      window.location.href = '/';
    }
  };

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
    <div className="profile-page">
      <div className="page-header">
        <h1>Profil sozlamalari</h1>
        <p>Shaxsiy ma'lumotlaringizni boshqaring</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-large">
              {profile.name?.charAt(0) || 'U'}
            </div>
            <button className="change-avatar-btn">O'zgartirish</button>
          </div>
          <div className="profile-info">
            <div className="info-row">
              <HiOutlineUser />
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="info-row">
              <HiOutlineMail />
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="info-row">
              <HiOutlinePhone />
              <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </div>
            <div className="info-row">
              <HiOutlineShieldCheck />
              <input type="text" value={getRoleName(profile.role)} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
            </div>
            <button className="save-btn" onClick={saveProfile}>
              <HiOutlineSave /> Saqlash
            </button>
          </div>
        </div>

        <div className="settings-card">
          <h3>Tizim sozlamalari</h3>
          <div className="setting-item">
            <HiOutlineGlobe />
            <span>Til</span>
            <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}>
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="setting-item">
            <HiOutlineBell />
            <span>Bildirishnomalar</span>
            <label className="switch">
              <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <HiOutlineMail />
            <span>Email bildirishnomalar</span>
            <label className="switch">
              <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <HiOutlineCalendar />
            <span>Kunlik hisobot</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <button className="save-btn" onClick={saveSettings}>
            <HiOutlineSave /> Sozlamalarni saqlash
          </button>

          <div className="logout-section">
            <hr />
            <button className="logout-btn" onClick={handleLogout}>
              <HiOutlineLogout /> Tizimdan chiqish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
