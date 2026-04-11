import React, { useState } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlineUserAdd, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineDotsVertical
} from 'react-icons/hi';
import './Teachers.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: 'Shahzoda Ahmedova', 
      subject: 'Matematika', 
      phone: '+998 90 123 4567', 
      email: 'shahzoda@edu.uz',
      experience: 8,
      rating: 4.8,
      students: 120,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?background=10b981&color=fff&name=Shahzoda+A'
    },
    { 
      id: 2, 
      name: 'Rustam Karimov', 
      subject: 'Fizika', 
      phone: '+998 91 234 5678', 
      email: 'rustam@edu.uz',
      experience: 12,
      rating: 4.9,
      students: 95,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=Rustam+K'
    },
    { 
      id: 3, 
      name: 'Gulnora Saidova', 
      subject: 'Ingliz tili', 
      phone: '+998 93 345 6789', 
      email: 'gulnora@edu.uz',
      experience: 5,
      rating: 4.7,
      students: 150,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?background=f59e0b&color=fff&name=Gulnora+S'
    },
    { 
      id: 4, 
      name: 'Alisher Tursunov', 
      subject: 'Tarix', 
      phone: '+998 94 456 7890', 
      email: 'alisher@edu.uz',
      experience: 15,
      rating: 4.9,
      students: 80,
      status: 'inactive',
      avatar: 'https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=Alisher+T'
    },
    { 
      id: 5, 
      name: 'Nilufar Rahimova', 
      subject: 'Biologiya', 
      phone: '+998 95 567 8901', 
      email: 'nilufar@edu.uz',
      experience: 6,
      rating: 4.8,
      students: 110,
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?background=ef4444&color=fff&name=Nilufar+R'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedSubject, setSelectedSubject] = useState('');

  const subjects = ['Hammasi', 'Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya'];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || selectedSubject === 'Hammasi' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<HiOutlineStar key={i} className="star-filled" />);
    }
    if (hasHalfStar) {
      stars.push(<HiOutlineStar key="half" className="star-half" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<HiOutlineStar key={`empty-${i}`} className="star-empty" />);
    }
    return stars;
  };

  return (
    <div className="teachers-page">
      <div className="page-header">
        <div>
          <h1>O'qituvchilar</h1>
          <p>Jami {filteredTeachers.length} nafar o'qituvchi</p>
        </div>
        <button className="btn-primary">
          <HiOutlineUserAdd /> Yangi o'qituvchi
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Ism yoki fan bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select className="filter-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            {subjects.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              ⊞
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              ☰
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="teachers-grid">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-card-header">
                <div className="teacher-avatar-wrapper">
                  <img src={teacher.avatar} alt={teacher.name} className="teacher-avatar" />
                  <div className={`status-dot ${teacher.status}`}></div>
                </div>
                <button className="card-menu-btn">
                  <HiOutlineDotsVertical />
                </button>
              </div>
              <div className="teacher-card-body">
                <h3>{teacher.name}</h3>
                <p className="teacher-subject">{teacher.subject}</p>
                <div className="teacher-rating">
                  {getRatingStars(teacher.rating)}
                  <span>{teacher.rating}</span>
                </div>
                <div className="teacher-stats">
                  <div className="stat">
                    <HiOutlineCalendar />
                    <span>{teacher.experience} yil</span>
                  </div>
                  <div className="stat">
                    <HiOutlineBookOpen />
                    <span>{teacher.students} talaba</span>
                  </div>
                </div>
                <div className="teacher-contacts">
                  <div className="contact-item">
                    <HiOutlinePhone />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="contact-item">
                    <HiOutlineMail />
                    <span>{teacher.email}</span>
                  </div>
                </div>
              </div>
              <div className="teacher-card-footer">
                <button className="card-btn edit-btn">
                  <HiOutlinePencil /> Tahrirlash
                </button>
                <button className="card-btn delete-btn">
                  <HiOutlineTrash /> O'chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="teachers-list-container">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>O'qituvchi</th>
                <th>Fan</th>
                <th>Staj</th>
                <th>Talabalar</th>
                <th>Reyting</th>
                <th>Holat</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>
                    <div className="teacher-cell">
                      <img src={teacher.avatar} alt={teacher.name} className="list-avatar" />
                      <div>
                        <div className="teacher-name">{teacher.name}</div>
                        <div className="teacher-contact-small">
                          <HiOutlinePhone /> {teacher.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="subject-badge">{teacher.subject}</span>
                  </td>
                  <td>{teacher.experience} yil</td>
                  <td>{teacher.students}</td>
                  <td>
                    <div className="rating-small">
                      {getRatingStars(teacher.rating)}
                      <span>{teacher.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${teacher.status}`}>
                      {teacher.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                    </span>
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
      )}
    </div>
  );
};

export default Teachers;