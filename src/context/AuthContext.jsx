import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const roles = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
    PARENT: 'parent',
    FINANCE: 'finance',
    LIBRARIAN: 'librarian'
  };

  const roleMenus = {
    [roles.ADMIN]: [
      { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineViewGrid' },
      { id: 'students', name: 'O\'quvchilar', icon: 'HiOutlineUsers' },
      { id: 'teachers', name: 'O\'qituvchilar', icon: 'HiOutlineUserGroup' },
      { id: 'classes', name: 'Sinflar', icon: 'HiOutlineAcademicCap' },
      { id: 'subjects', name: 'Fanlar', icon: 'HiOutlineBookOpen' },
      { id: 'attendance', name: 'Davomat', icon: 'HiOutlineCalendar' },
      { id: 'grades', name: 'Baholar', icon: 'HiOutlineStar' },
      { id: 'exams', name: 'Imtihonlar', icon: 'HiOutlineDocumentText' },
      { id: 'homework', name: 'Uy vazifalari', icon: 'HiOutlineClipboardList' },
      { id: 'schedule', name: 'Dars jadvali', icon: 'HiOutlineTable' },
      { id: 'messages', name: 'Xabarlar', icon: 'HiOutlineChat' },
      { id: 'announcements', name: 'E\'lonlar', icon: 'HiOutlineSpeakerphone' },
      { id: 'payments', name: 'To\'lovlar', icon: 'HiOutlineCreditCard' },
      { id: 'reports', name: 'Hisobotlar', icon: 'HiOutlineChartBar' },
      { id: 'users', name: 'Foydalanuvchilar', icon: 'HiOutlineUserGroup' },
      { id: 'library', name: 'Kutubxona', icon: 'HiOutlineBookOpen' },
      { id: 'cafeteria', name: 'Ovqatlanish', icon: 'HiOutlineCreditCard' },
      { id: 'health', name: 'Sog\'liq', icon: 'HiOutlineHeart' },
      { id: 'transport', name: 'Transport', icon: 'HiOutlineTruck' },
      { id: 'surveys', name: 'So\'rovnomalar', icon: 'HiOutlineChartBar' },
      { id: 'notifications', name: 'Ogohlantirishlar', icon: 'HiOutlineBell' },
      { id: 'staff', name: 'Xodimlar', icon: 'HiOutlineBriefcase' },
      { id: 'alumni', name: 'Bitiruvchilar', icon: 'HiOutlineAcademicCap' },
      { id: 'discipline', name: 'Mukofot/Intizom', icon: 'HiOutlineStar' },
      { id: 'analytics', name: 'Analitika', icon: 'HiOutlineTrendingUp' },
      { id: 'livechat', name: 'Live Chat', icon: 'HiOutlineChat' },
      { id: 'admissions', name: 'Qabul', icon: 'HiOutlineClipboardList' },
      { id: 'parents', name: 'Ota-onalar', icon: 'HiOutlineUsers' },
      { id: 'events', name: 'Tadbirlar', icon: 'HiOutlineCalendar' },
      { id: 'documents', name: 'Hujjatlar', icon: 'HiOutlineDocumentText' },
      { id: 'payroll', name: 'Oyliklar', icon: 'HiOutlineCreditCard' },
      { id: 'inventory', name: 'Inventar', icon: 'HiOutlineCube' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ],
    [roles.TEACHER]: [
      { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineViewGrid' },
      { id: 'students', name: 'O\'quvchilar', icon: 'HiOutlineUsers' },
      { id: 'attendance', name: 'Davomat', icon: 'HiOutlineCalendar' },
      { id: 'grades', name: 'Baholar', icon: 'HiOutlineStar' },
      { id: 'exams', name: 'Imtihonlar', icon: 'HiOutlineDocumentText' },
      { id: 'homework', name: 'Uy vazifalari', icon: 'HiOutlineClipboardList' },
      { id: 'schedule', name: 'Dars jadvali', icon: 'HiOutlineTable' },
      { id: 'messages', name: 'Xabarlar', icon: 'HiOutlineChat' },
      { id: 'announcements', name: 'E\'lonlar', icon: 'HiOutlineSpeakerphone' },
      { id: 'cafeteria', name: 'Ovqatlanish', icon: 'HiOutlineCreditCard' },
      { id: 'health', name: 'Sog\'liq', icon: 'HiOutlineHeart' },
      { id: 'discipline', name: 'Mukofot/Intizom', icon: 'HiOutlineStar' },
      { id: 'analytics', name: 'Analitika', icon: 'HiOutlineTrendingUp' },
      { id: 'livechat', name: 'Live Chat', icon: 'HiOutlineChat' },
      { id: 'events', name: 'Tadbirlar', icon: 'HiOutlineCalendar' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ],
    [roles.STUDENT]: [
      { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineViewGrid' },
      { id: 'grades', name: 'Baholarim', icon: 'HiOutlineStar' },
      { id: 'attendance', name: 'Davomatim', icon: 'HiOutlineCalendar' },
      { id: 'homework', name: 'Uy vazifalari', icon: 'HiOutlineClipboardList' },
      { id: 'schedule', name: 'Dars jadvali', icon: 'HiOutlineTable' },
      { id: 'library', name: 'Kutubxona', icon: 'HiOutlineBookOpen' },  // ✅ O'quvchi uchun kutubxona qo'shildi
      { id: 'attendance', name: 'Davomat', icon: 'HiOutlineCalendar' },

      { id: 'cafeteria', name: 'Ovqatlanish', icon: 'HiOutlineCreditCard' },
      { id: 'notifications', name: 'Ogohlantirishlar', icon: 'HiOutlineBell' },
      { id: 'messages', name: 'Xabarlar', icon: 'HiOutlineChat' },
      { id: 'announcements', name: 'E\'lonlar', icon: 'HiOutlineSpeakerphone' },
      { id: 'events', name: 'Tadbirlar', icon: 'HiOutlineCalendar' },
      { id: 'livechat', name: 'Live Chat', icon: 'HiOutlineChat' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ],
    [roles.PARENT]: [
      { id: 'dashboard', name: 'Farzandim', icon: 'HiOutlineUser' },
      { id: 'grades', name: 'Baholar', icon: 'HiOutlineStar' },
      { id: 'attendance', name: 'Davomat', icon: 'HiOutlineCalendar' },
      { id: 'payments', name: 'To\'lovlar', icon: 'HiOutlineCreditCard' },
      { id: 'cafeteria', name: 'Ovqatlanish', icon: 'HiOutlineCreditCard' },
      { id: 'notifications', name: 'Ogohlantirishlar', icon: 'HiOutlineBell' },
      { id: 'messages', name: 'Xabarlar', icon: 'HiOutlineChat' },
      { id: 'announcements', name: 'E\'lonlar', icon: 'HiOutlineSpeakerphone' },
      { id: 'events', name: 'Tadbirlar', icon: 'HiOutlineCalendar' },
      { id: 'livechat', name: 'Live Chat', icon: 'HiOutlineChat' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ],
    [roles.FINANCE]: [
      { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineViewGrid' },
      { id: 'payments', name: 'To\'lovlar', icon: 'HiOutlineCreditCard' },
      { id: 'reports', name: 'Hisobotlar', icon: 'HiOutlineChartBar' },
      { id: 'payroll', name: 'Oyliklar', icon: 'HiOutlineCreditCard' },
      { id: 'cafeteria', name: 'Ovqatlanish', icon: 'HiOutlineCreditCard' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ],
    [roles.LIBRARIAN]: [
      { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineViewGrid' },
      { id: 'library', name: 'Kutubxona', icon: 'HiOutlineBookOpen' },
      { id: 'profile', name: 'Profil', icon: 'HiOutlineUserCircle' }
    ]
  };

  const pagePermissions = {
    [roles.ADMIN]: {
      dashboard: true,
      students: true,
      teachers: true,
      classes: true,
      subjects: true,
      attendance: true,
      grades: true,
      exams: true,
      homework: true,
      schedule: true,
      messages: true,
      announcements: true,
      payments: true,
      reports: true,
      users: true,
      library: true,
      cafeteria: true,
      health: true,
      transport: true,
      surveys: true,
      notifications: true,
      staff: true,
      alumni: true,
      discipline: true,
      analytics: true,
      livechat: true,
      admissions: true,
      parents: true,
      events: true,
      documents: true,
      payroll: true,
      inventory: true,
      profile: true
    },
    [roles.TEACHER]: {
      dashboard: true,
      students: true,
      attendance: true,
      grades: true,
      exams: true,
      homework: true,
      schedule: true,
      messages: true,
      announcements: true,
      cafeteria: true,
      health: true,
      discipline: true,
      analytics: true,
      livechat: true,
      events: true,
      profile: true
    },
    [roles.STUDENT]: {
      dashboard: true,
      grades: true,
      attendance: true,
      homework: true,
      schedule: true,
      library: true,  // ✅ O'quvchi kutubxonani ko'ra oladi
      cafeteria: true,
      notifications: true,
      messages: true,
      announcements: true,
      events: true,
      livechat: true,
      profile: true
    },
    [roles.PARENT]: {
      dashboard: true,
      grades: true,
      attendance: true,
      payments: true,
      cafeteria: true,
      notifications: true,
      messages: true,
      announcements: true,
      events: true,
      livechat: true,
      profile: true
    },
    [roles.FINANCE]: {
      dashboard: true,
      payments: true,
      reports: true,
      payroll: true,
      cafeteria: true,
      profile: true
    },
    [roles.LIBRARIAN]: {
      dashboard: true,
      library: true,
      profile: true
    }
  };

  const initializeUsers = () => {
    return [
      { id: 1, name: 'Admin User', email: 'admin@edumanage.com', password: 'admin123', role: roles.ADMIN, avatar: 'A', status: 'active' },
      { id: 2, name: 'Shahzoda Ahmedova', email: 'teacher@edumanage.com', password: 'teacher123', role: roles.TEACHER, avatar: 'S', status: 'active', subject: 'Matematika' },
      { id: 3, name: 'Ali Valiyev', email: 'student@edumanage.com', password: 'student123', role: roles.STUDENT, avatar: 'A', status: 'active', class: '10-A', parentId: 4 },
      { id: 4, name: 'Vali Valiyev', email: 'parent@edumanage.com', password: 'parent123', role: roles.PARENT, avatar: 'V', status: 'active', childId: 3 },
      { id: 5, name: 'Finance Officer', email: 'finance@edumanage.com', password: 'finance123', role: roles.FINANCE, avatar: 'F', status: 'active' },
      { id: 6, name: 'Librarian', email: 'librarian@edumanage.com', password: 'lib123', role: roles.LIBRARIAN, avatar: 'L', status: 'active' }
    ];
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem('system_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers = initializeUsers();
      setUsers(defaultUsers);
      localStorage.setItem('system_users', JSON.stringify(defaultUsers));
    }

    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Email yoki parol noto\'g\'ri!' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('current_user');
  };

  const hasPermission = (pageId) => {
    if (!user) return false;
    return pagePermissions[user.role]?.[pageId] || false;
  };

  const getUserMenus = () => {
    if (!user) return [];
    return roleMenus[user.role] || [];
  };

  const addUser = (newUser) => {
    const userWithId = { ...newUser, id: Date.now() };
    const updatedUsers = [...users, userWithId];
    setUsers(updatedUsers);
    localStorage.setItem('system_users', JSON.stringify(updatedUsers));
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('system_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('system_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAuthenticated,
      roles,
      login,
      logout,
      hasPermission,
      getUserMenus,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};