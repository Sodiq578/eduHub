export const defaultStudents = [
  { id: 1, name: 'Ali Valiyev', class: '10-A', parent: '+998 90 123 4567', parentName: 'Vali Valiyev', parentEmail: 'vali@example.com', status: 'active', grade: 92, attendance: 95, email: 'ali@example.com', address: 'Toshkent sh.', birthDate: '2010-05-15', gender: 'Erkak' },
  { id: 2, name: 'Dilnoza Karimova', class: '10-B', parent: '+998 91 234 5678', parentName: 'Karim Karimov', parentEmail: 'karim@example.com', status: 'active', grade: 95, attendance: 98, email: 'dilnoza@example.com', address: 'Toshkent sh.', birthDate: '2010-08-22', gender: 'Ayol' },
  { id: 3, name: 'Jasur Aliyev', class: '9-A', parent: '+998 93 345 6789', parentName: 'Ali Aliyev', parentEmail: 'ali@example.com', status: 'inactive', grade: 78, attendance: 85, email: 'jasur@example.com', address: 'Toshkent sh.', birthDate: '2011-03-10', gender: 'Erkak' },
  { id: 4, name: 'Zarina Toshpulatova', class: '11-A', parent: '+998 94 456 7890', parentName: 'Toshpulat Toshpulatov', parentEmail: 'toshpulat@example.com', status: 'active', grade: 88, attendance: 92, email: 'zarina@example.com', address: 'Toshkent sh.', birthDate: '2009-11-30', gender: 'Ayol' },
  { id: 5, name: 'Bobur Sattorov', class: '8-A', parent: '+998 95 567 8901', parentName: 'Sattor Sattorov', parentEmail: 'sattor@example.com', status: 'active', grade: 85, attendance: 90, email: 'bobur@example.com', address: 'Toshkent sh.', birthDate: '2012-07-19', gender: 'Erkak' },
];

export const defaultTeachers = [
  { id: 1, name: 'Shahzoda Ahmedova', subject: 'Matematika', phone: '+998 90 123 4567', email: 'shahzoda@edu.uz', experience: 8, rating: 4.8, students: 120, status: 'active' },
  { id: 2, name: 'Rustam Karimov', subject: 'Fizika', phone: '+998 91 234 5678', email: 'rustam@edu.uz', experience: 12, rating: 4.9, students: 95, status: 'active' },
  { id: 3, name: 'Gulnora Saidova', subject: 'Ingliz tili', phone: '+998 93 345 6789', email: 'gulnora@edu.uz', experience: 5, rating: 4.7, students: 150, status: 'active' },
  { id: 4, name: 'Alisher Tursunov', subject: 'Tarix', phone: '+998 94 456 7890', email: 'alisher@edu.uz', experience: 15, rating: 4.9, students: 80, status: 'active' },
  { id: 5, name: 'Nilufar Rahimova', subject: 'Biologiya', phone: '+998 95 567 8901', email: 'nilufar@edu.uz', experience: 6, rating: 4.8, students: 110, status: 'active' },
];

export const defaultClasses = [
  { id: 1, name: '10-A', grade: 10, section: 'A', students: 28, teacher: 'Shahzoda Ahmedova', room: '201', schedule: '08:00 - 14:30', average: 87 },
  { id: 2, name: '10-B', grade: 10, section: 'B', students: 26, teacher: 'Rustam Karimov', room: '202', schedule: '08:00 - 14:30', average: 84 },
  { id: 3, name: '9-A', grade: 9, section: 'A', students: 30, teacher: 'Gulnora Saidova', room: '101', schedule: '08:00 - 14:30', average: 82 },
  { id: 4, name: '11-A', grade: 11, section: 'A', students: 24, teacher: 'Alisher Tursunov', room: '301', schedule: '08:00 - 14:30', average: 89 },
  { id: 5, name: '8-A', grade: 8, section: 'A', students: 32, teacher: 'Nilufar Rahimova', room: '102', schedule: '08:00 - 14:30', average: 79 },
];

