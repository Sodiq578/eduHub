import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineLock, 
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineViewBoards,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineRefresh,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from 'react-icons/hi';
import './Users.css';

const Users = () => {
  const { users, roles, roleLabels, roleColors, addUser, updateUser, deleteUser, hasPermission, user: currentUser, getUserById } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Ruxsatni tekshirish (faqat admin)
  if (!hasPermission('users')) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">🔒</div>
        <h2>Kirish huquqi yo'q</h2>
        <p>Sizga bu sahifani ko'rish uchun ruxsat berilmagan.</p>
        <p className="access-denied-sub">Bu sahifa faqat Administratorlar uchun!</p>
      </div>
    );
  }

  // Filtrlash
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (user.class && user.class.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (user.subject && user.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAdd = () => {
    setEditingUser({ 
      name: '', 
      email: '', 
      password: '', 
      role: roles.STUDENT, 
      status: 'active',
      avatar: '',
      class: '',
      subject: '',
      phone: '',
      address: '',
      experience: '',
      children: '',
      childName: '',
      parentId: '',
      registerDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user, password: '' });
    setShowModal(true);
  };

  const handleView = (user) => {
    // Qo'shimcha ma'lumotlarni yuklash
    const userWithDetails = { ...user };
    if (user.role === roles.PARENT && user.childId) {
      const child = getUserById(user.childId);
      if (child) {
        userWithDetails.childName = child.name;
        userWithDetails.childClass = child.class;
      }
    }
    if (user.role === roles.STUDENT && user.parentId) {
      const parent = getUserById(user.parentId);
      if (parent) {
        userWithDetails.parentName = parent.name;
        userWithDetails.parentPhone = parent.phone;
      }
    }
    setSelectedUser(userWithDetails);
    setShowViewModal(true);
  };

  const handleSave = () => {
    if (!editingUser.name || !editingUser.email) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    if (!editingUser.id && !editingUser.password) {
      alert('Iltimos, parolni kiriting!');
      return;
    }

    const userData = {
      ...editingUser,
      avatar: editingUser.name.charAt(0),
      registerDate: editingUser.registerDate || new Date().toISOString().split('T')[0]
    };

    if (editingUser.id && !editingUser.password) {
      const existingUser = users.find(u => u.id === editingUser.id);
      userData.password = existingUser.password;
    }

    if (editingUser.id) {
      updateUser(userData);
      alert("Foydalanuvchi ma'lumotlari yangilandi!");
    } else {
      addUser(userData);
      alert("Yangi foydalanuvchi qo'shildi! Endi u tizimga kira oladi.");
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const handleDelete = (id, userRole, userName) => {
    if (currentUser?.id === id) {
      alert("O'zingizni o'chira olmaysiz!");
      return;
    }
    if (window.confirm(`${userName} foydalanuvchini o'chirmoqchimisiz?`)) {
      deleteUser(id);
      alert("Foydalanuvchi o'chirildi!");
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Ism', 'Email', 'Rol', 'Holat', "Ro'yxatdan o'tgan sana", 'Telefon', 'Sinf/Fan', 'Manzil'];
    const csvData = filteredUsers.map(u => [
      u.id, u.name, u.email, roleLabels[u.role], 
      u.status === 'active' ? 'Aktiv' : 'Noaktiv',
      u.registerDate || '-',
      u.phone || '-',
      u.class || u.subject || '-',
      u.address || '-'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === roles.ADMIN).length,
    teachers: users.filter(u => u.role === roles.TEACHER).length,
    students: users.filter(u => u.role === roles.STUDENT).length,
    parents: users.filter(u => u.role === roles.PARENT).length,
    finance: users.filter(u => u.role === roles.FINANCE).length,
    librarian: users.filter(u => u.role === roles.LIBRARIAN).length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('uz-UZ');
  };

  // Render user card based on view mode
  const renderUserCard = (user) => {
    const commonButtons = (
      <div className="user-actions">
        <button className="view-btn" onClick={() => handleView(user)} title="Ko'rish">
          <HiOutlineEye />
        </button>
        <button className="edit-btn" onClick={() => handleEdit(user)} title="Tahrirlash">
          <HiOutlinePencil />
        </button>
        <button className="delete-btn" onClick={() => handleDelete(user.id, user.role, user.name)} title="O'chirish">
          <HiOutlineTrash />
        </button>
      </div>
    );

    if (viewMode === 'grid') {
      return (
        <div key={user.id} className="user-card grid-card">
          <div className="user-card-header" style={{ background: roleColors[user.role] + '15' }}>
            <div className="user-avatar" style={{ background: roleColors[user.role] }}>
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className={`user-status-dot ${user.status}`}></div>
          </div>
          <div className="user-card-body">
            <h3>{user.name}</h3>
            <p className="user-email"><HiOutlineMail /> {user.email}</p>
            <span className="role-badge" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
              {roleLabels[user.role]}
            </span>
            {user.class && <p className="user-extra"><HiOutlineAcademicCap /> Sinf: {user.class}</p>}
            {user.subject && <p className="user-extra"><HiOutlineBriefcase /> Fan: {user.subject}</p>}
            {user.phone && <p className="user-extra"><HiOutlinePhone /> {user.phone}</p>}
            <p className="user-register-date"><HiOutlineCalendar /> Qo'shilgan: {formatDate(user.registerDate)}</p>
          </div>
          <div className="user-card-footer">
            {commonButtons}
          </div>
        </div>
      );
    }

    if (viewMode === 'list') {
      return (
        <div key={user.id} className="user-card list-card">
          <div className="list-card-avatar">
            <div className="user-avatar small-avatar" style={{ background: roleColors[user.role] }}>
              {user.avatar || user.name.charAt(0)}
            </div>
          </div>
          <div className="list-card-info">
            <div className="list-card-header">
              <h3>{user.name}</h3>
              <span className={`status-badge ${user.status}`}>
                {user.status === 'active' ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                {user.status === 'active' ? 'Aktiv' : 'Noaktiv'}
              </span>
            </div>
            <p className="user-email"><HiOutlineMail /> {user.email}</p>
            <div className="list-card-details">
              <span className="role-badge small" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
                {roleLabels[user.role]}
              </span>
              {user.class && <span><HiOutlineAcademicCap /> {user.class}</span>}
              {user.subject && <span><HiOutlineBriefcase /> {user.subject}</span>}
              {user.phone && <span><HiOutlinePhone /> {user.phone}</span>}
              <span><HiOutlineCalendar /> {formatDate(user.registerDate)}</span>
            </div>
          </div>
          <div className="list-card-actions">
            {commonButtons}
          </div>
        </div>
      );
    }

    // Compact mode
    return (
      <div key={user.id} className="user-card compact-card">
        <div className="compact-avatar" style={{ background: roleColors[user.role] }}>
          {user.avatar || user.name.charAt(0)}
        </div>
        <div className="compact-info">
          <h4>{user.name}</h4>
          <p><HiOutlineMail /> {user.email}</p>
          {user.class && <p className="compact-detail"><HiOutlineAcademicCap /> {user.class}</p>}
          {user.subject && <p className="compact-detail"><HiOutlineBriefcase /> {user.subject}</p>}
        </div>
        <div className="compact-role" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
          {roleLabels[user.role]}
        </div>
        <div className="compact-actions">
          <button className="compact-view" onClick={() => handleView(user)} title="Ko'rish">
            <HiOutlineEye />
          </button>
          <button className="compact-edit" onClick={() => handleEdit(user)} title="Tahrirlash">
            <HiOutlinePencil />
          </button>
          <button className="compact-delete" onClick={() => handleDelete(user.id, user.role, user.name)} title="O'chirish">
            <HiOutlineTrash />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1><HiOutlineUsers /> Foydalanuvchilar</h1>
          <p>Jami {stats.total} ta foydalanuvchi | {stats.active} ta aktiv | 
          {stats.admins} admin | {stats.teachers} o'qituvchi | 
          {stats.students} o'quvchi | {stats.parents} ota-ona</p>
        </div>
        <div className="header-buttons">
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Grid ko'rinish">
              <HiOutlineViewGrid />
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List ko'rinish">
              <HiOutlineViewList />
            </button>
            <button className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`} onClick={() => setViewMode('compact')} title="Compact ko'rinish">
              <HiOutlineViewBoards />
            </button>
          </div>
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-export" onClick={resetFilters}>
            <HiOutlineRefresh /> Filtrni tozalash
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlinePlus /> Yangi foydalanuvchi
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="users-stats">
        <div className="stat-card"><div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}><HiOutlineUsers /></div><div className="stat-info"><div className="stat-value">{stats.total}</div><div className="stat-label">Jami</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}><HiOutlineShieldCheck /></div><div className="stat-info"><div className="stat-value">{stats.admins}</div><div className="stat-label">Admin</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}><HiOutlineBriefcase /></div><div className="stat-info"><div className="stat-value">{stats.teachers}</div><div className="stat-label">O'qituvchi</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}><HiOutlineAcademicCap /></div><div className="stat-info"><div className="stat-value">{stats.students}</div><div className="stat-label">O'quvchi</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}><HiOutlineUsers /></div><div className="stat-info"><div className="stat-value">{stats.parents}</div><div className="stat-label">Ota-ona</div></div></div>
        <div className="stat-card"><div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}><HiOutlineCheckCircle /></div><div className="stat-info"><div className="stat-value">{stats.active}</div><div className="stat-label">Aktiv</div></div></div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input type="text" placeholder="Ism, email, sinf yoki fan bo'yicha qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Barcha rollar</option>
            {Object.entries(roleLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Noaktiv</option>
          </select>
        </div>
      </div>

      {/* Foydalanuvchilar konteyneri */}
      <div className={`users-container ${viewMode}`}>
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <HiOutlineUser size={48} />
            <p>Hech qanday foydalanuvchi topilmadi</p>
            <button className="btn-primary" onClick={handleAdd}>Yangi foydalanuvchi qo'shish</button>
          </div>
        ) : (
          filteredUsers.map(user => renderUserCard(user))
        )}
      </div>

      {/* KO'RISH MODAL - to'liq ma'lumotlar bilan */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineUser /> Foydalanuvchi ma'lumotlari</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="user-profile-view">
                <div className="profile-header" style={{ background: roleColors[selectedUser.role] + '15' }}>
                  <div className="profile-avatar" style={{ background: roleColors[selectedUser.role] }}>{selectedUser.avatar || selectedUser.name.charAt(0)}</div>
                  <div className="profile-info">
                    <h3>{selectedUser.name}</h3>
                    <span className={`status-badge ${selectedUser.status}`}>{selectedUser.status === 'active' ? 'Aktiv' : 'Noaktiv'}</span>
                    <span className="role-badge" style={{ background: roleColors[selectedUser.role] + '20', color: roleColors[selectedUser.role] }}>{roleLabels[selectedUser.role]}</span>
                  </div>
                </div>
                <div className="profile-details">
                  <div className="detail-row"><span className="detail-label"><HiOutlineMail /> Email:</span><span className="detail-value">{selectedUser.email}</span></div>
                  {selectedUser.phone && <div className="detail-row"><span className="detail-label"><HiOutlinePhone /> Telefon:</span><span className="detail-value">{selectedUser.phone}</span></div>}
                  {selectedUser.class && <div className="detail-row"><span className="detail-label"><HiOutlineAcademicCap /> Sinf:</span><span className="detail-value">{selectedUser.class}</span></div>}
                  {selectedUser.subject && <div className="detail-row"><span className="detail-label"><HiOutlineBriefcase /> Fan:</span><span className="detail-value">{selectedUser.subject}</span></div>}
                  {selectedUser.experience && <div className="detail-row"><span className="detail-label">📅 Ish staji:</span><span className="detail-value">{selectedUser.experience} yil</span></div>}
                  {selectedUser.parentName && <div className="detail-row"><span className="detail-label">👨‍👩‍👧 Ota-ona:</span><span className="detail-value">{selectedUser.parentName} ({selectedUser.parentPhone})</span></div>}
                  {selectedUser.childName && <div className="detail-row"><span className="detail-label">👨‍👧 Farzand:</span><span className="detail-value">{selectedUser.childName} ({selectedUser.childClass})</span></div>}
                  {selectedUser.children && <div className="detail-row"><span className="detail-label">👨‍👧‍👦 Farzandlar:</span><span className="detail-value">{selectedUser.children}</span></div>}
                  {selectedUser.address && <div className="detail-row"><span className="detail-label"><HiOutlineLocationMarker /> Manzil:</span><span className="detail-value">{selectedUser.address}</span></div>}
                  <div className="detail-row"><span className="detail-label"><HiOutlineCalendar /> Ro'yxatdan o'tgan:</span><span className="detail-value">{formatDate(selectedUser.registerDate)}</span></div>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => { setShowViewModal(false); handleEdit(selectedUser); }}><HiOutlinePencil /> Tahrirlash</button>
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* QO'SHISH/TAHRIRLASH MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser?.id ? <HiOutlinePencil /> : <HiOutlinePlus />} {editingUser?.id ? 'Foydalanuvchi tahrirlash' : 'Yangi foydalanuvchi'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Ism *</label><input type="text" placeholder="To'liq ism" value={editingUser?.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value, avatar: e.target.value.charAt(0) })} /></div>
                <div className="form-group"><label>Email *</label><input type="email" placeholder="email@example.com" value={editingUser?.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Parol {!editingUser?.id && '*'}</label><div className="password-input-wrapper"><input type={showPassword ? 'text' : 'password'} placeholder={editingUser?.id ? "Yangi parol (ixtiyoriy)" : "Parol"} value={editingUser?.password || ''} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}</button></div></div>
                <div className="form-group"><label>Telefon</label><input type="tel" placeholder="+998 XX XXX XX XX" value={editingUser?.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Rol *</label><select value={editingUser?.role || roles.STUDENT} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value, class: '', subject: '' })}>{Object.entries(roleLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}</select></div>
                <div className="form-group"><label>Holat</label><select value={editingUser?.status || 'active'} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}><option value="active">Aktiv</option><option value="inactive">Noaktiv</option></select></div>
              </div>
              {editingUser?.role === roles.STUDENT && (<div className="form-row"><div className="form-group"><label>Sinf</label><input type="text" placeholder="Masalan: 10-A" value={editingUser?.class || ''} onChange={(e) => setEditingUser({ ...editingUser, class: e.target.value })} /></div><div className="form-group"><label>Ota-ona ID</label><input type="number" placeholder="Ota-onasining ID raqami" value={editingUser?.parentId || ''} onChange={(e) => setEditingUser({ ...editingUser, parentId: parseInt(e.target.value) })} /></div></div>)}
              {editingUser?.role === roles.TEACHER && (<div className="form-row"><div className="form-group"><label>Fan</label><input type="text" placeholder="Dars beradigan fani" value={editingUser?.subject || ''} onChange={(e) => setEditingUser({ ...editingUser, subject: e.target.value })} /></div><div className="form-group"><label>Ish staji</label><input type="number" placeholder="Yil" value={editingUser?.experience || ''} onChange={(e) => setEditingUser({ ...editingUser, experience: e.target.value })} /></div></div>)}
              {editingUser?.role === roles.PARENT && (<div className="form-group"><label>Farzand ID</label><input type="number" placeholder="Farzandining ID raqami" value={editingUser?.childId || ''} onChange={(e) => setEditingUser({ ...editingUser, childId: parseInt(e.target.value) })} /></div>)}
              <div className="form-group"><label>Manzil</label><textarea rows="2" placeholder="To'liq manzil" value={editingUser?.address || ''} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} /></div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>{editingUser?.id ? 'Yangilash' : 'Qo\'shish'}</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;