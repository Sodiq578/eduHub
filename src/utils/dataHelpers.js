// Student ma'lumotlarini olish
export const getStudentById = (studentId) => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  return students.find(s => s.id === studentId);
};

// Studentning to'lovlarini olish
export const getStudentPayments = (studentId) => {
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  return payments.filter(p => p.studentId === studentId);
};

// Studentning davomatini olish
export const getStudentAttendance = (studentId) => {
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  return attendance.filter(a => a.studentId === studentId);
};

// Studentning baholarini olish
export const getStudentGrades = (studentId) => {
  const grades = JSON.parse(localStorage.getItem('grades') || '[]');
  return grades.filter(g => g.studentId === studentId);
};

// O'qituvchining fanlarini olish
export const getTeacherSubjects = (teacherName) => {
  const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
  return subjects.filter(s => s.teacher === teacherName);
};

// Sinfdagi o'quvchilarni olish
export const getStudentsByClass = (className) => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  return students.filter(s => s.class === className);
};

// Sinf uchun uy vazifalarini olish
export const getHomeworkByClass = (className) => {
  const homeworks = JSON.parse(localStorage.getItem('homeworks') || '[]');
  return homeworks.filter(h => h.class === className);
};

// Fan bo'yicha imtihonlarni olish
export const getExamsBySubject = (subject) => {
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  return exams.filter(e => e.subject === subject);
};

// Umumiy statistikani olish
export const getOverallStats = () => {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
  const grades = JSON.parse(localStorage.getItem('grades') || '[]');
  
  return {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalIncome: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    avgAttendance: (attendance.filter(a => a.status === 'present').length / attendance.length * 100 || 0).toFixed(1),
    avgGrade: (grades.reduce((sum, g) => sum + g.score, 0) / grades.length || 0).toFixed(1)
  };
};