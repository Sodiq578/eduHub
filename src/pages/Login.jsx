import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineCreditCard,
  HiOutlineUsers,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import './Login.css';
import Logo from '../assets/logo.svg';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { login, users, roleLabels, roleColors } = useAuth();

  const roleIcons = {
    admin: <HiOutlineShieldCheck />,
    teacher: <HiOutlineUsers />,
    student: <HiOutlineAcademicCap />,
    parent: <HiOutlineUser />,
    finance: <HiOutlineCreditCard />,
    librarian: <HiOutlineBookOpen />
  };

  const getUsersByRole = (role) => {
    return users.filter(u => u.role === role && u.status === 'active');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        window.location.href = '/';
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 500);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleUserSelect = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
  };

  const roles = [
    { id: 'admin', label: 'Administrator', icon: <HiOutlineShieldCheck />, color: '#10b981', bg: '#f0fdf4' },
    { id: 'teacher', label: 'O\'qituvchi', icon: <HiOutlineUsers />, color: '#3b82f6', bg: '#eff6ff' },
    { id: 'student', label: 'O\'quvchi', icon: <HiOutlineAcademicCap />, color: '#f59e0b', bg: '#fffbeb' },
    { id: 'parent', label: 'Ota-ona', icon: <HiOutlineUser />, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 'finance', label: 'Moliyachi', icon: <HiOutlineCreditCard />, color: '#ef4444', bg: '#fef2f2' },
    { id: 'librarian', label: 'Kutubxonachi', icon: <HiOutlineBookOpen />, color: '#06b6d4', bg: '#ecfeff' }
  ];

  return (
    <div className="login-container">
      <div className="login-grid">
        {/* Chap tomon - Rasm */}
        <div className="login-image">
          <div className="image-content">
            <div className="image-overlay">
              <div className="image-text">
                
                <div className="image-features">
                  <img src={Logo} alt="EduManage Logo" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* O'ng tomon - Forma */}
        <div className="login-form">
          <div className="form-wrapper">
            <div className="form-header">
              <h2>Xush kelibsiz!</h2>
              <p>Tizimga kirish uchun hisobingizni tanlang</p>
            </div>

            {!selectedRole ? (
              <>
                <div className="role-section">
                  <h3>Rolingizni tanlang</h3>
                  <div className="role-list">
                    {roles.map(role => (
                      <div 
                        key={role.id}
                        className="role-item"
                        style={{ backgroundColor: role.bg, borderColor: role.color + '30' }}
                        onClick={() => handleRoleSelect(role.id)}
                      >
                        <div className="role-icon" style={{ color: role.color }}>
                          {role.icon}
                        </div>
                        <div className="role-info">
                          <div className="role-name">{role.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-divider">
                  <span>yoki</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <HiOutlineMail className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="Email manzil" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <HiOutlineLockClosed className="input-icon" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Parol" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Kirish...' : 'Kirish'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <button className="back-btn" onClick={() => setSelectedRole(null)}>
                  ← Barcha rollar
                </button>
                
                <div className="user-section">
                  <h3>{roles.find(r => r.id === selectedRole)?.label}lar</h3>
                  <div className="user-list">
                    {getUsersByRole(selectedRole).map(user => (
                      <div 
                        key={user.id}
                        className="user-item"
                        onClick={() => handleUserSelect(user.email, user.password)}
                      >
                        <div className="user-avatar" style={{ backgroundColor: roleColors[selectedRole] }}>
                          {user.avatar || user.name.charAt(0)}
                        </div>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                          {user.class && <div className="user-detail">📚 {user.class}</div>}
                          {user.subject && <div className="user-detail">📖 {user.subject}</div>}
                          {user.childName && <div className="user-detail">👨‍👧 {user.childName}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {getUsersByRole(selectedRole).length === 0 && (
                    <div className="no-users">
                      <p>Hozircha {roles.find(r => r.id === selectedRole)?.label}lar mavjud emas</p>
                    </div>
                  )}
                </div>

                <div className="form-divider">
                  <span>yoki</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <HiOutlineMail className="input-icon" />
                    <input 
                      type="email" 
                      placeholder="Email manzil" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <HiOutlineLockClosed className="input-icon" />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                                      placeholder="Parol" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? 'Kirish...' : 'Kirish'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;