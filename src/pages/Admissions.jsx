import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineCalendar, 
  HiOutlineDocument, 
  HiOutlineX, 
  HiOutlineFilter, 
  HiOutlineDownload,
  HiOutlineLocationMarker,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineUserAdd
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Admissions.css';

const Admissions = () => {
  const { user, roles } = useAuth();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);

  const isAdmin = user?.role === roles.ADMIN;

  const classes = ['1-A', '1-B', '2-A', '2-B', '3-A', '3-B', '4-A', '4-B', '5-A', '5-B', '6-A', '6-B', '7-A', '7-B', '8-A', '8-B', '9-A', '9-B', '10-A', '10-B', '11-A'];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const stored = localStorage.getItem('admissions');
    if (stored) {
      setApplications(JSON.parse(stored));
    } else {
      const defaultApplications = [
        { id: 1, name: 'Sardor Rahimov', class: '5-A', parentName: 'Rahim Rahimov', parentPhone: '+998 90 111 2233', parentEmail: 'rahim@example.com', birthDate: '2013-05-15', address: 'Toshkent sh., Yunusobod 15-uy', status: 'pending', applyDate: '2024-12-01', previousSchool: '31-maktab', gender: 'Erkak', notes: '' },
        { id: 2, name: 'Madina Azimova', class: '5-B', parentName: 'Azim Azimov', parentPhone: '+998 91 222 3344', parentEmail: 'azim@example.com', birthDate: '2013-08-22', address: 'Toshkent sh., Chilonzor 8-uy', status: 'approved', applyDate: '2024-12-02', previousSchool: '45-maktab', gender: 'Ayol', notes: 'A\'lochi o\'quvchi' },
        { id: 3, name: 'Jasur Akbarov', class: '6-A', parentName: 'Akbar Akbarov', parentPhone: '+998 93 333 4455', parentEmail: 'akbar@example.com', birthDate: '2012-03-10', address: 'Toshkent sh., Sergeli 12-uy', status: 'rejected', applyDate: '2024-12-03', previousSchool: '12-maktab', gender: 'Erkak', notes: 'Hujjatlar to\'liq emas' },
        { id: 4, name: 'Nilufar To\'xtayeva', class: '7-B', parentName: 'To\'xta To\'xtayev', parentPhone: '+998 94 444 5566', parentEmail: 'toxta@example.com', birthDate: '2011-11-20', address: 'Toshkent sh., Mirzo Ulug\'bek 5-uy', status: 'pending', applyDate: '2024-12-04', previousSchool: '28-maktab', gender: 'Ayol', notes: '' },
      ];
      setApplications(defaultApplications);
      localStorage.setItem('admissions', JSON.stringify(defaultApplications));
    }
  };

  const saveApplications = (updated) => {
    setApplications(updated);
    localStorage.setItem('admissions', JSON.stringify(updated));
  };

  const handleAdd = () => {
    setEditingApp({
      name: '',
      class: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      birthDate: '',
      address: '',
      status: 'pending',
      previousSchool: '',
      gender: 'Erkak',
      notes: ''
    });
    setShowModal(true);
  };

  const handleEdit = (app) => {
    setEditingApp({ ...app });
    setShowModal(true);
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowDetailsModal(true);
  };

  const handleSave = () => {
    if (!editingApp.name || !editingApp.parentPhone) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }
    if (editingApp.id) {
      saveApplications(applications.map(a => a.id === editingApp.id ? editingApp : a));
      alert("Ariza yangilandi!");
    } else {
      saveApplications([{ ...editingApp, id: Date.now(), applyDate: new Date().toISOString().split('T')[0] }, ...applications]);
      alert("Yangi ariza qo'shildi!");
    }
    setShowModal(false);
    setEditingApp(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Arizani o'chirmoqchimisiz?")) {
      saveApplications(applications.filter(a => a.id !== id));
      alert("Ariza o'chirildi!");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = applications.map(a => a.id === id ? { ...a, status: newStatus } : a);
    saveApplications(updated);
  };

  const filtered = applications.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.parentPhone.includes(searchTerm);
    const matchesStatus = filterStatus === '' || a.status === filterStatus;
    const matchesClass = filterClass === '' || a.class === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    byClass: classes.map(c => ({
      name: c,
      count: applications.filter(a => a.class === c).length
    })).filter(c => c.count > 0)
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Ism', 'Sinf', 'Ota-ona ismi', 'Telefon', 'Email', 'Holat', 'Murojaat sanasi', 'Oldingi maktab', 'Manzil'];
    const csvData = filtered.map(a => [
      a.id, a.name, a.class, a.parentName, a.parentPhone, a.parentEmail,
      a.status === 'pending' ? 'Kutilmoqda' : a.status === 'approved' ? 'Qabul qilingan' : 'Rad etilgan',
      a.applyDate, a.previousSchool, a.address
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <HiOutlineClock />;
      case 'approved': return <HiOutlineCheckCircle />;
      case 'rejected': return <HiOutlineXCircle />;
      default: return <HiOutlineClock />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="admissions-page">
      <div className="page-header">
        <div>
          <h1>Qabul</h1>
          <p>Jami {stats.total} ta ariza | {stats.pending} ta kutilmoqda | {stats.approved} ta qabul qilingan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlineUserAdd /> Yangi ariza
            </button>
          )}
        </div>
      </div>

      <div className="admissions-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami arizalar</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label"><HiOutlineClock /> Kutilmoqda</div>
        </div>
        <div className="stat-card approved">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label"><HiOutlineCheckCircle /> Qabul qilingan</div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label"><HiOutlineXCircle /> Rad etilgan</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Ism yoki telefon bo'yicha qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="approved">Qabul qilingan</option>
            <option value="rejected">Rad etilgan</option>
          </select>
          <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="applications-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <HiOutlineDocument size={48} />
            <p>Hech qanday ariza topilmadi</p>
            {isAdmin && (
              <button className="btn-primary" onClick={handleAdd}>Yangi ariza qo'shish</button>
            )}
          </div>
        ) : (
          filtered.map(app => (
            <div key={app.id} className={`application-card ${app.status}`}>
              <div className="app-avatar" style={{ background: `${getStatusColor(app.status)}15`, color: getStatusColor(app.status) }}>
                {app.name.charAt(0)}
              </div>
              <div className="app-info">
                <div className="app-header">
                  <h3>{app.name}</h3>
                  <span className="app-class">{app.class}</span>
                </div>
                <p className="app-school"><HiOutlineOfficeBuilding /> {app.previousSchool}</p>
                <div className="app-meta">
                  <span><HiOutlinePhone /> {app.parentPhone}</span>
                  <span><HiOutlineMail /> {app.parentEmail}</span>
                  <span><HiOutlineCalendar /> {app.applyDate}</span>
                </div>
              </div>
              <div className="app-status">
                <span className={`status-badge ${app.status}`}>
                  {getStatusIcon(app.status)}
                  {app.status === 'pending' ? 'Kutilmoqda' : app.status === 'approved' ? 'Qabul qilingan' : 'Rad etilgan'}
                </span>
              </div>
              <div className="app-actions">
                <button className="view-btn" onClick={() => handleView(app)} title="Ko'rish">
                  <HiOutlineDocument />
                </button>
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(app)} title="Tahrirlash">
                      <HiOutlinePencil />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(app.id)} title="O'chirish">
                      <HiOutlineTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ko'rish modal */}
      {showDetailsModal && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ariza ma'lumotlari</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">O'quvchi ismi:</span>
                  <span className="detail-value">{selectedApp.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sinf:</span>
                  <span className="detail-value">{selectedApp.class}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Jinsi:</span>
                  <span className="detail-value">{selectedApp.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tug'ilgan sana:</span>
                  <span className="detail-value">{selectedApp.birthDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ota-ona ismi:</span>
                  <span className="detail-value">{selectedApp.parentName || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Telefon:</span>
                  <span className="detail-value">{selectedApp.parentPhone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedApp.parentEmail || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Oldingi maktab:</span>
                  <span className="detail-value">{selectedApp.previousSchool}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Murojaat sanasi:</span>
                  <span className="detail-value">{selectedApp.applyDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Holat:</span>
                  <span className={`status-badge ${selectedApp.status}`}>
                    {getStatusIcon(selectedApp.status)}
                    {selectedApp.status === 'pending' ? 'Kutilmoqda' : selectedApp.status === 'approved' ? 'Qabul qilingan' : 'Rad etilgan'}
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Manzil:</span>
                  <span className="detail-value">{selectedApp.address}</span>
                </div>
                {selectedApp.notes && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Izoh:</span>
                    <span className="detail-value">{selectedApp.notes}</span>
                  </div>
                )}
              </div>
              {isAdmin && selectedApp.status === 'pending' && (
                <div className="status-actions">
                  <button className="approve-btn" onClick={() => { handleStatusChange(selectedApp.id, 'approved'); setShowDetailsModal(false); }}>
                    <HiOutlineCheckCircle /> Qabul qilish
                  </button>
                  <button className="reject-btn" onClick={() => { handleStatusChange(selectedApp.id, 'rejected'); setShowDetailsModal(false); }}>
                    <HiOutlineXCircle /> Rad etish
                  </button>
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Qo'shish/Tahrirlash modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingApp?.id ? 'Ariza tahrirlash' : 'Yangi ariza'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchi ismi *</label>
                  <input 
                    type="text" 
                    placeholder="Ism familiya" 
                    value={editingApp?.name || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Sinf</label>
                  <select 
                    value={editingApp?.class || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, class: e.target.value })}
                  >
                    <option value="">Sinf tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jinsi</label>
                  <select 
                    value={editingApp?.gender || 'Erkak'} 
                    onChange={(e) => setEditingApp({ ...editingApp, gender: e.target.value })}
                  >
                    <option value="Erkak">Erkak</option>
                    <option value="Ayol">Ayol</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tug'ilgan sana</label>
                  <input 
                    type="date" 
                    value={editingApp?.birthDate || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, birthDate: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ota-ona ismi</label>
                  <input 
                    type="text" 
                    placeholder="Ota yoki onaning ismi" 
                    value={editingApp?.parentName || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, parentName: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Telefon *</label>
                  <input 
                    type="tel" 
                    placeholder="+998 XX XXX XX XX" 
                    value={editingApp?.parentPhone || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, parentPhone: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="example@mail.com" 
                    value={editingApp?.parentEmail || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, parentEmail: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Oldingi maktab</label>
                  <input 
                    type="text" 
                    placeholder="Oldingi o'qigan maktabi" 
                    value={editingApp?.previousSchool || ''} 
                    onChange={(e) => setEditingApp({ ...editingApp, previousSchool: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Manzil</label>
                <textarea 
                  rows="2" 
                  placeholder="Yashash manzili" 
                  value={editingApp?.address || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, address: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label>Izoh</label>
                <textarea 
                  rows="2" 
                  placeholder="Qo'shimcha ma'lumotlar..." 
                  value={editingApp?.notes || ''} 
                  onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })} 
                />
              </div>

              <div className="form-group">
                <label>Holat</label>
                <select 
                  value={editingApp?.status || 'pending'} 
                  onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value })}
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="approved">Qabul qilingan</option>
                  <option value="rejected">Rad etilgan</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingApp?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Admissions;