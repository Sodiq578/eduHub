import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, HiOutlinePlus, HiOutlineBookOpen, HiOutlineUser, HiOutlineCalendar, 
  HiOutlineTrash, HiOutlinePencil, HiOutlineX, HiOutlineFilter, HiOutlineDownload, 
  HiOutlineMoon, HiOutlineSun, HiOutlineClock, HiOutlineChartBar, HiOutlineUsers, 
  HiOutlineCreditCard, HiOutlineEye, HiOutlineCheckCircle, HiOutlineXCircle, 
  HiOutlineTrendingUp, HiOutlineUserAdd, HiOutlineLocationMarker, HiOutlineIdentification,
  HiOutlineQrcode, HiOutlineBell, HiOutlineCalendar as HiOutlineReserve, 
  HiOutlineStar, HiOutlineSparkles, HiOutlinePrinter, HiOutlineGlobe, 
  HiOutlineOfficeBuilding, HiOutlineChip, HiOutlineDocumentText,
  HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineBookmark, HiOutlineTag,
  HiOutlineSortAscending, HiOutlineSortDescending, HiOutlineRefresh,
  HiOutlineTemplate, HiOutlineClipboardList, HiOutlineCollection,
  HiOutlinePhone, HiOutlineMail
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import './Library.css';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, 
  ArcElement, Title, Tooltip, Legend, Filler
);

