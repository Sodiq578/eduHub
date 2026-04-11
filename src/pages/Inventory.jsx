import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineCube, 
  HiOutlineLocationMarker, 
  HiOutlineCalendar, 
  HiOutlineX, 
  HiOutlineFilter, 
  HiOutlineDownload,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import './Inventory.css';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = ['Mebel', 'Texnika', 'Laboratoriya', 'Sport', 'Kutubxona', 'Kantina', 'Transport', 'Boshqa'];
  const conditions = ['Yangi', 'Yaxshi', 'Qoniqarli', "Ta'mir kerak", 'Ishlatilgan'];

  useEffect(() => {
    const stored = localStorage.getItem('inventory');
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      const defaultItems = [
        { id: 1, name: 'Stol', category: 'Mebel', quantity: 150, location: '1-qavat', condition: 'Yaxshi', lastCheck: '2024-11-01', status: 'active', purchaseDate: '2022-08-15', price: 450000, note: '' },
        { id: 2, name: 'Stul', category: 'Mebel', quantity: 300, location: '1-qavat', condition: 'Yaxshi', lastCheck: '2024-11-01', status: 'active', purchaseDate: '2022-08-15', price: 150000, note: '' },
        { id: 3, name: 'Mikroskop', category: 'Laboratoriya', quantity: 10, location: 'Biologiya xonasi', condition: 'Yangi', lastCheck: '2024-10-15', status: 'active', purchaseDate: '2023-09-10', price: 2500000, note: 'Olympus brendi' },
        { id: 4, name: 'Proyektor', category: 'Texnika', quantity: 15, location: 'Sinflar', condition: 'Yaxshi', lastCheck: '2024-09-20', status: 'active', purchaseDate: '2022-11-20', price: 1800000, note: 'Epson brendi' },
        { id: 5, name: 'Kompyuter', category: 'Texnika', quantity: 45, location: 'Kompyuter xonasi', condition: 'Yaxshi', lastCheck: '2024-10-01', status: 'active', purchaseDate: '2023-01-15', price: 3500000, note: 'Lenovo' },
        { id: 6, name: 'Futbol to\'pi', category: 'Sport', quantity: 20, location: 'Sport zal', condition: 'Yaxshi', lastCheck: '2024-11-10', status: 'active', purchaseDate: '2023-05-20', price: 80000, note: '' },
      ];
      setItems(defaultItems);
      localStorage.setItem('inventory', JSON.stringify(defaultItems));
    }
  }, []);

  const saveItems = (updated) => { 
    setItems(updated); 
    localStorage.setItem('inventory', JSON.stringify(updated)); 
  };

  const handleAdd = () => {
    setEditingItem({
      name: '',
      category: '',
      quantity: 0,
      location: '',
      condition: 'Yaxshi',
      lastCheck: new Date().toISOString().split('T')[0],
      status: 'active',
      purchaseDate: '',
      price: 0,
      note: ''
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingItem.name || !editingItem.category) { 
      alert('Iltimos, nom va kategoriyani kiriting!'); 
      return; 
    }
    
    if (editingItem.id) { 
      saveItems(items.map(i => i.id === editingItem.id ? editingItem : i)); 
      alert("Inventar ma'lumoti yangilandi!"); 
    } else { 
      saveItems([{ ...editingItem, id: Date.now() }, ...items]); 
      alert("Yangi inventar qo'shildi!"); 
    }
    setShowModal(false); 
    setEditingItem(null);
  };

  const handleDelete = (id) => { 
    if (window.confirm("Inventarni o'chirmoqchimisiz?")) { 
      saveItems(items.filter(i => i.id !== id)); 
      alert("O'chirildi!");
    } 
  };

  const filtered = items.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || i.category === filterCategory;
    const matchesCondition = filterCondition === '' || i.condition === filterCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const lowStock = items.filter(i => i.quantity < 10).length;
  const needRepair = items.filter(i => i.condition === "Ta'mir kerak").length;

  const exportToCSV = () => {
    const headers = ['ID', 'Nomi', 'Kategoriya', 'Miqdori', 'Joylashuvi', 'Holati', "Oxirgi tekshiruv", "Sotib olingan sana", 'Narxi', 'Izoh'];
    const csvData = filtered.map(i => [
      i.id, i.name, i.category, i.quantity, i.location, i.condition, i.lastCheck, i.purchaseDate || '-', i.price?.toLocaleString() || '-', i.note || '-'
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getConditionColor = (condition) => {
    switch(condition) {
      case 'Yangi': return '#10b981';
      case 'Yaxshi': return '#3b82f6';
      case 'Qoniqarli': return '#f59e0b';
      case "Ta'mir kerak": return '#ef4444';
      default: return '#64748b';
    }
  };

  const getConditionIcon = (condition) => {
    switch(condition) {
      case 'Yangi': return <HiOutlineCheckCircle />;
      case 'Yaxshi': return <HiOutlineCheckCircle />;
      case 'Qoniqarli': return <HiOutlineExclamationCircle />;
      case "Ta'mir kerak": return <HiOutlineExclamationCircle />;
      default: return <HiOutlineCube />;
    }
  };

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h1>Inventar / Ombor</h1>
          <p>Jami {items.length} turdagi | {totalItems} dona | Umumiy qiymat: {totalValue.toLocaleString()} so'm</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-primary" onClick={handleAdd}>
            <HiOutlinePlus /> Yangi inventar
          </button>
        </div>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Tur</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalItems}</div>
          <div className="stat-label">Jami dona</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{lowStock}</div>
          <div className="stat-label">Kam miqdor (&lt;10)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{needRepair}</div>
          <div className="stat-label">Ta'mir kerak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalValue.toLocaleString()} so'm</div>
          <div className="stat-label">Umumiy qiymat</div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Nom yoki joylashuv bo'yicha qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Barcha kategoriyalar</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
          <option value="">Barcha holatlar</option>
          {conditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="inventory-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <HiOutlineCube size={48} />
            <p>Hech qanday inventar topilmadi</p>
            <button className="btn-primary" onClick={handleAdd}>Yangi inventar qo'shish</button>
          </div>
        ) : (
          filtered.map(i => (
            <div key={i.id} className="inventory-card">
              <div className="inventory-icon" style={{ background: `${getConditionColor(i.condition)}15`, color: getConditionColor(i.condition) }}>
                <HiOutlineCube />
              </div>
              <div className="inventory-info">
                <h3>{i.name}</h3>
                <p className="inventory-category">{i.category}</p>
                <div className="inventory-details">
                  <p><HiOutlineLocationMarker /> {i.location}</p>
                  <p>📦 {i.quantity} dona</p>
                  <p className={`condition-${i.condition.toLowerCase().replace(/ /g, '')}`}>
                    {getConditionIcon(i.condition)} {i.condition}
                  </p>
                  <p><HiOutlineCalendar /> Oxirgi tekshiruv: {i.lastCheck}</p>
                  {i.purchaseDate && <p>📅 Sotib olingan: {i.purchaseDate}</p>}
                  {i.price > 0 && <p>💰 Narxi: {i.price.toLocaleString()} so'm</p>}
                  {i.note && <p className="inventory-note">📝 {i.note}</p>}
                </div>
              </div>
              <div className="inventory-actions">
                <button className="edit-btn" onClick={() => handleEdit(i)}>
                  <HiOutlinePencil /> Tahrirlash
                </button>
                <button className="delete-btn" onClick={() => handleDelete(i.id)}>
                  <HiOutlineTrash /> O'chirish
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem?.id ? 'Inventar tahrirlash' : 'Yangi inventar qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Inventar nomi" 
                    value={editingItem?.name || ''} 
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Kategoriya *</label>
                  <select 
                    value={editingItem?.category || ''} 
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  >
                    <option value="">Tanlang</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Miqdori</label>
                  <input 
                    type="number" 
                    placeholder="Miqdori" 
                    value={editingItem?.quantity || 0} 
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Joylashuvi</label>
                  <input 
                    type="text" 
                    placeholder="Qayerda joylashgan" 
                    value={editingItem?.location || ''} 
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Holati</label>
                  <select 
                    value={editingItem?.condition || 'Yaxshi'} 
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                  >
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Oxirgi tekshiruv</label>
                  <input 
                    type="date" 
                    value={editingItem?.lastCheck || new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setEditingItem({ ...editingItem, lastCheck: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sotib olingan sana</label>
                  <input 
                    type="date" 
                    value={editingItem?.purchaseDate || ''} 
                    onChange={(e) => setEditingItem({ ...editingItem, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Narxi (so'm)</label>
                  <input 
                    type="number" 
                    placeholder="Narxi" 
                    value={editingItem?.price || 0} 
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Izoh</label>
                <textarea 
                  rows="2" 
                  placeholder="Qo'shimcha ma'lumot..." 
                  value={editingItem?.note || ''} 
                  onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingItem?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Inventory;