export const defaultSubjects = [
  { id: 1, name: 'Matematika', code: 'MTH101', credits: 5, hours: 120, students: 180, teacher: 'Shahzoda Ahmedova', average: 85, status: 'active' },
  { id: 2, name: 'Fizika', code: 'PHY101', credits: 4, hours: 96, students: 150, teacher: 'Rustam Karimov', average: 82, status: 'active' },
  { id: 3, name: 'Ingliz tili', code: 'ENG101', credits: 3, hours: 72, students: 200, teacher: 'Gulnora Saidova', average: 88, status: 'active' },
  { id: 4, name: 'Tarix', code: 'HIS101', credits: 3, hours: 72, students: 140, teacher: 'Alisher Tursunov', average: 86, status: 'active' },
  { id: 5, name: 'Biologiya', code: 'BIO101', credits: 4, hours: 96, students: 120, teacher: 'Nilufar Rahimova', average: 84, status: 'active' },
];

export const defaultAttendance = [
  { id: 1, studentId: 1, studentName: 'Ali Valiyev', class: '10-A', date: '2024-12-01', status: 'present', arrival: '08:00', departure: '14:30' },
  { id: 2, studentId: 2, studentName: 'Dilnoza Karimova', class: '10-B', date: '2024-12-01', status: 'present', arrival: '07:55', departure: '14:30' },
  { id: 3, studentId: 3, studentName: 'Jasur Aliyev', class: '9-A', date: '2024-12-01', status: 'late', arrival: '08:20', departure: '14:30' },
  { id: 4, studentId: 4, studentName: 'Zarina Toshpulatova', class: '11-A', date: '2024-12-01', status: 'present', arrival: '08:00', departure: '14:30' },
  { id: 5, studentId: 5, studentName: 'Bobur Sattorov', class: '8-A', date: '2024-12-01', status: 'absent', arrival: '-', departure: '-' },
];

export const defaultGrades = [
  { id: 1, studentId: 1, studentName: 'Ali Valiyev', class: '10-A', subject: 'Matematika', score: 5, date: '2024-12-01', quarter: 1 },
  { id: 2, studentId: 1, studentName: 'Ali Valiyev', class: '10-A', subject: 'Fizika', score: 4, date: '2024-12-01', quarter: 1 },
  { id: 3, studentId: 2, studentName: 'Dilnoza Karimova', class: '10-B', subject: 'Matematika', score: 5, date: '2024-12-01', quarter: 1 },
  { id: 4, studentId: 3, studentName: 'Jasur Aliyev', class: '9-A', subject: 'Matematika', score: 3, date: '2024-12-01', quarter: 1 },
  { id: 5, studentId: 4, studentName: 'Zarina Toshpulatova', class: '11-A', subject: 'Tarix', score: 4, date: '2024-12-01', quarter: 1 },
];

export const defaultPayments = [
  { id: 1, studentId: 1, student: 'Ali Valiyev', class: '10-A', amount: 500000, date: '2024-12-01', method: 'Naqd', status: 'paid', type: 'Oylik to\'lov' },
  { id: 2, studentId: 2, student: 'Dilnoza Karimova', class: '10-B', amount: 500000, date: '2024-12-02', method: 'Plastik', status: 'paid', type: 'Oylik to\'lov' },
  { id: 3, studentId: 3, student: 'Jasur Aliyev', class: '9-A', amount: 500000, date: '2024-12-03', method: 'Click', status: 'pending', type: 'Oylik to\'lov' },
];

export const defaultHomeworks = [
  { id: 1, title: 'Matematika 5-misol', subject: 'Matematika', class: '10-A', dueDate: '2024-12-20', status: 'pending', description: '5-misolni yechish', createdAt: '2024-12-15', teacher: 'Shahzoda Ahmedova' },
  { id: 2, title: 'Fizika 10-topshiriq', subject: 'Fizika', class: '10-B', dueDate: '2024-12-18', status: 'submitted', description: 'Laboratoriya ishi', createdAt: '2024-12-14', teacher: 'Rustam Karimov' },
  { id: 3, title: 'Ingliz tili matn', subject: 'Ingliz tili', class: '9-A', dueDate: '2024-12-22', status: 'pending', description: 'Matn o\'qish va tarjima qilish', createdAt: '2024-12-16', teacher: 'Gulnora Saidova' },
];

