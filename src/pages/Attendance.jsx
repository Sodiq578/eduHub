import React, { useState } from 'react';
import { 
  HiOutlineCalendar, 
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineUserGroup
} from 'react-icons/hi';
import './Attendance.css';
// O'CHIRILDI: HiOutlineSearch, HiOutlineFilter

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('10-A');
  
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Ali Valiyev', status: 'present', arrival: '08:00', departure: '14:30', note: '' },
    { id: 2, name: 'Dilnoza Karimova', status: 'present', arrival: '07:55', departure: '14:30', note: '' },
    { id: 3, name: 'Jasur Aliyev', status: 'late', arrival: '08:20', departure: '14:30', note: 'Trafik sababli kechikdi' },
    { id: 4, name: 'Zarina Toshpulatova', status: 'present', arrival: '08:00', departure: '14:30', note: '' },
    { id: 5, name: 'Bobur Sattorov', status: 'absent', arrival: '-', departure: '-', note: 'Kasallik sababli' },
    { id: 6, name: 'Madina Rahimova', status: 'present', arrival: '07:58', departure: '14:30', note: '' },
    { id: 7, name: 'Shoxrux Ahmedov', status: 'excused', arrival: '09:00', departure: '14:30', note: 'Shifokor qabulida' },
  ]);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  
  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter(s => s.status === 'present').length,
    late: attendanceData.filter(s => s.status === 'late').length,
    absent: attendanceData.filter(s => s.status === 'absent').length,
    excused: attendanceData.filter(s => s.status === 'excused').length,
  };

  const updateStatus = (id, newStatus) => {
    setAttendanceData(prev => prev.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  const attendanceRate = ((stats.present + stats.late) / stats.total * 100).toFixed(1);

  return (
    <div className="attendance-page">
      <div className="page-header">
        <div>
          <h1>Davomat</h1>
          <p>Kunlik davomatni kuzatish</p>
        </div>
        <button className="btn-primary">
          <HiOutlineDownload /> Hisobot yuklash
        </button>
      </div>

      <div className="attendance-controls">
        <div className="controls-group">
          <div className="control-item">
            <HiOutlineCalendar />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="control-item">
            <HiOutlineUserGroup />
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="date-info">
          {new Date(selectedDate).toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami o'quvchilar</div>
        </div>
        <div className="stat-card present">
          <div className="stat-value">{stats.present}</div>
          <div className="stat-label">Kelganlar</div>
          <div className="stat-percent">{((stats.present / stats.total) * 100).toFixed(0)}%</div>
        </div>
        <div className="stat-card late">
          <div className="stat-value">{stats.late}</div>
          <div className="stat-label">Kech kelganlar</div>
        </div>
        <div className="stat-card absent">
          <div className="stat-value">{stats.absent}</div>
          <div className="stat-label">Kelmaganiar</div>
        </div>
        <div className="stat-card excused">
          <div className="stat-value">{stats.excused}</div>
          <div className="stat-label">Uzrli</div>
        </div>
      </div>

      <div className="attendance-progress">
        <div className="progress-header">
          <span>Davomat foizi</span>
          <span className="progress-percent">{attendanceRate}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${attendanceRate}%` }}></div>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>O'quvchi</th>
              <th>Sinf</th>
              <th>Kelish vaqti</th>
              <th>Ketish vaqti</th>
              <th>Holat</th>
              <th>Izoh</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map(student => (
              <tr key={student.id} className={`status-${student.status}`}>
                <td>#{student.id}</td>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-sm">
                      {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </div>
                </td>
                <td>{selectedClass}</td>
                <td>{student.arrival}</td>
                <td>{student.departure}</td>
                <td>
                  <div className="status-buttons">
                    <button 
                      className={`status-btn present ${student.status === 'present' ? 'active' : ''}`}
                      onClick={() => updateStatus(student.id, 'present')}
                    >
                      <HiOutlineCheckCircle /> Keldi
                    </button>
                    <button 
                      className={`status-btn late ${student.status === 'late' ? 'active' : ''}`}
                      onClick={() => updateStatus(student.id, 'late')}
                    >
                      <HiOutlineClock /> Kech
                    </button>
                    <button 
                      className={`status-btn absent ${student.status === 'absent' ? 'active' : ''}`}
                      onClick={() => updateStatus(student.id, 'absent')}
                    >
                      <HiOutlineXCircle /> Kelmadi
                    </button>
                  </div>
                </td>
                <td>
                  {student.note ? (
                    <span className="note-text">{student.note}</span>
                  ) : (
                    <button className="add-note-btn">+ Izoh</button>
                  )}
                </td>
                <td>
                  <button className="action-btn edit">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;