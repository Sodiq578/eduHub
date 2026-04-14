import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlinePrinter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi';
import './Attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState(['9-A', '9-B', '10-A', '10-B', '11-A']);
  const [showStats, setShowStats] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // LocalStorage dan o'quvchilarni yuklash
  useEffect(() => {
    loadStudents();
    loadAttendanceData();
  }, []);

  // O'quvchilarni yuklash
  const loadStudents = () => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      const defaultStudents = [
        { id: 1, name: 'Ali Valiyev', class: '10-A', parent: '+998 90 123 4567', status: 'active', grade: 92, attendance: 95, email: 'ali@example.com' },
        { id: 2, name: 'Dilnoza Karimova', class: '10-B', parent: '+998 91 234 5678', status: 'active', grade: 95, attendance: 98, email: 'dilnoza@example.com' },
        { id: 3, name: 'Jasur Aliyev', class: '9-A', parent: '+998 93 345 6789', status: 'inactive', grade: 78, attendance: 85, email: 'jasur@example.com' },
        { id: 4, name: 'Zarina Toshpulatova', class: '11-A', parent: '+998 94 456 7890', status: 'active', grade: 88, attendance: 92, email: 'zarina@example.com' },
        { id: 5, name: 'Bobur Sattorov', class: '8-A', parent: '+998 95 567 8901', status: 'active', grade: 85, attendance: 90, email: 'bobur@example.com' },
      ];
      setStudents(defaultStudents);
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
  };

  // Davomat ma'lumotlarini yuklash
  const loadAttendanceData = () => {
    const storedAttendance = localStorage.getItem('attendanceData');
    if (storedAttendance) {
      setAttendanceData(JSON.parse(storedAttendance));
    }
  };

  // Davomat ma'lumotlarini saqlash
  const saveAttendanceData = (data) => {
    localStorage.setItem('attendanceData', JSON.stringify(data));
    setAttendanceData(data);
  };

  // Davomatni belgilash
  const markAttendance = (studentId, status) => {
    const key = `${selectedDate}_${studentId}`;
    const updatedData = { ...attendanceData, [key]: status };
    saveAttendanceData(updatedData);
  };

  // O'quvchining davomat holatini olish
  const getAttendanceStatus = (studentId) => {
    const key = `${selectedDate}_${studentId}`;
    return attendanceData[key] || null;
  };

  // Filtrlangan o'quvchilar
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.parent.includes(searchTerm);
    const matchesClass = selectedClass === '' || student.class === selectedClass;
    return matchesSearch && matchesClass && student.status === 'active';
  });

  // Statistika hisoblash
  const getStatistics = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'present').length;
    const absent = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'absent').length;
    const late = filteredStudents.filter(s => getAttendanceStatus(s.id) === 'late').length;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { total, present, absent, late, attendanceRate };
  };

  // Oylik statistika
  const getMonthlyStats = (studentId) => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let present = 0, absent = 0, late = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const key = `${date}_${studentId}`;
      const status = attendanceData[key];
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
    }
    
    const total = present + absent + late;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { present, absent, late, attendanceRate };
  };

  // Eksport qilish (CSV)
  const exportToCSV = () => {
    const stats = getStatistics();
    const headers = ['ID', 'Ism', 'Sinf', 'Ota-ona tel', 'Holat', 'Kelish vaqti'];
    const csvData = filteredStudents.map(s => {
      const status = getAttendanceStatus(s.id);
      let statusText = '';
      let timeText = '';
      
      if (status === 'present') {
        statusText = '✅ Keldi';
        timeText = new Date().toLocaleTimeString();
      } else if (status === 'absent') {
        statusText = '❌ Kelmadi';
        timeText = '-';
      } else if (status === 'late') {
        statusText = '⏰ Kechikdi';
        timeText = new Date().toLocaleTimeString();
      } else {
        statusText = '⚠️ Belgilanmagan';
        timeText = '-';
      }
      
      return [s.id, s.name, s.class, s.parent, statusText, timeText];
    });
    
    const summary = [
      [''],
      ['DAVOMAT HISOBOTI'],
      [`Sana: ${selectedDate}`],
      [`Jami o'quvchilar: ${stats.total}`],
      [`Keldi: ${stats.present}`],
      [`Kelmadi: ${stats.absent}`],
      [`Kechikdi: ${stats.late}`],
      [`Davomat foizi: ${stats.attendanceRate}%`],
      ['']
    ];
    
    const csvContent = [...summary, headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chop etish
  const handlePrint = () => {
    window.print();
  };

  // Barcha o'quvchilarni belgilash
  const markAll = (status) => {
    filteredStudents.forEach(student => {
      markAttendance(student.id, status);
    });
  };

  const stats = getStatistics();

  // Hafta kunlari
  const weekDays = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
  const currentDayOfWeek = new Date(selectedDate).getDay();
  const adjustedDayOfWeek = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

  // Statistik karta komponenti
  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="attendance-stat-card" style={{ background: bgColor }}>
      <div className="stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Davomat</h1>
          <p>O'quvchilarning davomatini kuzatish va boshqarish</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handlePrint}>
            <HiOutlinePrinter /> Chop etish
          </button>
          <button className="btn-primary" onClick={exportToCSV}>
            <HiOutlineDownload /> Eksport
          </button>
        </div>
      </div>

      {/* Statistika kartalari */}
      <div className="attendance-stats-grid">
        <StatCard 
          title="Jami o'quvchilar" 
          value={stats.total} 
          icon={<HiOutlineUser />} 
          color="#3b82f6"
          bgColor="#eff6ff"
        />
        <StatCard 
          title="Keldi" 
          value={stats.present} 
          icon={<HiOutlineCheckCircle />} 
          color="#10b981"
          bgColor="#f0fdf4"
        />
        <StatCard 
          title="Kelmadi" 
          value={stats.absent} 
          icon={<HiOutlineXCircle />} 
          color="#ef4444"
          bgColor="#fef2f2"
        />
        <StatCard 
          title="Kechikdi" 
          value={stats.late} 
          icon={<HiOutlineClock />} 
          color="#f59e0b"
          bgColor="#fffbeb"
        />
        <StatCard 
          title="Davomat foizi" 
          value={`${stats.attendanceRate}%`} 
          icon={<HiOutlineChartBar />} 
          color="#8b5cf6"
          bgColor="#f5f3ff"
        />
      </div>

      {/* Boshqaruv paneli */}
      <div className="attendance-controls">
        <div className="date-controls">
          <div className="date-picker-wrapper">
            <HiOutlineCalendar />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="date-picker"
            />
          </div>
          <div className="day-info">
            <span className="day-badge">{weekDays[adjustedDayOfWeek]}</span>
          </div>
        </div>

        <div className="filter-controls">
          <div className="search-wrapper">
            <HiOutlineSearch />
            <input 
              type="text" 
              placeholder="Ism yoki ota-ona telefon bo'yicha qidirish..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="class-select" 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Barcha sinflar</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="bulk-actions">
          <button className="bulk-btn present" onClick={() => markAll('present')}>
            <HiOutlineCheckCircle /> Hammasini keldi
          </button>
          <button className="bulk-btn absent" onClick={() => markAll('absent')}>
            <HiOutlineXCircle /> Hammasini kelmadi
          </button>
          <button className="bulk-btn late" onClick={() => markAll('late')}>
            <HiOutlineClock /> Hammasini kechikdi
          </button>
        </div>
      </div>

      {/* Davomat jadvali */}
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>#</th>
              <th>O'quvchi ismi</th>
              <th>Sinf</th>
              <th>Ota-ona telefoni</th>
              <th>Davomat holati</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineUser size={48} />
                    <p>Hech qanday o'quvchi topilmadi</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => {
                const status = getAttendanceStatus(student.id);
                return (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">{student.name.charAt(0)}</div>
                        <div className="student-details">
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="class-badge">{student.class}</span></td>
                    <td>{student.parent}</td>
                    <td>
                      <div className="status-indicator">
                        {status === 'present' && (
                          <span className="status-badge present">
                            <HiOutlineCheckCircle /> Keldi
                          </span>
                        )}
                        {status === 'absent' && (
                          <span className="status-badge absent">
                            <HiOutlineXCircle /> Kelmadi
                          </span>
                        )}
                        {status === 'late' && (
                          <span className="status-badge late">
                            <HiOutlineClock /> Kechikdi
                          </span>
                        )}
                        {!status && (
                          <span className="status-badge pending">
                            <HiOutlineClock /> Belgilanmagan
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="attendance-actions">
                        <button 
                          className={`attendance-btn present ${status === 'present' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'present')}
                          title="Keldi"
                        >
                          <HiOutlineCheckCircle />
                        </button>
                        <button 
                          className={`attendance-btn absent ${status === 'absent' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'absent')}
                          title="Kelmadi"
                        >
                          <HiOutlineXCircle />
                        </button>
                        <button 
                          className={`attendance-btn late ${status === 'late' ? 'active' : ''}`}
                          onClick={() => markAttendance(student.id, 'late')}
                          title="Kechikdi"
                        >
                          <HiOutlineClock />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Statistika toggle */}
      <div className="stats-toggle">
        <button 
          className={`toggle-btn ${showStats ? 'active' : ''}`}
          onClick={() => setShowStats(!showStats)}
        >
          <HiOutlineChartBar /> Oylik statistika
        </button>
      </div>

      {/* Oylik statistika jadvali */}
      {showStats && (
        <div className="monthly-stats">
          <div className="stats-header">
            <h3>Oylik davomat statistikasi</h3>
            <div className="month-navigation">
              <button onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}>
                <HiOutlineChevronLeft />
              </button>
              <span>{`${currentYear} - ${currentMonth + 1}`}</span>
              <button onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}>
                <HiOutlineChevronRight />
              </button>
            </div>
          </div>
          <div className="stats-table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>O'quvchi</th>
                  <th>Sinf</th>
                  <th>Keldi</th>
                  <th>Kelmadi</th>
                  <th>Kechikdi</th>
                  <th>Davomat %</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const monthlyStats = getMonthlyStats(student.id);
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td className="stats-present">{monthlyStats.present}</td>
                      <td className="stats-absent">{monthlyStats.absent}</td>
                      <td className="stats-late">{monthlyStats.late}</td>
                      <td>
                        <div className="stats-percentage">
                          <div 
                            className="percentage-bar" 
                            style={{ width: `${monthlyStats.attendanceRate}%` }}
                          ></div>
                          <span>{monthlyStats.attendanceRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;