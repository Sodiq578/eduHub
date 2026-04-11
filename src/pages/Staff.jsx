import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, 
  HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar,
  HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineX,
  HiOutlineFilter, HiOutlineDownload, HiOutlineUserAdd
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Staff.css';

const Staff = () => {
  const { user, roles } = useAuth();
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const isAdmin = user?.role === roles.ADMIN;

  const departments = [
    'Direktor', 'Direktor o\'rinbosari', 'Buxgalteriya', 'Kutubxona', 
    'Kantina', 'Transport', 'Xavfsizlik', 'Texnik xodim', 'Tibbiyot xodimi'
  ];

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
    const stored = localStorage.getItem('staff');
    if (stored) {
      setStaff(JSON.parse(stored));
    } else {
      const defaultStaff = [
        { id: 1, name: 'Alisher Karimov', position: 'Direktor', department: 'Direktor', phone: '+998 90 111 2233', email: 'alisher@edumanage.com', hireDate: '2020-01-15', salary: 5000000, address: 'Toshkent sh.', status: 'active', avatar: 'A' },
        { id: 2, name: 'Dilbar To\'xtayeva', position: 'Bosh buxgalter', department: 'Buxgalteriya', phone: '+998 91 222 3344', email: 'dilbar@edumanage.com', hireDate: '2018-03-10', salary: 4000000, address: 'Toshkent sh.', status: 'active', avatar: 'D' },
        { id: 3, name: 'Rustam Ahmedov', position: 'Xavfsizlik xodimi', department: 'Xavfsizlik', phone: '+998 93 333 4455', email: 'rustam@edumanage.com', hireDate: '2021-06-20', salary: 2500000, address: 'Toshkent sh.', status: 'active', avatar: 'R' },
      ];
      setStaff(defaultStaff);
      localStorage.setItem('staff', JSON.stringify(defaultStaff));
    }
  };

  const saveStaff = (updatedStaff) => {
    setStaff(updatedStaff);
    localStorage.setItem('staff', JSON.stringify(updatedStaff));
  };

  const handleAdd = () => {
    setEditingStaff({ name: '', position: '', department: '', phone: '', email: '', hireDate: '', salary: 0, address: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingStaff({ ...item });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingStaff.name || !editingStaff.position || !editingStaff.department) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedStaff;
    if (editingStaff.id) {
      updatedStaff = staff.map(s => s.id === editingStaff.id ? editingStaff : s);
      alert("Xodim ma'lumotlari yangilandi!");
    } else {
      const newStaff = { ...editingStaff, id: Date.now(), avatar: editingStaff.name.charAt(0) };
      updatedStaff = [newStaff, ...staff];
      alert("Yangi xodim qo'shildi!");
    }
    saveStaff(updatedStaff);
    setShowModal(false);
    setEditingStaff(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Xodimni o\'chirmoqchimisiz?')) {
      saveStaff(staff.filter(s => s.id !== id));
      alert("Xodim o'chirildi!");
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === '' || s.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const totalSalary = staff.reduce((sum, s) => sum + (s.salary || 0), 0);

  const exportToCSV = () => {
    const headers = ['ID', 'Ism', 'Lavozim', "Bo'lim", 'Telefon', 'Email', 'Ishga qabul qilingan', 'Maosh', 'Manzil', 'Holat'];
    const csvData = staff.map(s => [s.id, s.name, s.position, s.department, s.phone, s.email, s.hireDate, s.salary, s.address, s.status]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="staff-page">
      <div className="page-header">
        <div><h1>Xodimlar</h1><p>Jami {totalStaff} nafar xodim | {activeStaff} ta aktiv | Oylik fond: {totalSalary.toLocaleString()} so'm</p></div>
        {isAdmin && <button className="btn-primary" onClick={handleAdd}><HiOutlineUserAdd /> Yangi xodim</button>}
      </div>

      <div className="staff-stats">
        <div className="stat-card"><div className="stat-value">{totalStaff}</div><div className="stat-label">Jami xodimlar</div></div>
        <div className="stat-card"><div className="stat-value">{activeStaff}</div><div className="stat-label">Aktiv</div></div>
        <div className="stat-card"><div className="stat-value">{staff.filter(s => s.department === 'Direktor').length}</div><div className="stat-label">Direktorlar</div></div>
        <div className="stat-card"><div className="stat-value">{staff.filter(s => s.department === 'Buxgalteriya').length}</div><div className="stat-label">Buxgalteriya</div></div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper"><HiOutlineSearch /><input type="text" placeholder="Qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        <select className="filter-select" value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">Barcha bo'limlar</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button className="btn-export" onClick={exportToCSV}><HiOutlineDownload /> Hisobot</button>
      </div>

      <div className="staff-grid">
        {filteredStaff.map(s => (
          <div key={s.id} className="staff-card">
            <div className="staff-avatar">{s.avatar}</div>
            <div className="staff-info">
              <h3>{s.name}</h3>
              <p className="staff-position">{s.position}</p>
              <p className="staff-dept">{s.department}</p>
              <div className="staff-details"><HiOutlinePhone /> {s.phone}</div>
              <div className="staff-details"><HiOutlineMail /> {s.email}</div>
              <div className="staff-details"><HiOutlineCalendar /> Qabul: {s.hireDate}</div>
              <div className="staff-salary">💰 {s.salary?.toLocaleString()} so'm</div>
            </div>
            {isAdmin && (
              <div className="staff-actions">
                <button className="edit-btn" onClick={() => handleEdit(s)}><HiOutlinePencil /></button>
                <button className="delete-btn" onClick={() => handleDelete(s.id)}><HiOutlineTrash /></button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{editingStaff?.id ? 'Xodim tahrirlash' : 'Yangi xodim'}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div>
            <div className="modal-body">
              <div className="form-row"><div className="form-group"><label>Ism *</label><input type="text" value={editingStaff?.name || ''} onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })} /></div>
              <div className="form-group"><label>Lavozim *</label><input type="text" value={editingStaff?.position || ''} onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })} /></div></div>
              <div className="form-row"><div className="form-group"><label>Bo'lim *</label><select value={editingStaff?.department || ''} onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}><option value="">Tanlang</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              <div className="form-group"><label>Telefon</label><input type="tel" value={editingStaff?.phone || ''} onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })} /></div></div>
              <div className="form-row"><div className="form-group"><label>Email</label><input type="email" value={editingStaff?.email || ''} onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })} /></div>
              <div className="form-group"><label>Ishga qabul qilingan</label><input type="date" value={editingStaff?.hireDate || ''} onChange={(e) => setEditingStaff({ ...editingStaff, hireDate: e.target.value })} /></div></div>
              <div className="form-row"><div className="form-group"><label>Maosh (so'm)</label><input type="number" value={editingStaff?.salary || 0} onChange={(e) => setEditingStaff({ ...editingStaff, salary: parseInt(e.target.value) })} /></div>
              <div className="form-group"><label>Manzil</label><input type="text" value={editingStaff?.address || ''} onChange={(e) => setEditingStaff({ ...editingStaff, address: e.target.value })} /></div></div>
            </div>
            <div className="modal-buttons"><button className="btn-primary" onClick={handleSave}>Saqlash</button><button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Staff;