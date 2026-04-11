import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlineUserAdd, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCalendar
} from 'react-icons/hi';
import './Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [classes, setClasses] = useState(['9-A', '9-B', '10-A', '10-B', '11-A']);

  // LocalStorage dan o'quvchilarni yuklash
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      const defaultStudents = [
        { id: 1, name: 'Ali Valiyev', class: '10-A', parent: '+998 90 123 4567', status: 'active', grade: 92, attendance: 95, email: 'ali@example.com', address: 'Toshkent sh.', birthDate: '2010-05-15', gender: 'Erkak' },
        { id: 2, name: 'Dilnoza Karimova', class: '10-B', parent: '+998 91 234 5678', status: 'active', grade: 95, attendance: 98, email: 'dilnoza@example.com', address: 'Toshkent sh.', birthDate: '2010-08-22', gender: 'Ayol' },
        { id: 3, name: 'Jasur Aliyev', class: '9-A', parent: '+998 93 345 6789', status: 'inactive', grade: 78, attendance: 85, email: 'jasur@example.com', address: 'Toshkent sh.', birthDate: '2011-03-10', gender: 'Erkak' },
        { id: 4, name: 'Zarina Toshpulatova', class: '11-A', parent: '+998 94 456 7890', status: 'active', grade: 88, attendance: 92, email: 'zarina@example.com', address: 'Toshkent sh.', birthDate: '2009-11-30', gender: 'Ayol' },
        { id: 5, name: 'Bobur Sattorov', class: '8-A', parent: '+998 95 567 8901', status: 'active', grade: 85, attendance: 90, email: 'bobur@example.com', address: 'Toshkent sh.', birthDate: '2012-07-19', gender: 'Erkak' },
      ];
      setStudents(defaultStudents);
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
  };

  // O'quvchilarni LocalStorage ga saqlash
  const saveStudents = (updatedStudents) => {
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
  };

  // Yangi o'quvchi qo'shish
  const handleAdd = () => {
    setEditingStudent({ 
      name: '', 
      class: '', 
      parent: '', 
      status: 'active', 
      grade: 0, 
      attendance: 0, 
      email: '', 
      address: '',
      birthDate: '',
      gender: 'Erkak'
    });
    setShowModal(true);
  };

  // O'quvchini tahrirlash
  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setShowModal(true);
  };

  // O'quvchini saqlash (yangi yoki tahrirlangan)
  const handleSave = () => {
    if (!editingStudent.name || !editingStudent.class || !editingStudent.parent) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedStudents;
    if (editingStudent.id) {
      // Tahrirlash
      updatedStudents = students.map(s => s.id === editingStudent.id ? editingStudent : s);
      alert('O\'quvchi ma\'lumotlari yangilandi!');
    } else {
      // Yangi qo'shish
      const newStudent = { ...editingStudent, id: Date.now() };
      updatedStudents = [...students, newStudent];
      alert('Yangi o\'quvchi qo\'shildi!');
    }
    
    saveStudents(updatedStudents);
    setShowModal(false);
    setEditingStudent(null);
  };

  // O'quvchini o'chirish
  const handleDelete = (id) => {
    if (window.confirm('O\'quvchini o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      const updatedStudents = students.filter(s => s.id !== id);
      saveStudents(updatedStudents);
      alert('O\'quvchi o\'chirildi!');
    }
  };

  // O'quvchilarni filtrlash
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.parent.includes(searchTerm) ||
                          student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || student.class === filterClass;
    const matchesStatus = filterStatus === '' || student.status === filterStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Statistikalar
  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(s => s.status === 'active').length;
  const avgGrade = (filteredStudents.reduce((sum, s) => sum + s.grade, 0) / totalStudents || 0).toFixed(1);
  const avgAttendance = (filteredStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents || 0).toFixed(1);

  // CSV ga eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', 'Ism', 'Sinf', 'Ota-ona tel', 'Email', 'Holat', 'O\'rtacha baho', 'Davomat', 'Tug\'ilgan sana', 'Jins', 'Manzil'];
    const csvData = filteredStudents.map(s => [
      s.id, s.name, s.class, s.parent, s.email || '', 
      s.status === 'active' ? 'Aktiv' : 'Noaktiv', 
      s.grade, s.attendance, s.birthDate || '', s.gender || '', s.address || ''
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Statistik kartalar
  const StatCard = ({ title, value, icon, color }) => (
    <div className="stat-card-mini" style={{ borderLeftColor: color }}>
      <div className="stat-icon-mini" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stat-info-mini">
        <div className="stat-value-mini">{value}</div>
        <div className="stat-title-mini">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>O'quvchilar</h1>
          <p>Jami {students.length} nafar o'quvchi ro'yxatga olingan</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <HiOutlineUserAdd /> Yangi o'quvchi
        </button>
      </div>

      {/* Statistik kartalar */}
      <div className="stats-mini-grid">
        <StatCard title="Jami o'quvchilar" value={totalStudents} icon={<HiOutlineUser />} color="#10b981" />
        <StatCard title="Aktiv o'quvchilar" value={activeStudents} icon={<HiOutlineUser />} color="#3b82f6" />
        <StatCard title="O'rtacha baho" value={`${avgGrade}%`} icon={<HiOutlineChartBar />} color="#f59e0b" />
        <StatCard title="Davomat" value={`${avgAttendance}%`} icon={<HiOutlineCalendar />} color="#8b5cf6" />
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Ism, ota-ona telefon yoki email bo'yicha qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filters-group">
          <select className="filter-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Noaktiv</option>
          </select>
          <button className="filter-btn" onClick={exportToCSV}>
            <HiOutlineDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* O'quvchilar jadvali */}
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ism</th>
              <th>Sinf</th>
              <th>Ota-ona tel</th>
              <th>Davomat</th>
              <th>O'rtacha</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineUser size={48} />
                    <p>Hech qanday o'quvchi topilmadi</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>#{student.id}</td>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{student.name.charAt(0)}</div>
                      <div>
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="class-badge">{student.class}</span></td>
                  <td>{student.parent}</td>
                  <td>
                    <div className="attendance-wrapper">
                      <div className="attendance-bar">
                        <div className="attendance-fill" style={{ width: `${student.attendance}%` }}></div>
                      </div>
                      <span className="attendance-value">{student.attendance}%</span>
                    </div>
                  </td>
                  <td><span className="grade-badge">{student.grade}%</span></td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEdit(student)} title="Tahrirlash">
                        <HiOutlinePencil />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(student.id)} title="O'chirish">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal oyna */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingStudent?.id ? 'O\'quvchi ma\'lumotlarini tahrirlash' : 'Yangi o\'quvchi qo\'shish'}</h2>
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
                    placeholder="O'quvchining to'liq ismi" 
                    value={editingStudent?.name || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <select value={editingStudent?.class || ''} onChange={(e) => setEditingStudent({ ...editingStudent, class: e.target.value })}>
                    <option value="">Sinf tanlang</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ota-ona telefoni *</label>
                  <input 
                    type="tel" 
                    placeholder="+998 XX XXX XX XX" 
                    value={editingStudent?.parent || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, parent: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    placeholder="example@mail.com" 
                    value={editingStudent?.email || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'rtacha baho</label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    value={editingStudent?.grade || 0} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Davomat %</label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    value={editingStudent?.attendance || 0} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, attendance: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Holat</label>
                  <select value={editingStudent?.status || 'active'} onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}>
                    <option value="active">Aktiv</option>
                    <option value="inactive">Noaktiv</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Jinsi</label>
                  <select value={editingStudent?.gender || 'Erkak'} onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}>
                    <option value="Erkak">Erkak</option>
                    <option value="Ayol">Ayol</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tug'ilgan sana</label>
                  <input 
                    type="date" 
                    value={editingStudent?.birthDate || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, birthDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Manzil</label>
                  <input 
                    type="text" 
                    placeholder="Yashash manzili" 
                    value={editingStudent?.address || ''} 
                    onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingStudent?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Students;