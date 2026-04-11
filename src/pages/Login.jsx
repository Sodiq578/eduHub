import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

  const demoAccounts = [
    { role: 'Administrator', email: 'admin@edumanage.com', password: 'admin123', color: '#10b981' },
    { role: 'O\'qituvchi', email: 'teacher@edumanage.com', password: 'teacher123', color: '#3b82f6' },
    { role: 'O\'quvchi', email: 'student@edumanage.com', password: 'student123', color: '#f59e0b' },
    { role: 'Ota-ona', email: 'parent@edumanage.com', password: 'parent123', color: '#8b5cf6' },
    { role: 'Moliyachi', email: 'finance@edumanage.com', password: 'finance123', color: '#ef4444' },
    { role: 'Kutubxonachi', email: 'librarian@edumanage.com', password: 'lib123', color: '#06b6d4' }
  ];

  return (
    <div className="login-container">
      <div className="login-bg"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">📚 EduManage</div>
          <h2>Xush kelibsiz!</h2>
          <p>Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
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

        <div className="demo-accounts">
          <p>Demo hisoblar:</p>
          <div className="demo-grid">
            {demoAccounts.map((acc, idx) => (
              <div key={idx} className="demo-item" onClick={() => { setEmail(acc.email); setPassword(acc.password); }}>
                <div className="demo-dot" style={{ background: acc.color }}></div>
                <span>{acc.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;