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
  HiOutlineClock
} from 'react-icons/hi';
import './Payroll.css';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showModal, setShowModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  // LOAD DATA
  useEffect(() => {
    loadPayrolls();
    loadTeachers();
  }, []);

  const loadPayrolls = () => {
    const stored = localStorage.getItem('payroll');
    if (stored) {
      setPayrolls(JSON.parse(stored));
    } else {
      const defaultData = [
        { id: 1, teacherName: 'Shahzoda Ahmedova', teacherId: 1, month: '2024-12', baseSalary: 5000000, bonus: 500000, deduction: 0, total: 5500000, status: 'paid', paymentDate: '2024-12-20' },
        { id: 2, teacherName: 'Rustam Karimov', teacherId: 2, month: '2024-12', baseSalary: 4800000, bonus: 300000, deduction: 0, total: 5100000, status: 'pending', paymentDate: '' },
        { id: 3, teacherName: 'Gulnora Saidova', teacherId: 3, month: '2024-12', baseSalary: 4500000, bonus: 200000, deduction: 0, total: 4700000, status: 'paid', paymentDate: '2024-12-19' },
      ];
      setPayrolls(defaultData);
      localStorage.setItem('payroll', JSON.stringify(defaultData));
    }
  };

  const loadTeachers = () => {
    const storedTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    setTeachers(storedTeachers);
  };

  const savePayrolls = (data) => {
    setPayrolls(data);
    localStorage.setItem('payroll', JSON.stringify(data));
  };

  const calculateTotal = (data) => {
    return ((data.baseSalary || 0) + (data.bonus || 0) - (data.deduction || 0));
  };

  const handleAdd = () => {
    setEditingPayroll({
      teacherName: '',
      teacherId: '',
      month: selectedMonth,
      baseSalary: 0,
      bonus: 0,
      deduction: 0,
      total: 0,
      status: 'pending',
      paymentDate: ''
    });
    setShowModal(true);
  };

  const handleEdit = (payroll) => {
    setEditingPayroll({ ...payroll });
    setShowModal(true);
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
      savePayrolls([{ ...updatedPayroll, id: Date.now() }, ...payrolls]);
      alert("Yangi oylik qo'shildi!");
    }

    setShowModal(false);
    setEditingPayroll(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Oylik ma'lumotini o'chirmoqchimisiz?")) {
      savePayrolls(payrolls.filter((p) => p.id !== id));
      alert("O'chirildi!");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = payrolls.map(p => 
      p.id === id ? { ...p, status: newStatus, paymentDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : '' } : p
    );
    savePayrolls(updated);
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

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
  };

  // Eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', "O'qituvchi", 'Asosiy maosh', 'Bonus', 'Ajratma', 'Jami', 'Holat', "To'lov sanasi", 'Oy'];
    const csvData = filtered.map(p => [
      p.id, p.teacherName, p.baseSalary, p.bonus, p.deduction, p.total,
      p.status === 'paid' ? "To'langan" : 'Kutilmoqda', p.paymentDate || '-', p.month
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Oylar ro'yxati
  const months = [
    '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
    '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12',
    '2025-01', '2025-02', '2025-03'
  ];

  return (
    <div className="payroll-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Oyliklar / Ish haqi</h1>
          <p>{filtered.length} ta xodim | Jami: {formatMoney(totalSalary)}</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
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
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-info">
            <h3>To'langan</h3>
            <p>{paidCount} ta | {formatMoney(paidAmount)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>Kutilayotgan</h3>
            <p>{pendingCount} ta | {formatMoney(pendingAmount)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineUser />
          </div>
          <div className="stat-info">
            <h3>Xodimlar</h3>
            <p>{teachers.length} nafar</p>
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
          <select className="filter-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {months.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
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
              <th>Asosiy maosh</th>
              <th>Bonus</th>
              <th>Ajratma</th>
              <th>Jami</th>
              <th>Holat</th>
              <th>To'lov sanasi</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-table">
                  <div className="empty-state">
                    <HiOutlineCash size={48} />
                    <p>Hech qanday oylik ma'lumoti topilmadi</p>
                    <button className="btn-primary" onClick={handleAdd}>Yangi oylik qo'shish</button>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className={p.status === 'pending' ? 'pending-row' : ''}>
                  <td>#{p.id}</td>
                  <td>
                    <div className="teacher-cell">
                      <div className="teacher-avatar">{p.teacherName.charAt(0)}</div>
                      {p.teacherName}
                    </div>
                  </td>
                  <td className="amount-cell">{formatMoney(p.baseSalary)}</td>
                  <td className="bonus-cell">+{formatMoney(p.bonus)}</td>
                  <td className="deduction-cell">-{formatMoney(p.deduction)}</td>
                  <td className="total-cell">{formatMoney(p.total)}</td>
                  <td>
                    <select 
                      className={`status-badge ${p.status}`}
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      <option value="paid">✅ To'langan</option>
                      <option value="pending">⏳ Kutilmoqda</option>
                    </select>
                  </td>
                  <td>{p.paymentDate || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEdit(p)}>
                        <HiOutlinePencil />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(p.id)}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPayroll?.id ? 'Oylik tahrirlash' : 'Yangi oylik'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>O'qituvchi *</label>
                <select
                  value={editingPayroll?.teacherName || ''}
                  onChange={(e) => {
                    const selectedTeacher = teachers.find(t => t.name === e.target.value);
                    setEditingPayroll({
                      ...editingPayroll,
                      teacherName: e.target.value,
                      teacherId: selectedTeacher?.id
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
                  <label>Asosiy maosh</label>
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
                  <label>Bonus</label>
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
                  <label>Ajratma</label>
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
                  <label>Jami</label>
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
                  <label>Oy</label>
                  <select
                    value={editingPayroll?.month || selectedMonth}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, month: e.target.value })}
                  >
                    {months.map(month => <option key={month} value={month}>{month}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select
                    value={editingPayroll?.status || 'pending'}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, status: e.target.value })}
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="paid">To'langan</option>
                  </select>
                </div>
              </div>

              {editingPayroll?.status === 'paid' && (
                <div className="form-group">
                  <label>To'lov sanasi</label>
                  <input
                    type="date"
                    value={editingPayroll?.paymentDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEditingPayroll({ ...editingPayroll, paymentDate: e.target.value })}
                  />
                </div>
              )}
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
 
