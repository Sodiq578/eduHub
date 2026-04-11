import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineHeart, 
  HiOutlineCalendar, 
  HiOutlineUser,
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineExclamationCircle,   // ← HiOutlineAlert o'rniga shu ishlatildi
  HiOutlineClipboardList
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Health.css';

const Health = () => {
  const { user, roles } = useAuth();
  const [students, setStudents] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmergency, setFilterEmergency] = useState('all');

  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.TEACHER;

  useEffect(() => {
    loadStudents();
    loadMedicalRecords();
  }, []);

  const loadStudents = () => {
    const storedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(storedStudents);
  };

  const loadMedicalRecords = () => {
    const storedRecords = localStorage.getItem('medical_records');
    if (storedRecords) {
      setMedicalRecords(JSON.parse(storedRecords));
    } else {
      const defaultRecords = [
        { 
          id: 1, 
          studentId: 1, 
          studentName: 'Ali Valiyev', 
          condition: 'Allergiya', 
          diagnosis: 'Yong\'oqqa allergiya', 
          date: '2024-09-01', 
          medications: 'Antigistamin', 
          emergency: true, 
          notes: 'Shifokor ko\'rigidan o\'tgan', 
          bloodType: 'O+', 
          height: 165, 
          weight: 55 
        },
        { 
          id: 2, 
          studentId: 3, 
          studentName: 'Jasur Aliyev', 
          condition: 'Bronxit', 
          diagnosis: 'Surunkali bronxit', 
          date: '2024-08-15', 
          medications: 'Inhaler', 
          emergency: false, 
          notes: 'Doimiy nazorat', 
          bloodType: 'A+', 
          height: 170, 
          weight: 60 
        },
        { 
          id: 3, 
          studentId: 4, 
          studentName: 'Zarina Toshpulatova', 
          condition: 'Sovuq allergiyasi', 
          diagnosis: 'Allergik rinit', 
          date: '2024-10-01', 
          medications: 'Antigistamin', 
          emergency: false, 
          notes: 'Mavsumiy', 
          bloodType: 'B+', 
          height: 162, 
          weight: 52 
        },
      ];
      setMedicalRecords(defaultRecords);
      localStorage.setItem('medical_records', JSON.stringify(defaultRecords));
    }
  };

  const saveMedicalRecords = (updatedRecords) => {
    setMedicalRecords(updatedRecords);
    localStorage.setItem('medical_records', JSON.stringify(updatedRecords));
  };

  const handleAddRecord = () => {
    setEditingRecord({
      studentId: '',
      studentName: '',
      condition: '',
      diagnosis: '',
      date: new Date().toISOString().split('T')[0],
      medications: '',
      emergency: false,
      notes: '',
      bloodType: '',
      height: '',
      weight: ''
    });
    setShowModal(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord({ ...record });
    setShowModal(true);
  };

  const handleSaveRecord = () => {
    if (!editingRecord.studentName || !editingRecord.condition) {
      alert('Iltimos, o\'quvchi ismi va kasallik nomini kiriting!');
      return;
    }

    let updatedRecords;
    if (editingRecord.id) {
      updatedRecords = medicalRecords.map(r => r.id === editingRecord.id ? editingRecord : r);
      alert("Tibbiy yozuv yangilandi!");
    } else {
      const newRecord = { ...editingRecord, id: Date.now() };
      updatedRecords = [newRecord, ...medicalRecords];
      alert("Yangi tibbiy yozuv qo'shildi!");
    }
    
    saveMedicalRecords(updatedRecords);
    setShowModal(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Tibbiy yozuvni o\'chirmoqchimisiz?')) {
      const updatedRecords = medicalRecords.filter(r => r.id !== id);
      saveMedicalRecords(updatedRecords);
      alert("Tibbiy yozuv o'chirildi!");
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmergency = filterEmergency === 'all' || 
      (filterEmergency === 'emergency' && record.emergency) ||
      (filterEmergency === 'normal' && !record.emergency);
    return matchesSearch && matchesEmergency;
  });

  const emergencyCount = medicalRecords.filter(r => r.emergency).length;
  const totalStudents = students.length;
  const recordsCount = medicalRecords.length;

  // Eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', 'O\'quvchi', 'Kasallik', 'Diagnoz', 'Sana', 'Dori-darmon', 'Shoshilinch', 'Qon guruhi', 'Bo\'yi', 'Vazni', 'Izoh'];
    const csvData = medicalRecords.map(r => [
      r.id, r.studentName, r.condition, r.diagnosis, r.date, r.medications, 
      r.emergency ? 'Ha' : 'Yo\'q', r.bloodType || '', r.height || '', r.weight || '', r.notes || ''
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="health-page">
      <div className="page-header">
        <div>
          <h1>Sog'liq / Tibbiy bo'lim</h1>
          <p>O'quvchilarning sog'liq holati va tibbiy yozuvlar</p>
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button className="btn-primary" onClick={handleAddRecord}>
              <HiOutlinePlus /> Yangi yozuv
            </button>
          )}
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="health-stats">
        <div className="stat-card">
          <div className="stat-value">{recordsCount}</div>
          <div className="stat-label">Tibbiy yozuvlar</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <div className="stat-value">{emergencyCount}</div>
          <div className="stat-label">Shoshilinch holatlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-label">Jami o'quvchilar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{((recordsCount / totalStudents) * 100 || 0).toFixed(0)}%</div>
          <div className="stat-label">Qamrov</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="O'quvchi yoki kasallik bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <HiOutlineFilter />
          <select className="filter-select" value={filterEmergency} onChange={(e) => setFilterEmergency(e.target.value)}>
            <option value="all">Barcha holatlar</option>
            <option value="emergency">Shoshilinch</option>
            <option value="normal">Oddiy</option>
          </select>
        </div>
      </div>

      {/* Tibbiy yozuvlar ro'yxati */}
      <div className="health-records">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <HiOutlineHeart size={48} />
            <h3>Hech qanday tibbiy yozuv yo'q</h3>
            <p>Hali hech qanday tibbiy ma'lumot qo'shilmagan</p>
            {isAdmin && (
              <button className="btn-primary" onClick={handleAddRecord}>
                <HiOutlinePlus /> Birinchi yozuvni qo'shish
              </button>
            )}
          </div>
        ) : (
          filteredRecords.map(record => (
            <div key={record.id} className={`health-card ${record.emergency ? 'emergency' : ''}`}>
              <div className="health-icon">
                <HiOutlineHeart />
              </div>
              <div className="health-content">
                <div className="health-header">
                  <h3>{record.studentName}</h3>
                  {record.emergency && (
                    <span className="emergency-badge">
                      <HiOutlineExclamationCircle /> Shoshilinch
                    </span>
                  )}
                </div>
                <p className="health-condition">{record.condition}</p>
                <p className="health-diagnosis">{record.diagnosis}</p>
                <div className="health-meta">
                  <span><HiOutlineCalendar /> {record.date}</span>
                  <span><HiOutlineUser /> Dori: {record.medications}</span>
                  {record.bloodType && <span>🩸 Qon: {record.bloodType}</span>}
                  {(record.height || record.weight) && (
                    <span>📏 {record.height}cm / {record.weight}kg</span>
                  )}
                </div>
                {record.notes && (
                  <div className="health-notes">
                    <HiOutlineClipboardList /> {record.notes}
                  </div>
                )}
              </div>
              {isAdmin && (
                <div className="health-actions">
                  <button className="edit-btn" onClick={() => handleEditRecord(record)}>
                    <HiOutlinePencil />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteRecord(record.id)}>
                    <HiOutlineTrash />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Tibbiy yozuv qo'shish/tahrirlash modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRecord?.id ? 'Tibbiy yozuv tahrirlash' : 'Yangi tibbiy yozuv'}</h2>
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
                    placeholder="O'quvchi ismi" 
                    value={editingRecord?.studentName || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, studentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Kasallik nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Kasallik nomi" 
                    value={editingRecord?.condition || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, condition: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Diagnoz</label>
                <input 
                  type="text" 
                  placeholder="Diagnoz" 
                  value={editingRecord?.diagnosis || ''} 
                  onChange={(e) => setEditingRecord({ ...editingRecord, diagnosis: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sana</label>
                  <input 
                    type="date" 
                    value={editingRecord?.date || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Dori-darmonlar</label>
                  <input 
                    type="text" 
                    placeholder="Dori-darmonlar" 
                    value={editingRecord?.medications || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, medications: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Qon guruhi</label>
                  <select 
                    value={editingRecord?.bloodType || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, bloodType: e.target.value })}
                  >
                    <option value="">Tanlang</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Bo'yi (cm)</label>
                  <input 
                    type="number" 
                    placeholder="Bo'yi" 
                    value={editingRecord?.height || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, height: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Vazni (kg)</label>
                  <input 
                    type="number" 
                    placeholder="Vazni" 
                    value={editingRecord?.weight || ''} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, weight: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={editingRecord?.emergency || false} 
                    onChange={(e) => setEditingRecord({ ...editingRecord, emergency: e.target.checked })}
                  />
                  Shoshilinch holat
                </label>
              </div>

              <div className="form-group">
                <label>Izoh</label>
                <textarea 
                  placeholder="Qo'shimcha ma'lumotlar..." 
                  rows="3"
                  value={editingRecord?.notes || ''} 
                  onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveRecord}>
                {editingRecord?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Health;