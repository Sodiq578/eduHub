import {
  defaultStudents,
  defaultTeachers,
  defaultClasses,
  defaultSubjects,
  defaultAttendance,
  defaultGrades,
  defaultPayments,
  defaultHomeworks,
  defaultExams,
  defaultSchedule,
  defaultLibrary,
  defaultCafeteria,
  defaultMedicalRecords,
  defaultNotifications,
  defaultAnnouncements
} from '../data/defaultData';

// Umumiy ma'lumotlarni yuklash funksiyasi
export const initializeData = () => {
  // Students
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify(defaultStudents));
  }

  // Teachers
  if (!localStorage.getItem('teachers')) {
    localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
  }

  // Classes
  if (!localStorage.getItem('classes')) {
    localStorage.setItem('classes', JSON.stringify(defaultClasses));
  }

  // Subjects
  if (!localStorage.getItem('subjects')) {
    localStorage.setItem('subjects', JSON.stringify(defaultSubjects));
  }

  // Attendance
  if (!localStorage.getItem('attendance')) {
    localStorage.setItem('attendance', JSON.stringify(defaultAttendance));
  }

  // Grades
  if (!localStorage.getItem('grades')) {
    localStorage.setItem('grades', JSON.stringify(defaultGrades));
  }

  // Payments
  if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify(defaultPayments));
  }

  // Homeworks
  if (!localStorage.getItem('homeworks')) {
    localStorage.setItem('homeworks', JSON.stringify(defaultHomeworks));
  }

  // Exams
  if (!localStorage.getItem('exams')) {
    localStorage.setItem('exams', JSON.stringify(defaultExams));
  }

  // Schedule
  if (!localStorage.getItem('schedule')) {
    localStorage.setItem('schedule', JSON.stringify(defaultSchedule));
  }

  // Library
  if (!localStorage.getItem('library_books')) {
    localStorage.setItem('library_books', JSON.stringify(defaultLibrary));
  }

  // Cafeteria
  if (!localStorage.getItem('cafeteria_menu')) {
    localStorage.setItem('cafeteria_menu', JSON.stringify(defaultCafeteria));
  }

  // Medical Records
  if (!localStorage.getItem('medical_records')) {
    localStorage.setItem('medical_records', JSON.stringify(defaultMedicalRecords));
  }

  // Notifications
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify(defaultNotifications));
  }

  // Announcements
  if (!localStorage.getItem('announcements')) {
    localStorage.setItem('announcements', JSON.stringify(defaultAnnouncements));
  }
};

// Ma'lumotlarni yangilash funksiyalari
export const updateStudents = (students) => {
  localStorage.setItem('students', JSON.stringify(students));
};

export const updateTeachers = (teachers) => {
  localStorage.setItem('teachers', JSON.stringify(teachers));
};

export const updateClasses = (classes) => {
  localStorage.setItem('classes', JSON.stringify(classes));
};

export const updateSubjects = (subjects) => {
  localStorage.setItem('subjects', JSON.stringify(subjects));
};

export const updateAttendance = (attendance) => {
  localStorage.setItem('attendance', JSON.stringify(attendance));
};

export const updateGrades = (grades) => {
  localStorage.setItem('grades', JSON.stringify(grades));
};

export const updatePayments = (payments) => {
  localStorage.setItem('payments', JSON.stringify(payments));
};

export const updateHomeworks = (homeworks) => {
  localStorage.setItem('homeworks', JSON.stringify(homeworks));
};

// Ma'lumotlarni o'chirish funksiyasi
export const clearAllData = () => {
  localStorage.clear();
  initializeData();
};