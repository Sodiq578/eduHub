import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineDocument, 
  HiOutlineDownload, 
  HiOutlineEye, 
  HiOutlineX, 
  HiOutlineFilter, 
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineCloudUpload,
  HiOutlineDocumentText,
  HiOutlineDocumentSearch,
  HiOutlineDocumentReport,
  HiOutlinePrinter,
  HiOutlineShare,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineRefresh,
  HiOutlineChartBar,
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineUpload,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineStar,
  HiOutlineLink,
  HiOutlineDuplicate,
  HiOutlineArchive,
  HiOutlineLockClosed,
  HiOutlineLockOpen,
  HiOutlineInformationCircle,
  HiOutlineMailOpen,
  HiOutlineClipboardCopy
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Documents.css';

const Documents = () => {
  const { user, roles } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const isAdmin = user?.role === roles.ADMIN;

  const categories = ['Reglament', 'Hisobot', 'Jadval', 'Shaxsiy', 'Rasmiy', 'Metodik', 'Boshqa'];
  const docTypes = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG', 'ZIP'];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const stored = localStorage.getItem('documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    } else {
      const defaultDocs = generateDefaultDocuments();
      setDocuments(defaultDocs);
      localStorage.setItem('documents', JSON.stringify(defaultDocs));
    }
  };

  const generateDefaultDocuments = () => {
    const docsList = [
      { 
        id: 1, 
        title: 'Maktab nizomi', 
        category: 'Reglament', 
        type: 'PDF', 
        fileSize: '2.5 MB', 
        uploadDate: '2024-09-01', 
        uploadedBy: 'Admin', 
        views: 45, 
        downloads: 12, 
        description: 'Maktabning asosiy nizomi va qoidalari',
        isImportant: true,
        isArchived: false,
        tags: ['nizom', 'qoidalar']
      },
      { 
        id: 2, 
        title: '1-chorak hisoboti', 
        category: 'Hisobot', 
        type: 'DOCX', 
        fileSize: '1.2 MB', 
        uploadDate: '2024-11-30', 
        uploadedBy: 'Admin', 
        views: 128, 
        downloads: 34, 
        description: 'Birinchi chorak yakunlari bo\'yicha hisobot',
        isImportant: true,
        isArchived: false,
        tags: ['hisobot', 'chorak']
      },
      { 
        id: 3, 
        title: 'Dars jadvali 2024', 
        category: 'Jadval', 
        type: 'XLSX', 
        fileSize: '0.8 MB', 
        uploadDate: '2024-08-15', 
        uploadedBy: 'Admin', 
        views: 256, 
        downloads: 89, 
        description: '2024-2025 o\'quv yili dars jadvali',
        isImportant: false,
        isArchived: false,
        tags: ['jadval', 'dars']
      },
      { 
        id: 4, 
        title: 'O\'qituvchilar kengashi', 
        category: 'Rasmiy', 
        type: 'PDF', 
        fileSize: '1.8 MB', 
        uploadDate: '2024-10-10', 
        uploadedBy: 'Admin', 
        views: 67, 
        downloads: 23, 
        description: 'O\'qituvchilar kengashi qarorlari',
        isImportant: true,
        isArchived: false,
        tags: ['kengash', 'qaror']
      },
      { 
        id: 5, 
        title: 'Sinflar ro\'yxati', 
        category: 'Jadval', 
        type: 'XLSX', 
        fileSize: '0.5 MB', 
        uploadDate: '2024-09-05', 
        uploadedBy: 'Admin', 
        views: 189, 
        downloads: 56, 
        description: 'Barcha sinflar ro\'yxati',
        isImportant: false,
        isArchived: false,
        tags: ['sinflar', 'ro\'yxat']
      },
      { 
        id: 6, 
        title: 'Metodik qo\'llanma', 
        category: 'Metodik', 
        type: 'PDF', 
        fileSize: '3.2 MB', 
        uploadDate: '2024-11-15', 
        uploadedBy: 'Admin', 
        views: 92, 
        downloads: 28, 
        description: 'O\'qituvchilar uchun metodik qo\'llanma',
        isImportant: false,
        isArchived: false,
        tags: ['metodik', 'qo\'llanma']
      },
      { 
        id: 7, 
        title: 'Imtihon jadvali', 
        category: 'Jadval', 
        type: 'PDF', 
        fileSize: '0.6 MB', 
        uploadDate: '2024-12-01', 
        uploadedBy: 'Admin', 
        views: 312, 
        downloads: 145, 
        description: 'Yakuniy imtihonlar jadvali',
        isImportant: true,
        isArchived: false,
        tags: ['imtihon', 'jadval']
      },
      { 
        id: 8, 
        title: 'O\'quv yili hisoboti', 
        category: 'Hisobot', 
        type: 'DOCX', 
        fileSize: '2.1 MB', 
        uploadDate: '2024-12-20', 
        uploadedBy: 'Admin', 
        views: 78, 
        downloads: 31, 
        description: 'O\'quv yili yakunlari bo\'yicha hisobot',
        isImportant: true,
        isArchived: false,
        tags: ['hisobot', 'yakun']
      }
    ];
    return docsList;
  };

  const saveDocuments = (updated) => { 
    setDocuments(updated); 
    localStorage.setItem('documents', JSON.stringify(updated)); 
  };

  const handleAdd = () => {
    setEditingDoc({
      title: '',
      category: '',
      type: 'PDF',
      fileSize: '',
      description: '',
      uploadedBy: user?.name || 'Admin',
      tags: [],
      isImportant: false,
      isArchived: false
    });
    setShowModal(true);
  };

  const handleEdit = (doc) => {
    setEditingDoc({ ...doc });
    setShowModal(true);
    setOpenAccordionId(null);
  };

  const handleView = (doc) => {
    const updatedDoc = { ...doc, views: (doc.views || 0) + 1 };
    const updatedDocs = documents.map(d => d.id === doc.id ? updatedDoc : d);
    saveDocuments(updatedDocs);
    setSelectedDoc(updatedDoc);
    setShowViewModal(true);
  };

  const handleDownload = (doc) => {
    const updatedDoc = { ...doc, downloads: (doc.downloads || 0) + 1 };
    const updatedDocs = documents.map(d => d.id === doc.id ? updatedDoc : d);
    saveDocuments(updatedDocs);
    alert(`${doc.title} yuklanmoqda...`);
  };

  const handleShare = (doc) => {
    setSelectedDoc(doc);
    setShowShareModal(true);
  };

  const handleSave = () => {
    if (!editingDoc.title || !editingDoc.category) { 
      alert('Iltimos, sarlavha va kategoriyani kiriting!'); 
      return; 
    }
    
    if (editingDoc.id) { 
      saveDocuments(documents.map(d => d.id === editingDoc.id ? editingDoc : d)); 
      alert("Hujjat yangilandi!"); 
    } else { 
      saveDocuments([{ 
        ...editingDoc, 
        id: Date.now(), 
        uploadDate: new Date().toISOString().split('T')[0], 
        views: 0, 
        downloads: 0,
        tags: editingDoc.tags || []
      }, ...documents]); 
      alert("Yangi hujjat qo'shildi!"); 
    }
    setShowModal(false); 
    setEditingDoc(null);
  };

  const handleDelete = (id) => { 
    if (window.confirm("Hujjatni o'chirmoqchimisiz?")) { 
      saveDocuments(documents.filter(d => d.id !== id)); 
      alert("Hujjat o'chirildi!");
      setOpenAccordionId(null);
    } 
  };

  const toggleAccordion = (id, e) => {
    if (e && (e.target.closest('.doc-actions') || e.target.closest('.accordion-trigger'))) {
      if (e) e.stopPropagation();
      return;
    }
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  const toggleImportant = (id) => {
    const updated = documents.map(d => 
      d.id === id ? { ...d, isImportant: !d.isImportant } : d
    );
    saveDocuments(updated);
  };

  const toggleArchive = (id) => {
    const updated = documents.map(d => 
      d.id === id ? { ...d, isArchived: !d.isArchived } : d
    );
    saveDocuments(updated);
  };

  // Filter va sort
  const filtered = documents
    .filter(d => {
      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === '' || d.category === filterCategory;
      const matchesType = filterType === '' || d.type === filterType;
      return matchesSearch && matchesCategory && matchesType && !d.isArchived;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' ? new Date(b.uploadDate) - new Date(a.uploadDate) : new Date(a.uploadDate) - new Date(b.uploadDate);
      } else if (sortBy === 'views') {
        return sortOrder === 'desc' ? b.views - a.views : a.views - b.views;
      } else if (sortBy === 'downloads') {
        return sortOrder === 'desc' ? b.downloads - a.downloads : a.downloads - b.downloads;
      } else if (sortBy === 'title') {
        return sortOrder === 'desc' ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
      }
      return 0;
    });

  const stats = {
    total: documents.length,
    totalViews: documents.reduce((sum, d) => sum + (d.views || 0), 0),
    totalDownloads: documents.reduce((sum, d) => sum + (d.downloads || 0), 0),
    importantCount: documents.filter(d => d.isImportant).length,
    archivedCount: documents.filter(d => d.isArchived).length,
    byCategory: categories.map(cat => ({
      name: cat,
      count: documents.filter(d => d.category === cat).length
    })).filter(c => c.count > 0)
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Sarlavha', 'Kategoriya', 'Tur', 'Hajmi', 'Yuklangan sana', 'Yuklagan', "Ko'rishlar", "Yuklab olishlar", 'Tavsif'];
    const csvData = filtered.map(d => [
      d.id, d.title, d.category, d.type, d.fileSize, d.uploadDate, d.uploadedBy, d.views, d.downloads, d.description || ''
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterType('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'PDF': return <HiOutlineDocumentText />;
      case 'DOCX': return <HiOutlineDocument />;
      case 'XLSX': return <HiOutlineDocumentSearch />;
      case 'PPTX': return <HiOutlineDocumentReport />;
      default: return <HiOutlineDocument />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'PDF': return '#ef4444';
      case 'DOCX': return '#3b82f6';
      case 'XLSX': return '#10b981';
      case 'PPTX': return '#f59e0b';
      default: return '#64748b';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('uz-UZ');
  };

  return (
    <div className="documents-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1><HiOutlineFolder /> Hujjatlar arxivi</h1>
          <p><HiOutlineDocument /> Jami {stats.total} ta hujjat | <HiOutlineEye /> {stats.totalViews} marta ko'rilgan | <HiOutlineDownload /> {stats.totalDownloads} marta yuklab olingan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          <button className="btn-export" onClick={resetFilters}>
            <HiOutlineRefresh /> Filtrni tozalash
          </button>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <HiOutlineViewGrid />
            </button>
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <HiOutlineViewList />
            </button>
          </div>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlineCloudUpload /> Hujjat yuklash
            </button>
          )}
        </div>
      </div>

      {/* STATISTIK KARTALAR */}
      <div className="documents-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <HiOutlineDocument />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Jami hujjatlar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <HiOutlineTag />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.byCategory.length}</div>
            <div className="stat-label">Kategoriyalar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <HiOutlineEye />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalViews}</div>
            <div className="stat-label">Jami ko'rishlar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <HiOutlineDownload />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalDownloads}</div>
            <div className="stat-label">Yuklab olishlar</div>
          </div>
        </div>
      </div>

      {/* FILTERLAR */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Sarlavha, tavsif yoki teg bo'yicha qidirish..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Barcha kategoriyalar</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Barcha turlar</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sana bo'yicha</option>
            <option value="title">Sarlavha bo'yicha</option>
            <option value="views">Ko'rishlar bo'yicha</option>
            <option value="downloads">Yuklab olishlar bo'yicha</option>
          </select>
          <button className="sort-order-btn" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      </div>

      {/* HUJJATLAR GRID/LIST */}
      {viewMode === 'grid' ? (
        <div className="documents-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <HiOutlineDocument size={48} />
              <p>Hech qanday hujjat topilmadi</p>
              {isAdmin && (
                <button className="btn-primary" onClick={handleAdd}>Birinchi hujjatni yuklash</button>
              )}
            </div>
          ) : (
            filtered.map(d => (
              <div 
                key={d.id} 
                className={`document-card ${d.isImportant ? 'important' : ''} ${openAccordionId === d.id ? 'expanded' : ''}`}
                onClick={(e) => toggleAccordion(d.id, e)}
              >
                <div className="doc-icon" style={{ background: `${getTypeColor(d.type)}15`, color: getTypeColor(d.type) }}>
                  {getTypeIcon(d.type)}
                </div>
                <div className="doc-info">
                  <div className="doc-header">
                    <h3>{d.title}</h3>
                    <span className="doc-type" style={{ background: `${getTypeColor(d.type)}15`, color: getTypeColor(d.type) }}>
                      {d.type}
                    </span>
                    {d.isImportant && <span className="important-badge">⭐ Muhim</span>}
                  </div>
                  <p className="doc-category">{d.category}</p>
                  {d.description && <p className="doc-description">{d.description}</p>}
                  <div className="doc-meta">
                    <span><HiOutlineFolder /> {d.fileSize}</span>
                    <span><HiOutlineCalendar /> {formatDate(d.uploadDate)}</span>
                    <span><HiOutlineUser /> {d.uploadedBy}</span>
                    <span><HiOutlineEye /> {d.views}</span>
                    <span><HiOutlineDownload /> {d.downloads}</span>
                  </div>
                </div>
                <div className="doc-actions">
                  <button className="view-btn" onClick={(e) => { e.stopPropagation(); handleView(d); }} title="Ko'rish">
                    <HiOutlineEye />
                  </button>
                  <button className="download-btn" onClick={(e) => { e.stopPropagation(); handleDownload(d); }} title="Yuklab olish">
                    <HiOutlineDownload />
                  </button>
                  <button className="share-btn" onClick={(e) => { e.stopPropagation(); handleShare(d); }} title="Ulashish">
                    <HiOutlineShare />
                  </button>
                  {isAdmin && (
                    <>
                      <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEdit(d); }} title="Tahrirlash">
                        <HiOutlinePencil />
                      </button>
                      <button className="delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }} title="O'chirish">
                        <HiOutlineTrash />
                      </button>
                    </>
                  )}
                </div>
                {/* Accordion panel - qo'shimcha ma'lumotlar */}
                {openAccordionId === d.id && (
                  <div className="accordion-panel">
                    <div className="accordion-content-doc">
                      <div className="extra-info">
                        <div className="info-row">
                          <span className="info-label"><HiOutlineTag /> Teglar:</span>
                          <span className="info-value">
                            {d.tags && d.tags.length > 0 ? d.tags.join(', ') : 'Teglar mavjud emas'}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label"><HiOutlineClock /> Yaratilgan vaqt:</span>
                          <span className="info-value">{formatDate(d.uploadDate)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label"><HiOutlineInformationCircle /> Qo'shimcha:</span>
                          <span className="info-value">{d.description || 'Tavsif mavjud emas'}</span>
                        </div>
                      </div>
                      <div className="accordion-actions">
                        {isAdmin && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); toggleImportant(d.id); }}>
                              {d.isImportant ? <HiOutlineLockOpen /> : <HiOutlineStar />}
                              {d.isImportant ? 'Muhimdan chiqarish' : 'Muhim qilish'}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); toggleArchive(d.id); }}>
                              <HiOutlineArchive /> Arxivlash
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="documents-list">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Nomi</th>
                <th>Kategoriya</th>
                <th>Tur</th>
                <th>Hajmi</th>
                <th>Sana</th>
                <th>Ko'rishlar</th>
                <th>Yuklab olishlar</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table">
                    <div className="empty-state">
                      <HiOutlineDocument size={48} />
                      <p>Hech qanday hujjat topilmadi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(d => (
                  <tr key={d.id} className={d.isImportant ? 'important-row' : ''}>
                    <td>
                      <div className="list-doc-info">
                        {getTypeIcon(d.type)}
                        <span>{d.title}</span>
                        {d.isImportant && <span className="important-badge-small">⭐</span>}
                      </div>
                    </td>
                    <td>{d.category}</td>
                    <td><span className="type-badge">{d.type}</span></td>
                    <td>{d.fileSize}</td>
                    <td>{formatDate(d.uploadDate)}</td>
                    <td>{d.views}</td>
                    <td>{d.downloads}</td>
                    <td>
                      <div className="list-actions">
                        <button onClick={() => handleView(d)} title="Ko'rish"><HiOutlineEye /></button>
                        <button onClick={() => handleDownload(d)} title="Yuklab olish"><HiOutlineDownload /></button>
                        <button onClick={() => handleShare(d)} title="Ulashish"><HiOutlineShare /></button>
                        {isAdmin && (
                          <>
                            <button onClick={() => handleEdit(d)} title="Tahrirlash"><HiOutlinePencil /></button>
                            <button onClick={() => handleDelete(d.id)} title="O'chirish"><HiOutlineTrash /></button>
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
      )}

      {/* KO'RISH MODAL */}
      {showViewModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDoc.title}</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="doc-details-view">
                <div className="details-section">
                  <h3>Ma'lumotlar</h3>
                  <div className="detail-row">
                    <span className="detail-label">Kategoriya:</span>
                    <span className="detail-value">{selectedDoc.category}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tur:</span>
                    <span className="detail-value">{selectedDoc.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Hajmi:</span>
                    <span className="detail-value">{selectedDoc.fileSize}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Yuklangan sana:</span>
                    <span className="detail-value">{formatDate(selectedDoc.uploadDate)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Yuklagan:</span>
                    <span className="detail-value">{selectedDoc.uploadedBy}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ko'rishlar:</span>
                    <span className="detail-value">{selectedDoc.views}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Yuklab olishlar:</span>
                    <span className="detail-value">{selectedDoc.downloads}</span>
                  </div>
                  {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Teglar:</span>
                      <span className="detail-value">{selectedDoc.tags.join(', ')}</span>
                    </div>
                  )}
                  {selectedDoc.description && (
                    <div className="detail-row">
                      <span className="detail-label">Tavsif:</span>
                      <span className="detail-value">{selectedDoc.description}</span>
                    </div>
                  )}
                </div>
                <div className="preview-section">
                  <div className="preview-placeholder">
                    {getTypeIcon(selectedDoc.type)}
                    <p>{selectedDoc.type} fayl</p>
                    <button className="download-btn-large" onClick={() => handleDownload(selectedDoc)}>
                      <HiOutlineDownload /> Yuklab olish
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* ULASHISH MODAL */}
      {showShareModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><HiOutlineShare /> Hujjatni ulashish</h2>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="share-info">
                <p><strong>{selectedDoc.title}</strong> hujjatini ulashish</p>
                <div className="share-link">
                  <input type="text" readOnly value={`${window.location.origin}/documents/${selectedDoc.id}`} />
                  <button onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/documents/${selectedDoc.id}`);
                    alert("Link nusxalandi!");
                  }}>
                    <HiOutlineClipboardCopy /> Nusxalash
                  </button>
                </div>
                <div className="share-options">
                  <button onClick={() => window.print()}><HiOutlinePrinter /> Chop etish</button>
                  <button><HiOutlineMailOpen /> Email</button>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowShareModal(false)}>Yopish</button>
            </div>
          </div>
        </div>
      )}

      {/* QO'SHISh/TAHRIRLASH MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDoc?.id ? <HiOutlinePencil /> : <HiOutlineCloudUpload />} {editingDoc?.id ? 'Hujjat tahrirlash' : 'Yangi hujjat yuklash'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Sarlavha *</label>
                <input 
                  type="text" 
                  placeholder="Hujjat sarlavhasi" 
                  value={editingDoc?.title || ''} 
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategoriya *</label>
                  <select 
                    value={editingDoc?.category || ''} 
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                  >
                    <option value="">Tanlang</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fayl turi *</label>
                  <select 
                    value={editingDoc?.type || 'PDF'} 
                    onChange={(e) => setEditingDoc({ ...editingDoc, type: e.target.value })}
                  >
                    {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fayl hajmi</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: 1.5 MB" 
                    value={editingDoc?.fileSize || ''} 
                    onChange={(e) => setEditingDoc({ ...editingDoc, fileSize: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label>Yuklagan</label>
                  <input 
                    type="text" 
                    value={editingDoc?.uploadedBy || user?.name || 'Admin'} 
                    onChange={(e) => setEditingDoc({ ...editingDoc, uploadedBy: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teglar</label>
                  <input 
                    type="text" 
                    placeholder="Vergul bilan ajrating (masalan: nizom, qoidalar)" 
                    value={editingDoc?.tags?.join(', ') || ''} 
                    onChange={(e) => setEditingDoc({ ...editingDoc, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })} 
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={editingDoc?.isImportant || false} 
                      onChange={(e) => setEditingDoc({ ...editingDoc, isImportant: e.target.checked })} 
                    /> Muhim hujjat
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Tavsif</label>
                <textarea 
                  rows="3" 
                  placeholder="Hujjat haqida qisqacha ma'lumot..." 
                  value={editingDoc?.description || ''} 
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })} 
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingDoc?.id ? 'Yangilash' : 'Yuklash'}
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

export default Documents;