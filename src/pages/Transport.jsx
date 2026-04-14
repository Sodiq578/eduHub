import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineMap, 
  HiOutlineTruck, 
  HiOutlineUser, 
  HiOutlineClock, 
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineX
} from 'react-icons/hi';
import './Transport.css';

const Transport = () => {
  // ========== STATE'LAR ==========
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());

  // Xarita uchun markerlar
  const [markers, setMarkers] = useState([]);

  // ========== MA'LUMOTLARNI YUKLASH ==========
  useEffect(() => {
    loadBuses();
    loadRoutes();
  }, []);

  // Avtobuslarni yuklash
  const loadBuses = () => {
    const stored = localStorage.getItem('transport_buses');
    if (stored) {
      setBuses(JSON.parse(stored));
    } else {
      const defaultBuses = [
        { id: 1, number: '01-A-777', driver: 'Alisher Karimov', phone: '+998 90 111 2233', capacity: 40, routeId: 1, status: 'active' },
        { id: 2, number: '02-B-888', driver: 'Rustam Toshpulatov', phone: '+998 91 222 3344', capacity: 35, routeId: 2, status: 'active' },
        { id: 3, number: '03-C-999', driver: 'Jasur Aliyev', phone: '+998 93 333 4455', capacity: 45, routeId: 3, status: 'maintenance' },
        { id: 4, number: '04-D-111', driver: 'Sherzod Rahimov', phone: '+998 94 444 5566', capacity: 50, routeId: 1, status: 'active' },
      ];
      setBuses(defaultBuses);
      localStorage.setItem('transport_buses', JSON.stringify(defaultBuses));
    }
  };

  // Marshrutlarni yuklash
  const loadRoutes = () => {
    const stored = localStorage.getItem('transport_routes');
    if (stored) {
      setRoutes(JSON.parse(stored));
    } else {
      const defaultRoutes = [
        { 
          id: 1, 
          name: 'Yunusobod - Maktab', 
          startPoint: 'Yunusobod', 
          endPoint: 'Maktab', 
          distance: '12 km', 
          duration: '35 min',
          stops: ['Yunusobod', 'Minor', 'Tinchlik', 'Oybek', 'Maktab'],
          coordinates: [
            { lat: 41.3111, lng: 69.2797, name: 'Yunusobod' },
            { lat: 41.3000, lng: 69.2900, name: 'Minor' },
            { lat: 41.2850, lng: 69.3000, name: 'Tinchlik' },
            { lat: 41.2700, lng: 69.3100, name: 'Oybek' },
            { lat: 41.2600, lng: 69.3200, name: 'Maktab' }
          ]
        },
        { 
          id: 2, 
          name: 'Chilonzor - Maktab', 
          startPoint: 'Chilonzor', 
          endPoint: 'Maktab', 
          distance: '15 km', 
          duration: '45 min',
          stops: ['Chilonzor', 'Novza', 'Paxtakor', 'Amir Temur', 'Maktab'],
          coordinates: [
            { lat: 41.2500, lng: 69.2000, name: 'Chilonzor' },
            { lat: 41.2600, lng: 69.2200, name: 'Novza' },
            { lat: 41.2700, lng: 69.2400, name: 'Paxtakor' },
            { lat: 41.2800, lng: 69.2600, name: 'Amir Temur' },
            { lat: 41.2900, lng: 69.2800, name: 'Maktab' }
          ]
        },
        { 
          id: 3, 
          name: 'Sergeli - Maktab', 
          startPoint: 'Sergeli', 
          endPoint: 'Maktab', 
          distance: '18 km', 
          duration: '55 min',
          stops: ['Sergeli', 'Qatortol', 'Qo\'yliq', 'Oloy', 'Maktab'],
          coordinates: [
            { lat: 41.2000, lng: 69.2500, name: 'Sergeli' },
            { lat: 41.2200, lng: 69.2600, name: 'Qatortol' },
            { lat: 41.2400, lng: 69.2700, name: 'Qo\'yliq' },
            { lat: 41.2600, lng: 69.2800, name: 'Oloy' },
            { lat: 41.2900, lng: 69.2900, name: 'Maktab' }
          ]
        }
      ];
      setRoutes(defaultRoutes);
      localStorage.setItem('transport_routes', JSON.stringify(defaultRoutes));
    }
  };

  // Ma'lumotlarni saqlash
  const saveBuses = (data) => {
    setBuses(data);
    localStorage.setItem('transport_buses', JSON.stringify(data));
  };

  const saveRoutes = (data) => {
    setRoutes(data);
    localStorage.setItem('transport_routes', JSON.stringify(data));
  };

  // ========== AVTOBUS AMALLARI ==========
  const handleAddBus = () => {
    setEditingBus({
      id: null,
      number: '',
      driver: '',
      phone: '',
      capacity: 40,
      routeId: routes[0]?.id || '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus({ ...bus });
    setShowModal(true);
  };

  const handleSaveBus = () => {
    if (!editingBus.number || !editingBus.driver || !editingBus.phone) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedBuses;
    if (editingBus.id) {
      updatedBuses = buses.map(b => b.id === editingBus.id ? editingBus : b);
      alert('Avtobus ma\'lumotlari yangilandi!');
    } else {
      const newBus = { ...editingBus, id: Date.now() };
      updatedBuses = [...buses, newBus];
      alert('Yangi avtobus qo\'shildi!');
    }
    
    saveBuses(updatedBuses);
    setShowModal(false);
    setEditingBus(null);
  };

  const handleDeleteBus = (id) => {
    if (window.confirm('Avtobusni o\'chirmoqchimisiz?')) {
      const updatedBuses = buses.filter(b => b.id !== id);
      saveBuses(updatedBuses);
      alert('Avtobus o\'chirildi!');
    }
  };

  // ========== MARSHURT AMALLARI ==========
  const handleAddRoute = () => {
    setEditingRoute({
      id: null,
      name: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      duration: '',
      stops: [],
      coordinates: []
    });
    setShowRouteModal(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute({ ...route });
    setShowRouteModal(true);
  };

  const handleSaveRoute = () => {
    if (!editingRoute.name || !editingRoute.startPoint || !editingRoute.endPoint) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedRoutes;
    if (editingRoute.id) {
      updatedRoutes = routes.map(r => r.id === editingRoute.id ? editingRoute : r);
      alert('Marshrut yangilandi!');
    } else {
      const newRoute = { ...editingRoute, id: Date.now() };
      updatedRoutes = [...routes, newRoute];
      alert('Yangi marshrut qo\'shildi!');
    }
    
    saveRoutes(updatedRoutes);
    setShowRouteModal(false);
    setEditingRoute(null);
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Marshrutni o\'chirmoqchimisiz?')) {
      const updatedRoutes = routes.filter(r => r.id !== id);
      saveRoutes(updatedRoutes);
      alert('Marshrut o\'chirildi!');
    }
  };

  // ========== YORDAMCHI FUNKSIYALAR ==========
  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.name : 'Belgilanmagan';
  };

  const getRouteById = (routeId) => {
    return routes.find(r => r.id === routeId);
  };

  const getBusesByRoute = (routeId) => {
    return buses.filter(b => b.routeId === routeId);
  };

  // Statistikalar
  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);
  const activeBuses = buses.filter(b => b.status === 'active').length;
  const totalStops = routes.reduce((sum, route) => sum + (route.stops?.length || 0), 0);

  // Filtrlangan avtobuslar
  const filteredBuses = buses.filter(bus => 
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRouteName(bus.routeId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrlangan marshrutlar
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xarita komponenti (simulyatsiya - aslida Google Maps yoki Leaflet ishlatiladi)
  const MapView = ({ route, allRoutes }) => {
    if (!route && !allRoutes) return null;
    
    const displayRoutes = allRoutes ? routes : [route];
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#E91E63'];
    
    return (
      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-header">
            <HiOutlineLocationMarker />
            <span>Xarita ko'rinishi</span>
          </div>
          <div className="map-svg">
            <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
              {displayRoutes.map((route, idx) => {
                const color = colors[idx % colors.length];
                const points = route.coordinates?.map((coord, i) => {
                  // Koordinatalarni SVG koordinatalariga o'tkazish
                  const x = 100 + (coord.lng - 69.2) * 800;
                  const y = 50 + (41.35 - coord.lat) * 800;
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <g key={route.id}>
                    {/* Chiziq */}
                    {points && <polyline points={points} stroke={color} strokeWidth="4" fill="none" strokeDasharray={allRoutes ? "5,5" : "none"} />}
                    {/* Markerlar */}
                    {route.coordinates?.map((coord, i) => {
                      const x = 100 + (coord.lng - 69.2) * 800;
                      const y = 50 + (41.35 - coord.lat) * 800;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="8" fill={color} stroke="white" strokeWidth="2" />
                          <text x={x + 12} y={y + 4} fontSize="11" fill="#333">{coord.name}</text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="map-legend">
            {routes.map((route, idx) => (
              <div key={route.id} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                <span>{route.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="transport-page">
      {/* ========== HEADER ========== */}
      <div className="page-header">
        <div>
          <h1>🚍 Transport boshqaruvi</h1>
          <p>Avtobuslar va marshrutlarni boshqarish</p>
        </div>
        <div className="header-buttons">
          <button className="btn-primary" onClick={handleAddBus}>
            <HiOutlinePlus /> Yangi avtobus
          </button>
          <button className="btn-secondary" onClick={handleAddRoute}>
            <HiOutlineMap /> Yangi marshrut
          </button>
        </div>
      </div>

      {/* ========== STATISTIKA KARTALARI ========== */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-value">{buses.length}</div>
          <div className="stat-label">Jami avtobuslar</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{activeBuses}</div>
          <div className="stat-label">Faol avtobuslar</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-value">{totalCapacity}</div>
          <div className="stat-label">Jami o'rinlar</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{routes.length}</div>
          <div className="stat-label">Marshrutlar</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-value">{totalStops}</div>
          <div className="stat-label">Bekatlar</div>
        </div>
      </div>

      {/* ========== QIDIRUV VA VIEW MODE ========== */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Avtobus raqami, haydovchi, marshrut bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="view-modes">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <HiOutlineViewGrid /> Grid
          </button>
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <HiOutlineViewList /> Ro'yxat
          </button>
          <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
            <HiOutlineMap /> Xarita
          </button>
        </div>
      </div>

      {/* ========== XARITA KO'RINISHI ========== */}
      {viewMode === 'map' && (
        <div className="map-view">
          <div className="map-header-controls">
            <h3>📍 Marshrutlar xaritasi</h3>
            <button className="refresh-btn" onClick={() => setMapKey(Date.now())}>
              <HiOutlineRefresh /> Yangilash
            </button>
          </div>
          <MapView allRoutes={true} />
        </div>
      )}

      {/* ========== MARSHUTLAR BO'LIMI ========== */}
      {(viewMode === 'grid' || viewMode === 'list') && (
        <>
          <div className="section-header">
            <h2><HiOutlineMap /> Marshrutlar</h2>
            <p>{filteredRoutes.length} ta marshrut mavjud</p>
          </div>

          <div className={`routes-container ${viewMode}`}>
            {filteredRoutes.length === 0 ? (
              <div className="empty-state">
                <HiOutlineMap size={48} />
                <p>Hech qanday marshrut topilmadi</p>
                <button className="btn-primary" onClick={handleAddRoute}>+ Marshrut qo'shish</button>
              </div>
            ) : (
              filteredRoutes.map(route => {
                const routeBuses = getBusesByRoute(route.id);
                return (
                  <div key={route.id} className={`route-card ${viewMode}`}>
                    <div className="route-header">
                      <div className="route-icon">
                        <HiOutlineMap />
                      </div>
                      <div className="route-info">
                        <h3>{route.name}</h3>
                        <p>{route.startPoint} → {route.endPoint}</p>
                      </div>
                      <div className="route-stats">
                        <span className="route-distance">📏 {route.distance}</span>
                        <span className="route-duration">⏱ {route.duration}</span>
                      </div>
                    </div>
                    
                    <div className="route-details">
                      <div className="route-stops">
                        <strong>Bekatlar:</strong>
                        <div className="stops-list">
                          {route.stops?.map((stop, idx) => (
                            <span key={idx} className="stop-badge">
                              {stop}
                              {idx < route.stops.length - 1 && ' → '}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {routeBuses.length > 0 && (
                        <div className="route-buses">
                          <strong>Avtobuslar:</strong>
                          <div className="buses-list">
                            {routeBuses.map(bus => (
                              <span key={bus.id} className="bus-badge">
                                {bus.number}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="route-actions">
                      <button className="view-route-btn" onClick={() => setSelectedRoute(route)}>
                        <HiOutlineEye /> Xaritada ko'rish
                      </button>
                      <button className="edit-btn" onClick={() => handleEditRoute(route)}>
                        <HiOutlinePencil /> Tahrirlash
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteRoute(route.id)}>
                        <HiOutlineTrash /> O'chirish
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ========== AVTOBUSLAR BO'LIMI ========== */}
          <div className="section-header">
            <h2><HiOutlineTruck /> Avtobuslar</h2>
            <p>{filteredBuses.length} ta avtobus mavjud</p>
          </div>

          <div className={`buses-container ${viewMode}`}>
            {filteredBuses.length === 0 ? (
              <div className="empty-state">
                <HiOutlineTruck size={48} />
                <p>Hech qanday avtobus topilmadi</p>
                <button className="btn-primary" onClick={handleAddBus}>+ Avtobus qo'shish</button>
              </div>
            ) : (
              filteredBuses.map(bus => {
                const route = getRouteById(bus.routeId);
                return (
                  <div key={bus.id} className={`bus-card ${viewMode} ${bus.status}`}>
                    <div className="bus-header">
                      <div className="bus-icon">
                        <HiOutlineTruck />
                      </div>
                      <div className="bus-info">
                        <h3>Avtobus {bus.number}</h3>
                        <span className={`status-badge ${bus.status}`}>
                          {bus.status === 'active' ? 'Faol' : 'Ta\'mirda'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bus-details">
                      <p><HiOutlineUser /> <strong>Haydovchi:</strong> {bus.driver}</p>
                      <p><HiOutlinePhone /> <strong>Telefon:</strong> {bus.phone}</p>
                      <p><HiOutlineMap /> <strong>Marshrut:</strong> {route?.name || 'Belgilanmagan'}</p>
                      <p>👥 <strong>O'rinlar:</strong> {bus.capacity} ta</p>
                    </div>

                    <div className="bus-actions">
                      <button className="edit-btn" onClick={() => handleEditBus(bus)}>
                        <HiOutlinePencil /> Tahrirlash
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteBus(bus.id)}>
                        <HiOutlineTrash /> O'chirish
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ========== MARSHURT XARITASI MODAL ========== */}
      {selectedRoute && (
        <div className="modal-overlay" onClick={() => setSelectedRoute(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗺 {selectedRoute.name}</h2>
              <button className="modal-close" onClick={() => setSelectedRoute(null)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="route-full-info">
                <div className="route-info-row">
                  <span>🏁 Boshlanish:</span>
                  <strong>{selectedRoute.startPoint}</strong>
                </div>
                <div className="route-info-row">
                  <span>🏁 Tugash:</span>
                  <strong>{selectedRoute.endPoint}</strong>
                </div>
                <div className="route-info-row">
                  <span>📏 Masofa:</span>
                  <strong>{selectedRoute.distance}</strong>
                </div>
                <div className="route-info-row">
                  <span>⏱ Vaqt:</span>
                  <strong>{selectedRoute.duration}</strong>
                </div>
                <div className="route-info-row full-width">
                  <span>🚏 Bekatlar:</span>
                  <div className="stops-flow">
                    {selectedRoute.stops?.map((stop, idx) => (
                      <span key={idx} className="stop-flow-item">
                        {stop}
                        {idx < selectedRoute.stops.length - 1 && ' → '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <MapView route={selectedRoute} />
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setSelectedRoute(null)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== AVTOBUS MODAL ========== */}
      {showModal && editingBus && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBus.id ? '✏️ Avtobusni tahrirlash' : '➕ Yangi avtobus'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Avtobus raqami *</label>
                <input 
                  type="text" 
                  value={editingBus.number} 
                  onChange={(e) => setEditingBus({...editingBus, number: e.target.value})}
                  placeholder="Masalan: 01-A-777"
                />
              </div>
              <div className="form-group">
                <label>Haydovchi ismi *</label>
                <input 
                  type="text" 
                  value={editingBus.driver} 
                  onChange={(e) => setEditingBus({...editingBus, driver: e.target.value})}
                  placeholder="Haydovchi ismi"
                />
              </div>
              <div className="form-group">
                <label>Telefon raqam *</label>
                <input 
                  type="tel" 
                  value={editingBus.phone} 
                  onChange={(e) => setEditingBus({...editingBus, phone: e.target.value})}
                  placeholder="+998 XX XXX XX XX"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>O'rinlar soni</label>
                  <input 
                    type="number" 
                    value={editingBus.capacity} 
                    onChange={(e) => setEditingBus({...editingBus, capacity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Marshrut</label>
                  <select value={editingBus.routeId} onChange={(e) => setEditingBus({...editingBus, routeId: parseInt(e.target.value)})}>
                    <option value="">Tanlang</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Holati</label>
                <select value={editingBus.status} onChange={(e) => setEditingBus({...editingBus, status: e.target.value})}>
                  <option value="active">Faol</option>
                  <option value="maintenance">Ta'mirda</option>
                </select>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveBus}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MARSHURT MODAL ========== */}
      {showRouteModal && editingRoute && (
        <div className="modal-overlay" onClick={() => setShowRouteModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRoute.id ? '✏️ Marshrutni tahrirlash' : '➕ Yangi marshrut'}</h2>
              <button className="modal-close" onClick={() => setShowRouteModal(false)}><HiOutlineX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Marshrut nomi *</label>
                <input 
                  type="text" 
                  value={editingRoute.name} 
                  onChange={(e) => setEditingRoute({...editingRoute, name: e.target.value})}
                  placeholder="Masalan: Yunusobod - Maktab"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Boshlanish nuqtasi *</label>
                  <input 
                    type="text" 
                    value={editingRoute.startPoint} 
                    onChange={(e) => setEditingRoute({...editingRoute, startPoint: e.target.value})}
                    placeholder="Masalan: Yunusobod"
                  />
                </div>
                <div className="form-group">
                  <label>Tugash nuqtasi *</label>
                  <input 
                    type="text" 
                    value={editingRoute.endPoint} 
                    onChange={(e) => setEditingRoute({...editingRoute, endPoint: e.target.value})}
                    placeholder="Masalan: Maktab"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Masofa</label>
                  <input 
                    type="text" 
                    value={editingRoute.distance} 
                    onChange={(e) => setEditingRoute({...editingRoute, distance: e.target.value})}
                    placeholder="Masalan: 12 km"
                  />
                </div>
                <div className="form-group">
                  <label>Davomiyligi</label>
                  <input 
                    type="text" 
                    value={editingRoute.duration} 
                    onChange={(e) => setEditingRoute({...editingRoute, duration: e.target.value})}
                    placeholder="Masalan: 35 min"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Bekatlar (vergul bilan ajrating)</label>
                <input 
                  type="text" 
                  value={editingRoute.stops?.join(', ') || ''} 
                  onChange={(e) => setEditingRoute({...editingRoute, stops: e.target.value.split(',').map(s => s.trim())})}
                  placeholder="Yunusobod, Minor, Tinchlik, Oybek, Maktab"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveRoute}>💾 Saqlash</button>
              <button className="btn-secondary" onClick={() => setShowRouteModal(false)}>Bekor qilish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transport;