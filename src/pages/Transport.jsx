import React, { useState, useEffect } from 'react';
import {
  HiOutlineMap,
  HiOutlineEye,
  HiOutlineX,
  HiOutlineTruck,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineInformationCircle,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineChartBar,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineMap as HiOutlineMapIcon
} from 'react-icons/hi';
import './Transport.css';

const Transport = () => {
  // ========== STATE ==========
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showBusModal, setShowBusModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [waveActive, setWaveActive] = useState(null);
  const [activeStop, setActiveStop] = useState(null);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalBuses: 0,
    activeBuses: 0,
    totalStops: 0,
    avgDistance: 0
  });

  // ========== DEFAULT MA'LUMOTLAR ==========
  const defaultRoutes = [
    {
      id: 1,
      name: "Yunusobod - Maktab",
      startPoint: "Yunusobod",
      endPoint: "Maktab",
      startCoords: "41.343210,69.297890",
      endCoords: "41.311470,69.279650",
      color: "#4CAF50",
      distance: "12 km",
      duration: "35 min",
      stops: ["Yunusobod", "Oybek", "Bodomzor", "Maktab"],
      buses: [1, 3]
    },
    {
      id: 2,
      name: "Chilonzor - Maktab",
      startPoint: "Chilonzor",
      endPoint: "Maktab",
      startCoords: "41.284300,69.220500",
      endCoords: "41.311470,69.279650",
      color: "#2196F3",
      distance: "15 km",
      duration: "45 min",
      stops: ["Chilonzor", "Novza", "Xalqlar Do'stligi", "Maktab"],
      buses: [2]
    },
    {
      id: 3,
      name: "Sergeli - Maktab",
      startPoint: "Sergeli",
      endPoint: "Maktab",
      startCoords: "41.232890,69.212340",
      endCoords: "41.311470,69.279650",
      color: "#FF9800",
      distance: "18 km",
      duration: "55 min",
      stops: ["Sergeli", "Qipchoq", "Toshkent", "Maktab"],
      buses: [4]
    }
  ];

  const defaultBuses = [
    {
      id: 1,
      number: "01-A 777",
      driver: "Alisher Karimov",
      phone: "+998 90 123 45 67",
      routeId: 1,
      status: "active",
      capacity: 45,
      year: 2022
    },
    {
      id: 2,
      number: "01-B 888",
      driver: "Jasur Rahimov",
      phone: "+998 91 234 56 78",
      routeId: 2,
      status: "active",
      capacity: 50,
      year: 2023
    },
    {
      id: 3,
      number: "01-C 999",
      driver: "Shavkat Toshmatov",
      phone: "+998 93 345 67 89",
      routeId: 1,
      status: "maintenance",
      capacity: 40,
      year: 2021
    },
    {
      id: 4,
      number: "01-D 000",
      driver: "Bobur Abrorov",
      phone: "+998 94 456 78 90",
      routeId: 3,
      status: "active",
      capacity: 55,
      year: 2024
    }
  ];

  // ========== USEFFECT ==========
  useEffect(() => {
    setRoutes(defaultRoutes);
    setBuses(defaultBuses);
    calculateStats(defaultRoutes, defaultBuses);
  }, []);

  // ========== STATISTIKA HISOBI ==========
  const calculateStats = (routesData, busesData) => {
    const totalStops = routesData.reduce((sum, route) => sum + route.stops.length, 0);
    const totalDistance = routesData.reduce((sum, route) => sum + parseFloat(route.distance), 0);
    const avgDistance = routesData.length > 0 ? (totalDistance / routesData.length).toFixed(1) : 0;
    
    setStats({
      totalRoutes: routesData.length,
      totalBuses: busesData.length,
      activeBuses: busesData.filter(bus => bus.status === 'active').length,
      totalStops: totalStops,
      avgDistance: avgDistance
    });
  };

  // ========== QIDIRUV FILTRI ==========
  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.endPoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBuses = buses.filter(bus =>
    bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== YANDEX MAP URL ==========
  const getMapUrl = (route) => {
    if (!route) return '';
    return `https://yandex.uz/map-widget/v1/?mode=routes&rtext=${route.startCoords}~${route.endCoords}&rtt=auto&z=12`;
  };

  const getMapUrlForStop = (coords) => {
    return `https://yandex.uz/map-widget/v1/?mode=search&text=${coords}&z=15`;
  };

  // ========== TO'LQIN (WAVE) ANIMATSIYASI ==========
  const handleStopClick = (stop, index, routeId) => {
    setWaveActive({ stop, index, routeId });
    setActiveStop(stop);
    
    // 1.5 sekunddan keyin to'lqin effektini o'chirish
    setTimeout(() => {
      setWaveActive(null);
    }, 1500);
  };

  // ========== MARSHURT QO'SHISH / TAXRIRLASH ==========
  const handleSaveRoute = (routeData) => {
    if (editingRoute) {
      // Taxrirlash
      setRoutes(routes.map(route => 
        route.id === editingRoute.id ? { ...routeData, id: route.id } : route
      ));
    } else {
      // Yangi qo'shish
      const newId = Math.max(...routes.map(r => r.id), 0) + 1;
      setRoutes([...routes, { ...routeData, id: newId }]);
    }
    setShowRouteModal(false);
    setEditingRoute(null);
    calculateStats(routes, buses);
  };

  const handleDeleteRoute = (routeId) => {
    if (window.confirm("Ushbu marshrutni o'chirmoqchimisiz?")) {
      setRoutes(routes.filter(route => route.id !== routeId));
      calculateStats(routes, buses);
    }
  };

  // ========== AVTOBUS QO'SHISH / TAXRIRLASH ==========
  const handleSaveBus = (busData) => {
    if (editingRoute) {
      setBuses(buses.map(bus => 
        bus.id === editingRoute.id ? { ...busData, id: bus.id } : bus
      ));
    } else {
      const newId = Math.max(...buses.map(b => b.id), 0) + 1;
      setBuses([...buses, { ...busData, id: newId }]);
    }
    setShowBusModal(false);
    setEditingRoute(null);
    calculateStats(routes, buses);
  };

  const handleDeleteBus = (busId) => {
    if (window.confirm("Ushbu avtobusni o'chirmoqchimisiz?")) {
      setBuses(buses.filter(bus => bus.id !== busId));
      calculateStats(routes, buses);
    }
  };

  // ========== AVTOBUS STATUSINI O'ZGARTIRISH ==========
  const toggleBusStatus = (busId) => {
    setBuses(buses.map(bus => 
      bus.id === busId 
        ? { ...bus, status: bus.status === 'active' ? 'maintenance' : 'active' }
        : bus
    ));
  };

  // ========== RENDER MAP VIEW ==========
  const renderMapView = () => (
    <div className="map-view-section">
      <div className="map-header-controls">
        <h3><HiOutlineMapIcon /> Marshrutlar xaritasi</h3>
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          <HiOutlineRefresh /> Yangilash
        </button>
      </div>
      <div className="routes-map-grid">
        {filteredRoutes.map(route => (
          <div key={route.id} className="route-map-card">
            <div className="route-map-header">
              <h4>{route.name}</h4>
              <span className="route-distance-badge">{route.distance}</span>
            </div>
            <div className="route-points">
              <div className="point-item" onClick={() => handleStopClick(route.startPoint, 0, route.id)}>
                <div className="point-marker A">A</div>
                <span className="point-name">📍 {route.startPoint}</span>
              </div>
              {route.stops.slice(1, -1).map((stop, idx) => (
                <div key={idx} className="point-item" onClick={() => handleStopClick(stop, idx + 1, route.id)}>
                  <div className="point-marker stop">●</div>
                  <span className="point-name">🚏 {stop}</span>
                </div>
              ))}
              <div className="point-item" onClick={() => handleStopClick(route.endPoint, route.stops.length - 1, route.id)}>
                <div className="point-marker B">B</div>
                <span className="point-name">🏁 {route.endPoint}</span>
              </div>
            </div>
            <div className="route-map-preview">
              <iframe
                src={getMapUrl(route)}
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                title={`${route.name} map`}
              />
            </div>
            <button className="view-full-btn" onClick={() => setSelectedRoute(route)}>
              <HiOutlineEye /> To'liq ko'rish
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ========== RENDER GRID VIEW ==========
  const renderGridView = () => (
    <div className="routes-container grid">
      {filteredRoutes.map(route => (
        <div key={route.id} className="route-card" style={{ borderLeftColor: route.color }}>
          <div className="route-header">
            <div className="route-icon" style={{ background: `${route.color}20`, color: route.color }}>
              <HiOutlineMap />
            </div>
            <div className="route-info">
              <h3>{route.name}</h3>
              <p>
                <span className="start-badge">A</span> {route.startPoint} 
                <span> → </span>
                <span className="end-badge">B</span> {route.endPoint}
              </p>
            </div>
            <div className="route-stats">
              <span className="route-distance">📏 {route.distance}</span>
              <span className="route-duration">⏱ {route.duration}</span>
            </div>
          </div>
          
          <div className="route-details">
            <div className="route-stops">
              <strong>🚏 Bekatlar ({route.stops.length}):</strong>
              <div className="stops-list">
                {route.stops.map((stop, idx) => (
                  <span 
                    key={idx} 
                    className="stop-badge"
                    onClick={() => handleStopClick(stop, idx, route.id)}
                    style={{ position: 'relative', overflow: 'visible' }}
                  >
                    {stop}
                    {waveActive && waveActive.stop === stop && waveActive.routeId === route.id && (
                      <div className="wave-animation">
                        <div className="wave-ring"></div>
                        <div className="wave-ring wave-ring-2"></div>
                        <div className="wave-ring wave-ring-3"></div>
                      </div>
                    )}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="route-buses">
              <strong>🚌 Avtobuslar:</strong>
              <div className="buses-list">
                {route.buses.map(busId => {
                  const bus = buses.find(b => b.id === busId);
                  return bus ? (
                    <span key={busId} className="bus-badge" onClick={() => setSelectedBus(bus)}>
                      {bus.number}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
          
          <div className="route-actions">
            <button className="view-route-btn" onClick={() => setSelectedRoute(route)}>
              <HiOutlineEye /> Xarita
            </button>
            <button className="edit-btn" onClick={() => {
              setEditingRoute(route);
              setShowRouteModal(true);
            }}>
              <HiOutlinePencil /> Tahrir
            </button>
            <button className="delete-btn" onClick={() => handleDeleteRoute(route.id)}>
              <HiOutlineTrash /> O'chir
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // ========== RENDER BUS LIST ==========
  const renderBusList = () => (
    <div className="buses-container grid">
      {filteredBuses.map(bus => (
        <div key={bus.id} className={`bus-card ${bus.status}`}>
          <div className="bus-header">
            <div className="bus-icon">
              <HiOutlineTruck />
            </div>
            <div className="bus-info">
              <h3>🚍 {bus.number}</h3>
              <span className={`status-badge ${bus.status}`}>
                {bus.status === 'active' ? 'Faol' : 'Ta\'mirda'}
              </span>
            </div>
          </div>
          
          <div className="bus-details">
            <p><HiOutlineUser /> Haydovchi: {bus.driver}</p>
            <p><HiOutlinePhone /> Tel: {bus.phone}</p>
            <p><HiOutlineCalendar /> Yili: {bus.year}</p>
            <p><HiOutlineChartBar /> Sig'imi: {bus.capacity} kishi</p>
            <p>
              <HiOutlineMap /> Marshrut: {
                routes.find(r => r.id === bus.routeId)?.name || 'Noma\'lum'
              }
            </p>
          </div>
          
          <div className="bus-actions">
            <button className="view-route-btn" onClick={() => toggleBusStatus(bus.id)}>
              {bus.status === 'active' ? '🔧 Ta\'mirlash' : '✅ Faollashtirish'}
            </button>
            <button className="edit-btn" onClick={() => {
              setEditingRoute(bus);
              setShowBusModal(true);
            }}>
              <HiOutlinePencil /> Tahrir
            </button>
            <button className="delete-btn" onClick={() => handleDeleteBus(bus.id)}>
              <HiOutlineTrash /> O'chir
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // ========== STATISTIKA KARTALARI ==========
  const renderStats = () => (
    <div className="stats-grid">
      <div className="stat-card blue">
        <div className="stat-value">{stats.totalRoutes}</div>
        <div className="stat-label">Marshrutlar</div>
      </div>
      <div className="stat-card green">
        <div className="stat-value">{stats.totalBuses}</div>
        <div className="stat-label">Avtobuslar</div>
      </div>
      <div className="stat-card orange">
        <div className="stat-value">{stats.activeBuses}</div>
        <div className="stat-label">Faol avtobuslar</div>
      </div>
      <div className="stat-card purple">
        <div className="stat-value">{stats.totalStops}</div>
        <div className="stat-label">Bekatlar</div>
      </div>
      <div className="stat-card teal">
        <div className="stat-value">{stats.avgDistance}</div>
        <div className="stat-label">O'rtacha masofa (km)</div>
      </div>
    </div>
  );

  // ========== MODAL OYNALAR ==========
  const RouteModal = () => (
    <div className="modal-overlay" onClick={() => {
      setShowRouteModal(false);
      setEditingRoute(null);
    }}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingRoute ? 'Marshrutni tahrirlash' : 'Yangi marshrut qo\'shish'}</h2>
          <button className="modal-close" onClick={() => setShowRouteModal(false)}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveRoute({
              name: formData.get('name'),
              startPoint: formData.get('startPoint'),
              endPoint: formData.get('endPoint'),
              startCoords: formData.get('startCoords'),
              endCoords: formData.get('endCoords'),
              color: formData.get('color'),
              distance: formData.get('distance'),
              duration: formData.get('duration'),
              stops: formData.get('stops').split(',').map(s => s.trim()),
              buses: formData.get('buses').split(',').map(s => parseInt(s.trim()))
            });
          }}>
            <div className="form-group">
              <label>Marshrut nomi</label>
              <input name="name" defaultValue={editingRoute?.name} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Boshlanish nuqtasi</label>
                <input name="startPoint" defaultValue={editingRoute?.startPoint} required />
              </div>
              <div className="form-group">
                <label>Tugash nuqtasi</label>
                <input name="endPoint" defaultValue={editingRoute?.endPoint} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Boshlanish koordinatalari</label>
                <input name="startCoords" defaultValue={editingRoute?.startCoords} placeholder="41.343210,69.297890" required />
              </div>
              <div className="form-group">
                <label>Tugash koordinatalari</label>
                <input name="endCoords" defaultValue={editingRoute?.endCoords} placeholder="41.311470,69.279650" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Masofa (km)</label>
                <input name="distance" defaultValue={editingRoute?.distance} required />
              </div>
              <div className="form-group">
                <label>Vaqt (min)</label>
                <input name="duration" defaultValue={editingRoute?.duration} required />
              </div>
            </div>
            <div className="form-group">
              <label>Rang</label>
              <input name="color" type="color" defaultValue={editingRoute?.color || '#4CAF50'} />
            </div>
            <div className="form-group">
              <label>Bekatlar (vergul bilan ajrating)</label>
              <textarea name="stops" rows="3" defaultValue={editingRoute?.stops?.join(', ')} required />
            </div>
            <div className="form-group">
              <label>Avtobus ID'lari (vergul bilan)</label>
              <input name="buses" defaultValue={editingRoute?.buses?.join(', ')} />
            </div>
            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setShowRouteModal(false)}>Bekor qilish</button>
              <button type="submit" className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const BusModal = () => (
    <div className="modal-overlay" onClick={() => {
      setShowBusModal(false);
      setEditingRoute(null);
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingRoute ? 'Avtobusni tahrirlash' : 'Yangi avtobus qo\'shish'}</h2>
          <button className="modal-close" onClick={() => setShowBusModal(false)}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveBus({
              number: formData.get('number'),
              driver: formData.get('driver'),
              phone: formData.get('phone'),
              routeId: parseInt(formData.get('routeId')),
              status: formData.get('status'),
              capacity: parseInt(formData.get('capacity')),
              year: parseInt(formData.get('year'))
            });
          }}>
            <div className="form-group">
              <label>Avtobus raqami</label>
              <input name="number" defaultValue={editingRoute?.number} required />
            </div>
            <div className="form-group">
              <label>Haydovchi ismi</label>
              <input name="driver" defaultValue={editingRoute?.driver} required />
            </div>
            <div className="form-group">
              <label>Telefon raqami</label>
              <input name="phone" defaultValue={editingRoute?.phone} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Marshrut ID</label>
                <select name="routeId" defaultValue={editingRoute?.routeId}>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Holati</label>
                <select name="status" defaultValue={editingRoute?.status || 'active'}>
                  <option value="active">Faol</option>
                  <option value="maintenance">Ta'mirda</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sig'imi</label>
                <input name="capacity" type="number" defaultValue={editingRoute?.capacity || 45} required />
              </div>
              <div className="form-group">
                <label>Ishlab chiqarilgan yili</label>
                <input name="year" type="number" defaultValue={editingRoute?.year || 2022} required />
              </div>
            </div>
            <div className="modal-buttons">
              <button type="button" className="btn-secondary" onClick={() => setShowBusModal(false)}>Bekor qilish</button>
              <button type="submit" className="btn-primary">Saqlash</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // ========== MAIN RENDER ==========
  return (
    <div className="transport-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>🚍 Transport boshqaruv tizimi</h1>
          <p>Avtobus marshrutlari va bekatlar to'lqinli animatsiya bilan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-primary" onClick={() => {
            setEditingRoute(null);
            setShowRouteModal(true);
          }}>
            <HiOutlinePlus /> Marshrut qo'shish
          </button>
          <button className="btn-secondary" onClick={() => {
            setEditingRoute(null);
            setShowBusModal(true);
          }}>
            <HiOutlinePlus /> Avtobus qo'shish
          </button>
        </div>
      </div>

      {/* STATISTIKA */}
      {renderStats()}

      {/* QIDIRUV VA VIEW MODE */}
      <div className="controls-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Marshrut yoki avtobus qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="view-modes">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <HiOutlineViewGrid /> Grid
          </button>
          <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
            <HiOutlineMapIcon /> Xarita
          </button>
        </div>
      </div>

      {/* MARSHURTLAR SECTION */}
      <div className="section-header">
        <h2><HiOutlineMap /> Marshrutlar ({filteredRoutes.length})</h2>
        <p>Bekatlarga bosing - to'lqin effekti</p>
      </div>

      {viewMode === 'map' ? renderMapView() : renderGridView()}

      {/* AVTOBUSLAR SECTION */}
      <div className="section-header">
        <h2><HiOutlineTruck /> Avtobuslar ({filteredBuses.length})</h2>
      </div>
      {renderBusList()}

      {/* MARSHURT MAP MODAL */}
      {selectedRoute && (
        <div className="modal-overlay" onClick={() => setSelectedRoute(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗺 {selectedRoute.name}</h2>
              <button className="modal-close" onClick={() => setSelectedRoute(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="single-map-view">
                <div className="map-header-info">
                  <div className="route-info-badges">
                    <span className="badge start">A: {selectedRoute.startPoint}</span>
                    <span>→</span>
                    <span className="badge end">B: {selectedRoute.endPoint}</span>
                  </div>
                  <div className="route-meta">
                    <span>📏 {selectedRoute.distance}</span>
                    <span>⏱ {selectedRoute.duration}</span>
                  </div>
                </div>
                <div className="yandex-map-container">
                  <iframe
                    src={getMapUrl(selectedRoute)}
                    width="100%"
                    height="450"
                    style={{ border: 0, borderRadius: '12px' }}
                    loading="lazy"
                    allowFullScreen
                    title="Yandex Map"
                  />
                </div>
                
                {/* BEKATLAR TO'LQINLI ANIMATSIYA */}
                <div className="stops-info">
                  <div className="stops-title">🚏 Marshrut bo'yicha bekatlar:</div>
                  <div className="stops-wave-container">
                    {selectedRoute.stops.map((stop, idx) => (
                      <div 
                        key={idx}
                        className={`stop-wave-item ${waveActive && waveActive.stop === stop ? 'wave-active' : ''}`}
                        onClick={() => handleStopClick(stop, idx, selectedRoute.id)}
                        style={{ position: 'relative', overflow: 'visible' }}
                      >
                        <span className="stop-dot" style={{ background: selectedRoute.color }}></span>
                        <span className="stop-name">{stop}</span>
                        {waveActive && waveActive.stop === stop && waveActive.routeId === selectedRoute.id && (
                          <div className="wave-animation">
                            <div className="wave-ring"></div>
                            <div className="wave-ring wave-ring-2"></div>
                            <div className="wave-ring wave-ring-3"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="map-note-wave">
                  <div className="wave-hint">
                    🌊 <strong>To'lqin effekti:</strong> Bekatlarga bosing - atrofida to'lqinlar paydo bo'ladi!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AVTOBUS INFO MODAL */}
      {selectedBus && (
        <div className="modal-overlay" onClick={() => setSelectedBus(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineInformationCircle /> Avtobus ma'lumotlari</h2>
              <button className="modal-close" onClick={() => setSelectedBus(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="bus-info-modal">
                <div className="info-row"><strong>🚍 Raqami:</strong> {selectedBus.number}</div>
                <div className="info-row"><strong>👨‍✈️ Haydovchi:</strong> {selectedBus.driver}</div>
                <div className="info-row"><strong>📞 Telefon:</strong> {selectedBus.phone}</div>
                <div className="info-row"><strong>📍 Holati:</strong> {selectedBus.status === 'active' ? 'Faol' : 'Ta\'mirda'}</div>
                <div className="info-row"><strong>💺 Sig'imi:</strong> {selectedBus.capacity} kishi</div>
                <div className="info-row"><strong>📅 Yili:</strong> {selectedBus.year}</div>
                <div className="info-row"><strong>🗺 Marshrut:</strong> {routes.find(r => r.id === selectedBus.routeId)?.name}</div>
              </div>
            </div>
         <button className="btn-primary" onClick={() => setSelectedBus(null)}>
  Yopish
</button>
          </div>
        </div>
      )}

      {/* MODAL OYNALAR */}
      {showRouteModal && <RouteModal />}
      {showBusModal && <BusModal />}
    </div>
  );
};

export default Transport;