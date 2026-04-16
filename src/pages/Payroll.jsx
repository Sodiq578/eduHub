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
import Logo from '../assets/logo.svg';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);

  // LOAD DATA
  useEffect(() => {
    loadPayrolls();
    loadTeachers();
    loadSalaryHistory();
  }, []);

  const loadPayrolls = () => {
    const stored = localStorage.getItem('payroll');
    if (stored) {
      setPayrolls(JSON.parse(stored));
    } else {
      const defaultData = generateDefaultPayrolls();
      setPayrolls(defaultData);
      localStorage.setItem('payroll', JSON.stringify(defaultData));
    }
  };

  const generateDefaultPayrolls = () => {
    const teachersList = [
      { id: 1, name: 'Shahzoda Ahmedova', subject: 'Matematika', baseSalary: 5000000 },
      { id: 2, name: 'Rustam Karimov', subject: 'Fizika', baseSalary: 4800000 },
      { id: 3, name: 'Gulnora Saidova', subject: 'Ona tili', baseSalary: 4500000 },
      { id: 4, name: 'Bobur Aliyev', subject: 'Ingliz tili', baseSalary: 5200000 },
      { id: 5, name: 'Dilshod Karimov', subject: 'Tarix', baseSalary: 4600000 },
      { id: 6, name: 'Nodira Ismoilova', subject: 'Biologiya', baseSalary: 4700000 }
    ];
    
    const months = ['2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02'];
    const payrollsList = [];
    
    for (let i = 0; i < teachersList.length; i++) {
      for (let j = 0; j < months.length; j++) {
        const bonus = Math.floor(Math.random() * 500000);
        const deduction = Math.floor(Math.random() * 100000);
        const total = teachersList[i].baseSalary + bonus - deduction;
        const status = Math.random() > 0.3 ? 'paid' : 'pending';
        const paymentDate = status === 'paid' ? `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}` : '';
        
        payrollsList.push({
          id: i * months.length + j + 1,
          teacherName: teachersList[i].name,
          teacherId: teachersList[i].id,
          subject: teachersList[i].subject,
          month: months[j],
          baseSalary: teachersList[i].baseSalary,
          bonus: bonus,
          deduction: deduction,
          total: total,
          status: status,
          paymentDate: paymentDate,
          paymentMethod: ['Naqd', 'Plastik', 'Bank', 'Click'][Math.floor(Math.random() * 4)],
          receiptNo: `PR-${String(2024000 + i * months.length + j).slice(-6)}`,
          description: status === 'paid' ? "To'lov qabul qilindi" : "To'lov kutilmoqda"
        });
      }
    }
    return payrollsList;
  };

  const loadTeachers = () => {
    const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    if (storedTeachers.length === 0) {
      const defaultTeachers = [
        { id: 1, name: 'Shahzoda Ahmedova', subject: 'Matematika', phone: '+998901234567', email: 'shahzoda@school.uz', experience: 8, baseSalary: 5000000 },
        { id: 2, name: 'Rustam Karimov', subject: 'Fizika', phone: '+998902345678', email: 'rustam@school.uz', experience: 5, baseSalary: 4800000 },
        { id: 3, name: 'Gulnora Saidova', subject: 'Ona tili', phone: '+998903456789', email: 'gulnora@school.uz', experience: 10, baseSalary: 4500000 },
        { id: 4, name: 'Bobur Aliyev', subject: 'Ingliz tili', phone: '+998904567890', email: 'bobur@school.uz', experience: 6, baseSalary: 5200000 },
        { id: 5, name: 'Dilshod Karimov', subject: 'Tarix', phone: '+998905678901', email: 'dilshod@school.uz', experience: 7, baseSalary: 4600000 },
        { id: 6, name: 'Nodira Ismoilova', subject: 'Biologiya', phone: '+998906789012', email: 'nodira@school.uz', experience: 4, baseSalary: 4700000 }
      ];
      setTeachers(defaultTeachers);
      localStorage.setItem('teachers', JSON.stringify(defaultTeachers));
    } else {
      setTeachers(storedTeachers);
    }
  };

  const loadSalaryHistory = () => {
    const stored = localStorage.getItem('salaryHistory');
    if (stored) {
      setSalaryHistory(JSON.parse(stored));
    } else {
      setSalaryHistory([]);
      localStorage.setItem('salaryHistory', JSON.stringify([]));
    }
  };

  const savePayrolls = (data) => {
    setPayrolls(data);
    localStorage.setItem('payroll', JSON.stringify(data));
  };

  const saveSalaryHistory = (data) => {
    setSalaryHistory(data);
    localStorage.setItem('salaryHistory', JSON.stringify(data));
  };

  const calculateTotal = (data) => {
    return ((data.baseSalary || 0) + (data.bonus || 0) - (data.deduction || 0));
  };

  const handleAdd = () => {
    setEditingPayroll({
      teacherName: '',
      teacherId: '',
      subject: '',
      month: selectedMonth,
      baseSalary: 0,
      bonus: 0,
      deduction: 0,
      total: 0,
      status: 'pending',
      paymentDate: '',
      paymentMethod: 'Naqd',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (payroll) => {
    setEditingPayroll({ ...payroll });
    setShowModal(true);
    setOpenAccordionId(null);
  };

  const handleView = (payroll) => {
    setSelectedPayroll(payroll);
    setShowDetailsModal(true);
    setOpenAccordionId(null);
  };

  const handleViewReceipt = (payroll) => {
    setSelectedPayroll(payroll);
    setShowReceiptModal(true);
    setOpenAccordionId(null);
  };

  const handleSave = () => {
    if (!editingPayroll.teacherName) {
      alert("O'qituvchini tanlang!");
      return;
    }

    const total = calculateTotal(editingPayroll);
    const updatedPayroll = { ...editingPayroll, total };

    if (editingPayroll.id) {
      const updated = payrolls.map((p) => p.id === editingPayroll.id ? updatedPayroll : p);
      savePayrolls(updated);
      alert("Oylik ma'lumotlari yangilandi!");
    } else {
      const newPayroll = { 
        ...updatedPayroll, 
        id: Date.now(),
        receiptNo: `PR-${String(Date.now()).slice(-6)}`
      };
      savePayrolls([newPayroll, ...payrolls]);
      alert("Yangi oylik qo'shildi!");
    }

    setShowModal(false);
    setEditingPayroll(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Oylik ma'lumotini o'chirmoqchimisiz?")) {
      savePayrolls(payrolls.filter((p) => p.id !== id));
      alert("O'chirildi!");
      setOpenAccordionId(null);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = payrolls.map(p => 
      p.id === id ? { 
        ...p, 
        status: newStatus, 
        paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : '',
        description: newStatus === 'paid' ? "To'lov qabul qilindi" : "To'lov kutilmoqda"
      } : p
    );
    savePayrolls(updated);
    
    // Historyga qo'shish
    const changedPayroll = updated.find(p => p.id === id);
    if (newStatus === 'paid') {
      const historyEntry = {
        id: Date.now(),
        payrollId: id,
        teacherName: changedPayroll.teacherName,
        month: changedPayroll.month,
        amount: changedPayroll.total,
        date: new Date().toISOString().split('T')[0],
        type: 'payment'
      };
      saveSalaryHistory([historyEntry, ...salaryHistory]);
    }
  };

  const toggleAccordion = (id, e) => {
    if (e && (e.target.closest('.action-btn-accordion') || e.target.closest('.accordion-trigger'))) {
      if (e) e.stopPropagation();
      return;
    }
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  // FILTER
  const filtered = payrolls.filter((p) => {
    const matchesSearch = p.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = p.month === selectedMonth;
    const matchesStatus = statusFilter === '' || p.status === statusFilter;
    return matchesSearch && matchesMonth && matchesStatus;
  });

  const totalSalary = filtered.reduce((sum, p) => sum + (p.total || 0), 0);
  const paidCount = filtered.filter(p => p.status === 'paid').length;
  const pendingCount = filtered.filter(p => p.status === 'pending').length;
  const paidAmount = filtered.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.total, 0);
  const pendingAmount = filtered.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.total, 0);
  const paymentRate = filtered.length > 0 ? ((paidCount / filtered.length) * 100).toFixed(1) : 0;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('uz-UZ');
  };

  // Eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', "O'qituvchi", 'Fan', 'Asosiy maosh', 'Bonus', 'Ajratma', 'Jami', 'Holat', "To'lov sanasi", "To'lov usuli", 'Kvitansiya', 'Oy'];
    const csvData = filtered.map(p => [
      p.id, p.teacherName, p.subject || '-', p.baseSalary, p.bonus, p.deduction, p.total,
      p.status === 'paid' ? "To'langan" : 'Kutilmoqda', p.paymentDate || '-', p.paymentMethod || '-', p.receiptNo || '-', p.month
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Chop etish
  const printReceipt = (payroll) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Ish haqi kvitansiyasi ${payroll.receiptNo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f0f0f0; }
          .receipt { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { text-align: center; padding: 30px; background: linear-gradient(135deg, #f8fafc, #fff); border-bottom: 2px solid #10b981; }
          .school-name { font-size: 24px; font-weight: bold; color: #10b981; }
          .receipt-no { font-size: 14px; color: #666; margin-top: 10px; font-family: monospace; }
          .details { padding: 20px 30px; }
          .row { display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; }
          .label { font-weight: bold; color: #475569; }
          .total { font-size: 20px; font-weight: bold; color: #10b981; text-align: right; padding: 15px 30px; background: #f8fafc; border-top: 2px solid #10b981; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .status-paid { background: #d1fae5; color: #065f46; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
           img src="${Logo}" alt="Maktab logotipi" style="height: 60px; margin-bottom: 20px;" />
            <div>Ish haqi kvitansiyasi</div>
            <div class="receipt-no">№ ${payroll.receiptNo}</div>
          </div>
          <div class="details">
            <div class="row"><span class="label">O'qituvchi:</span><span>${payroll.teacherName}</span></div>
            <div class="row"><span class="label">Fan:</span><span>${payroll.subject || '-'}</span></div>
            <div class="row"><span class="label">Oy:</span><span>${payroll.month}</span></div>
            <div class="row"><span class="label">Asosiy maosh:</span><span>${formatMoney(payroll.baseSalary)}</span></div>
            <div class="row"><span class="label">Bonus:</span><span>+${formatMoney(payroll.bonus)}</span></div>
            <div class="row"><span class="label">Ajratma:</span><span>-${formatMoney(payroll.deduction)}</span></div>
            <div class="row"><span class="label">To'lov usuli:</span><span>${payroll.paymentMethod || 'Naqd'}</span></div>
            <div class="row"><span class="label">To'lov sanasi:</span><span>${formatDate(payroll.paymentDate)}</span></div>
          </div>
          <div class="total">Jami: ${formatMoney(payroll.total)}</div>
          <div class="footer"><p>✅ To'lov muvaffaqiyatli amalga oshirildi.</p></div>
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
  };

  // Oylar ro'yxati
  const months = [
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'
  ];

  const getStatusIcon = (status) => {
    return status === 'paid' ? <HiOutlineCheckCircle /> : <HiOutlineClock />;
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'Naqd': return <HiOutlineCash />;
      case 'Plastik': return <HiOutlineCreditCard />;
      case 'Bank': return <HiOutlineCurrencyDollar />;
      default: return <HiOutlineCurrencyDollar />;
    }
  };

  return (
    <div className="payroll-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1><HiOutlineCash /> Oyliklar / Ish haqi</h1>
          <p><HiOutlineUsers /> {filtered.length} ta xodim | Jami: {formatMoney(totalSalary)} | To'lov ko'rsatkichi: {paymentRate}%</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-export" onClick={resetFilters}>
            <HiOutlineRefresh /> Filtrni tozalash
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlinePlus /> Yangi oylik
          </button>
        </div>
      </div>

      {/* STATISTIK KARTALAR */}
      <div className="payroll-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineCash />
          </div>
          <div className="stat-info">
            <h3>Jami to'lov</h3>
            <p>{formatMoney(totalSalary)}</p>
            <small><HiOutlineTrendingUp /> +8% o'tgan oyga nisbatan</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-info">
            <h3>To'langan</h3>
            <p>{paidCount} ta | {formatMoney(paidAmount)}</p>
            <small>{paymentRate}% to'lov ko'rsatkichi</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>Kutilayotgan</h3>
            <p>{pendingCount} ta | {formatMoney(pendingAmount)}</p>
            <small><HiOutlineExclamationCircle /> To'lov kutilmoqda</small>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineCalculator />
          </div>
          <div className="stat-info">
            <h3>O'rtacha maosh</h3>
            <p>{filtered.length > 0 ? formatMoney(totalSalary / filtered.length) : formatMoney(0)}</p>
            <small>{teachers.length} nafar xodim</small>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input
            type="text"
            placeholder="O'qituvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="month-selector">
            <HiOutlineCalendar />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
          </div>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Barcha holatlar</option>
            <option value="paid">To'langan</option>
            <option value="pending">Kutilmoqda</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>O'qituvchi</th>
              <th>Fan</th>
              <th>Asosiy maosh</th>
              <th>Bonus</th>
              <th>Ajratma</th>
              <th>Jami</th>
              <th>Holat</th>
              <th>To'lov sanasi</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineCash size={48} />
                    <p>Hech qanday oylik ma'lumoti topilmadi</p>
                    <button className="btn-primary" onClick={handleAdd}>Yangi oylik qo'shish</button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <React.Fragment key={p.id}>
                  <tr 
                    className={`payroll-row ${p.status === 'pending' ? 'pending-row' : ''} ${openAccordionId === p.id ? 'active' : ''}`}
                    onClick={(e) => toggleAccordion(p.id, e)}
                  >
                    <td>#{p.id}</td>
                    <td>
                      <div className="teacher-cell">
                        <div className="teacher-avatar">{p.teacherName.charAt(0)}</div>
                        {p.teacherName}
                      </div>
                    </td>
                    <td>{p.subject || '-'}</td>
                    <td className="amount-cell">{formatMoney(p.baseSalary)}</td>
                    <td className="bonus-cell">+{formatMoney(p.bonus)}</td>
                    <td className="deduction-cell">-{formatMoney(p.deduction)}</td>
                    <td className="total-cell">{formatMoney(p.total)}</td>
                    <td>
                      <select 
                        className={`status-badge ${p.status}`}
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="paid">✅ To'langan</option>
                        <option value="pending">⏳ Kutilmoqda</option>
                      </select>
                    </td>
                    <td>{p.paymentDate ? formatDate(p.paymentDate) : '-'}</td>
                    <td>
                      <button 
                        className={`accordion-trigger ${openAccordionId === p.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenAccordionId(openAccordionId === p.id ? null : p.id);
                        }}
                      >
                        {openAccordionId === p.id ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {/* Accordion panel */}
                  {openAccordionId === p.id && (
                    <tr className="accordion-row">
                      <td colSpan="10" className="accordion-cell">
                        <div className="accordion-content">
                          <div className="action-buttons-accordion">
                            <button className="action-btn-accordion view" onClick={(e) => { e.stopPropagation(); handleView(p); }}>
                              <HiOutlineEye /> <span>Ko'rish</span>
                            </button>
                            <button className="action-btn-accordion receipt" onClick={(e) => { e.stopPropagation(); handleViewReceipt(p); }}>
                              <HiOutlineReceiptTax /> <span>Kvitansiya</span>
                            </button>
                            <button className="action-btn-accordion edit" onClick={(e) => { e.stopPropagation(); handleEdit(p); }}>
                              <HiOutlinePencil /> <span>Tahrirlash</span>
                            </button>
                            <button className="action-btn-accordion delete" onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}>
                              <HiOutlineTrash /> <span>O'chirish</span>
                            </button>
                          </div>
                          <div className="accordion-info">
                            <div className="info-item">
                              <span className="info-label"><HiOutlineReceiptTax /> Kvitansiya raqami:</span>
                              <span className="info-value">{p.receiptNo || '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label"><HiOutlineCreditCard /> To'lov usuli:</span>
                              <span className="info-value">{getMethodIcon(p.paymentMethod)} {p.paymentMethod || 'Naqd'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label"><HiOutlineDocumentText /> Tavsif:</span>
                              <span className="info-value">{p.description || '-'}</span>
                            </div>
                            <div className="info-item">
                              <span className="info-label"><HiOutlineCalculator /> Hisoblash:</span>
                              <span className="info-value">{formatMoney(p.baseSalary)} + {formatMoney(p.bonus)} - {formatMoney(p.deduction)} = {formatMoney(p.total)}</span>
                            </div>
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

      {/* KO'RISH MODAL */}
      {showDetailsModal && selectedPayroll && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineEye /> Oylik ma'lumotlari</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineUser /> O'qituvchi:</span>
                  <span className="detail-value">{selectedPayroll.teacherName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineBookOpen /> Fan:</span>
                  <span className="detail-value">{selectedPayroll.subject || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineCalendar /> Oy:</span>
                  <span className="detail-value">{selectedPayroll.month}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineReceiptTax /> Kvitansiya:</span>
                  <span className="detail-value">{selectedPayroll.receiptNo || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineCash /> Asosiy maosh:</span>
                  <span className="detail-value">{formatMoney(selectedPayroll.baseSalary)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineTrendingUp /> Bonus:</span>
                  <span className="detail-value">+{formatMoney(selectedPayroll.bonus)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineTrendingDown /> Ajratma:</span>
                  <span className="detail-value">-{formatMoney(selectedPayroll.deduction)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineCurrencyDollar /> Jami:</span>
                  <span className="detail-value total-amount">{formatMoney(selectedPayroll.total)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><HiOutlineCheckCircle /> Holat:</span>
                  <span className={`status-badge ${selectedPayroll.status}`}>
                    {getStatusIcon(selectedPayroll.status)} {selectedPayroll.status === 'paid' ? "To'langan" : 'Kutilmoqda'}
                  </span>
                </div>
                {selectedPayroll.paymentDate && (
                  <div className="detail-item">
                    <span className="detail-label"><HiOutlineCalendar /> To'lov sanasi:</span>
                    <span className="detail-value">{formatDate(selectedPayroll.paymentDate)}</span>
                  </div>
                )}
                {selectedPayroll.paymentMethod && (
                  <div className="detail-item">
                    <span className="detail-label"><HiOutlineCreditCard /> To'lov usuli:</span>
                    <span className="detail-value">{selectedPayroll.paymentMethod}</span>
                  </div>
                )}
                {selectedPayroll.description && (
                  <div className="detail-item full-width">
                    <span className="detail-label"><HiOutlineDocumentText /> Tavsif:</span>
                    <span className="detail-value">{selectedPayroll.description}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => { setShowDetailsModal(false); handleViewReceipt(selectedPayroll); }}>
                <HiOutlineReceiptTax /> Kvitansiya
              </button>
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* KVITANSIYA MODAL */}
      {showReceiptModal && selectedPayroll && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineReceiptTax /> Ish haqi kvitansiyasi</h2>
              <button className="modal-close" onClick={() => setShowReceiptModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body receipt-body">
              <div className="receipt-header">
            <img src={Logo} alt="Maktab logotipi" />
               
                <p>Ish haqi kvitansiyasi</p>
                <div className="receipt-no">№ {selectedPayroll.receiptNo || 'PR-' + String(selectedPayroll.id).slice(-6)}</div>
              </div>
              <div className="receipt-details">
                <div className="receipt-row">
                  <span className="receipt-label">O'qituvchi:</span>
                  <span className="receipt-value">{selectedPayroll.teacherName}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Fan:</span>
                  <span className="receipt-value">{selectedPayroll.subject || '-'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Oy:</span>
                  <span className="receipt-value">{selectedPayroll.month}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Asosiy maosh:</span>
                  <span className="receipt-value">{formatMoney(selectedPayroll.baseSalary)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Bonus:</span>
                  <span className="receipt-value bonus">+{formatMoney(selectedPayroll.bonus)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Ajratma:</span>
                  <span className="receipt-value deduction">-{formatMoney(selectedPayroll.deduction)}</span>
                </div>
                <div className="receipt-row total-row">
                  <span className="receipt-label">Jami summa:</span>
                  <span className="receipt-value total-amount">{formatMoney(selectedPayroll.total)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">To'lov usuli:</span>
                  <span className="receipt-value">{selectedPayroll.paymentMethod || 'Naqd'}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">To'lov sanasi:</span>
                  <span className="receipt-value">{formatDate(selectedPayroll.paymentDate)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Holat:</span>
                  <span className={`status-badge ${selectedPayroll.status}`}>
                    {selectedPayroll.status === 'paid' ? "✅ To'langan" : "⏳ Kutilmoqda"}
                  </span>
                </div>
              </div>
              <div className="receipt-footer">
                <p>Rahmat! To'lov muvaffaqiyatli amalga oshirildi.</p>
                <p className="receipt-note">Ushbu kvitansiyani saqlab qo'ying!</p>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => printReceipt(selectedPayroll)}>
                <HiOutlinePrinter /> Chop etish
              </button>
              <button className="btn-secondary" onClick={() => setShowReceiptModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPayroll?.id ? <HiOutlinePencil /> : <HiOutlinePlus />} {editingPayroll?.id ? 'Oylik tahrirlash' : 'Yangi oylik'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label><HiOutlineUser /> O'qituvchi *</label>
                <select
                  value={editingPayroll?.teacherName || ''}
                  onChange={(e) => {
                    const selectedTeacher = teachers.find(t => t.name === e.target.value);
                    setEditingPayroll({
                      ...editingPayroll,
                      teacherName: e.target.value,
                      teacherId: selectedTeacher?.id,
                      subject: selectedTeacher?.subject,
                      baseSalary: selectedTeacher?.baseSalary || 0
                    });
                  }}
                >
                  <option value="">O'qituvchi tanlang</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><HiOutlineCash /> Asosiy maosh</label>
                  <input
                    type="number"
                    placeholder="Asosiy maosh"
                    value={editingPayroll?.baseSalary || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const updated = { ...editingPayroll, baseSalary: val };
                      updated.total = calculateTotal(updated);
                      setEditingPayroll(updated);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label><HiOutlineTrendingUp /> Bonus</label>
                  <input
                    type="number"
                    placeholder="Bonus"
                    value={editingPayroll?.bonus || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const updated = { ...editingPayroll, bonus: val };
                      updated.total = calculateTotal(updated);
                      setEditingPayroll(updated);
                    }}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><HiOutlineTrendingDown /> Ajratma</label>
                  <input
                    type="number"
                    placeholder="Ajratma"
                    value={editingPayroll?.deduction || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const updated = { ...editingPayroll, deduction: val };
                      updated.total = calculateTotal(updated);
                      setEditingPayroll(updated);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label><HiOutlineCalculator /> Jami</label>
                  <input
                    type="text"
                    value={formatMoney(calculateTotal(editingPayroll))}
                    disabled
                    className="total-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><HiOutlineCalendar /> Oy</label>
                  <select
                    value={editingPayroll?.month || selectedMonth}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, month: e.target.value })}
                  >
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label><HiOutlineCreditCard /> To'lov usuli</label>
                  <select
                    value={editingPayroll?.paymentMethod || 'Naqd'}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, paymentMethod: e.target.value })}
                  >
                    <option value="Naqd">Naqd</option>
                    <option value="Plastik">Plastik</option>
                    <option value="Bank">Bank</option>
                    <option value="Click">Click</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label><HiOutlineCheckCircle /> Holat</label>
                  <select
                    value={editingPayroll?.status || 'pending'}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, status: e.target.value })}
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="paid">To'langan</option>
                  </select>
                </div>
                {editingPayroll?.status === 'paid' && (
                  <div className="form-group">
                    <label><HiOutlineCalendar /> To'lov sanasi</label>
                    <input
                      type="date"
                      value={editingPayroll?.paymentDate || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setEditingPayroll({ ...editingPayroll, paymentDate: e.target.value })}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label><HiOutlineDocumentText /> Tavsif</label>
                <textarea
                  rows="2"
                  placeholder="Qo'shimcha ma'lumot..."
                  value={editingPayroll?.description || ''}
                  onChange={(e) => setEditingPayroll({ ...editingPayroll, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingPayroll?.id ? 'Yangilash' : 'Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;