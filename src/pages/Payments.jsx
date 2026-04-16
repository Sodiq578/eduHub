import React, { useState, useEffect } from 'react';
import {
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlinePrinter,
  HiOutlineFilter,
  HiOutlineRefresh,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCreditCard,
  HiOutlineReceiptTax,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineCurrencyDollar,
  HiOutlineCalculator,
  HiOutlineExclamationCircle,
  HiOutlineBookOpen,
  HiOutlineUsers
} from 'react-icons/hi';
import './Payroll.css';
import { useAuth } from '../context/AuthContext';
import './Payments.css';
import Logo from '../assets/logo.svg';

const Payments = () => {
  const { user, roles } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [debts, setDebts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDebtorListModal, setShowDebtorListModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [openAccordionId, setOpenAccordionId] = useState(null);

  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.FINANCE;

  // Accordion toggle - butun qator bosilganda
  const toggleAccordion = (id, e) => {
    if (e && (e.target.closest('.action-btn-accordion') || e.target.closest('.accordion-trigger') || e.target.closest('.payment-status'))) {
      e.stopPropagation();
      return;
    }
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  // Ma'lumotlarni yuklash
  useEffect(() => {
    loadPayments();
    loadStudents();
    loadDebts();
  }, []);

  const loadPayments = () => {
    const stored = localStorage.getItem('payments');
    if (stored) {
      setPayments(JSON.parse(stored));
    } else {
      const defaultPayments = generateDefaultPayments();
      setPayments(defaultPayments);
      localStorage.setItem('payments', JSON.stringify(defaultPayments));
    }
  };

  const generateDefaultPayments = () => {
    const now = new Date();
    const payments = [];
    const studentsList = [
      { name: 'Ali Valiyev', class: '10-A', id: 1 },
      { name: 'Dilnoza Karimova', class: '10-B', id: 2 },
      { name: 'Jasur Aliyev', class: '9-A', id: 3 },
      { name: 'Zarina Toshpulatova', class: '11-A', id: 4 },
      { name: 'Bobur Sattorov', class: '8-A', id: 5 },
      { name: 'Madina Rahimova', class: '10-A', id: 6 },
      { name: 'Shohruh Akbarov', class: '9-B', id: 7 },
      { name: 'Gulnora Saidova', class: '11-B', id: 8 },
      { name: 'Olimjon Xolmatov', class: '7-A', id: 9 },
      { name: 'Nigora Ahmedova', class: '8-B', id: 10 }
    ];
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - Math.floor(Math.random() * 60));
      const statuses = ['paid', 'pending', 'overdue'];
      const methods = ['Naqd', 'Plastik', 'Click', 'Payme'];
      const types = ["Oylik to'lov", "Qo'shimcha to'lov", "Imtihon to'lovi", "Kutubxona to'lovi"];
      const student = studentsList[Math.floor(Math.random() * studentsList.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      payments.push({
        id: i,
        student: student.name,
        studentId: student.id,
        class: student.class,
        amount: [300000, 400000, 500000, 550000, 600000][Math.floor(Math.random() * 5)],
        date: date.toISOString().split('T')[0],
        method: methods[Math.floor(Math.random() * methods.length)],
        status: status,
        type: types[Math.floor(Math.random() * types.length)],
        receiptNo: `RCT-${String(2024000 + i).slice(-6)}`,
        description: status === 'overdue' ? "Muddati o'tgan to'lov" : status === 'pending' ? "To'lov kutilmoqda" : "To'lov qabul qilindi",
        deadline: status === 'pending' || status === 'overdue' ? new Date(date.setDate(date.getDate() + 15)).toISOString().split('T')[0] : null
      });
    }
    return payments;
  };

  const loadStudents = () => {
    const stored = localStorage.getItem('students');
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      const defaultStudents = [
        { id: 1, name: 'Ali Valiyev', class: '10-A', phone: '+998901234567', parentPhone: '+998901234568', address: 'Toshkent sh., Chilonzor tumani' },
        { id: 2, name: 'Dilnoza Karimova', class: '10-B', phone: '+998902345678', parentPhone: '+998902345679', address: 'Toshkent sh., Yunusobod tumani' },
        { id: 3, name: 'Jasur Aliyev', class: '9-A', phone: '+998903456789', parentPhone: '+998903456790', address: 'Toshkent sh., Mirzo Ulug\'bek tumani' },
        { id: 4, name: 'Zarina Toshpulatova', class: '11-A', phone: '+998904567890', parentPhone: '+998904567891', address: 'Toshkent sh., Sergeli tumani' },
        { id: 5, name: 'Bobur Sattorov', class: '8-A', phone: '+998905678901', parentPhone: '+998905678902', address: 'Toshkent sh., Yakkasaroy tumani' },
        { id: 6, name: 'Madina Rahimova', class: '10-A', phone: '+998906789012', parentPhone: '+998906789013', address: 'Toshkent sh., Shayxontohur tumani' }
      ];
      setStudents(defaultStudents);
      localStorage.setItem('students', JSON.stringify(defaultStudents));
    }
  };

  const loadDebts = () => {
    const stored = localStorage.getItem('debts');
    if (stored) {
      setDebts(JSON.parse(stored));
    } else {
      setDebts([]);
      localStorage.setItem('debts', JSON.stringify([]));
    }
  };

  const savePayments = (updatedPayments) => {
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
    updateDebts(updatedPayments);
  };

  const updateDebts = (allPayments) => {
    const studentDebts = {};
    students.forEach(student => {
      const studentPayments = allPayments.filter(p => p.studentId === student.id);
      const totalPending = studentPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
      const totalOverdue = studentPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);
      
      if (totalPending > 0 || totalOverdue > 0) {
        studentDebts[student.id] = {
          studentId: student.id,
          studentName: student.name,
          class: student.class,
          pendingAmount: totalPending,
          overdueAmount: totalOverdue,
          totalDebt: totalPending + totalOverdue,
          lastPaymentDate: studentPayments.filter(p => p.status === 'paid').sort((a,b) => new Date(b.date) - new Date(a.date))[0]?.date || null
        };
      }
    });
    const newDebts = Object.values(studentDebts);
    setDebts(newDebts);
    localStorage.setItem('debts', JSON.stringify(newDebts));
  };

  const handleAdd = () => {
    setEditingPayment({
      student: '',
      studentId: '',
      class: '',
      amount: 500000,
      date: new Date().toISOString().split('T')[0],
      method: 'Naqd',
      status: 'paid',
      type: "Oylik to'lov",
      receiptNo: '',
      description: '',
      deadline: ''
    });
    setShowModal(true);
  };

  const handleEdit = (payment, e) => {
    if (e) e.stopPropagation();
    setEditingPayment({ ...payment });
    setShowModal(true);
    setOpenAccordionId(null);
  };

  const handleView = (payment, e) => {
    if (e) e.stopPropagation();
    setSelectedPayment(payment);
    setShowDetailsModal(true);
    setOpenAccordionId(null);
  };

  const handleViewInvoice = (payment, e) => {
    if (e) e.stopPropagation();
    setSelectedPayment(payment);
    setShowInvoiceModal(true);
    setOpenAccordionId(null);
  };

  const handleSave = () => {
    if (!editingPayment.student || !editingPayment.amount || editingPayment.amount <= 0) {
      alert('Iltimos, o\'quvchi va to\'lov summasini kiriting!');
      return;
    }

    let updatedPayments;
    if (editingPayment.id) {
      updatedPayments = payments.map(p => p.id === editingPayment.id ? editingPayment : p);
      alert("To'lov ma'lumotlari yangilandi!");
    } else {
      const newPayment = { 
        ...editingPayment, 
        id: Date.now(),
        receiptNo: `RCT-${String(Date.now()).slice(-6)}`,
        deadline: editingPayment.status === 'pending' ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null
      };
      updatedPayments = [newPayment, ...payments];
      alert("Yangi to'lov qo'shildi!");
    }
    savePayments(updatedPayments);
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("To'lovni o'chirmoqchimisiz?")) {
      const updatedPayments = payments.filter(p => p.id !== id);
      savePayments(updatedPayments);
      alert("To'lov o'chirildi!");
      setOpenAccordionId(null);
    }
  };

  const updateStatus = (id, newStatus, e) => {
    if (e) e.stopPropagation();
    const updatedPayments = payments.map(p => 
      p.id === id ? { ...p, status: newStatus, deadline: newStatus === 'pending' ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null } : p
    );
    savePayments(updatedPayments);
  };

  // Qarzdorlar ro'yxati
  const debtorsList = payments.filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((unique, payment) => {
      if (!unique.some(p => p.studentId === payment.studentId)) {
        unique.push(payment);
      }
      return unique;
    }, [])
    .map(debtor => ({
      ...debtor,
      totalDebt: payments.filter(p => p.studentId === debtor.studentId && (p.status === 'pending' || p.status === 'overdue'))
        .reduce((sum, p) => sum + p.amount, 0)
    }));

  const getStudentPaymentHistory = (studentId) => {
    return payments.filter(p => p.studentId === studentId).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const stats = {
    totalCollected: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    totalOverdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    paymentCount: payments.filter(p => p.status === 'paid').length,
    collectionRate: payments.length > 0 ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(1) : 0
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    const matchesMethod = methodFilter === '' || p.method === methodFilter;
    const matchesType = typeFilter === '' || p.type === typeFilter;
    const matchesClass = classFilter === '' || p.class === classFilter;
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(p.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDate = paymentDate >= startDate && paymentDate <= endDate;
    }
    return matchesSearch && matchesStatus && matchesMethod && matchesType && matchesClass && matchesDate;
  });

  const uniqueClasses = [...new Set(payments.map(p => p.class))].sort();

  const methodStats = {
    Naqd: payments.filter(p => p.method === 'Naqd').length,
    Plastik: payments.filter(p => p.method === 'Plastik').length,
    Click: payments.filter(p => p.method === 'Click').length,
    Payme: payments.filter(p => p.method === 'Payme').length,
  };
  const totalPaymentsCount = payments.length;
  const methodPercentages = {
    Naqd: totalPaymentsCount > 0 ? ((methodStats.Naqd / totalPaymentsCount) * 100).toFixed(0) : 0,
    Plastik: totalPaymentsCount > 0 ? ((methodStats.Plastik / totalPaymentsCount) * 100).toFixed(0) : 0,
    Click: totalPaymentsCount > 0 ? ((methodStats.Click / totalPaymentsCount) * 100).toFixed(0) : 0,
    Payme: totalPaymentsCount > 0 ? ((methodStats.Payme / totalPaymentsCount) * 100).toFixed(0) : 0,
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const exportToCSV = () => {
    const headers = ['ID', "O'quvchi", 'Sinf', "To'lov turi", 'Summa', 'Sana', "To'lov usuli", 'Holat', 'Kvitansiya raqami', 'Tavsif'];
    const csvData = filteredPayments.map(p => [
      p.id, p.student, p.class, p.type, p.amount, p.date, p.method,
      p.status === 'paid' ? "To'langan" : p.status === 'pending' ? 'Kutilmoqda' : "Muddati o'tgan",
      p.receiptNo, p.description || ''
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = (payment) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kvitansiya ${payment.receiptNo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f0f0; }
          .invoice { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { text-align: center; padding: 30px; background: linear-gradient(135deg, #f8fafc, #fff); border-bottom: 2px solid #10b981; }
          .school-name { font-size: 28px; font-weight: bold; color: #10b981; }
          .receipt-no { font-size: 16px; color: #666; margin-top: 10px; }
          .details { padding: 20px 30px; }
          .row { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #475569; }
          .total { font-size: 22px; font-weight: bold; color: #10b981; text-align: right; padding: 20px 30px; border-top: 2px solid #10b981; }
          .footer { text-align: center; padding: 20px; background: #f8fafc; font-size: 12px; color: #666; }
          .status { display: inline-block; padding: 5px 12px; border-radius: 20px; }
          .status-paid { background: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
        img src="${Logo}" alt="Maktab logotipi" style="height: 60px; margin-bottom: 20px;" />
            <div>To'lov kvitansiyasi</div>
            <div class="receipt-no">№ ${payment.receiptNo}</div>
          </div>
          <div class="details">
            <div class="row"><span class="label">O'quvchi:</span><span>${payment.student}</span></div>
            <div class="row"><span class="label">Sinf:</span><span>${payment.class}</span></div>
            <div class="row"><span class="label">To'lov turi:</span><span>${payment.type}</span></div>
            <div class="row"><span class="label">Summa:</span><span>${formatMoney(payment.amount)}</span></div>
            <div class="row"><span class="label">Sana:</span><span>${formatDate(payment.date)}</span></div>
            <div class="row"><span class="label">To'lov usuli:</span><span>${payment.method}</span></div>
          </div>
          <div class="total">Jami: ${formatMoney(payment.amount)}</div>
          <div class="footer"><p>Rahmat! To'lov muvaffaqiyatli amalga oshirildi.</p></div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setMethodFilter('');
    setTypeFilter('');
    setClassFilter('');
    setDateRange({ start: '', end: '' });
  };

  const paymentTypes = ["Oylik to'lov", "Qo'shimcha to'lov", "Imtihon to'lovi", "Kutubxona to'lovi", "Ekskursiya to'lovi"];
  const paymentMethods = ['Naqd', 'Plastik', 'Click', 'Payme'];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <HiOutlineCheckCircle />;
      case 'pending': return <HiOutlineClock />;
      case 'overdue': return <HiOutlineXCircle />;
      default: return <HiOutlineClock />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return "To'langan";
      case 'pending': return "Kutilmoqda";
      case 'overdue': return "Muddati o'tgan";
      default: return status;
    }
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'Naqd': return <HiOutlineCash />;
      case 'Plastik': return <HiOutlineCreditCard />;
      default: return <HiOutlineCurrencyDollar />;
    }
  };

  return (
    <div className="payments-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>💳 To'lovlar Boshqaruvi</h1>
          <p>Jami {filteredPayments.length} ta to'lov | To'lov ko'rsatkichi: {stats.collectionRate}%</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={() => setShowDebtorListModal(true)}>
            <HiOutlineUser /> Qarzdorlar ({debtorsList.length})
          </button>
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-export" onClick={resetFilters}>
            <HiOutlineRefresh /> Filtrni tozalash
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlinePlus /> Yangi to'lov
            </button>
          )}
        </div>
      </div>

      {/* Statistika kartalari */}
      <div className="payments-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineCurrencyDollar />
          </div>
          <div className="stat-info">
            <h3>Yig'ilgan</h3>
            <p>{formatMoney(stats.totalCollected)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>Kutilayotgan</h3>
            <p>{formatMoney(stats.totalPending)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ef444415', color: '#ef4444' }}>
            <HiOutlineXCircle />
          </div>
          <div className="stat-info">
            <h3>Muddati o'tgan</h3>
            <p>{formatMoney(stats.totalOverdue)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-info">
            <h3>To'lovlar soni</h3>
            <p>{stats.paymentCount} ta</p>
          </div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="payments-controls">
        <div className="filters-bar">
          <div className="search-wrapper">
            <HiOutlineSearch />
            <input 
              type="text" 
              placeholder="O'quvchi, sinf yoki kvitansiya bo'yicha qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters-group">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Barcha holatlar</option>
              <option value="paid">To'langan</option>
              <option value="pending">Kutilayotgan</option>
              <option value="overdue">Muddati o'tgan</option>
            </select>
            <select className="filter-select" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="">Barcha usullar</option>
              <option value="Naqd">Naqd</option>
              <option value="Plastik">Plastik</option>
              <option value="Click">Click</option>
              <option value="Payme">Payme</option>
            </select>
            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Barcha turlar</option>
              {paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="filter-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="">Barcha sinflar</option>
              {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="date-range-filter">
          <input type="date" className="date-input" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span>-</span>
          <input type="date" className="date-input" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      {/* To'lovlar jadvali */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>O'quvchi</th>
              <th>Sinf</th>
              <th>To'lov turi</th>
              <th>Summa</th>
              <th>Sana</th>
              <th>To'lov usuli</th>
              <th>Holat</th>
              <th>To'lov muddati</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineCurrencyDollar size={48} />
                    <p>Hech qanday to'lov topilmadi</p>
                    {isAdmin && <button className="btn-primary" onClick={handleAdd}>Yangi to'lov qo'shish</button>}
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <React.Fragment key={payment.id}>
                  <tr 
                    className={`payment-row ${payment.status === 'overdue' ? 'overdue-row' : ''} ${openAccordionId === payment.id ? 'active' : ''}`}
                    onClick={(e) => toggleAccordion(payment.id, e)}
                  >
                    <td>#{payment.id}</td>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar-sm">{payment.student.charAt(0)}</div>
                        {payment.student}
                      </div>
                    </td>
                    <td>{payment.class}</td>
                    <td>{payment.type}</td>
                    <td className="amount-cell">{formatMoney(payment.amount)}</td>
                    <td>
                      <div className="date-cell">
                        <HiOutlineCalendar /> {formatDate(payment.date)}
                      </div>
                    </td>
                    <td>
                      <span className={`method-badge ${payment.method.toLowerCase()}`}>
                        {getMethodIcon(payment.method)} {payment.method}
                      </span>
                    </td>
                    <td>
                      <select
                        className={`payment-status ${payment.status}`}
                        value={payment.status}
                        onChange={(e) => updateStatus(payment.id, e.target.value, e)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="paid">To'langan</option>
                        <option value="pending">Kutilmoqda</option>
                        <option value="overdue">Muddati o'tgan</option>
                      </select>
                    </td>
                    <td>
                      {payment.deadline && payment.status !== 'paid' && (
                        <div className={`deadline-cell ${new Date(payment.deadline) < new Date() ? 'expired' : ''}`}>
                          <HiOutlineCalendar /> {formatDate(payment.deadline)}
                        </div>
                      )}
                      {payment.status === 'paid' && <span className="paid-badge">To'langan</span>}
                    </td>
                    <td>
                      <button 
                        className={`accordion-trigger ${openAccordionId === payment.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAccordionId(openAccordionId === payment.id ? null : payment.id);
                        }}
                      >
                        {openAccordionId === payment.id ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {/* Accordion panel - ochiladigan qism */}
                  {openAccordionId === payment.id && (
                    <tr className="accordion-row">
                      <td colSpan="10" className="accordion-cell">
                        <div className="accordion-content">
                          <div className="action-buttons-accordion">
                            <button className="action-btn-accordion view" onClick={(e) => handleView(payment, e)}>
                              <HiOutlineEye /> <span>Ko'rish</span>
                            </button>
                            <button className="action-btn-accordion invoice" onClick={(e) => handleViewInvoice(payment, e)}>
                              <HiOutlineReceiptTax /> <span>Kvitansiya</span>
                            </button>
                            <button className="action-btn-accordion history" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudentForHistory(payment.studentId);
                              setShowPaymentHistoryModal(true);
                              setOpenAccordionId(null);
                            }}>
                              <HiOutlineClock /> <span>Tarix</span>
                            </button>
                            {isAdmin && (
                              <>
                                <button className="action-btn-accordion edit" onClick={(e) => handleEdit(payment, e)}>
                                  <HiOutlinePencil /> <span>Tahrirlash</span>
                                </button>
                                <button className="action-btn-accordion delete" onClick={(e) => handleDelete(payment.id, e)}>
                                  <HiOutlineTrash /> <span>O'chirish</span>
                                </button>
                              </>
                            )}
                          </div>
                          <div className="accordion-info">
                            <div className="info-item">
                              <span className="info-label">📄 Kvitansiya raqami:</span>
                              <span className="info-value">{payment.receiptNo}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label">💰 To'lov summasi:</span>
                              <span className="info-value amount">{formatMoney(payment.amount)}</span>
                            </div>
                            {payment.description && (
                              <div className="info-item">
                                <span className="info-label">📝 Tavsif:</span>
                                <span className="info-value">{payment.description}</span>
                              </div>
                            )}
                            {payment.deadline && payment.status !== 'paid' && (
                              <div className="info-item">
                                <span className="info-label">⏰ To'lov muddati:</span>
                                <span className="info-value">{formatDate(payment.deadline)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* To'lov usullari va so'nggi to'lovlar */}
      <div className="payment-methods-summary">
        <div className="summary-card">
          <h4><HiOutlineCreditCard /> To'lov usullari bo'yicha</h4>
          <div className="methods-stats">
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Naqd</span>
              <div className="method-bar"><div className="method-fill" style={{ width: `${methodPercentages.Naqd}%`, background: '#10b981' }}></div></div>
              <span className="method-percent">{methodPercentages.Naqd}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCreditCard /> Plastik</span>
              <div className="method-bar"><div className="method-fill" style={{ width: `${methodPercentages.Plastik}%`, background: '#3b82f6' }}></div></div>
              <span className="method-percent">{methodPercentages.Plastik}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Click</span>
              <div className="method-bar"><div className="method-fill" style={{ width: `${methodPercentages.Click}%`, background: '#f59e0b' }}></div></div>
              <span className="method-percent">{methodPercentages.Click}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Payme</span>
              <div className="method-bar"><div className="method-fill" style={{ width: `${methodPercentages.Payme}%`, background: '#8b5cf6' }}></div></div>
              <span className="method-percent">{methodPercentages.Payme}%</span>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <h4><HiOutlineClock /> So'nggi to'lovlar</h4>
          <div className="recent-payments">
            {payments.slice(0, 5).map(payment => (
              <div key={payment.id} className="recent-item">
                <div className="recent-info">
                  <div className="recent-name">{payment.student}</div>
                  <div className="recent-date">{formatDate(payment.date)}</div>
                </div>
                <div className="recent-amount">{formatMoney(payment.amount)}</div>
                <div className={`recent-status ${payment.status}`}>{getStatusIcon(payment.status)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qarzdorlar ro'yxati modal */}
      {showDebtorListModal && (
        <div className="modal-overlay" onClick={() => setShowDebtorListModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineUser /> Qarzdorlar ro'yxati</h2>
              <button className="modal-close" onClick={() => setShowDebtorListModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              {debtorsList.length === 0 ? (
                <div className="empty-state"><HiOutlineCheckCircle size={48} color="#10b981" /><p>Hozircha qarzdorlar mavjud emas!</p></div>
              ) : (
                <div className="debtors-list">
                  <table className="debtors-table">
                    <thead><tr><th>O'quvchi</th><th>Sinf</th><th>Qarz summasi</th><th>Amallar</th></tr></thead>
                    <tbody>
                      {debtorsList.map(debtor => (
                        <tr key={debtor.studentId}>
                          <td><div className="student-cell"><div className="student-avatar-sm">{debtor.student.charAt(0)}</div>{debtor.student}</div></td>
                          <td>{debtor.class}</td>
                          <td className="debt-amount">{formatMoney(debtor.totalDebt)}</td>
                          <td><button className="btn-small" onClick={() => { setSelectedStudentForHistory(debtor.studentId); setShowDebtorListModal(false); setShowPaymentHistoryModal(true); }}>To'lov tarixi</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-buttons"><button className="btn-secondary" onClick={() => setShowDebtorListModal(false)}>Yopish</button></div>
          </div>
        </div>
      )}

      {/* To'lov tarixi modal */}
      {showPaymentHistoryModal && selectedStudentForHistory && (
        <div className="modal-overlay" onClick={() => setShowPaymentHistoryModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineClock /> To'lov tarixi</h2>
              <button className="modal-close" onClick={() => setShowPaymentHistoryModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              {(() => {
                const student = students.find(s => s.id === selectedStudentForHistory);
                const history = getStudentPaymentHistory(selectedStudentForHistory);
                const totalPaid = history.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
                const totalPending = history.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
                return (
                  <>
                    <div className="student-info-header">
                      <h3>{student?.name}</h3>
                      <p>Sinf: {student?.class} | Telefon: {student?.phone}</p>
                      <div className="history-stats">
                        <div className="history-stat"><span>Jami to'langan:</span><strong className="paid-text">{formatMoney(totalPaid)}</strong></div>
                        <div className="history-stat"><span>Jami qarz:</span><strong className="pending-text">{formatMoney(totalPending)}</strong></div>
                      </div>
                    </div>
                    {history.length === 0 ? (<div className="empty-state"><p>Hech qanday to'lov tarixi mavjud emas</p></div>) : (
                      <table className="history-table">
                        <thead><tr><th>Kvitansiya №</th><th>Sana</th><th>To'lov turi</th><th>Summa</th><th>Holat</th></tr></thead>
                        <tbody>
                          {history.map(payment => (
                            <tr key={payment.id}>
                              <td>{payment.receiptNo}</td>
                              <td>{formatDate(payment.date)}</td>
                              <td>{payment.type}</td>
                              <td className="amount-cell">{formatMoney(payment.amount)}</td>
                              <td><span className={`status-badge ${payment.status}`}>{getStatusText(payment.status)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="modal-buttons"><button className="btn-secondary" onClick={() => setShowPaymentHistoryModal(false)}>Yopish</button></div>
          </div>
        </div>
      )}

      {/* Ko'rish modal */}
      {showDetailsModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>To'lov ma'lumotlari</h2><button className="modal-close" onClick={() => setShowDetailsModal(false)}><HiOutlineX /></button></div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item"><span className="detail-label">Kvitansiya raqami:</span><span className="detail-value">{selectedPayment.receiptNo}</span></div>
                <div className="detail-item"><span className="detail-label">O'quvchi:</span><span className="detail-value">{selectedPayment.student}</span></div>
                <div className="detail-item"><span className="detail-label">Sinf:</span><span className="detail-value">{selectedPayment.class}</span></div>
                <div className="detail-item"><span className="detail-label">To'lov turi:</span><span className="detail-value">{selectedPayment.type}</span></div>
                <div className="detail-item"><span className="detail-label">Summa:</span><span className="detail-value">{formatMoney(selectedPayment.amount)}</span></div>
                <div className="detail-item"><span className="detail-label">Sana:</span><span className="detail-value">{formatDate(selectedPayment.date)}</span></div>
                <div className="detail-item"><span className="detail-label">To'lov usuli:</span><span className="detail-value">{selectedPayment.method}</span></div>
                <div className="detail-item"><span className="detail-label">Holat:</span><span className={`status-badge ${selectedPayment.status}`}>{getStatusText(selectedPayment.status)}</span></div>
                {selectedPayment.description && <div className="detail-item full-width"><span className="detail-label">Tavsif:</span><span className="detail-value">{selectedPayment.description}</span></div>}
              </div>
            </div>
            <div className="modal-buttons"><button className="btn-primary" onClick={() => { setShowDetailsModal(false); handleViewInvoice(selectedPayment); }}><HiOutlineReceiptTax /> Kvitansiya</button><button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Yopish</button></div>
          </div>
        </div>
      )}

      {/* Kvitansiya modal */}
      {showInvoiceModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowInvoiceModal(false)}>
          <div className="modal-content invoice-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2><HiOutlineReceiptTax /> Kvitansiya #{selectedPayment.receiptNo}</h2><button className="modal-close" onClick={() => setShowInvoiceModal(false)}><HiOutlineX /></button></div>
            <div className="modal-body invoice-body">
              <div className="invoice-header"><div className="school-logo"></div><img src={Logo} alt="Maktab logotipi" style={{ height: '60px', marginBottom: '20px' }} /><p>To'lov kvitansiyasi</p></div>
              <div className="invoice-details">
                <div className="invoice-row"><span className="invoice-label">Kvitansiya raqami:</span><span className="invoice-value">{selectedPayment.receiptNo}</span></div>
                <div className="invoice-row"><span className="invoice-label">Sana:</span><span className="invoice-value">{formatDate(selectedPayment.date)}</span></div>
                <div className="invoice-row"><span className="invoice-label">O'quvchi:</span><span className="invoice-value">{selectedPayment.student}</span></div>
                <div className="invoice-row"><span className="invoice-label">Sinf:</span><span className="invoice-value">{selectedPayment.class}</span></div>
                <div className="invoice-row"><span className="invoice-label">To'lov turi:</span><span className="invoice-value">{selectedPayment.type}</span></div>
                <div className="invoice-row"><span className="invoice-label">To'lov usuli:</span><span className="invoice-value">{selectedPayment.method}</span></div>
                <div className="invoice-row total-row"><span className="invoice-label">Jami summa:</span><span className="invoice-value total-amount">{formatMoney(selectedPayment.amount)}</span></div>
              </div>
              <div className="invoice-footer"><p>Rahmat! To'lov muvaffaqiyatli amalga oshirildi.</p></div>
            </div>
            <div className="modal-buttons"><button className="btn-primary" onClick={() => printInvoice(selectedPayment)}><HiOutlinePrinter /> Chop etish</button><button className="btn-secondary" onClick={() => setShowInvoiceModal(false)}>Yopish</button></div>
          </div>
        </div>
      )}

      {/* Yangi/Tahrirlash modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>{editingPayment?.id ? "To'lov tahrirlash" : "Yangi to'lov"}</h2><button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button></div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchi *</label>
                  <select value={editingPayment?.student || ''} onChange={(e) => {
                    const selectedStudent = students.find(s => s.name === e.target.value);
                    setEditingPayment({ ...editingPayment, student: e.target.value, studentId: selectedStudent?.id, class: selectedStudent?.class || '' });
                  }}>
                    <option value="">O'quvchi tanlang</option>
                    {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.class})</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Sinf</label><input type="text" value={editingPayment?.class || ''} disabled /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>To'lov turi</label><select value={editingPayment?.type || "Oylik to'lov"} onChange={(e) => setEditingPayment({ ...editingPayment, type: e.target.value })}>{paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="form-group"><label>Summa *</label><input type="number" value={editingPayment?.amount || 0} onChange={(e) => setEditingPayment({ ...editingPayment, amount: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Sana</label><input type="date" value={editingPayment?.date || ''} onChange={(e) => setEditingPayment({ ...editingPayment, date: e.target.value })} /></div>
                <div className="form-group"><label>To'lov usuli</label><select value={editingPayment?.method || 'Naqd'} onChange={(e) => setEditingPayment({ ...editingPayment, method: e.target.value })}>{paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Holat</label><select value={editingPayment?.status || 'paid'} onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value })}><option value="paid">To'langan</option><option value="pending">Kutilmoqda</option><option value="overdue">Muddati o'tgan</option></select></div>
                <div className="form-group"><label>Kvitansiya raqami</label><input type="text" value={editingPayment?.receiptNo || 'Avtomatik'} disabled /></div>
              </div>
              <div className="form-group"><label>Tavsif</label><textarea rows="2" placeholder="Qo'shimcha ma'lumot..." value={editingPayment?.description || ''} onChange={(e) => setEditingPayment({ ...editingPayment, description: e.target.value })} /></div>
            </div>
            <div className="modal-buttons"><button className="btn-primary" onClick={handleSave}>{editingPayment?.id ? 'Yangilash' : 'Qo\'shish'}</button><button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;