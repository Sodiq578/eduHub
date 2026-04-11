import React, { useState, useEffect } from 'react';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineMap, HiOutlineTruck, HiOutlineUser, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi';
import './Transport.css';

const Transport = () => {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedBuses = localStorage.getItem('transport_buses');
    if (storedBuses) {
      setBuses(JSON.parse(storedBuses));
    } else {
      const defaultBuses = [
        { id: 1, number: '01-A-777', driver: 'Alisher Karimov', phone: '+998 90 111 2233', capacity: 40, route: 'Yunusobod - Maktab' },
        { id: 2, number: '02-B-888', driver: 'Rustam Toshpulatov', phone: '+998 91 222 3344', capacity: 35, route: 'Chilonzor - Maktab' },
        { id: 3, number: '03-C-999', driver: 'Jasur Aliyev', phone: '+998 93 333 4455', capacity: 45, route: 'Sergeli - Maktab' },
      ];
      setBuses(defaultBuses);
      localStorage.setItem('transport_buses', JSON.stringify(defaultBuses));
    }
  }, []);

  const filteredBuses = buses.filter(bus => 
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);

  return (
    <div className="transport-page">
      <div className="page-header">
        <div>
          <h1>Transport</h1>
          <p>Avtobus va marshrutlarni boshqarish</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingBus({}); setShowModal(true); }}>
          <HiOutlinePlus /> Yangi avtobus
        </button>
      </div>

      <div className="transport-stats">
        <div className="stat-card">
          <div className="stat-value">{buses.length}</div>
          <div className="stat-label">Avtobuslar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalCapacity}</div>
          <div className="stat-label">Jami o'rinlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">5</div>
          <div className="stat-label">Yo'nalishlar</div>
        </div>
      </div>

      <div className="search-wrapper">
        <HiOutlineSearch />
        <input type="text" placeholder="Avtobus raqami, haydovchi yoki yo'nalish bo'yicha qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="transport-grid">
        {filteredBuses.map(bus => (
          <div key={bus.id} className="transport-card">
            <div className="transport-icon">
              <HiOutlineTruck />
            </div>
            <h3>Avtobus {bus.number}</h3>
            <p className="driver"><HiOutlineUser /> {bus.driver}</p>
            <p className="phone"><HiOutlinePhone /> {bus.phone}</p>
            <p className="route"><HiOutlineMap /> {bus.route}</p>
            <p className="capacity">👥 {bus.capacity} o'rin</p>
            <div className="transport-actions">
              <button className="edit-btn" onClick={() => { setEditingBus(bus); setShowModal(true); }}>
                <HiOutlinePencil /> Tahrirlash
              </button>
              <button className="delete-btn" onClick={() => { 
                if(window.confirm('O\'chirmoqchimisiz?')) {
                  setBuses(buses.filter(b => b.id !== bus.id));
                  localStorage.setItem('transport_buses', JSON.stringify(buses.filter(b => b.id !== bus.id)));
                }
              }}>
                <HiOutlineTrash /> O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transport;