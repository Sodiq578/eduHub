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
  HiOutlineViewBoards
} from 'react-icons/hi';
import './Users.css';

const Users = () => {
  const { users, roles, addUser, updateUser, deleteUser, hasPermission, user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'grid', 'list', 'compact'

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

  const roleLabels = {
    [roles.ADMIN]: 'Administrator',
    [roles.TEACHER]: 'O\'qituvchi',
    [roles.STUDENT]: 'O\'quvchi',
    [roles.PARENT]: 'Ota-ona',
    [roles.FINANCE]: 'Moliyachi',
    [roles.LIBRARIAN]: 'Kutubxonachi'
  };

  const roleColors = {
    [roles.ADMIN]: '#10b981',
    [roles.TEACHER]: '#3b82f6',
    [roles.STUDENT]: '#f59e0b',
    [roles.PARENT]: '#8b5cf6',
    [roles.FINANCE]: '#ef4444',
    [roles.LIBRARIAN]: '#06b6d4'
  };

  // Filtrlash
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
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
      registerDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingUser.name || !editingUser.email || !editingUser.password) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    const userData = {
      ...editingUser,
      avatar: editingUser.name.charAt(0),
      registerDate: editingUser.registerDate || new Date().toISOString().split('T')[0]
    };

    if (editingUser.id) {
      updateUser(userData);
      alert("Foydalanuvchi ma'lumotlari yangilandi!");
    } else {
      addUser(userData);
      alert("Yangi foydalanuvchi qo'shildi!");
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
    const headers = ['ID', 'Ism', 'Email', 'Rol', 'Holat', "Ro'yxatdan o'tgan sana", 'Sinf/Fan'];
    const csvData = filteredUsers.map(u => [
      u.id, u.name, u.email, roleLabels[u.role], 
      u.status === 'active' ? 'Aktiv' : 'Noaktiv',
      u.registerDate || '-',
      u.class || u.subject || '-'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === roles.ADMIN).length,
    teachers: users.filter(u => u.role === roles.TEACHER).length,
    students: users.filter(u => u.role === roles.STUDENT).length,
    parents: users.filter(u => u.role === roles.PARENT).length,
    active: users.filter(u => u.status === 'active').length
  };

  // Render user card based on view mode
  const renderUserCard = (user) => {
    const commonButtons = (
      <div className="user-actions">
        <button className="edit-btn" onClick={() => handleEdit(user)}>
          <HiOutlinePencil /> Tahrirlash
        </button>
        <button className="delete-btn" onClick={() => handleDelete(user.id, user.role, user.name)}>
          <HiOutlineTrash /> O'chirish
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
            <p className="user-email">{user.email}</p>
            <span className="role-badge" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
              {roleLabels[user.role]}
            </span>
            {user.class && <p className="user-extra"><HiOutlineCalendar /> Sinf: {user.class}</p>}
            {user.subject && <p className="user-extra"><HiOutlineShieldCheck /> Fan: {user.subject}</p>}
            {user.phone && <p className="user-extra">📞 {user.phone}</p>}
            <p className="user-register-date"><HiOutlineCalendar /> Qo'shilgan: {user.registerDate}</p>
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
                {user.status === 'active' ? 'Aktiv' : 'Noaktiv'}
              </span>
            </div>
            <p className="user-email">{user.email}</p>
            <div className="list-card-details">
              <span className="role-badge small" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
                {roleLabels[user.role]}
              </span>
              {user.class && <span>Sinf: {user.class}</span>}
              {user.subject && <span>Fan: {user.subject}</span>}
              {user.phone && <span>📞 {user.phone}</span>}
              <span>📅 {user.registerDate}</span>
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
          <p>{user.email}</p>
        </div>
        <div className="compact-role" style={{ background: roleColors[user.role] + '20', color: roleColors[user.role] }}>
          {roleLabels[user.role]}
        </div>
        <div className="compact-actions">
          <button className="compact-edit" onClick={() => handleEdit(user)}>
            <HiOutlinePencil />
          </button>
          <button className="compact-delete" onClick={() => handleDelete(user.id, user.role, user.name)}>
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
          <h1>Foydalanuvchilar</h1>
          <p>Jami {stats.total} ta foydalanuvchi | {stats.active} ta aktiv | {stats.admins} admin | {stats.teachers} o'qituvchi | {stats.students} o'quvchi</p>
        </div>
        <div className="header-buttons">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid ko'rinish"
            >
              <HiOutlineViewGrid />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List ko'rinish"
            >
              <HiOutlineViewList />
            </button>
            <button 
              className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact ko'rinish"
            >
              <HiOutlineViewBoards />
            </button>
          </div>
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlinePlus /> Yangi foydalanuvchi
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">{stats.admins}</div>
          <div className="stat-label">Admin</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value">{stats.teachers}</div>
          <div className="stat-label">O'qituvchi</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value">{stats.students}</div>
          <div className="stat-label">O'quvchi</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value">{stats.parents}</div>
          <div className="stat-label">Ota-ona</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Aktiv</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Ism yoki email bo'yicha qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Barcha rollar</option>
            {Object.entries(roleLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
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

      {/* Modal oyna (avvalgidek qoladi) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser?.id ? 'Foydalanuvchi tahrirlash' : 'Yangi foydalanuvchi'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Ism *</label>
                  <input 
                    type="text" 
                    placeholder="To'liq ism" 
                    value={editingUser?.name || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value, avatar: e.target.value.charAt(0) })} 
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    value={editingUser?.email || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Parol *</label>
                  <input 
                    type="password" 
                    placeholder="Parol" 
                    value={editingUser?.password || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input 
                    type="tel" 
                    placeholder="+998 XX XXX XX XX" 
                    value={editingUser?.phone || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rol *</label>
                  <select 
                    value={editingUser?.role || roles.STUDENT} 
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value, class: '', subject: '' })}
                  >
                    {Object.entries(roleLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingUser?.status || 'active'} 
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Noaktiv</option>
                  </select>
                </div>
              </div>

              {editingUser?.role === roles.STUDENT && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Sinf</label>
                    <input 
                      type="text" 
                      placeholder="Masalan: 10-A" 
                      value={editingUser?.class || ''} 
                      onChange={(e) => setEditingUser({ ...editingUser, class: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Manzil</label>
                    <input 
                      type="text" 
                      placeholder="Yashash manzili" 
                      value={editingUser?.address || ''} 
                      onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} 
                    />
                  </div>
                </div>
              )}

              {editingUser?.role === roles.TEACHER && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Fan</label>
                    <input 
                      type="text" 
                      placeholder="Dars beradigan fani" 
                      value={editingUser?.subject || ''} 
                      onChange={(e) => setEditingUser({ ...editingUser, subject: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Ish staji</label>
                    <input 
                      type="number" 
                      placeholder="Yil" 
                      value={editingUser?.experience || ''} 
                      onChange={(e) => setEditingUser({ ...editingUser, experience: e.target.value })} 
                    />
                  </div>
                </div>
              )}

              {editingUser?.role === roles.PARENT && (
                <div className="form-group">
                  <label>Farzandlari</label>
                  <input 
                    type="text" 
                    placeholder="Farzand ismlari (vergul bilan)" 
                    value={editingUser?.children || ''} 
                    onChange={(e) => setEditingUser({ ...editingUser, children: e.target.value })} 
                  />
                </div>
              )}

              <div className="form-group">
                <label>Manzil</label>
                <textarea 
                  rows="2" 
                  placeholder="To'liq manzil" 
                  value={editingUser?.address || ''} 
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} 
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingUser?.id ? 'Yangilash' : 'Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;