export const defaultExams = [
  { id: 1, title: 'Matematika 1-chorak', subject: 'Matematika', date: '2024-12-15', duration: 60, totalScore: 50, status: 'upcoming', questions: 25 },
  { id: 2, title: 'Fizika O\'rtacha', subject: 'Fizika', date: '2024-12-10', duration: 45, totalScore: 40, status: 'completed', questions: 20 },
  { id: 3, title: 'Ingliz tili Test', subject: 'Ingliz tili', date: '2024-12-20', duration: 30, totalScore: 30, status: 'upcoming', questions: 15 },
];

export const defaultSchedule = [
  { id: 1, day: 'Dushanba', time: '08:00-09:30', subject: 'Matematika', teacher: 'Shahzoda Ahmedova', room: '201', class: '10-A' },
  { id: 2, day: 'Dushanba', time: '09:45-11:15', subject: 'Fizika', teacher: 'Rustam Karimov', room: '202', class: '10-A' },
  { id: 3, day: 'Seshanba', time: '08:00-09:30', subject: 'Ingliz tili', teacher: 'Gulnora Saidova', room: '101', class: '10-A' },
];

export const defaultLibrary = [
  { id: 1, title: 'Matematika 10-sinf', author: 'Sh. Ahmedova', isbn: '978-9943-01-001', quantity: 15, available: 12, category: 'Darslik' },
  { id: 2, title: 'Fizika asoslari', author: 'R. Karimov', isbn: '978-9943-01-002', quantity: 10, available: 8, category: 'Darslik' },
  { id: 3, title: 'Ingliz tili grammatikasi', author: 'G. Saidova', isbn: '978-9943-01-003', quantity: 20, available: 18, category: 'Qo\'llanma' },
];

export const defaultCafeteria = [
  { id: 1, day: 'Dushanba', mealType: 'Nonushta', name: 'Bochka', price: 15000, calories: 450, ingredients: ['Non', 'Tuxum', 'Sariyog'] },
  { id: 2, day: 'Dushanba', mealType: 'Tushlik', name: 'Palov', price: 25000, calories: 650, ingredients: ['Guruch', 'Go\'sht', 'Sabzi'] },
  { id: 3, day: 'Seshanba', mealType: 'Nonushta', name: 'Kasha', price: 12000, calories: 350, ingredients: ['Guruch', 'Sut', 'Shakar'] },
];

export const defaultMedicalRecords = [
  { id: 1, studentId: 1, studentName: 'Ali Valiyev', condition: 'Allergiya', diagnosis: 'Yong\'oqqa allergiya', date: '2024-09-01', medications: 'Antigistamin', emergency: true, notes: 'Shifokor ko\'rigidan o\'tgan', bloodType: 'O+', height: 165, weight: 55 },
  { id: 2, studentId: 3, studentName: 'Jasur Aliyev', condition: 'Bronxit', diagnosis: 'Surunkali bronxit', date: '2024-08-15', medications: 'Inhaler', emergency: false, notes: 'Doimiy nazorat', bloodType: 'A+', height: 170, weight: 60 },
];

export const defaultNotifications = [
  { id: 1, title: "To'lov muddati", message: 'Dekabr oyi to\'lovi 10-kungacha amalga oshirilishi kerak', type: 'payment', date: '2024-12-01', read: false, author: 'Admin' },
  { id: 2, title: 'Uy vazifasi muddati', message: 'Matematika fanidan uy vazifasi ertaga topshirilishi kerak', type: 'homework', date: '2024-12-03', read: false, author: 'Admin' },
  { id: 3, title: 'Tadbir eslatmasi', message: '15-dekabr kuni maktab bayrami bo\'lib o\'tadi', type: 'event', date: '2024-12-05', read: true, author: 'Admin' },
];

export const defaultAnnouncements = [
  { id: 1, title: '1-chorak yakunlandi', content: 'Hurmatli o\'quvchilar va ota-onalar! 1-chorak muvaffaqiyatli yakunlandi. Barcha o\'quvchilarni tabriklaymiz!', date: '2024-11-30', priority: 'high', views: 45, author: 'Administrator' },
  { id: 2, title: 'Ota-onalar yig\'ilishi', content: '10-dekabr kuni soat 15:00 da onlayn ota-onalar yig\'ilishi bo\'lib o\'tadi.', date: '2024-12-05', priority: 'medium', views: 28, author: 'Administrator' },
];