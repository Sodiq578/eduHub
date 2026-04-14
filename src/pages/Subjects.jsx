import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineX,
  HiOutlineDownload,
  HiOutlinePrinter,
  HiOutlineFilter,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlinePhotograph,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineChartPie
} from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Subjects.css';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);
  
  // Yangi state'lar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minCredits: '',
    maxCredits: '',
    minHours: '',
    maxHours: '',
    minAverage: '',
    maxAverage: ''
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"role":"admin"}');

  useEffect(() => {
    loadSubjects();
    loadTeachers();
  }, []);

  // Toast notification funksiyalari
  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const loadSubjects = () => {
    const stored = localStorage.getItem('subjects');
    if (stored) {
      setSubjects(JSON.parse(stored));
    } else {
      const defaultSubjects = [
        { id: 1, name: 'Matematika', code: 'MTH101', credits: 5, hours: 120, students: 180, teacher: 'Shahzoda Ahmedova', teacherId: 1, average: 85, status: 'active', image: '📐', createdAt: '2024-01-15', updatedAt: '2024-03-20' },
        { id: 2, name: 'Fizika', code: 'PHY101', credits: 4, hours: 96, students: 150, teacher: 'Rustam Karimov', teacherId: 2, average: 82, status: 'active', image: '⚛️', createdAt: '2024-01-16', updatedAt: '2024-03-19' },
        { id: 3, name: 'Ingliz tili', code: 'ENG101', credits: 3, hours: 72, students: 200, teacher: 'Gulnora Saidova', teacherId: 3, average: 88, status: 'active', image: '🇬🇧', createdAt: '2024-01-17', updatedAt: '2024-03-21' },
        { id: 4, name: 'Tarix', code: 'HIS101', credits: 3, hours: 72, students: 140, teacher: 'Alisher Tursunov', teacherId: 4, average: 86, status: 'active', image: '📜', createdAt: '2024-01-18', updatedAt: '2024-03-18' },
        { id: 5, name: 'Biologiya', code: 'BIO101', credits: 4, hours: 96, students: 120, teacher: 'Nilufar Rahimova', teacherId: 5, average: 84, status: 'active', image: '🧬', createdAt: '2024-01-19', updatedAt: '2024-03-22' },
        { id: 6, name: 'Kimyo', code: 'CHE101', credits: 4, hours: 96, students: 115, teacher: 'Dilbar To\'xtayeva', teacherId: 6, average: 80, status: 'inactive', image: '🧪', createdAt: '2024-01-20', updatedAt: '2024-03-17' },
      ];
      setSubjects(defaultSubjects);
      localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
    }
  };

  const loadTeachers = () => {
    const stored = localStorage.getItem('teachers');
    if (stored) {
      setTeachers(JSON.parse(stored));
    } else {
      const defaultTeachers = [
        { id: 1, name: 'Shahzoda Ahmedova', subject: 'Matematika', email: 'shahzoda@school.uz', phone: '+998901234567' },
        { id: 2, name: 'Rustam Karimov', subject: 'Fizika', email: 'rustam@school.uz', phone: '+998901234568' },
        { id: 3, name: 'Gulnora Saidova', subject: 'Ingliz tili', email: 'gulnora@school.uz', phone: '+998901234569' },
        { id: 4, name: 'Alisher Tursunov', subject: 'Tarix', email: 'alisher@school.uz', phone: '+998901234570' },
        { id: 5, name: 'Nilufar Rahimova', subject: 'Biologiya', email: 'nilufar@school.uz', phone: '+998901234571' },
        { id: 6, name: 'Dilbar To\'xtayeva', subject: 'Kimyo', email: 'dilbar@school.uz', phone: '+998901234572' },
      ];
      setTeachers(defaultTeachers);
      localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    }
  };

  const saveSubjects = (updatedSubjects) => {
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
  };

  // Sorting funksiyasi
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filtrlash va saralash
  const getFilteredAndSortedSubjects = () => {
    let filtered = subjects.filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.teacher.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || sub.status === statusFilter;
      
      // Advanced filters
      const matchesCredits = (!advancedFilters.minCredits || sub.credits >= parseInt(advancedFilters.minCredits)) &&
                            (!advancedFilters.maxCredits || sub.credits <= parseInt(advancedFilters.maxCredits));
      const matchesHours = (!advancedFilters.minHours || sub.hours >= parseInt(advancedFilters.minHours)) &&
                          (!advancedFilters.maxHours || sub.hours <= parseInt(advancedFilters.maxHours));
      const matchesAverage = (!advancedFilters.minAverage || sub.average >= parseInt(advancedFilters.minAverage)) &&
                            (!advancedFilters.maxAverage || sub.average <= parseInt(advancedFilters.maxAverage));
      
      return matchesSearch && matchesStatus && matchesCredits && matchesHours && matchesAverage;
    });

    // Saralash
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredSubjects = getFilteredAndSortedSubjects();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubjects = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAdd = () => {
    setEditingSubject({
      name: '',
      code: '',
      credits: 3,
      hours: 72,
      students: 0,
      teacher: '',
      teacherId: '',
      average: 0,
      status: 'active',
      image: '📚',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEdit = (subject) => {
    setEditingSubject({ ...subject });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingSubject.name || !editingSubject.code || !editingSubject.teacher) {
      showToast('Iltimos, barcha majburiy maydonlarni to\'ldiring!', 'error');
      return;
    }

    let updatedSubjects;
    const now = new Date().toISOString().split('T')[0];
    
    if (editingSubject.id) {
      updatedSubjects = subjects.map(s => s.id === editingSubject.id ? { ...editingSubject, updatedAt: now } : s);
      showToast('Fan ma\'lumotlari yangilandi!', 'success');
    } else {
      const newSubject = { ...editingSubject, id: Date.now(), createdAt: now, updatedAt: now };
      updatedSubjects = [...subjects, newSubject];
      showToast('Yangi fan qo\'shildi!', 'success');
    }
    
    saveSubjects(updatedSubjects);
    setShowModal(false);
    setEditingSubject(null);
  };

  const handleDelete = (id) => {
    if (currentUser.role !== 'admin') {
      showToast('Faqat admin fanni o\'chira oladi!', 'error');
      return;
    }
    
    if (window.confirm('Fanni o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      const updatedSubjects = subjects.filter(s => s.id !== id);
      saveSubjects(updatedSubjects);
      showToast('Fan o\'chirildi!', 'success');
    }
  };

  const handleBulkDelete = () => {
    if (currentUser.role !== 'admin') {
      showToast('Faqat admin ommaviy o\'chirishni amalga oshira oladi!', 'error');
      return;
    }
    
    if (window.confirm(`${selectedSubjects.length} ta fanni o\'chirmoqchimisiz?`)) {
      const updatedSubjects = subjects.filter(s => !selectedSubjects.includes(s.id));
      saveSubjects(updatedSubjects);
      setSelectedSubjects([]);
      setShowBulkActions(false);
      showToast(`${selectedSubjects.length} ta fan o\'chirildi!`, 'success');
    }
  };

  const handleSelectAll = () => {
    if (selectedSubjects.length === currentSubjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(currentSubjects.map(s => s.id));
    }
  };

  const handleSelectSubject = (id) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter(sid => sid !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredSubjects.map(sub => ({
      'Fan nomi': sub.name,
      'Kod': sub.code,
      'Kredit': sub.credits,
      'Soat': sub.hours,
      'O\'quvchilar': sub.students,
      'O\'qituvchi': sub.teacher,
      'O\'rtacha baho': `${sub.average}%`,
      'Holat': sub.status === 'active' ? 'Aktiv' : 'Noaktiv',
      'Yaratilgan sana': sub.createdAt,
      'Oxirgi o\'zgarish': sub.updatedAt
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Fanlar');
    XLSX.writeFile(wb, `fanlar_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Excel fayl yuklab olindi!', 'success');
  };

  // Export to PDF
// Alternativ PDF eksport (oddiyroq versiya)
const exportToPDF = () => {
  const doc = new jsPDF();
  
  // Sarlavha
  doc.setFontSize(16);
  doc.text('Fanlar Ro\'yxati', 14, 15);
  doc.setFontSize(10);
  doc.text(`Sana: ${new Date().toLocaleDateString()}`, 14, 25);
  doc.text(`Jami fanlar: ${filteredSubjects.length}`, 14, 32);
  
  // Jadval
  let yPos = 45;
  doc.setFontSize(9);
  
  // Kolonkalar sarlavhasi
  const headers = ['Fan', 'Kod', 'Kredit', 'Soat', 'O\'quvchi', 'O\'rtacha'];
  let xPositions = [14, 50, 80, 100, 120, 145];
  
  headers.forEach((header, i) => {
    doc.text(header, xPositions[i], yPos);
  });
  
  yPos += 7;
  
  // Ma'lumotlar
  filteredSubjects.slice(0, 20).forEach((sub, index) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    const rowData = [
      sub.name.length > 15 ? sub.name.substring(0, 12) + '...' : sub.name,
      sub.code,
      sub.credits.toString(),
      sub.hours.toString(),
      sub.students.toString(),
      `${sub.average}%`
    ];
    
    rowData.forEach((data, i) => {
      doc.text(data, xPositions[i], yPos);
    });
    
    yPos += 6;
  });
  
  doc.save(`fanlar_${new Date().toISOString().split('T')[0]}.pdf`);
  showToast('PDF fayl yuklab olindi!', 'success');
};
  // Statistika uchun ma'lumotlar
  const getChartData = () => {
    return subjects.map(sub => ({
      name: sub.name,
      oquvchilar: sub.students,
      ortacha: sub.average
    }));
  };

  const getPieData = () => {
    const active = subjects.filter(s => s.status === 'active').length;
    const inactive = subjects.filter(s => s.status === 'inactive').length;
    return [
      { name: 'Aktiv', value: active, color: '#10b981' },
      { name: 'Noaktiv', value: inactive, color: '#ef4444' }
    ];
  };

  const totalStudents = subjects.reduce((sum, sub) => sum + sub.students, 0);
  const totalHours = subjects.reduce((sum, sub) => sum + sub.hours, 0);
  const avgGrade = Math.round(subjects.reduce((sum, sub) => sum + sub.average, 0) / subjects.length) || 0;

  return (
    <div className="subjects-page">
      <ToastContainer />
      
      <div className="page-header">
        <div>
          <h1>Fanlar</h1>
          <p>Jami {filteredSubjects.length} ta fan | {totalStudents} nafar o'quvchi</p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={exportToExcel}>
            <HiOutlineDownload /> Excel
          </button>
          <button className="btn-secondary" onClick={exportToPDF}>
            <HiOutlinePrinter /> PDF
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlinePlus /> Yangi fan
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Fan nomi, kod yoki o'qituvchi bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="filter-controls">
          <select className="filter-select" value={statusFilter} onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}>
            <option value="">Barcha fanlar</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Noaktiv</option>
          </select>
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <HiOutlineFilter /> Qo'shimcha filtr
          </button>
          <button className="btn-stats" onClick={() => setShowStatsModal(true)}>
            <HiOutlineChartPie /> Statistika
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-group">
            <label>Kredit oralig'i</label>
            <div className="filter-range">
              <input type="number" placeholder="Min" value={advancedFilters.minCredits} onChange={(e) => setAdvancedFilters({...advancedFilters, minCredits: e.target.value})} />
              <span>-</span>
              <input type="number" placeholder="Max" value={advancedFilters.maxCredits} onChange={(e) => setAdvancedFilters({...advancedFilters, maxCredits: e.target.value})} />
            </div>
          </div>
          <div className="filter-group">
            <label>Soat oralig'i</label>
            <div className="filter-range">
              <input type="number" placeholder="Min" value={advancedFilters.minHours} onChange={(e) => setAdvancedFilters({...advancedFilters, minHours: e.target.value})} />
              <span>-</span>
              <input type="number" placeholder="Max" value={advancedFilters.maxHours} onChange={(e) => setAdvancedFilters({...advancedFilters, maxHours: e.target.value})} />
            </div>
          </div>
          <div className="filter-group">
            <label>Baho oralig'i</label>
            <div className="filter-range">
              <input type="number" placeholder="Min" value={advancedFilters.minAverage} onChange={(e) => setAdvancedFilters({...advancedFilters, minAverage: e.target.value})} />
              <span>-</span>
              <input type="number" placeholder="Max" value={advancedFilters.maxAverage} onChange={(e) => setAdvancedFilters({...advancedFilters, maxAverage: e.target.value})} />
            </div>
          </div>
          <button className="btn-clear-filters" onClick={() => setAdvancedFilters({minCredits: '', maxCredits: '', minHours: '', maxHours: '', minAverage: '', maxAverage: ''})}>
            Tozalash
          </button>
        </div>
      )}

      <div className="subjects-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineBookOpen />
          </div>
          <div className="stat-info">
            <h3>Jami fanlar</h3>
            <p>{subjects.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineUsers />
          </div>
          <div className="stat-info">
            <h3>Jami o'quvchilar</h3>
            <p>{totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>Jami soatlar</h3>
            <p>{totalHours}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineChartBar />
          </div>
          <div className="stat-info">
            <h3>O'rtacha baho</h3>
            <p>{avgGrade}%</p>
          </div>
        </div>
      </div>

      {selectedSubjects.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedSubjects.length} ta fan tanlandi</span>
          <div className="bulk-actions">
            <button className="btn-danger" onClick={handleBulkDelete}>O'chirish</button>
            <button className="btn-secondary" onClick={() => setSelectedSubjects([])}>Bekor qilish</button>
          </div>
        </div>
      )}

      <div className="subjects-table-container">
        <table className="subjects-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selectedSubjects.length === currentSubjects.length && currentSubjects.length > 0} onChange={handleSelectAll} />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Fan nomi {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                Kod {sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('credits')} style={{ cursor: 'pointer' }}>
                Kredit {sortConfig.key === 'credits' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('hours')} style={{ cursor: 'pointer' }}>
                Soat {sortConfig.key === 'hours' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('students')} style={{ cursor: 'pointer' }}>
                O'quvchilar {sortConfig.key === 'students' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('teacher')} style={{ cursor: 'pointer' }}>
                O'qituvchi {sortConfig.key === 'teacher' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th onClick={() => handleSort('average')} style={{ cursor: 'pointer' }}>
                O'rtacha {sortConfig.key === 'average' && (sortConfig.direction === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
              </th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {currentSubjects.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineBookOpen size={48} />
                    <p>Hech qanday fan topilmadi</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentSubjects.map(subject => (
                <tr key={subject.id}>
                  <td>
                    <input type="checkbox" checked={selectedSubjects.includes(subject.id)} onChange={() => handleSelectSubject(subject.id)} />
                  </td>
                  <td>
                    <div className="subject-cell">
                      <div className="subject-icon">
                        <span style={{ fontSize: '24px' }}>{subject.image || '📚'}</span>
                      </div>
                      <div>
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-code">{subject.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="code-cell">{subject.code}</td>
                  <td>{subject.credits}</td>
                  <td>{subject.hours} h</td>
                  <td>{subject.students}</td>
                  <td>{subject.teacher}</td>
                  <td>
                    <div className="average-circle" style={{ 
                      background: subject.average >= 85 ? '#10b981' : subject.average >= 70 ? '#f59e0b' : '#ef4444' 
                    }}>
                      {subject.average}%
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${subject.status}`}>
                      {subject.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEdit(subject)}>
                        <HiOutlinePencil />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(subject.id)}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <HiOutlineChevronLeft />
            </button>
            {[...Array(totalPages).keys()].map(number => (
              <button key={number + 1} className={currentPage === number + 1 ? 'active' : ''} onClick={() => handlePageChange(number + 1)}>
                {number + 1}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <HiOutlineChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSubject?.id ? 'Fan ma\'lumotlarini tahrirlash' : 'Yangi fan qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Fan nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Matematika" 
                    value={editingSubject?.name || ''} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fan kodi *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: MTH101" 
                    value={editingSubject?.code || ''} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kredit soni</label>
                  <input 
                    type="number" 
                    placeholder="3" 
                    value={editingSubject?.credits || 3} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Jami soatlar</label>
                  <input 
                    type="number" 
                    placeholder="72" 
                    value={editingSubject?.hours || 72} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, hours: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'qituvchi *</label>
                  <select 
                    value={editingSubject?.teacher || ''} 
                    onChange={(e) => {
                      const teacher = teachers.find(t => t.name === e.target.value);
                      setEditingSubject({ 
                        ...editingSubject, 
                        teacher: e.target.value,
                        teacherId: teacher?.id || ''
                      });
                    }}
                  >
                    <option value="">O'qituvchi tanlang</option>
                    {teachers.map(t => <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingSubject?.status || 'active'} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, status: e.target.value })}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Noaktiv</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchilar soni</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={editingSubject?.students || 0} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, students: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>O'rtacha baho (%)</label>
                  <input 
                    type="number" 
                    placeholder="0-100" 
                    value={editingSubject?.average || 0} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, average: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fan ikonasi</label>
                  <input 
                    type="text" 
                    placeholder="📚, 📐, ⚛️, etc." 
                    value={editingSubject?.image || '📚'} 
                    onChange={(e) => setEditingSubject({ ...editingSubject, image: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingSubject?.id ? 'Yangilash' : 'Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fanlar Statistikasi</h2>
              <button className="modal-close" onClick={() => setShowStatsModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="stats-grid">
                <div className="stats-chart">
                  <h3>O'quvchilar va o'rtacha baho</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="oquvchilar" fill="#3b82f6" name="O'quvchilar" />
                      <Bar yAxisId="right" dataKey="ortacha" fill="#10b981" name="O'rtacha baho" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="stats-chart">
                  <h3>Fan holati</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={getPieData()} cx="50%" cy="50%" labelLine={false} label={entry => `${entry.name}: ${entry.value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;