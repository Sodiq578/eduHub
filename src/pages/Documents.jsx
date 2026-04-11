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
  HiOutlineShare
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Documents.css';

const Documents = () => {
  const { user, roles } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);

  const isAdmin = user?.role === roles.ADMIN;

  const categories = ['Reglament', 'Hisobot', 'Jadval', 'Shaxsiy', 'Rasmiy', 'Metodik', 'Boshqa'];
  const docTypes = ['PDF', 'DOCX', 'XLSX', 'PPTX', 'JPG', 'PNG'];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const stored = localStorage.getItem('documents');
    if (stored) {
      setDocuments(JSON.parse(stored));
    } else {
      const defaultDocs = [
        { id: 1, title: 'Maktab nizomi', category: 'Reglament', type: 'PDF', fileSize: '2.5 MB', uploadDate: '2024-09-01', uploadedBy: 'Admin', views: 45, downloads: 12, description: 'Maktabning asosiy nizomi va qoidalari' },
        { id: 2, title: '1-chorak hisoboti', category: 'Hisobot', type: 'DOCX', fileSize: '1.2 MB', uploadDate: '2024-11-30', uploadedBy: 'Admin', views: 128, downloads: 34, description: 'Birinchi chorak yakunlari bo\'yicha hisobot' },
        { id: 3, title: 'Dars jadvali 2024', category: 'Jadval', type: 'XLSX', fileSize: '0.8 MB', uploadDate: '2024-08-15', uploadedBy: 'Admin', views: 256, downloads: 89, description: '2024-2025 o\'quv yili dars jadvali' },
        { id: 4, title: 'O\'qituvchilar kengashi', category: 'Rasmiy', type: 'PDF', fileSize: '1.8 MB', uploadDate: '2024-10-10', uploadedBy: 'Admin', views: 67, downloads: 23, description: 'O\'qituvchilar kengashi qarorlari' },
        { id: 5, title: 'Sinflar ro\'yxati', category: 'Jadval', type: 'XLSX', fileSize: '0.5 MB', uploadDate: '2024-09-05', uploadedBy: 'Admin', views: 189, downloads: 56, description: 'Barcha sinflar ro\'yxati' },
      ];
      setDocuments(defaultDocs);
      localStorage.setItem('documents', JSON.stringify(defaultDocs));
    }
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
      uploadedBy: user?.name || 'Admin'
    });
    setShowModal(true);
  };

  const handleEdit = (doc) => {
    setEditingDoc({ ...doc });
    setShowModal(true);
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
        downloads: 0 
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
    } 
  };

  const filtered = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || d.category === filterCategory;
    const matchesType = filterType === '' || d.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const stats = {
    total: documents.length,
    totalViews: documents.reduce((sum, d) => sum + (d.views || 0), 0),
    totalDownloads: documents.reduce((sum, d) => sum + (d.downloads || 0), 0),
    byCategory: categories.map(cat => ({
      name: cat,
      count: documents.filter(d => d.category === cat).length
    })).filter(c => c.count > 0)
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Sarlavha', 'Kategoriya', 'Tur', 'Hajmi', 'Yuklangan sana', 'Yuklagan', "Ko'rishlar", "Yuklab olishlar"];
    const csvData = filtered.map(d => [
      d.id, d.title, d.category, d.type, d.fileSize, d.uploadDate, d.uploadedBy, d.views, d.downloads
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="documents-page">
      <div className="page-header">
        <div>
          <h1>Hujjatlar</h1>
          <p>Jami {stats.total} ta hujjat | {stats.totalViews} marta ko'rilgan | {stats.totalDownloads} marta yuklab olingan</p>
        </div>
        <div className="header-buttons">
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
          {isAdmin && (
            <button className="btn-primary" onClick={handleAdd}>
              <HiOutlineCloudUpload /> Hujjat yuklash
            </button>
          )}
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="documents-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Jami hujjatlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.byCategory.length}</div>
          <div className="stat-label">Kategoriyalar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalViews}</div>
          <div className="stat-label">Jami ko'rishlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalDownloads}</div>
          <div className="stat-label">Yuklab olishlar</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Sarlavha yoki tavsif bo'yicha qidirish..." 
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
        </div>
      </div>

      {/* Hujjatlar grid */}
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
            <div key={d.id} className="document-card">
              <div className="doc-icon" style={{ background: `${getTypeColor(d.type)}15`, color: getTypeColor(d.type) }}>
                {getTypeIcon(d.type)}
              </div>
              <div className="doc-info">
                <div className="doc-header">
                  <h3>{d.title}</h3>
                  <span className="doc-type" style={{ background: `${getTypeColor(d.type)}15`, color: getTypeColor(d.type) }}>
                    {d.type}
                  </span>
                </div>
                <p className="doc-category">{d.category}</p>
                {d.description && <p className="doc-description">{d.description}</p>}
                <div className="doc-meta">
                  <span><HiOutlineFolder /> {d.fileSize}</span>
                  <span><HiOutlineCalendar /> {d.uploadDate}</span>
                  <span><HiOutlineUser /> {d.uploadedBy}</span>
                  <span><HiOutlineEye /> {d.views}</span>
                  <span><HiOutlineDownload /> {d.downloads}</span>
                </div>
              </div>
              <div className="doc-actions">
                <button className="view-btn" onClick={() => handleView(d)} title="Ko'rish">
                  <HiOutlineEye />
                </button>
                <button className="download-btn" onClick={() => handleDownload(d)} title="Yuklab olish">
                  <HiOutlineDownload />
                </button>
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(d)} title="Tahrirlash">
                      <HiOutlinePencil />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(d.id)} title="O'chirish">
                      <HiOutlineTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ko'rish modal */}
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
              <div className="doc-details">
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
                  <span className="detail-value">{selectedDoc.uploadDate}</span>
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
                {selectedDoc.description && (
                  <div className="detail-row">
                    <span className="detail-label">Tavsif:</span>
                    <span className="detail-value">{selectedDoc.description}</span>
                  </div>
                )}
              </div>
              <div className="doc-preview">
                <div className="preview-placeholder">
                  {getTypeIcon(selectedDoc.type)}
                  <p>{selectedDoc.type} fayl</p>
                  <button className="download-btn-large" onClick={() => handleDownload(selectedDoc)}>
                    <HiOutlineDownload /> Yuklab olish
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Qo'shish/Tahrirlash modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDoc?.id ? 'Hujjat tahrirlash' : 'Yangi hujjat yuklash'}</h2>
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