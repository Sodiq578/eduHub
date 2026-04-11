import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineReceiptTax,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineCreditCard,
  HiOutlineCash
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Payments.css';

const Payments = () => {
  const { user, roles } = useAuth();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [students, setStudents] = useState([]);

  const isAdmin = user?.role === roles.ADMIN || user?.role === roles.FINANCE;

  useEffect(() => {
    loadPayments();
    loadStudents();
  }, []);

  const loadPayments = () => {
    const stored = localStorage.getItem('payments');
    if (stored) {
      setPayments(JSON.parse(stored));
    } else {
      const defaultPayments = [
        { id: 1, student: 'Ali Valiyev', studentId: 1, class: '10-A', amount: 500000, date: '2024-01-15', method: 'Naqd', status: 'paid', type: "Oylik to'lov", receiptNo: 'RCT-001', description: '' },
        { id: 2, student: 'Dilnoza Karimova', studentId: 2, class: '10-B', amount: 500000, date: '2024-01-14', method: 'Plastik', status: 'paid', type: "Oylik to'lov", receiptNo: 'RCT-002', description: '' },
        { id: 3, student: 'Jasur Aliyev', studentId: 3, class: '9-A', amount: 500000, date: '2024-01-10', method: 'Click', status: 'paid', type: "Oylik to'lov", receiptNo: 'RCT-003', description: '' },
        { id: 4, student: 'Zarina Toshpulatova', studentId: 4, class: '11-A', amount: 550000, date: '2024-01-20', method: 'Payme', status: 'pending', type: "Oylik to'lov", receiptNo: 'RCT-004', description: '' },
        { id: 5, student: 'Bobur Sattorov', studentId: 5, class: '8-A', amount: 500000, date: '2024-01-05', method: 'Naqd', status: 'overdue', type: "Oylik to'lov", receiptNo: 'RCT-005', description: '' },
        { id: 6, student: 'Madina Rahimova', studentId: 6, class: '10-A', amount: 100000, date: '2024-01-18', method: 'Plastik', status: 'paid', type: "Qo'shimcha to'lov", receiptNo: 'RCT-006', description: 'Kitob sotib olish uchun' },
      ];
      setPayments(defaultPayments);
      localStorage.setItem('payments', JSON.stringify(defaultPayments));
    }
  };

  const loadStudents = () => {
    const stored = localStorage.getItem('students');
    if (stored) {
      setStudents(JSON.parse(stored));
    }
  };

  const savePayments = (updatedPayments) => {
    setPayments(updatedPayments);
    localStorage.setItem('payments', JSON.stringify(updatedPayments));
  };

  const handleAdd = () => {
    setEditingPayment({
      student: '',
      studentId: '',
      class: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: 'Naqd',
      status: 'paid',
      type: "Oylik to'lov",
      receiptNo: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment({ ...payment });
    setShowModal(true);
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
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
        receiptNo: `RCT-${String(Date.now()).slice(-6)}`
      };
      updatedPayments = [newPayment, ...payments];
      alert("Yangi to'lov qo'shildi!");
    }
    
    savePayments(updatedPayments);
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("To'lovni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!")) {
      const updatedPayments = payments.filter(p => p.id !== id);
      savePayments(updatedPayments);
      alert("To'lov o'chirildi!");
    }
  };

  const updateStatus = (id, newStatus) => {
    const updatedPayments = payments.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    );
    savePayments(updatedPayments);
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
    return matchesSearch && matchesStatus && matchesMethod && matchesType;
  });

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

  const exportToCSV = () => {
    const headers = ['ID', "O'quvchi", 'Sinf', "To'lov turi", 'Summa', 'Sana', "To'lov usuli", 'Holat', 'Kvitansiya raqami', 'Tavsif'];
    const csvData = filteredPayments.map(p => [
      p.id, p.student, p.class, p.type, p.amount, p.date, p.method,
      p.status === 'paid' ? "To'langan" : p.status === 'pending' ? 'Kutilmoqda' : "Muddati o'tgan",
      p.receiptNo, p.description || ''
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const getMethodIcon = (method) => {
    switch(method) {
      case 'Naqd': return <HiOutlineCash />;
      case 'Plastik': return <HiOutlineCreditCard />;
      case 'Click': return <HiOutlineCash />;
      case 'Payme': return <HiOutlineCash />;
      default: return <HiOutlineCurrencyDollar />;
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <div>
          <h1>To'lovlar</h1>
          <p>Jami {filteredPayments.length} ta to'lov | To'lov ko'rsatkichi: {stats.collectionRate}%</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlinePlus /> Yangi to'lov
            </button>
          )}
        </div>
      </div>

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
          </div>
        </div>
      </div>

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
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineCurrencyDollar size={48} />
                    <p>Hech qanday to'lov topilmadi</p>
                    {isAdmin && (
                      <button className="btn-primary" onClick={handleAdd}>
                        Yangi to'lov qo'shish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td>#{payment.id}</td>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar-sm">
                        {payment.student.charAt(0)}
                      </div>
                      {payment.student}
                    </div>
                  </td>
                  <td>{payment.class}</td>
                  <td>{payment.type}</td>
                  <td className="amount-cell">{formatMoney(payment.amount)}</td>
                  <td>
                    <div className="date-cell">
                      <HiOutlineCalendar />
                      {new Date(payment.date).toLocaleDateString('uz-UZ')}
                    </div>
                  </td>
                  <td>
                    <span className={`method-badge ${payment.method.toLowerCase()}`}>
                      {getMethodIcon(payment.method)}
                      {payment.method}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`payment-status ${payment.status}`}
                      value={payment.status}
                      onChange={(e) => updateStatus(payment.id, e.target.value)}
                    >
                      <option value="paid">To'langan</option>
                      <option value="pending">Kutilmoqda</option>
                      <option value="overdue">Muddati o'tgan</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn view" onClick={() => handleView(payment)}>
                        <HiOutlineEye />
                      </button>
                      {isAdmin && (
                        <>
                          <button className="action-btn edit" onClick={() => handleEdit(payment)}>
                            <HiOutlinePencil />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(payment.id)}>
                            <HiOutlineTrash />
                          </button>
                        </>
                      )}
                    </div>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="payment-methods-summary">
        <div className="summary-card">
          <h4><HiOutlineCreditCard /> To'lov usullari bo'yicha</h4>
          <div className="methods-stats">
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Naqd</span>
              <div className="method-bar">
                <div className="method-fill" style={{ width: `${methodPercentages.Naqd}%`, background: '#10b981' }}></div>
              </div>
              <span className="method-percent">{methodPercentages.Naqd}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCreditCard /> Plastik</span>
              <div className="method-bar">
                <div className="method-fill" style={{ width: `${methodPercentages.Plastik}%`, background: '#3b82f6' }}></div>
              </div>
              <span className="method-percent">{methodPercentages.Plastik}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Click</span>
              <div className="method-bar">
                <div className="method-fill" style={{ width: `${methodPercentages.Click}%`, background: '#f59e0b' }}></div>
              </div>
              <span className="method-percent">{methodPercentages.Click}%</span>
            </div>
            <div className="method-item">
              <span className="method-name"><HiOutlineCash /> Payme</span>
              <div className="method-bar">
                <div className="method-fill" style={{ width: `${methodPercentages.Payme}%`, background: '#8b5cf6' }}></div>
              </div>
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
                  <div className="recent-date">{new Date(payment.date).toLocaleDateString('uz-UZ')}</div>
                </div>
                <div className="recent-amount">{formatMoney(payment.amount)}</div>
                <div className={`recent-status ${payment.status}`}>
                  {getStatusIcon(payment.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ko'rish modal */}
      {showDetailsModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>To'lov ma'lumotlari</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Kvitansiya raqami:</span>
                  <span className="detail-value">{selectedPayment.receiptNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">O'quvchi:</span>
                  <span className="detail-value">{selectedPayment.student}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sinf:</span>
                  <span className="detail-value">{selectedPayment.class}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">To'lov turi:</span>
                  <span className="detail-value">{selectedPayment.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Summa:</span>
                  <span className="detail-value">{formatMoney(selectedPayment.amount)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sana:</span>
                  <span className="detail-value">{selectedPayment.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">To'lov usuli:</span>
                  <span className="detail-value">{selectedPayment.method}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Holat:</span>
                  <span className={`status-badge ${selectedPayment.status}`}>
                    {getStatusIcon(selectedPayment.status)}
                    {selectedPayment.status === 'paid' ? "To'langan" : selectedPayment.status === 'pending' ? 'Kutilmoqda' : "Muddati o'tgan"}
                  </span>
                </div>
                {selectedPayment.description && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Tavsif:</span>
                    <span className="detail-value">{selectedPayment.description}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowDetailsModal(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal oyna */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPayment?.id ? "To'lov tahrirlash" : "Yangi to'lov"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchi *</label>
                  <select 
                    value={editingPayment?.student || ''} 
                    onChange={(e) => {
                      const selectedStudent = students.find(s => s.name === e.target.value);
                      setEditingPayment({ 
                        ...editingPayment, 
                        student: e.target.value,
                        studentId: selectedStudent?.id,
                        class: selectedStudent?.class || ''
                      });
                    }}
                  >
                    <option value="">O'quvchi tanlang</option>
                    {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.class})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sinf</label>
                  <input type="text" value={editingPayment?.class || ''} disabled style={{ background: '#f1f5f9' }} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>To'lov turi</label>
                  <select 
                    value={editingPayment?.type || "Oylik to'lov"} 
                    onChange={(e) => setEditingPayment({ ...editingPayment, type: e.target.value })}
                  >
                    {paymentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Summa *</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={editingPayment?.amount || 0} 
                    onChange={(e) => setEditingPayment({ ...editingPayment, amount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sana</label>
                  <input 
                    type="date" 
                    value={editingPayment?.date || ''} 
                    onChange={(e) => setEditingPayment({ ...editingPayment, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>To'lov usuli</label>
                  <select 
                    value={editingPayment?.method || 'Naqd'} 
                    onChange={(e) => setEditingPayment({ ...editingPayment, method: e.target.value })}
                  >
                    {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingPayment?.status || 'paid'} 
                    onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value })}
                  >
                    <option value="paid">To'langan</option>
                    <option value="pending">Kutilmoqda</option>
                    <option value="overdue">Muddati o'tgan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kvitansiya raqami</label>
                  <input 
                    type="text" 
                    placeholder="Avtomatik" 
                    value={editingPayment?.receiptNo || 'Yangi'} 
                    disabled 
                    style={{ background: '#f1f5f9' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tavsif</label>
                <textarea 
                  rows="2" 
                  placeholder="Qo'shimcha ma'lumot..." 
                  value={editingPayment?.description || ''} 
                  onChange={(e) => setEditingPayment({ ...editingPayment, description: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingPayment?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Payments;