// ==================== DEFAULT BOOKS DATA ====================
const defaultBooksData = [
  { id: 1, title: 'Matematika 10-sinf', author: 'Shahzoda Ahmedova', isbn: '978-9943-01-001', quantity: 15, available: 12, category: 'Darslik', location: 'A-1', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=1', borrowCount: 25, avgRating: 4.5, publisher: 'Sharq', year: 2024, pages: 256, language: "O'zbek", description: '10-sinf o\'quvchilari uchun matematika darsligi' },
  { id: 2, title: 'Fizika asoslari', author: 'Rustam Karimov', isbn: '978-9943-01-002', quantity: 10, available: 8, category: 'Darslik', location: 'A-2', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=2', borrowCount: 18, avgRating: 4.2, publisher: 'Fan', year: 2023, pages: 312, language: "O'zbek", description: 'Fizika fanining asosiy qoidalari' },
  { id: 3, title: 'Ingliz tili grammatikasi', author: 'Gulnora Saidova', isbn: '978-9943-01-003', quantity: 20, available: 18, category: "Qo'llanma", location: 'B-1', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=3', borrowCount: 32, avgRating: 4.8, publisher: 'Oxford', year: 2024, pages: 180, language: 'Ingliz', description: 'Ingliz tili grammatikasi qo\'llanmasi' },
  { id: 4, title: "O'zbek adabiyoti antologiyasi", author: 'Abdulla Qodiriy', isbn: '978-9943-01-004', quantity: 8, available: 5, category: 'Badiiy', location: 'C-1', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=4', borrowCount: 12, avgRating: 4.9, publisher: "O'zbekiston", year: 2022, pages: 450, language: "O'zbek", description: "O'zbek adabiyotining eng yaxshi namunalari" },
  { id: 5, title: 'Kimyo 9-sinf', author: 'Dilbar To\'xtayeva', isbn: '978-9943-01-005', quantity: 12, available: 10, category: 'Darslik', location: 'A-3', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=5', borrowCount: 15, avgRating: 4.3, publisher: 'Sharq', year: 2023, pages: 280, language: "O'zbek", description: '9-sinf o\'quvchilari uchun kimyo darsligi' },
  { id: 6, title: 'Biologiya 11-sinf', author: 'Nilufar Rahimova', isbn: '978-9943-01-006', quantity: 10, available: 7, category: 'Darslik', location: 'A-4', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=6', borrowCount: 10, avgRating: 4.1, publisher: 'Fan', year: 2024, pages: 320, language: "O'zbek", description: '11-sinf o\'quvchilari uchun biologiya darsligi' },
  { id: 7, title: 'Tarix fanidan testlar', author: 'Alisher Tursunov', isbn: '978-9943-01-007', quantity: 25, available: 22, category: "Qo'llanma", location: 'B-2', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=7', borrowCount: 28, avgRating: 4.4, publisher: 'Istiqlol', year: 2023, pages: 150, language: "O'zbek", description: 'Tarix fanidan test to\'plami' },
  { id: 8, title: 'Algoritmlash asoslari', author: 'Sardor Rahimov', isbn: '978-9943-01-008', quantity: 8, available: 6, category: 'Darslik', location: 'A-5', addedDate: '2024-09-01', image: 'https://picsum.photos/200/300?random=8', borrowCount: 20, avgRating: 4.7, publisher: 'IT Press', year: 2024, pages: 380, language: "O'zbek", description: 'Dasturlash asoslari va algoritmlar' }
];

const Library = () => {
  const { user, roles } = useAuth();
  const isAdmin = user?.role === roles.ADMIN;
  const isLibrarian = user?.role === roles.LIBRARIAN;
  const canManage = isAdmin || isLibrarian;
  
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('books');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    isbn: '', dateFrom: '', dateTo: '', availableOnly: false, minRating: 0,
    publisher: '', yearFrom: '', yearTo: '', language: ''
  });
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('book');
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Main Data
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [libraryHours, setLibraryHours] = useState({
    open: '09:00', close: '18:00', weekdays: 'Monday-Friday', saturday: '10:00-15:00', sunday: 'Closed'
  });
  
  // Editing State
  const [editingBook, setEditingBook] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedReservationDate, setSelectedReservationDate] = useState('');
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedReview, setSelectedReview] = useState('');

  // ==================== LOAD DATA ====================
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('library_darkMode');
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    loadBooks();
    loadMembers();
    loadBorrowHistory();
    loadReservations();
    loadReviews();
    loadNotifications();
    loadLibraryHours();
  }, []);

  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
    localStorage.setItem('library_members', JSON.stringify(members));
    localStorage.setItem('library_history', JSON.stringify(borrowHistory));
    localStorage.setItem('library_reservations', JSON.stringify(reservations));
    localStorage.setItem('library_reviews', JSON.stringify(reviews));
    localStorage.setItem('library_notifications', JSON.stringify(notifications));
    localStorage.setItem('library_hours', JSON.stringify(libraryHours));
    localStorage.setItem('library_darkMode', JSON.stringify(darkMode));
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [books, members, borrowHistory, reservations, reviews, notifications, libraryHours, darkMode]);

  const loadBooks = () => {
    const stored = localStorage.getItem('library_books');
    if (stored && JSON.parse(stored).length > 0) {
      setBooks(JSON.parse(stored));
    } else {
      setBooks(defaultBooksData);
      localStorage.setItem('library_books', JSON.stringify(defaultBooksData));
    }
  };

  const loadMembers = () => {
    const stored = localStorage.getItem('library_members');
    if (stored && JSON.parse(stored).length > 0) {
      setMembers(JSON.parse(stored));
    } else {
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const defaultMembers = [
        ...students.map(s => ({ id: s.id, name: s.name, type: 'student', class: s.class, phone: s.parent || s.phone, email: s.email, joinedDate: new Date().toISOString().split('T')[0], borrowCount: 0, activeBorrows: 0, membershipId: `LIB-${s.id}` })),
        ...teachers.map(t => ({ id: t.id + 100, name: t.name, type: 'teacher', subject: t.subject, phone: t.phone, email: t.email, joinedDate: new Date().toISOString().split('T')[0], borrowCount: 0, activeBorrows: 0, membershipId: `LIB-${t.id + 100}` }))
      ];
      setMembers(defaultMembers);
      localStorage.setItem('library_members', JSON.stringify(defaultMembers));
    }
  };

  const loadBorrowHistory = () => {
    const stored = localStorage.getItem('library_history');
    if (stored) setBorrowHistory(JSON.parse(stored));
    else setBorrowHistory([]);
  };

  const loadReservations = () => {
    const stored = localStorage.getItem('library_reservations');
    if (stored) setReservations(JSON.parse(stored));
    else setReservations([]);
  };

  const loadReviews = () => {
    const stored = localStorage.getItem('library_reviews');
    if (stored) setReviews(JSON.parse(stored));
    else setReviews([]);
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem('library_notifications');
    if (stored) setNotifications(JSON.parse(stored));
    else setNotifications([]);
  };

  const loadLibraryHours = () => {
    const stored = localStorage.getItem('library_hours');
    if (stored) setLibraryHours(JSON.parse(stored));
  };

  // ==================== SEARCH & FILTER ====================
  const normalizeText = (text) => text?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  const fuzzySearch = (text, search) => normalizeText(text).includes(normalizeText(search));

  const categories = ['Barchasi', 'Darslik', "Qo'llanma", 'Badiiy', "Lug'at", 'Ensiklopediya'];
  const languages = ['Barchasi', "O'zbek", 'Rus', 'Ingliz'];
  const sortOptions = [
    { value: 'title', label: 'Nomi', icon: <HiOutlineBookOpen /> },
    { value: 'author', label: 'Muallif', icon: <HiOutlineUser /> },
    { value: 'year', label: 'Yil', icon: <HiOutlineCalendar /> },
    { value: 'borrowCount', label: "O'qilganlar", icon: <HiOutlineTrendingUp /> },
    { value: 'avgRating', label: 'Reyting', icon: <HiOutlineStar /> },
    { value: 'available', label: 'Mavjudlik', icon: <HiOutlineCheckCircle /> }
  ];

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = fuzzySearch(book.title, searchTerm) || fuzzySearch(book.author, searchTerm) || fuzzySearch(book.isbn, searchTerm);
      const matchesCategory = categoryFilter === '' || categoryFilter === 'Barchasi' || book.category === categoryFilter;
      const matchesStatus = statusFilter === '' || (statusFilter === 'available' ? book.available > 0 : book.available === 0);
      const matchesISBN = !advancedFilters.isbn || book.isbn === advancedFilters.isbn;
      const matchesDate = (!advancedFilters.dateFrom || book.addedDate >= advancedFilters.dateFrom) && (!advancedFilters.dateTo || book.addedDate <= advancedFilters.dateTo);
      const matchesAvailable = !advancedFilters.availableOnly || book.available > 0;
      const matchesRating = !advancedFilters.minRating || (book.avgRating || 0) >= advancedFilters.minRating;
      const matchesPublisher = !advancedFilters.publisher || book.publisher?.toLowerCase().includes(advancedFilters.publisher.toLowerCase());
      const matchesYear = (!advancedFilters.yearFrom || (book.year || 0) >= advancedFilters.yearFrom) && (!advancedFilters.yearTo || (book.year || 0) <= advancedFilters.yearTo);
      const matchesLanguage = !advancedFilters.language || advancedFilters.language === 'Barchasi' || book.language === advancedFilters.language;
      return matchesSearch && matchesCategory && matchesStatus && matchesISBN && matchesDate && matchesAvailable && matchesRating && matchesPublisher && matchesYear && matchesLanguage;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'title') { aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase(); }
      if (sortBy === 'author') { aVal = a.author.toLowerCase(); bVal = b.author.toLowerCase(); }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // ==================== STATISTICS ====================
  const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.available, 0);
  const borrowedBooks = totalBooks - availableBooks;
  const activeBorrows = borrowHistory.filter(h => !h.returned).length;
  
  const mostPopularBook = books.reduce((max, book) => {
    const borrowedCount = borrowHistory.filter(h => h.bookId === book.id && h.returned).length;
    return borrowedCount > max.count ? { book, count: borrowedCount } : max;
  }, { book: null, count: 0 });
  
  const mostActiveMember = members.reduce((max, member) => {
    const borrowCount = borrowHistory.filter(h => h.memberId === member.id).length;
    return borrowCount > max.count ? { member, count: borrowCount } : max;
  }, { member: null, count: 0 });
  
  const overdueBooksList = borrowHistory.filter(h => !h.returned && new Date(h.deadline) < new Date());
  const totalPenalties = borrowHistory.reduce((sum, h) => sum + (h.penalty || 0), 0);

  // ==================== CHART DATA ====================
  const categoryChartData = {
    labels: categories.filter(c => c !== 'Barchasi'),
    datasets: [{ label: 'Kitoblar soni', data: categories.filter(c => c !== 'Barchasi').map(cat => books.filter(b => b.category === cat).length), backgroundColor: '#10b981', borderRadius: 8 }]
  };
  const borrowChartData = {
    labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
    datasets: [{ label: 'Olingan kitoblar', data: [12, 15, 18, 22, 25, 30, 35, 40, 45, 50, 55, borrowHistory.length], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }]
  };
  const ratingChartData = {
    labels: ['5 yulduz', '4 yulduz', '3 yulduz', '2 yulduz', '1 yulduz'],
    datasets: [{ data: [reviews.filter(r => r.rating === 5).length, reviews.filter(r => r.rating === 4).length, reviews.filter(r => r.rating === 3).length, reviews.filter(r => r.rating === 2).length, reviews.filter(r => r.rating === 1).length], backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'], borderWidth: 0 }]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }, tooltip: { backgroundColor: 'white', titleColor: '#1e293b', bodyColor: '#64748b', borderColor: '#e2e8f0', borderWidth: 1 } } };

  // ==================== BOOK OPERATIONS ====================
  const handleBorrow = () => {
    if (!selectedMember || !selectedBook) { alert('Iltimos, kitob va a\'zoni tanlang!'); return; }
    const book = books.find(b => b.id === selectedBook.id);
    const member = members.find(m => m.id === parseInt(selectedMember));
    if (!book || book.available <= 0) { alert('Kitob mavjud emas!'); return; }
    
    const deadline = new Date(); deadline.setDate(deadline.getDate() + 14);
    const newHistory = { id: Date.now(), memberId: member.id, memberName: member.name, memberType: member.type, bookId: book.id, bookTitle: book.title, borrowDate: new Date().toISOString().split('T')[0], deadline: deadline.toISOString().split('T')[0], returned: false, returnDate: null, penalty: 0 };
    
    setBooks(books.map(b => b.id === book.id ? { ...b, available: b.available - 1, borrowCount: (b.borrowCount || 0) + 1 } : b));
    setMembers(members.map(m => m.id === member.id ? { ...m, borrowCount: (m.borrowCount || 0) + 1, activeBorrows: (m.activeBorrows || 0) + 1 } : m));
    setBorrowHistory([newHistory, ...borrowHistory]);
    
    const reservation = reservations.find(r => r.bookId === book.id && r.memberId === member.id);
    if (reservation) setReservations(reservations.filter(r => r.id !== reservation.id));
    
    alert(`${member.name} kitobni oldi! Qaytarish muddati: ${newHistory.deadline}`);
    setShowModal(false); setSelectedMember(''); setSelectedBook(null);
  };

  const handleReturn = (historyId, bookId, memberId) => {
    const history = borrowHistory.find(h => h.id === historyId);
    const returnDate = new Date().toISOString().split('T')[0];
    const daysLate = Math.max(0, Math.floor((new Date(returnDate) - new Date(history.deadline)) / (1000 * 60 * 60 * 24)));
    const penalty = daysLate * 2000;
    
    setBorrowHistory(borrowHistory.map(h => h.id === historyId ? { ...h, returned: true, returnDate: returnDate, penalty: penalty } : h));
    setBooks(books.map(b => b.id === bookId ? { ...b, available: b.available + 1 } : b));
    setMembers(members.map(m => m.id === memberId ? { ...m, activeBorrows: Math.max(0, (m.activeBorrows || 0) - 1) } : m));
    
    if (penalty > 0) alert(`Kitob qaytarildi! Kechikkan kun: ${daysLate}, Jarima: ${penalty} so'm`);
    else alert(`Kitob muvaffaqiyatli qaytarildi! Qaytarilgan sana: ${returnDate}`);
  };

  const handleReserve = () => {
    if (!selectedMember || !selectedBook || !selectedReservationDate) { alert('Iltimos, barcha maydonlarni to\'ldiring!'); return; }
    const book = books.find(b => b.id === selectedBook.id);
    const member = members.find(m => m.id === parseInt(selectedMember));
    if (!book || book.available <= 0) { alert('Kitob mavjud emas!'); return; }
    
    const existingReservation = reservations.find(r => r.bookId === book.id && r.memberId === member.id && r.status === 'active');
    if (existingReservation) { alert('Bu kitob allaqachon bron qilingan!'); return; }
    
    const newReservation = { id: Date.now(), bookId: book.id, bookTitle: book.title, memberId: member.id, memberName: member.name, reserveDate: new Date().toISOString().split('T')[0], expireDate: selectedReservationDate, status: 'active' };
    setReservations([...reservations, newReservation]);
    alert(`${book.title} kitobi ${member.name} uchun bron qilindi! Muddati: ${selectedReservationDate}`);
    setShowModal(false); setSelectedMember(''); setSelectedBook(null); setSelectedReservationDate('');
  };

  const handleAddReview = () => {
    if (!selectedBook || !selectedReview) { alert('Iltimos, baho va izoh qoldiring!'); return; }
    const newReview = { id: Date.now(), bookId: selectedBook.id, bookTitle: selectedBook.title, memberName: user?.name || 'Guest', rating: selectedRating, review: selectedReview, date: new Date().toISOString().split('T')[0] };
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    const bookReviews = updatedReviews.filter(r => r.bookId === selectedBook.id);
    const avgRating = bookReviews.length > 0 ? bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length : 0;
    setBooks(books.map(b => b.id === selectedBook.id ? { ...b, avgRating: avgRating.toFixed(1) } : b));
    alert('Rahmat! Fikringiz qabul qilindi.');
    setShowModal(false); setSelectedReview(''); setSelectedRating(5);
  };

  const handleAddBook = () => {
    if (!editingBook.title || !editingBook.author || !editingBook.isbn) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    if (editingBook.id) {
      setBooks(books.map(b => b.id === editingBook.id ? editingBook : b));
      alert("Kitob ma'lumotlari yangilandi!");
    } else {
      const newBook = { 
        ...editingBook, 
        id: Date.now(),
        available: editingBook.quantity,
        addedDate: new Date().toISOString().split('T')[0],
        borrowCount: 0,
        avgRating: 0
      };
      setBooks([newBook, ...books]);
      alert("Yangi kitob qo'shildi!");
    }

    setShowModal(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (id) => {
    if (borrowHistory.some(h => h.bookId === id && !h.returned)) { alert('Bu kitob hali qaytarilmagan!'); return; }
    if (window.confirm('Kitobni o\'chirmoqchimisiz?')) { setBooks(books.filter(b => b.id !== id)); alert('Kitob o\'chirildi!'); }
  };

  const handleAddMember = () => {
    if (!editingMember.name) { alert('Iltimos, a\'zo nomini kiriting!'); return; }
    if (editingMember.id) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      alert('A\'zo ma\'lumotlari yangilandi!');
    } else {
      const newMember = { ...editingMember, id: Date.now(), joinedDate: new Date().toISOString().split('T')[0], borrowCount: 0, activeBorrows: 0, membershipId: `LIB-${Date.now()}` };
      setMembers([...members, newMember]);
      alert('Yangi a\'zo qo\'shildi!');
    }
    setShowModal(false); setEditingMember(null);
  };

  const handleDeleteMember = (id) => {
    if (borrowHistory.some(h => h.memberId === id && !h.returned)) { alert('Bu a\'zoning qaytarmagan kitoblari bor!'); return; }
    if (window.confirm('A\'zoni o\'chirmoqchimisiz?')) { setMembers(members.filter(m => m.id !== id)); alert('A\'zo o\'chirildi!'); }
  };

  const generateQRCode = (book) => { setSelectedBook(book); setShowQrModal(true); };

  const exportToCSV = () => {
    const headers = ['ID', 'Kitob nomi', 'Muallif', 'ISBN', 'Kategoriya', 'Jami nusxa', 'Mavjud', "O'qilganlar", 'Reyting', 'Nashriyot', 'Yil', 'Sahifalar', 'Til'];
    const csvData = books.map(book => [book.id, book.title, book.author, book.isbn, book.category, book.quantity, book.available, book.borrowCount || 0, book.avgRating || 0, book.publisher || '', book.year || '', book.pages || '', book.language || '']);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `library_books_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => { window.print(); };
  
  const resetFilters = () => {
    setSearchTerm(''); setCategoryFilter(''); setStatusFilter(''); setSortBy('title'); setSortOrder('asc');
    setAdvancedFilters({ isbn: '', dateFrom: '', dateTo: '', availableOnly: false, minRating: 0, publisher: '', yearFrom: '', yearTo: '', language: '' });
  };

  // ==================== RENDER ====================
  return (
    <div className={`library-page ${darkMode ? 'dark' : ''}`}>
      <div className="page-header">
        <div>
          <h1><HiOutlineBookOpen /> Kutubxona tizimi</h1>
          <p>{books.length} ta kitob, {members.length} ta a'zo | {availableBooks} ta mavjud | {borrowedBooks} ta o'qilmoqda</p>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
          </button>
          <button className="icon-btn" onClick={exportToCSV}>
            <HiOutlineDownload /> CSV
          </button>
          <button className="icon-btn" onClick={exportToPDF}>
            <HiOutlinePrinter /> PDF
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'books' ? 'active' : ''}`} onClick={() => { setActiveTab('books'); setCurrentPage(1); }}>
          <HiOutlineBookOpen /> Kitoblar
        </button>
        <button className={`tab ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
          <HiOutlineUsers /> A'zolar
        </button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <HiOutlineCalendar /> Tarix
        </button>
        <button className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <HiOutlineChartBar /> Dashboard
        </button>
        <button className={`tab ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
          <HiOutlineGlobe /> Online katalog
        </button>
      </div>

      {/* BOOKS TAB */}
      {activeTab === 'books' && (
        <>
          <div className="search-filters-bar">
            <div className="search-wrapper">
              <HiOutlineSearch />
              <input 
                type="text" 
                placeholder="Kitob nomi, muallif yoki ISBN bo'yicha qidirish..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <HiOutlineX />
                </button>
              )}
            </div>
            
            {canManage && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setModalType('book');
                  setEditingBook({
                    title: '',
                    author: '',
                    isbn: '',
                    category: 'Darslik',
                    publisher: '',
                    year: new Date().getFullYear(),
                    pages: 0,
                    language: "O'zbek",
                    quantity: 1,
                    location: '',
                    image: '',
                    description: ''
                  });
                  setShowModal(true);
                }}
              >
                <HiOutlinePlus /> Kitob qo'shish
              </button>
            )}
            
            <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <HiOutlineFilter /> Filtrlar
            </button>
            
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                <HiOutlineTemplate />
              </button>
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <HiOutlineClipboardList />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-row">
                <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Barcha holatlar</option>
                  <option value="available">Mavjud</option>
                  <option value="borrowed">Olingan</option>
                </select>
                <button className="btn-secondary" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>
                  <HiOutlineChip /> Kengaytirilgan
                </button>
                <button className="btn-reset" onClick={resetFilters}>
                  <HiOutlineRefresh /> Tozalash
                </button>
              </div>
              <div className="sort-row">
                <span className="sort-label"><HiOutlineSortAscending /> Tartiblash:</span>
                {sortOptions.map(opt => (
                  <button 
                    key={opt.value} 
                    className={`sort-btn ${sortBy === opt.value ? 'active' : ''}`} 
                    onClick={() => { setSortBy(opt.value); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  >
                    {opt.icon} {opt.label} 
                    {sortBy === opt.value && (sortOrder === 'asc' ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showAdvancedSearch && (
            <div className="advanced-search-panel">
              <div className="adv-search-row">
                <input type="text" placeholder="ISBN" value={advancedFilters.isbn} onChange={(e) => setAdvancedFilters({...advancedFilters, isbn: e.target.value})} />
              </div>
              <div className="adv-search-row">
                <input type="text" placeholder="Nashriyot" value={advancedFilters.publisher} onChange={(e) => setAdvancedFilters({...advancedFilters, publisher: e.target.value})} />
              </div>
              <div className="adv-search-row">
                <input type="number" placeholder="Yil (dan)" value={advancedFilters.yearFrom} onChange={(e) => setAdvancedFilters({...advancedFilters, yearFrom: parseInt(e.target.value)})} />
              </div>
              <div className="adv-search-row">
                <input type="number" placeholder="Yil (gacha)" value={advancedFilters.yearTo} onChange={(e) => setAdvancedFilters({...advancedFilters, yearTo: parseInt(e.target.value)})} />
              </div>
              <div className="adv-search-row">
                <select value={advancedFilters.language} onChange={(e) => setAdvancedFilters({...advancedFilters, language: e.target.value})}>
                  <option value="">Barcha tillar</option>
                  {languages.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="adv-search-row">
                <label>
                  <input type="checkbox" checked={advancedFilters.availableOnly} onChange={(e) => setAdvancedFilters({...advancedFilters, availableOnly: e.target.checked})} /> 
                  Faqat mavjud kitoblar
                </label>
              </div>
              <div className="adv-search-row">
                <select value={advancedFilters.minRating} onChange={(e) => setAdvancedFilters({...advancedFilters, minRating: parseInt(e.target.value)})}>
                  <option value={0}>Barcha reytinglar</option>
                  <option value={4}>4+ yulduz</option>
                  <option value={3}>3+ yulduz</option>
                </select>
              </div>
            </div>
          )}

          <div className={`books-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
            {paginatedBooks.length === 0 ? (
              <div className="empty-state">
                <HiOutlineBookOpen size={48} />
                <p>Hech qanday kitob topilmadi</p>
                <button className="btn-primary" onClick={resetFilters}>Filtrlarni tozalash</button>
              </div>
            ) : (
              paginatedBooks.map(book => (
                <div key={book.id} className="book-card">
                  <img src={book.image} alt={book.title} className="book-image" />
                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="book-author"><HiOutlineUser /> {book.author}</p>
                    <p className="book-isbn"><HiOutlineTag /> ISBN: {book.isbn}</p>
                    <div className="book-details">
                      <span><HiOutlineBookmark /> {book.publisher || '-'}</span>
                      <span><HiOutlineCalendar /> {book.year || '-'}</span>
                      <span>📄 {book.pages || 0} bet</span>
                      <span>🌐 {book.language || "O'zbek"}</span>
                    </div>
                    <div className="book-rating">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar key={i} className={i < Math.floor(book.avgRating || 0) ? 'filled' : ''} />
                      ))}
                      {book.avgRating || 0} ({reviews.filter(r => r.bookId === book.id).length} ta izoh)
                    </div>
                    <div className="book-stats">
                      <span className="book-category">📚 {book.category}</span>
                      <span className={book.available === 0 ? 'out-of-stock' : ''}>
                        📖 Mavjud: {book.available}/{book.quantity}
                      </span>
                      <span>👥 {book.borrowCount || 0} marta o'qilgan</span>
                    </div>
                    <div className="book-location">
                      <HiOutlineLocationMarker /> {book.location || 'Belgilanmagan'}
                    </div>
                    {book.description && <p className="book-description">{book.description}</p>}
                    <div className="book-actions">
                      <button className="qr-btn" onClick={() => generateQRCode(book)}>
                        <HiOutlineQrcode /> QR
                      </button>
                      {canManage && (
                        <button className="edit-btn" onClick={() => { 
                          setModalType('book'); 
                          setEditingBook(book); 
                          setShowModal(true); 
                        }}>
                          <HiOutlinePencil />
                        </button>
                      )}
                      <button className="borrow-btn" onClick={() => { 
                        if (members.length === 0) { 
                          alert('Avval a\'zo qo\'shing!'); 
                          return; 
                        } 
                        setModalType('borrow'); 
                        setSelectedBook(book); 
                        setShowModal(true); 
                      }}>
                        <HiOutlineBookOpen /> Olish
                      </button>
                      <button className="reserve-btn" onClick={() => { 
                        setModalType('reserve'); 
                        setSelectedBook(book); 
                        setShowModal(true); 
                      }}>
                        <HiOutlineReserve /> Bron
                      </button>
                      <button className="review-btn" onClick={() => { 
                        setModalType('review'); 
                        setSelectedBook(book); 
                        setShowModal(true); 
                      }}>
                        <HiOutlineStar /> Baho
                      </button>
                      {canManage && (
                        <button className="delete-btn" onClick={() => handleDeleteBook(book.id)}>
                          <HiOutlineTrash />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>
                <HiOutlineArrowLeft />
              </button>
              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 7 && currentPage > 4) pageNum = currentPage - 4 + i;
                if (pageNum <= totalPages) {
                  return (
                    <button key={pageNum} className={currentPage === pageNum ? 'active' : ''} onClick={() => setCurrentPage(pageNum)}>
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>
                <HiOutlineArrowRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="members-section">
          <div className="section-header">
            {canManage && (
              <button className="btn-primary" onClick={() => { 
                setModalType('member'); 
                setEditingMember({ name: '', type: 'student', class: '', phone: '', email: '' }); 
                setShowModal(true); 
              }}>
                <HiOutlineUserAdd /> Yangi a'zo
              </button>
            )}
          </div>
          <div className="members-grid">
            {members.map(member => {
              const activeBorrowsCount = borrowHistory.filter(h => h.memberId === member.id && !h.returned).length;
              return (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">{member.name.charAt(0)}</div>
                  <h3>{member.name}</h3>
                  <p className="member-type">{member.type === 'student' ? "O'quvchi" : 'O\'qituvchi'}</p>
                  <p className="member-id"><HiOutlineIdentification /> {member.membershipId}</p>
                  {member.class && <p>Sinf: {member.class}</p>}
                  {member.subject && <p>Fan: {member.subject}</p>}
                  <p><HiOutlinePhone /> {member.phone || '-'}</p>
                  <p><HiOutlineMail /> {member.email || '-'}</p>
                  <div className="member-stats">
                    <span>📖 {member.borrowCount || 0} kitob</span>
                    <span>📚 {activeBorrowsCount} aktiv</span>
                  </div>
                  {canManage && (
                    <div className="member-actions">
                      <button className="edit-btn" onClick={() => { 
                        setModalType('member'); 
                        setEditingMember(member); 
                        setShowModal(true); 
                      }}>
                        <HiOutlinePencil /> Tahrirlash
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteMember(member.id)}>
                        <HiOutlineTrash /> O'chirish
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="history-section">
          <div className="notifications-panel">
            <h3><HiOutlineBell /> Bildirishnomalar</h3>
            {notifications.map(n => (
              <div key={n.id} className="notification-item">
                <div className="notification-icon">🔔</div>
                <div>
                  <div className="notification-title">{n.title}</div>
                  <div className="notification-message">{n.message}</div>
                </div>
              </div>
            ))}
          </div>
          <table className="history-table">
            <thead>
              <tr>
                <th>A'zo</th>
                <th>Kitob</th>
                <th>Olingan</th>
                <th>Muddat</th>
                <th>Holat</th>
                <th>Jarima</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {borrowHistory.map(history => {
                const isOverdue = !history.returned && new Date(history.deadline) < new Date();
                return (
                  <tr key={history.id} className={isOverdue ? 'overdue' : ''}>
                    <td>
                      {history.memberName}<br/>
                      <small>{history.memberType === 'student' ? "O'quvchi" : 'O\'qituvchi'}</small>
                    </td>
                    <td>{history.bookTitle}</td>
                    <td>{history.borrowDate}</td>
                    <td className={isOverdue ? 'deadline-overdue' : ''}>{history.deadline}</td>
                    <td>
                      {history.returned ? (
                        <span className="returned"><HiOutlineCheckCircle /> Qaytarilgan</span>
                      ) : isOverdue ? (
                        <span className="overdue-status"><HiOutlineXCircle /> Kechikkan</span>
                      ) : (
                        <span className="borrowed-status"><HiOutlineClock /> Olingan</span>
                      )}
                    </td>
                    <td>{history.penalty > 0 ? `${history.penalty} so'm` : '-'}</td>
                    <td>
                      {!history.returned && canManage && (
                        <button className="return-btn" onClick={() => handleReturn(history.id, history.bookId, history.memberId)}>
                          Qaytarish
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">{totalBooks}</div>
              <div className="stat-label">Jami kitoblar</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{availableBooks}</div>
              <div className="stat-label">Mavjud</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{borrowedBooks}</div>
              <div className="stat-label">O'qilmoqda</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{members.length}</div>
              <div className="stat-label">A'zolar</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{activeBorrows}</div>
              <div className="stat-label">Aktiv qarzlar</div>
            </div>
            <div className="stat-card warning">
              <div className="stat-value">{overdueBooksList.length}</div>
              <div className="stat-label">Kechikkan</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{totalPenalties.toLocaleString()} so'm</div>
              <div className="stat-label">Jami jarimalar</div>
            </div>
          </div>
          <div className="dashboard-charts">
            <div className="chart-card">
              <h3>📊 Kategoriyalar bo'yicha</h3>
              <div className="chart-container">
                <Bar data={categoryChartData} options={chartOptions} />
              </div>
            </div>
            <div className="chart-card">
              <h3>📈 Oylik statistika</h3>
              <div className="chart-container">
                <Line data={borrowChartData} options={chartOptions} />
              </div>
            </div>
            <div className="chart-card">
              <h3>⭐ Reytinglar</h3>
              <div className="chart-container-small">
                <Doughnut data={ratingChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="dashboard-insights">
            <div className="insight-card">
              <h3><HiOutlineTrendingUp /> Eng ko'p o'qilgan kitob</h3>
              {mostPopularBook.book ? (
                <div>
                  <p className="insight-title">{mostPopularBook.book.title}</p>
                  <p>{mostPopularBook.count} marta</p>
                </div>
              ) : <p>Ma'lumot yo'q</p>}
            </div>
            <div className="insight-card">
              <h3><HiOutlineUsers /> Eng faol a'zo</h3>
              {mostActiveMember.member ? (
                <div>
                  <p className="insight-title">{mostActiveMember.member.name}</p>
                  <p>{mostActiveMember.count} ta kitob</p>
                </div>
              ) : <p>Ma'lumot yo'q</p>}
            </div>
            <div className="insight-card">
              <h3><HiOutlineClock /> Ish vaqti</h3>
              <p>Dush-Jum: {libraryHours.open} - {libraryHours.close}</p>
              <p>Shanba: {libraryHours.saturday}</p>
              <p>Yakshanba: {libraryHours.sunday}</p>
            </div>
          </div>
        </div>
      )}

      {/* CATALOG TAB */}
      {activeTab === 'catalog' && (
        <div className="public-catalog">
          <div className="catalog-header">
            <h2><HiOutlineGlobe /> Online katalog</h2>
            <p>Login qilmasdan kitoblarni ko'rish</p>
          </div>
          <div className="books-container grid-view">
            {books.map(book => (
              <div key={book.id} className="book-card catalog-card">
                <img src={book.image} alt={book.title} className="book-image" />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <div className="book-rating">⭐ {book.avgRating || 0}</div>
                  <div className="book-stats">
                    <span>📖 {book.available}/{book.quantity} mavjud</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODALS ==================== */}
      
      {/* BOOK MODAL (Qo'shish/Tahrirlash) */}
      {showModal && modalType === 'book' && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBook?.id ? 'Kitob tahrirlash' : 'Yangi kitob qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Kitob nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: JavaScript asoslari"
                    value={editingBook?.title || ''} 
                    onChange={(e) => setEditingBook({...editingBook, title: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Muallif *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Anvar Karimov"
                    value={editingBook?.author || ''} 
                    onChange={(e) => setEditingBook({...editingBook, author: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>ISBN *</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: 978-9943-01-001"
                    value={editingBook?.isbn || ''} 
                    onChange={(e) => setEditingBook({...editingBook, isbn: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select 
                    value={editingBook?.category || 'Darslik'} 
                    onChange={(e) => setEditingBook({...editingBook, category: e.target.value})}
                  >
                    <option value="Darslik">📚 Darslik</option>
                    <option value="Qo'llanma">📖 Qo'llanma</option>
                    <option value="Badiiy">🎭 Badiiy</option>
                    <option value="Lug'at">📘 Lug'at</option>
                    <option value="Ensiklopediya">🌍 Ensiklopediya</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nashriyot</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: Sharq nashriyoti"
                    value={editingBook?.publisher || ''} 
                    onChange={(e) => setEditingBook({...editingBook, publisher: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Nashr yili</label>
                  <input 
                    type="number" 
                    placeholder="2024"
                    value={editingBook?.year || new Date().getFullYear()} 
                    onChange={(e) => setEditingBook({...editingBook, year: parseInt(e.target.value)})} 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Sahifalar soni</label>
                  <input 
                    type="number" 
                    placeholder="Masalan: 300"
                    value={editingBook?.pages || 0} 
                    onChange={(e) => setEditingBook({...editingBook, pages: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="form-group">
                  <label>Tili</label>
                  <select 
                    value={editingBook?.language || "O'zbek"} 
                    onChange={(e) => setEditingBook({...editingBook, language: e.target.value})}
                  >
                    <option value="O'zbek">🇺🇿 O'zbek</option>
                    <option value="Rus">🇷🇺 Rus</option>
                    <option value="Ingliz">🇬🇧 Ingliz</option>
                    <option value="Arab">🇸🇦 Arab</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nusxa soni</label>
                  <input 
                    type="number" 
                    placeholder="Masalan: 5"
                    value={editingBook?.quantity || 1} 
                    onChange={(e) => setEditingBook({...editingBook, quantity: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="form-group">
                  <label>Joylashuv (shkaf/javon)</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: A-1, 2-javon"
                    value={editingBook?.location || ''} 
                    onChange={(e) => setEditingBook({...editingBook, location: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Kitob rasmi URL</label>
                <input 
                  type="text" 
                  placeholder="https://example.com/book.jpg"
                  value={editingBook?.image || ''} 
                  onChange={(e) => setEditingBook({...editingBook, image: e.target.value})} 
                />
                {editingBook?.image && (
                  <div style={{marginTop: '10px'}}>
                    <img src={editingBook.image} alt="Preview" style={{width: '100px', height: 'auto', borderRadius: '8px'}} />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Kitob haqida qisqacha</label>
                <textarea 
                  rows="4" 
                  placeholder="Kitob haqida ma'lumot, mazmuni, kimlar uchun..."
                  value={editingBook?.description || ''} 
                  onChange={(e) => setEditingBook({...editingBook, description: e.target.value})} 
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddBook}>
                {editingBook?.id ? '🔄 Yangilash' : '➕ Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                ❌ Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER MODAL */}
      {showModal && modalType === 'member' && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMember?.id ? 'A\'zo tahrirlash' : 'Yangi a\'zo'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <input 
                type="text" 
                placeholder="A'zo nomi *" 
                value={editingMember?.name || ''} 
                onChange={(e) => setEditingMember({...editingMember, name: e.target.value})} 
              />
              <select 
                value={editingMember?.type || 'student'} 
                onChange={(e) => setEditingMember({...editingMember, type: e.target.value})}
              >
                <option value="student">O'quvchi</option>
                <option value="teacher">O'qituvchi</option>
              </select>
              {editingMember?.type === 'student' && (
                <input 
                  type="text" 
                  placeholder="Sinf" 
                  value={editingMember?.class || ''} 
                  onChange={(e) => setEditingMember({...editingMember, class: e.target.value})} 
                />
              )}
              {editingMember?.type === 'teacher' && (
                <input 
                  type="text" 
                  placeholder="Fan" 
                  value={editingMember?.subject || ''} 
                  onChange={(e) => setEditingMember({...editingMember, subject: e.target.value})} 
                />
              )}
              <input 
                type="tel" 
                placeholder="Telefon" 
                value={editingMember?.phone || ''} 
                onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})} 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={editingMember?.email || ''} 
                onChange={(e) => setEditingMember({...editingMember, email: e.target.value})} 
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddMember}>
                {editingMember?.id ? 'Yangilash' : 'Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BORROW MODAL */}
      {showModal && modalType === 'borrow' && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitob olish</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Kitob:</strong> {selectedBook.title}</p>
              <p><strong>Mavjud:</strong> {selectedBook.available}/{selectedBook.quantity}</p>
              <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                <option value="">A'zo tanlang</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.type === 'student' ? m.class : m.subject})
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleBorrow}>
                Kitob berish
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESERVE MODAL */}
      {showModal && modalType === 'reserve' && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitob bron qilish</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Kitob:</strong> {selectedBook.title}</p>
              <p><strong>Mavjud:</strong> {selectedBook.available}/{selectedBook.quantity}</p>
              <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                <option value="">A'zo tanlang</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input 
                type="date" 
                placeholder="Bron muddati" 
                value={selectedReservationDate} 
                onChange={(e) => setSelectedReservationDate(e.target.value)} 
                min={new Date().toISOString().split('T')[0]} 
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleReserve}>
                Bron qilish
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showModal && modalType === 'review' && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitobga baho berish</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Kitob:</strong> {selectedBook.title}</p>
              <div className="rating-input">
                {[...Array(5)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`rating-star ${selectedRating > i ? 'active' : ''}`} 
                    onClick={() => setSelectedRating(i+1)}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <textarea 
                rows="3" 
                placeholder="Izohingizni yozing..." 
                value={selectedReview} 
                onChange={(e) => setSelectedReview(e.target.value)} 
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleAddReview}>
                Baho berish
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQrModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Kitob QR kodi</h2>
              <button className="modal-close" onClick={() => setShowQrModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body qr-body">
              <div className="qr-placeholder">
                <HiOutlineQrcode size={150} />
                <p><strong>{selectedBook.title}</strong></p>
                <p>ISBN: {selectedBook.isbn}</p>
                <p>ID: {selectedBook.id}</p>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowQrModal(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;