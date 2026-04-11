import React, { useState, useEffect } from 'react';
import { 
  HiOutlineUser, 
  HiOutlineBookOpen, 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineX
} from 'react-icons/hi';
import './Schedule.css';

const Schedule = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'];
  const timeSlots = ['08:00-09:30', '09:45-11:15', '11:30-13:00', '14:00-15:30'];
  const classes = ['9-A', '9-B', '10-A', '10-B', '11-A'];
  const subjects = ['Matematika', 'Fizika', 'Ingliz tili', 'Tarix', 'Biologiya', 'Kimyo', 'O\'zbek tili', 'Jismoniy tarbiya'];
  const teachers = ['Shahzoda Ahmedova', 'Rustam Karimov', 'Gulnora Saidova', 'Alisher Tursunov', 'Nilufar Rahimova', 'Dilbar To\'xtayeva'];

  useEffect(() => {
    const stored = localStorage.getItem('schedule');
    if (stored) {
      setSchedule(JSON.parse(stored));
    } else {
      const defaultSchedule = [
        { id: 1, day: 'Dushanba', time: '08:00-09:30', subject: 'Matematika', teacher: 'Shahzoda Ahmedova', room: '201', class: '10-A' },
        { id: 2, day: 'Dushanba', time: '09:45-11:15', subject: 'Fizika', teacher: 'Rustam Karimov', room: '202', class: '10-A' },
        { id: 3, day: 'Seshanba', time: '08:00-09:30', subject: 'Ingliz tili', teacher: 'Gulnora Saidova', room: '101', class: '10-A' },
        { id: 4, day: 'Chorshanba', time: '08:00-09:30', subject: 'Tarix', teacher: 'Alisher Tursunov', room: '301', class: '10-A' },
        { id: 5, day: 'Payshanba', time: '08:00-09:30', subject: 'Biologiya', teacher: 'Nilufar Rahimova', room: '102', class: '10-A' },
        { id: 6, day: 'Juma', time: '08:00-09:30', subject: 'Kimyo', teacher: 'Dilbar To\'xtayeva', room: '103', class: '10-A' },
      ];
      setSchedule(defaultSchedule);
      localStorage.setItem('schedule', JSON.stringify(defaultSchedule));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  const getScheduleForClass = (className) => schedule.filter(s => s.class === className);

  const addOrUpdateLesson = () => {
    if (!editingLesson.subject || !editingLesson.teacher) {
      alert('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    if (editingLesson.id) {
      setSchedule(schedule.map(l => l.id === editingLesson.id ? editingLesson : l));
    } else {
      setSchedule([...schedule, { 
        ...editingLesson, 
        id: Date.now(), 
        class: selectedClass, 
        day: selectedDay, 
        time: selectedTime 
      }]);
    }
    setShowModal(false);
    setEditingLesson(null);
    setSelectedDay('');
    setSelectedTime('');
  };

  const deleteLesson = (id) => {
    if (window.confirm('Darsni o\'chirmoqchimisiz?')) {
      setSchedule(schedule.filter(l => l.id !== id));
    }
  };

  const openAddModal = (day, time) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setEditingLesson({ subject: '', teacher: '', room: '' });
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setShowModal(true);
  };

  const changeWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  const weekDays = days.map((day, idx) => {
    const date = new Date(currentWeek);
    date.setDate(currentWeek.getDate() - currentWeek.getDay() + idx + 1);
    return { day, date };
  });

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div>
          <h1>Dars jadvali</h1>
          <p>Haftalik dars jadvali</p>
        </div>
        <select className="class-selector" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="schedule-controls">
        <button onClick={() => changeWeek(-1)}><HiOutlineChevronLeft /></button>
        <span>{currentWeek.toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => changeWeek(1)}><HiOutlineChevronRight /></button>
      </div>

      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Vaqt</th>
              {weekDays.map(({ day, date }) => (
                <th key={day}>
                  {day}<br />
                  <small>{date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'numeric' })}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot}>
                <td className="time-cell">{timeSlot}</td>
                {days.map(day => {
                  const lesson = getScheduleForClass(selectedClass).find(l => l.day === day && l.time === timeSlot);
                  return (
                    <td key={day} className="lesson-cell">
                      {lesson ? (
                        <div className="lesson-info">
                          <div className="lesson-subject">{lesson.subject}</div>
                          <div className="lesson-details">
                            <HiOutlineUser /> {lesson.teacher}<br />
                            <HiOutlineBookOpen /> Xona: {lesson.room}
                          </div>
                          <div className="lesson-actions">
                            <button className="edit-lesson" onClick={() => openEditModal(lesson)}><HiOutlinePencil /></button>
                            <button className="delete-lesson" onClick={() => deleteLesson(lesson.id)}><HiOutlineTrash /></button>
                          </div>
                        </div>
                      ) : (
                        <button className="empty-lesson" onClick={() => openAddModal(day, timeSlot)}>
                          <HiOutlinePlus /> Dars qo'shish
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingLesson?.id ? 'Dars tahrirlash' : 'Yangi dars'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <select 
                value={editingLesson?.subject || ''} 
                onChange={(e) => setEditingLesson({ ...editingLesson, subject: e.target.value })}
              >
                <option value="">Fan tanlang</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select 
                value={editingLesson?.teacher || ''} 
                onChange={(e) => setEditingLesson({ ...editingLesson, teacher: e.target.value })}
              >
                <option value="">O'qituvchi tanlang</option>
                {teachers.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input 
                type="text" 
                placeholder="Xona raqami" 
                value={editingLesson?.room || ''} 
                onChange={(e) => setEditingLesson({ ...editingLesson, room: e.target.value })}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={addOrUpdateLesson}>Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;