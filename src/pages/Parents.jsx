import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineUsers, 
  HiOutlineX, 
  HiOutlineDownload,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineUserAdd,
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineCake,
  HiOutlineDocumentText,
  HiOutlineFilter,
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlineOfficeBuilding
} from 'react-icons/hi';
import './Parents.css';

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [selectedChildren, setSelectedChildren] = useState([]);

  const parentTypes = [
    { value: 'father', label: 'Ota', icon: <HiOutlineUser /> },
    { value: 'mother', label: 'Ona', icon: <HiOutlineUserGroup /> },
    { value: 'guardian', label: 'Vasiy', icon: <HiOutlineIdentification /> }
  ];

  useEffect(() => {
    loadParents();
    loadStudents();
  }, []);

  const loadParents = () => {
    const storedParents = localStorage.getItem('parents');
    if (storedParents) {
      setParents(JSON.parse(storedParents));
    } else {
      const defaultParents = [
        { id: 1, type: 'father', firstName: 'Vali', lastName: 'Valiyev', fullName: 'Vali Valiyev', phone: '+998 90 111 2233', children: ['Ali Valiyev'], childIds: [1], address: 'Toshkent sh., Yunusobod 15-uy', status: 'active', registrationDate: '2024-09-01', occupation: 'Tadbirkor', birthYear: '1975', passport: 'AA1234567' },
        { id: 2, type: 'mother', firstName: 'Gulnora', lastName: 'Valiyeva', fullName: 'Gulnora Valiyeva', phone: '+998 91 222 3344', children: ['Ali Valiyev'], childIds: [1], address: 'Toshkent sh., Yunusobod 15-uy', status: 'active', registrationDate: '2024-09-01', occupation: 'Shifokor', birthYear: '1978', passport: 'AB2345678' },
        { id: 3, type: 'father', firstName: 'Karim', lastName: 'Karimov', fullName: 'Karim Karimov', phone: '+998 91 222 3344', children: ['Dilnoza Karimova'], childIds: [2], address: 'Toshkent sh., Chilonzor 8-uy', status: 'active', registrationDate: '2024-09-02', occupation: 'Muhandis', birthYear: '1975', passport: 'AC3456789' },
      ];
      setParents(defaultParents);
      localStorage.setItem('parents', JSON.stringify(defaultParents));
    }
  };

  const loadStudents = () => {
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);
  };

  const saveParents = (updated) => { 
    setParents(updated); 
    localStorage.setItem('parents', JSON.stringify(updated)); 
  };

  const getParentTypeLabel = (type) => {
    switch(type) {
      case 'father': return 'Ota';
      case 'mother': return 'Ona';
      case 'guardian': return 'Vasiy';
      default: return 'Ota-ona';
    }
  };

  const getParentTypeIcon = (type) => {
    switch(type) {
      case 'father': return <HiOutlineUser />;
      case 'mother': return <HiOutlineUserGroup />;
      case 'guardian': return <HiOutlineIdentification />;
      default: return <HiOutlineUser />;
    }
  };

  const handleAdd = () => {
    setEditingParent({
      type: 'father',
      firstName: '',
      lastName: '',
      fullName: '',
      phone: '',
      children: [],
      childIds: [],
      address: '',
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      occupation: '',
      birthYear: '',
      passport: '',
      workPhone: ''
    });
    setSelectedChildren([]);
    setShowModal(true);
  };

  const handleEdit = (parent) => {
    setEditingParent({ ...parent });
    setSelectedChildren(parent.childIds || []);
    setShowModal(true);
  };

  const updateFullName = () => {
    if (editingParent) {
      const fullName = `${editingParent.firstName || ''} ${editingParent.lastName || ''}`.trim();
      setEditingParent({ ...editingParent, fullName });
    }
  };

  useEffect(() => {
    if (editingParent) {
      updateFullName();
    }
  }, [editingParent?.firstName, editingParent?.lastName]);

  const handleChildSelect = (studentId, studentName) => {
    let newChildIds = [...selectedChildren];
    let newChildrenNames = [...(editingParent?.children || [])];
    
    if (newChildIds.includes(studentId)) {
      newChildIds = newChildIds.filter(id => id !== studentId);
      newChildrenNames = newChildrenNames.filter(name => name !== studentName);
    } else {
      newChildIds.push(studentId);
      newChildrenNames.push(studentName);
    }
    
    setSelectedChildren(newChildIds);
    setEditingParent({
      ...editingParent,
      childIds: newChildIds,
      children: newChildrenNames
    });
  };

  const handleSave = () => {
    if (!editingParent.firstName || !editingParent.phone) { 
      alert('Iltimos, ism va telefon raqamni kiriting!'); 
      return; 
    }
    
    const parentToSave = { 
      ...editingParent, 
      registrationDate: editingParent.registrationDate || new Date().toISOString().split('T')[0]
    };
    
    if (editingParent.id) { 
      saveParents(parents.map(p => p.id === editingParent.id ? parentToSave : p)); 
      alert("Ma'lumot yangilandi!"); 
    } else { 
      saveParents([{ ...parentToSave, id: Date.now() }, ...parents]); 
      alert("Yangi ma'lumot qo'shildi!"); 
    }
    setShowModal(false); 
    setEditingParent(null);
    setSelectedChildren([]);
  };

  const handleDelete = (id) => { 
    if (window.confirm("O'chirmoqchimisiz?")) { 
      saveParents(parents.filter(p => p.id !== id)); 
      alert("O'chirildi!");
    } 
  };

  const filtered = parents.filter(p => {
    const matchesSearch = p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phone?.includes(searchTerm);
    const matchesType = filterType === '' || p.type === filterType;
    const matchesStatus = filterStatus === '' || p.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: parents.length,
    fathers: parents.filter(p => p.type === 'father').length,
    mothers: parents.filter(p => p.type === 'mother').length,
    guardians: parents.filter(p => p.type === 'guardian').length,
    active: parents.filter(p => p.status === 'active').length,
    totalChildren: parents.reduce((sum, p) => sum + (p.children?.length || 0), 0)
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Turi', 'Ism', 'Familiya', 'Telefon', 'Ish joyi', 'Tug\'ilgan yil', 'Passport', 'Farzandlar', 'Manzil', 'Holat'];
    const csvData = parents.map(p => [
      p.id, getParentTypeLabel(p.type), p.firstName, p.lastName, p.phone, p.occupation || '', p.birthYear || '', p.passport || '',
      p.children?.join(', ') || '', p.address || '', p.status === 'active' ? 'Aktiv' : 'Noaktiv'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="parents-page">
      <div className="page-header">
        <div>
          <h1>Ota-onalar va Vasiylar</h1>
          <p>Jami {stats.total} nafar | Ota: {stats.fathers} | Ona: {stats.mothers} | Vasiy: {stats.guardians}</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlineUserAdd /> Yangi qo'shish
          </button>
        </div>
      </div>

      <div className="parents-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.fathers}</div>
          <div className="stat-label"><HiOutlineUser /> Ota</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.mothers}</div>
          <div className="stat-label"><HiOutlineUserGroup /> Ona</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.guardians}</div>
          <div className="stat-label"><HiOutlineIdentification /> Vasiy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalChildren}</div>
          <div className="stat-label"><HiOutlineUsers /> Jami farzandlar</div>
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
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Barcha turlar</option>
            <option value="father"><HiOutlineUser /> Ota</option>
            <option value="mother"><HiOutlineUserGroup /> Ona</option>
            <option value="guardian"><HiOutlineIdentification /> Vasiy</option>
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="active"><HiOutlineCheckCircle /> Aktiv</option>
            <option value="inactive"><HiOutlineX /> Noaktiv</option>
          </select>
        </div>
      </div>

      <div className="parents-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <HiOutlineUsers size={48} />
            <p>Hech qanday ma'lumot topilmadi</p>
            <button className="btn-primary" onClick={handleAdd}>Yangi qo'shish</button>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className={`parent-card ${p.type}`}>
              <div className="parent-avatar">
                {getParentTypeIcon(p.type)}
              </div>
              <div className="parent-info">
                <div className="parent-header">
                  <h3>{p.fullName}</h3>
                  <span className="type-badge" data-type={p.type}>
                    {getParentTypeLabel(p.type)}
                  </span>
                </div>
                <div className="parent-details">
                  <p><HiOutlinePhone /> {p.phone}</p>
                  {p.workPhone && <p><HiOutlineOfficeBuilding /> Ish tel: {p.workPhone}</p>}
                  {p.occupation && <p><HiOutlineBriefcase /> Kasbi: {p.occupation}</p>}
                  {p.birthYear && <p><HiOutlineCake /> Tug'ilgan yil: {p.birthYear}</p>}
                  {p.passport && <p><HiOutlineDocumentText /> Passport: {p.passport}</p>}
                  <p><HiOutlineLocationMarker /> {p.address || "Manzil kiritilmagan"}</p>
                  <p className="parent-children">
                    <HiOutlineUsers /> Farzandlari ({p.children?.length || 0}): 
                    <span className="children-names">{p.children?.join(', ') || '-'}</span>
                  </p>
                </div>
                <div className="parent-meta">
                  <span className={`status-badge ${p.status}`}>
                    {p.status === 'active' ? <HiOutlineCheckCircle /> : <HiOutlineX />}
                    {p.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                  </span>
                  <span className="reg-date"><HiOutlineCalendar /> {p.registrationDate}</span>
                </div>
              </div>
              <div className="parent-actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  <HiOutlinePencil /> Tahrirlash
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                  <HiOutlineTrash /> O'chirish
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingParent?.id ? 'Ma\'lumot tahrirlash' : 'Yangi ma\'lumot qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Turi *</label>
                  <select 
                    value={editingParent?.type || 'father'} 
                    onChange={(e) => setEditingParent({ ...editingParent, type: e.target.value })}
                  >
                    <option value="father"><HiOutlineUser /> Ota</option>
                    <option value="mother"><HiOutlineUserGroup /> Ona</option>
                    <option value="guardian"><HiOutlineIdentification /> Vasiy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingParent?.status || 'active'} 
                    onChange={(e) => setEditingParent({ ...editingParent, status: e.target.value })}
                  >
                    <option value="active"><HiOutlineCheckCircle /> Aktiv</option>
                    <option value="inactive"><HiOutlineX /> Noaktiv</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ism *</label>
                  <input 
                    type="text" 
                    placeholder="Ismi" 
                    value={editingParent?.firstName || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Familiya</label>
                  <input 
                    type="text" 
                    placeholder="Familiyasi" 
                    value={editingParent?.lastName || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Telefon raqam *</label>
                  <input 
                    type="tel" 
                    placeholder="+998 XX XXX XX XX" 
                    value={editingParent?.phone || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ish joyi telefoni</label>
                  <input 
                    type="tel" 
                    placeholder="Ish joyi telefoni" 
                    value={editingParent?.workPhone || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, workPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kasbi</label>
                  <input 
                    type="text" 
                    placeholder="Kasbi / Ish joyi" 
                    value={editingParent?.occupation || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, occupation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tug'ilgan yili</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: 1975" 
                    value={editingParent?.birthYear || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, birthYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Passport seriyasi</label>
                  <input 
                    type="text" 
                    placeholder="AA 1234567" 
                    value={editingParent?.passport || ''} 
                    onChange={(e) => setEditingParent({ ...editingParent, passport: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Ro'yxatdan o'tgan sana</label>
                  <input 
                    type="date" 
                    value={editingParent?.registrationDate || new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setEditingParent({ ...editingParent, registrationDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Manzil</label>
                <textarea 
                  rows="2" 
                  placeholder="Yashash manzili" 
                  value={editingParent?.address || ''} 
                  onChange={(e) => setEditingParent({ ...editingParent, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Farzandlarini tanlang</label>
                <div className="children-selector">
                  {students.length === 0 ? (
                    <p className="no-students">Hozircha o'quvchilar mavjud emas</p>
                  ) : (
                    students.map(student => (
                      <label key={student.id} className="child-checkbox">
                        <input 
                          type="checkbox"
                          checked={selectedChildren.includes(student.id)}
                          onChange={() => handleChildSelect(student.id, student.name)}
                        />
                        <span className="checkmark"></span>
                        <span className="child-name">{student.name}</span>
                        <span className="child-class">{student.class}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingParent?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Parents;