import React, { useState } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineStar,
  HiOutlineDownload
} from 'react-icons/hi';
import './Grades.css';

const Grades = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [selectedQuarter, setSelectedQuarter] = useState('1-chorak');

  const [grades] = useState([
    { id: 1, name: 'Ali Valiyev', grades: [5, 4, 5, 4, 5], average: 4.6, trend: 'up' },
    { id: 2, name: 'Dilnoza Karimova', grades: [5, 5, 5, 5, 5], average: 5.0, trend: 'up' },
    { id: 3, name: 'Jasur Aliyev', grades: [4, 4, 3, 4, 4], average: 3.8, trend: 'down' },
    { id: 4, name: 'Zarina Toshpulatova', grades: [5, 4, 5, 5, 4], average: 4.6, trend: 'up' },
    { id: 5, name: 'Bobur Sattorov', grades: [3, 4, 3, 4, 3], average: 3.4, trend: 'down' },
    { id: 6, name: 'Madina Rahimova', grades: [5, 5, 4, 5, 5], average: 4.8, trend: 'up' },
  ]);

  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  const subjects = ['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo'];
  const quarters = ['1-chorak', '2-chorak', '3-chorak', '4-chorak', 'Yillik'];

  const classAverage = (grades.reduce((sum, student) => sum + student.average, 0) / grades.length).toFixed(1);
  const highestGrade = Math.max(...grades.map(s => s.average));
  const lowestGrade = Math.min(...grades.map(s => s.average));

  return (
    <div className="grades-page">
      <div className="page-header">
        <div>
          <h1>Baholar</h1>
          <p>O'quvchilarning akademik ko'rsatkichlari</p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary">
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-primary">
            <HiOutlinePlus /> Baho qo'shish
          </button>
        </div>
      </div>

      <div className="grades-controls">
        <div className="controls-group">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)}>
            {quarters.map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grades-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineChartBar />
          </div>
          <div className="stat-info">
            <h3>Sinf o'rtacha</h3>
            <p>{classAverage}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineTrendingUp />
          </div>
          <div className="stat-info">
            <h3>Eng yuqori</h3>
            <p>{highestGrade}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineTrendingDown />
          </div>
          <div className="stat-info">
            <h3>Eng past</h3>
            <p>{lowestGrade}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineStar />
          </div>
          <div className="stat-info">
            <h3>5 liklar soni</h3>
            <p>{grades.reduce((sum, s) => sum + s.grades.filter(g => g === 5).length, 0)}</p>
          </div>
        </div>
      </div>

      <div className="grades-table-container">
        <table className="grades-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>O'quvchi</th>
              <th>1-chorak</th>
              <th>2-chorak</th>
              <th>3-chorak</th>
              <th>4-chorak</th>
              <th>O'rtacha</th>
              <th>Trend</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(student => (
              <tr key={student.id}>
                <td>#{student.id}</td>
                <td>
                  <div className="student-cell">
                    <div className="student-avatar-sm">
                      {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </div>
                </td>
                {student.grades.map((grade, idx) => (
                  <td key={idx}>
                    <span className={`grade-badge grade-${grade}`}>{grade}</span>
                  </td>
                ))}
                <td>
                  <div className="average-circle" style={{ 
                    background: student.average >= 4.5 ? '#10b981' : student.average >= 3.5 ? '#f59e0b' : '#ef4444' 
                  }}>
                    {student.average}
                  </div>
                </td>
                <td>
                  {student.trend === 'up' ? (
                    <HiOutlineTrendingUp className="trend-up" />
                  ) : (
                    <HiOutlineTrendingDown className="trend-down" />
                  )}
                </td>
                <td>
                  <button className="action-btn edit"><HiOutlinePencil /></button>
                  <button className="action-btn delete"><HiOutlineTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grades-summary">
        <div className="summary-card">
          <h4>Baholar taqsimoti</h4>
          <div className="distribution">
            <div className="dist-item">
              <span className="dist-label">5</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '45%', background: '#10b981' }}></div>
              </div>
              <span className="dist-value">45%</span>
            </div>
            <div className="dist-item">
              <span className="dist-label">4</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '30%', background: '#3b82f6' }}></div>
              </div>
              <span className="dist-value">30%</span>
            </div>
            <div className="dist-item">
              <span className="dist-label">3</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '20%', background: '#f59e0b' }}></div>
              </div>
              <span className="dist-value">20%</span>
            </div>
            <div className="dist-item">
              <span className="dist-label">2</span>
              <div className="dist-bar">
                <div className="dist-fill" style={{ width: '5%', background: '#ef4444' }}></div>
              </div>
              <span className="dist-value">5%</span>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <h4>Eng yaxshi o'quvchilar</h4>
          <div className="top-performers">
            {grades.slice(0, 3).map((student, idx) => (
              <div key={idx} className="performer-item">
                <div className="performer-rank">{idx + 1}</div>
                <div className="performer-info">
                  <div className="performer-name">{student.name}</div>
                  <div className="performer-grade">O'rtacha: {student.average}</div>
                </div>
                <div className="performer-medal">
                  {idx === 0 && '🥇'}
                  {idx === 1 && '🥈'}
                  {idx === 2 && '🥉'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;