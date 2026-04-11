import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineUserGroup,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineX,
  HiOutlineClock
} from 'react-icons/hi';
import './Cafeteria.css';

const Cafeteria = () => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');

  // LocalStorage dan ma'lumotlarni yuklash
  useEffect(() => {
    loadMenu();
    loadOrders();
    loadAllergies();
  }, []);

  const loadMenu = () => {
    const storedMenu = localStorage.getItem('cafeteria_menu');
    if (storedMenu) {
      setMenu(JSON.parse(storedMenu));
    } else {
      const defaultMenu = [
        { id: 1, day: 'Dushanba', mealType: 'Nonushta', name: 'Bochka', price: 15000, calories: 450, ingredients: ['Non', 'Tuxum', 'Sariyog'] },
        { id: 2, day: 'Dushanba', mealType: 'Tushlik', name: 'Palov', price: 25000, calories: 650, ingredients: ['Guruch', 'Go\'sht', 'Sabzi'] },
        { id: 3, day: 'Seshanba', mealType: 'Nonushta', name: 'Kasha', price: 12000, calories: 350, ingredients: ['Guruch', 'Sut', 'Shakar'] },
        { id: 4, day: 'Seshanba', mealType: 'Tushlik', name: 'Manti', price: 22000, calories: 550, ingredients: ['Xamir', 'Go\'sht', 'Piyoz'] },
      ];
      setMenu(defaultMenu);
      localStorage.setItem('cafeteria_menu', JSON.stringify(defaultMenu));
    }
  };

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('cafeteria_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      const defaultOrders = [
        { id: 1, student: 'Ali Valiyev', class: '10-A', date: '2024-12-15', mealType: 'Tushlik', items: ['Palov'], total: 25000, status: 'pending' },
        { id: 2, student: 'Dilnoza Karimova', class: '10-B', date: '2024-12-15', mealType: 'Tushlik', items: ['Manti'], total: 22000, status: 'paid' },
      ];
      setOrders(defaultOrders);
      localStorage.setItem('cafeteria_orders', JSON.stringify(defaultOrders));
    }
  };

  const loadAllergies = () => {
    const storedAllergies = localStorage.getItem('student_allergies');
    if (storedAllergies) {
      setAllergies(JSON.parse(storedAllergies));
    } else {
      const defaultAllergies = [
        { id: 1, student: 'Ali Valiyev', class: '10-A', allergies: ['Yong\'oq'], diet: 'Halol' },
        { id: 2, student: 'Jasur Aliyev', class: '9-A', allergies: ['Sut mahsulotlari'], diet: 'Vegetarian' },
      ];
      setAllergies(defaultAllergies);
      localStorage.setItem('student_allergies', JSON.stringify(defaultAllergies));
    }
  };

  // Menyu funksiyalari
  const saveMenu = (updatedMenu) => {
    setMenu(updatedMenu);
    localStorage.setItem('cafeteria_menu', JSON.stringify(updatedMenu));
  };

  const handleAddMenu = () => {
    setEditingMenu({
      id: null,
      day: 'Dushanba',
      mealType: 'Tushlik',
      name: '',
      price: 0,
      calories: 0,
      ingredients: []
    });
    setIngredientsInput('');
    setShowMenuModal(true);
  };

  const handleEditMenu = (item) => {
    setEditingMenu({ ...item });
    setIngredientsInput(item.ingredients ? item.ingredients.join(', ') : '');
    setShowMenuModal(true);
  };

  const handleSaveMenu = () => {
    if (!editingMenu.name || !editingMenu.price || editingMenu.price <= 0) {
      alert('Iltimos, taom nomi va narxini to\'g\'ri kiriting!');
      return;
    }

    // ingredientsInput dan array yaratish
    const ingredientsArray = ingredientsInput ? ingredientsInput.split(',').map(i => i.trim()).filter(i => i) : [];
    
    const updatedMenuData = {
      ...editingMenu,
      ingredients: ingredientsArray,
      price: Number(editingMenu.price),
      calories: Number(editingMenu.calories) || 0
    };

    let updatedMenu;
    if (editingMenu.id) {
      updatedMenu = menu.map(m => m.id === editingMenu.id ? updatedMenuData : m);
      alert('Taom ma\'lumotlari yangilandi!');
    } else {
      const newItem = { ...updatedMenuData, id: Date.now() };
      updatedMenu = [...menu, newItem];
      alert('Yangi taom qo\'shildi!');
    }
    
    saveMenu(updatedMenu);
    setShowMenuModal(false);
    setEditingMenu(null);
    setIngredientsInput('');
  };

  const handleDeleteMenu = (id) => {
    if (window.confirm('Taomni o\'chirmoqchimisiz?')) {
      const updatedMenu = menu.filter(m => m.id !== id);
      saveMenu(updatedMenu);
      alert('Taom o\'chirildi!');
    }
  };

  // Buyurtmalar funksiyalari
  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem('cafeteria_orders', JSON.stringify(updatedOrders));
  };

  const handleAddOrder = () => {
    setEditingOrder({
      id: null,
      student: '',
      class: '',
      date: new Date().toISOString().split('T')[0],
      mealType: 'Tushlik',
      items: [],
      total: 0,
      status: 'pending'
    });
    setShowOrderModal(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setShowOrderModal(true);
  };

  const handleSaveOrder = () => {
    if (!editingOrder.student || !editingOrder.class) {
      alert('Iltimos, o\'quvchi ismi va sinfini kiriting!');
      return;
    }

    let updatedOrders;
    if (editingOrder.id) {
      updatedOrders = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
      alert('Buyurtma yangilandi!');
    } else {
      const newOrder = { ...editingOrder, id: Date.now(), items: editingOrder.items || [] };
      updatedOrders = [...orders, newOrder];
      alert('Yangi buyurtma qo\'shildi!');
    }
    
    saveOrders(updatedOrders);
    setShowOrderModal(false);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Buyurtmani o\'chirmoqchimisiz?')) {
      const updatedOrders = orders.filter(o => o.id !== id);
      saveOrders(updatedOrders);
      alert('Buyurtma o\'chirildi!');
    }
  };

  const updateOrderStatus = (id, newStatus) => {
    const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus } : o);
    saveOrders(updatedOrders);
  };

  // Allergiyalar funksiyalari
  const saveAllergies = (updatedAllergies) => {
    setAllergies(updatedAllergies);
    localStorage.setItem('student_allergies', JSON.stringify(updatedAllergies));
  };

  const handleAddAllergy = () => {
    const newAllergy = {
      id: Date.now(),
      student: '',
      class: '',
      allergies: [],
      diet: 'Halol'
    };
    saveAllergies([...allergies, newAllergy]);
  };

  const handleUpdateAllergy = (id, field, value) => {
    const updatedAllergies = allergies.map(a => a.id === id ? { ...a, [field]: value } : a);
    saveAllergies(updatedAllergies);
  };

  const handleDeleteAllergy = (id) => {
    if (window.confirm('Allergiya ma\'lumotini o\'chirmoqchimisiz?')) {
      const updatedAllergies = allergies.filter(a => a.id !== id);
      saveAllergies(updatedAllergies);
      alert('Allergiya ma\'lumoti o\'chirildi!');
    }
  };

  // Statistikalar
  const filteredMenu = menu.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    order.student.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
    order.class.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  const totalOrders = orders.length;
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const paidOrders = orders.filter(o => o.status === 'paid').length;

  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma'];
  const mealTypes = ['Nonushta', 'Tushlik', 'Kechki ovqat'];

  return (
    <div className="cafeteria-page">
      <div className="page-header">
        <div>
          <h1>Ovqatlanish / Kantina</h1>
          <p>Menyu va buyurtmalarni boshqarish</p>
        </div>
        {activeTab === 'menu' && (
          <button className="btn-primary" onClick={handleAddMenu}>
            <HiOutlinePlus /> Menyu qo'shish
          </button>
        )}
        {activeTab === 'orders' && (
          <button className="btn-primary" onClick={handleAddOrder}>
            <HiOutlinePlus /> Buyurtma qo'shish
          </button>
        )}
        {activeTab === 'allergies' && (
          <button className="btn-primary" onClick={handleAddAllergy}>
            <HiOutlinePlus /> Allergiya qo'shish
          </button>
        )}
      </div>

      {/* Statistikalar */}
      <div className="cafeteria-stats">
        <div className="stat-card"><div className="stat-value">{totalOrders}</div><div className="stat-label">Jami buyurtmalar</div></div>
        <div className="stat-card"><div className="stat-value">{totalRevenue.toLocaleString()} so'm</div><div className="stat-label">Jami daromad</div></div>
        <div className="stat-card"><div className="stat-value">{pendingOrders}</div><div className="stat-label">Kutilayotgan</div></div>
        <div className="stat-card"><div className="stat-value">{menu.length}</div><div className="stat-label">Menyudagi taomlar</div></div>
      </div>

      {/* Tabs */}
      <div className="cafeteria-tabs">
        <button className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          📋 Menyu
        </button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          🛒 Buyurtmalar ({pendingOrders})
        </button>
        <button className={`tab-btn ${activeTab === 'allergies' ? 'active' : ''}`} onClick={() => setActiveTab('allergies')}>
          ⚠️ Allergiyalar ({allergies.length})
        </button>
      </div>

      {/* Menyu tab */}
      {activeTab === 'menu' && (
        <>
          <div className="search-wrapper">
            <HiOutlineSearch />
            <input type="text" placeholder="Taom nomi yoki kun bo'yicha qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="menu-grid">
            {filteredMenu.length === 0 ? (
              <div className="empty-state">
                <HiOutlineCreditCard size={48} />
                <p>Hech qanday taom topilmadi</p>
                <button className="btn-primary" onClick={handleAddMenu}>Yangi taom qo'shish</button>
              </div>
            ) : (
              filteredMenu.map(item => (
                <div key={item.id} className="menu-card">
                  <div className="menu-card-header">
                    <span className="menu-day">{item.day}</span>
                    <span className="menu-type">{item.mealType}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p className="menu-price">{item.price.toLocaleString()} so'm</p>
                  <p className="menu-calories">🔥 {item.calories} kkal</p>
                  <div className="menu-ingredients">
                    {item.ingredients && item.ingredients.map((ing, idx) => <span key={idx} className="ingredient">{ing}</span>)}
                  </div>
                  <div className="menu-actions">
                    <button className="edit-btn" onClick={() => handleEditMenu(item)}>
                      <HiOutlinePencil /> Tahrirlash
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteMenu(item.id)}>
                      <HiOutlineTrash /> O'chirish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Buyurtmalar tab */}
      {activeTab === 'orders' && (
        <>
          <div className="search-wrapper">
            <HiOutlineSearch />
            <input type="text" placeholder="O'quvchi yoki sinf bo'yicha qidirish..." value={orderSearchTerm} onChange={(e) => setOrderSearchTerm(e.target.value)} />
          </div>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>O'quvchi</th>
                  <th>Sinf</th>
                  <th>Sana</th>
                  <th>Summa</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan="7" className="empty-table">Hech qanday buyurtma topilmadi</td></tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.student}</td>
                      <td>{order.class}</td>
                      <td>{order.date}</td>
                      <td className="amount-cell">{order.total.toLocaleString()} so'm</td>
                      <td>
                        <select 
                          className={`order-status ${order.status}`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">⏳ Kutilmoqda</option>
                          <option value="paid">✅ To'langan</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit" onClick={() => handleEditOrder(order)}>
                            <HiOutlinePencil />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDeleteOrder(order.id)}>
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
        </>
      )}

      {/* Allergiyalar tab */}
      {activeTab === 'allergies' && (
        <div className="allergies-list">
          {allergies.length === 0 ? (
            <div className="empty-state">
              <HiOutlineExclamationCircle size={48} />
              <p>Hech qanday allergiya ma'lumoti yo'q</p>
              <button className="btn-primary" onClick={handleAddAllergy}>Allergiya qo'shish</button>
            </div>
          ) : (
            allergies.map(allergy => (
              <div key={allergy.id} className="allergy-card">
                <div className="allergy-info">
                  <div className="allergy-student">
                    <input 
                      type="text" 
                      placeholder="O'quvchi ismi"
                      value={allergy.student || ''} 
                      onChange={(e) => handleUpdateAllergy(allergy.id, 'student', e.target.value)}
                      className="allergy-student-input"
                    />
                    <input 
                      type="text" 
                      placeholder="Sinf"
                      value={allergy.class || ''} 
                      onChange={(e) => handleUpdateAllergy(allergy.id, 'class', e.target.value)}
                      className="allergy-class-input"
                    />
                  </div>
                  <div className="allergy-details">
                    <div className="allergy-item">
                      <label>Allergiyalar:</label>
                      <input 
                        type="text" 
                        value={allergy.allergies?.join(', ') || ''} 
                        onChange={(e) => handleUpdateAllergy(allergy.id, 'allergies', e.target.value.split(',').map(i => i.trim()))}
                        placeholder="Masalan: Yong'oq, Sut"
                      />
                    </div>
                    <div className="allergy-item">
                      <label>Maxsus dieta:</label>
                      <select value={allergy.diet || 'Halol'} onChange={(e) => handleUpdateAllergy(allergy.id, 'diet', e.target.value)}>
                        <option value="Halol">Halol</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteAllergy(allergy.id)}>
                  <HiOutlineTrash /> O'chirish
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Menyu modal */}
      {showMenuModal && (
        <div className="modal-overlay" onClick={() => setShowMenuModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMenu?.id ? 'Menyu tahrirlash' : 'Yangi taom'}</h2>
              <button className="modal-close" onClick={() => setShowMenuModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Hafta kuni</label>
                  <select value={editingMenu?.day || 'Dushanba'} onChange={(e) => setEditingMenu({ ...editingMenu, day: e.target.value })}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ovqat turi</label>
                  <select value={editingMenu?.mealType || 'Tushlik'} onChange={(e) => setEditingMenu({ ...editingMenu, mealType: e.target.value })}>
                    {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Taom nomi *</label>
                <input type="text" placeholder="Taom nomi" value={editingMenu?.name || ''} onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Narxi (so'm) *</label>
                  <input type="number" placeholder="Narxi" value={editingMenu?.price || 0} onChange={(e) => setEditingMenu({ ...editingMenu, price: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Kaloriya (kkal)</label>
                  <input type="number" placeholder="Kaloriya" value={editingMenu?.calories || 0} onChange={(e) => setEditingMenu({ ...editingMenu, calories: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="form-group">
                <label>Masalliqlar (vergul bilan ajrating)</label>
                <input 
                  type="text" 
                  placeholder="Masalan: Non, Tuxum, Sariyog" 
                  value={ingredientsInput} 
                  onChange={(e) => setIngredientsInput(e.target.value)} 
                />
                <small className="form-hint">Masalliqlarni vergul bilan ajratib yozing</small>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveMenu}>Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowMenuModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* Buyurtma modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOrder?.id ? 'Buyurtma tahrirlash' : 'Yangi buyurtma'}</h2>
              <button className="modal-close" onClick={() => setShowOrderModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>O'quvchi ismi *</label>
                  <input type="text" placeholder="O'quvchi ismi" value={editingOrder?.student || ''} onChange={(e) => setEditingOrder({ ...editingOrder, student: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Sinf *</label>
                  <input type="text" placeholder="Sinf" value={editingOrder?.class || ''} onChange={(e) => setEditingOrder({ ...editingOrder, class: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sana</label>
                  <input type="date" value={editingOrder?.date || ''} onChange={(e) => setEditingOrder({ ...editingOrder, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Ovqat turi</label>
                  <select value={editingOrder?.mealType || 'Tushlik'} onChange={(e) => setEditingOrder({ ...editingOrder, mealType: e.target.value })}>
                    {mealTypes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Summa</label>
                  <input type="number" placeholder="Summa" value={editingOrder?.total || 0} onChange={(e) => setEditingOrder({ ...editingOrder, total: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-group">
                  <label>Holat</label>
                  <select value={editingOrder?.status || 'pending'} onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}>
                    <option value="pending">Kutilmoqda</option>
                    <option value="paid">To'langan</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveOrder}>Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowOrderModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cafeteria;