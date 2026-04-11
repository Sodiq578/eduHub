import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlineChartBar, 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineStar, 
  HiOutlineTrash, 
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineFilter,
  HiOutlineDownload
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Surveys.css';

const Surveys = () => {
  const { user, roles } = useAuth();
  const [surveys, setSurveys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  // Load surveys
  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = () => {
    const stored = localStorage.getItem('surveys');
    if (stored) {
      setSurveys(JSON.parse(stored));
    } else {
      const defaultSurveys = [
        { 
          id: 1, 
          title: 'Maktab sifati', 
          questions: ['Siz maktab sifatidan mamunmisiz?', 'O\'qituvchilar bilim darajasi qanday?', 'Maktab jihozlari yetarlimi?'], 
          responses: 45, 
          average: 4.5,
          createdDate: '2024-11-01',
          status: 'active',
          author: 'Administrator'
        },
        { 
          id: 2, 
          title: 'Kantina xizmati', 
          questions: ['Ovqat sifati qanday?', 'Narxlar maqbulmi?', 'Xizmat ko\'rsatish tezligi?'], 
          responses: 32, 
          average: 4.2,
          createdDate: '2024-11-15',
          status: 'active',
          author: 'Administrator'
        },
        { 
          id: 3, 
          title: 'Masofaviy ta\'lim', 
          questions: ['Onlayn darslar sifati?', 'Platforma qulaymi?', 'Internet tezligi yetarlimi?'], 
          responses: 28, 
          average: 4.0,
          createdDate: '2024-11-20',
          status: 'inactive',
          author: 'Administrator'
        },
      ];
      setSurveys(defaultSurveys);
      localStorage.setItem('surveys', JSON.stringify(defaultSurveys));
    }
  };

  // Save surveys
  const saveSurveys = (updatedSurveys) => {
    setSurveys(updatedSurveys);
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys));
  };

  const isAdmin = user?.role === roles.ADMIN;

  // Yangi so'rovnoma qo'shish
  const handleAddSurvey = () => {
    setEditingSurvey({
      title: '',
      questions: [''],
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  // So'rovnomani tahrirlash
  const handleEditSurvey = (survey) => {
    setEditingSurvey({ ...survey });
    setShowModal(true);
  };

  // So'rovnomani saqlash
  const handleSaveSurvey = () => {
    if (!editingSurvey.title || !editingSurvey.title.trim()) {
      alert('Iltimos, so\'rovnoma sarlavhasini kiriting!');
      return;
    }
    if (!editingSurvey.questions || editingSurvey.questions.length === 0 || !editingSurvey.questions[0].trim()) {
      alert('Iltimos, kamida bitta savol kiriting!');
      return;
    }

    const filteredQuestions = editingSurvey.questions.filter(q => q.trim());
    const newAverage = editingSurvey.average || 0;

    let updatedSurveys;
    if (editingSurvey.id) {
      updatedSurveys = surveys.map(s => s.id === editingSurvey.id ? 
        { ...editingSurvey, questions: filteredQuestions, average: newAverage } : s);
      alert("So'rovnoma yangilandi!");
    } else {
      const newSurvey = {
        ...editingSurvey,
        id: Date.now(),
        questions: filteredQuestions,
        responses: 0,
        average: 0,
        createdDate: new Date().toISOString().split('T')[0],
        author: user?.name || 'Administrator'
      };
      updatedSurveys = [newSurvey, ...surveys];
      alert("Yangi so'rovnoma qo'shildi!");
    }
    
    saveSurveys(updatedSurveys);
    setShowModal(false);
    setEditingSurvey(null);
  };

  // So'rovnomani o'chirish
  const handleDeleteSurvey = (id) => {
    if (window.confirm('So\'rovnomani o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      const updatedSurveys = surveys.filter(s => s.id !== id);
      saveSurveys(updatedSurveys);
      alert("So'rovnoma o'chirildi!");
    }
  };

  // So'rovnoma holatini o'zgartirish
  const toggleStatus = (id) => {
    const updatedSurveys = surveys.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
    );
    saveSurveys(updatedSurveys);
  };

  // Savol qo'shish
  const addQuestion = () => {
    setEditingSurvey({
      ...editingSurvey,
      questions: [...(editingSurvey?.questions || []), '']
    });
  };

  // Savolni o'chirish
  const removeQuestion = (index) => {
    const newQuestions = editingSurvey.questions.filter((_, i) => i !== index);
    setEditingSurvey({ ...editingSurvey, questions: newQuestions });
  };

  // Savolni yangilash
  const updateQuestion = (index, value) => {
    const newQuestions = [...editingSurvey.questions];
    newQuestions[index] = value;
    setEditingSurvey({ ...editingSurvey, questions: newQuestions });
  };

  // So'rovnoma detallarini ko'rish
  const viewDetails = (survey) => {
    setSelectedSurvey(survey);
    setShowDetailsModal(true);
  };

  // So'rovnomalarni filtrlash
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || 
      (filterRating === 'high' && survey.average >= 4.5) ||
      (filterRating === 'medium' && survey.average >= 3.5 && survey.average < 4.5) ||
      (filterRating === 'low' && survey.average < 3.5);
    return matchesSearch && matchesRating;
  });

  // Statistikalar
  const totalResponses = surveys.reduce((sum, s) => sum + s.responses, 0);
  const avgRating = surveys.reduce((sum, s) => sum + s.average, 0) / surveys.length || 0;
  const activeSurveys = surveys.filter(s => s.status === 'active').length;

  // Eksport qilish
  const exportToCSV = () => {
    const headers = ['ID', 'Sarlavha', 'Savollar', 'Javoblar', 'O\'rtacha reyting', 'Holat', 'Sana', 'Muallif'];
    const csvData = surveys.map(s => [
      s.id, s.title, s.questions.join('; '), s.responses, s.average, 
      s.status === 'active' ? 'Aktiv' : 'Noaktiv', s.createdDate, s.author
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surveys_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reyting bo'yicha rang
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10b981';
    if (rating >= 3.5) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="surveys-page">
      <div className="page-header">
        <div>
          <h1>So'rovnomalar va Feedback</h1>
          <p>Fikr-mulohazalarni yig'ish va tahlil qilish</p>
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button className="btn-primary" onClick={handleAddSurvey}>
              <HiOutlinePlus /> Yangi so'rovnoma
            </button>
          )}
          <button className="btn-export" onClick={exportToCSV}>
            <HiOutlineDownload /> Hisobot
          </button>
        </div>
      </div>

      {/* Statistik kartalar */}
      <div className="surveys-stats">
        <div className="stat-card">
          <div className="stat-value">{surveys.length}</div>
          <div className="stat-label">So'rovnomalar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeSurveys}</div>
          <div className="stat-label">Aktiv</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalResponses}</div>
          <div className="stat-label">Jami javoblar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgRating.toFixed(1)}</div>
          <div className="stat-label">O'rtacha reyting</div>
        </div>
      </div>

      {/* Filterlar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="So'rovnoma qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <HiOutlineFilter />
          <select className="filter-select" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="all">Barcha reytinglar</option>
            <option value="high">Yuqori (4.5+)</option>
            <option value="medium">O'rta (3.5-4.5)</option>
            <option value="low">Past (3.5 dan past)</option>
          </select>
        </div>
      </div>

      {/* So'rovnomalar grid */}
      <div className="surveys-grid">
        {filteredSurveys.length === 0 ? (
          <div className="empty-state">
            <HiOutlineChartBar size={48} />
            <h3>Hech qanday so'rovnoma yo'q</h3>
            <p>Hali hech qanday so'rovnoma qo'shilmagan</p>
            {isAdmin && (
              <button className="btn-primary" onClick={handleAddSurvey}>
                <HiOutlinePlus /> Birinchi so'rovnomani qo'shish
              </button>
            )}
          </div>
        ) : (
          filteredSurveys.map(survey => (
            <div key={survey.id} className="survey-card">
              <div className="survey-header">
                <h3>{survey.title}</h3>
                <div className="survey-badges">
                  <span className={`status-badge ${survey.status}`}>
                    {survey.status === 'active' ? 'Aktiv' : 'Noaktiv'}
                  </span>
                  <span className="survey-rating" style={{ background: `${getRatingColor(survey.average)}15`, color: getRatingColor(survey.average) }}>
                    <HiOutlineStar /> {survey.average}
                  </span>
                </div>
              </div>
              <p className="survey-responses">
                <HiOutlineUser /> {survey.responses} ta javob | <HiOutlineCalendar /> {survey.createdDate}
              </p>
              <div className="survey-questions">
                {survey.questions.slice(0, 2).map((q, idx) => (
                  <div key={idx} className="question-item">• {q.length > 60 ? q.substring(0, 60) + '...' : q}</div>
                ))}
                {survey.questions.length > 2 && (
                  <div className="question-more">+{survey.questions.length - 2} ta savol</div>
                )}
              </div>
              <div className="survey-actions">
                <button className="view-btn" onClick={() => viewDetails(survey)}>
                  <HiOutlineEye /> Ko'rish
                </button>
                {isAdmin && (
                  <>
                    <button className="edit-btn" onClick={() => handleEditSurvey(survey)}>
                      <HiOutlinePencil /> Tahrirlash
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteSurvey(survey.id)}>
                      <HiOutlineTrash /> O'chirish
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* So'rovnoma qo'shish/tahrirlash modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSurvey?.id ? 'So\'rovnoma tahrirlash' : 'Yangi so\'rovnoma'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Sarlavha *</label>
                <input 
                  type="text" 
                  placeholder="So'rovnoma sarlavhasi" 
                  value={editingSurvey?.title || ''} 
                  onChange={(e) => setEditingSurvey({ ...editingSurvey, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Savollar *</label>
                {editingSurvey?.questions?.map((q, index) => (
                  <div key={index} className="question-input-group">
                    <input 
                      type="text" 
                      placeholder={`${index + 1}-savol`} 
                      value={q}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                    />
                    {editingSurvey.questions.length > 1 && (
                      <button type="button" className="remove-question" onClick={() => removeQuestion(index)}>
                        <HiOutlineTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-question-btn" onClick={addQuestion}>
                  <HiOutlinePlus /> Savol qo'shish
                </button>
              </div>
              {editingSurvey?.id && (
                <div className="form-group">
                  <label>Holat</label>
                  <select 
                    value={editingSurvey?.status || 'active'} 
                    onChange={(e) => setEditingSurvey({ ...editingSurvey, status: e.target.value })}
                  >
                    <option value="active">Aktiv</option>
                    <option value="inactive">Noaktiv</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSaveSurvey}>
                {editingSurvey?.id ? 'Yangilash' : 'Qo\'shish'}
              </button>
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* So'rovnoma detallari modal */}
      {showDetailsModal && selectedSurvey && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedSurvey.title}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="details-info">
                <div className="info-item">
                  <HiOutlineCalendar /> Yaratilgan: {selectedSurvey.createdDate}
                </div>
                <div className="info-item">
                  <HiOutlineUser /> Muallif: {selectedSurvey.author}
                </div>
                <div className="info-item">
                  <HiOutlineChartBar /> Jami javoblar: {selectedSurvey.responses}
                </div>
                <div className="info-item">
                  <HiOutlineStar /> O'rtacha reyting: {selectedSurvey.average}
                </div>
              </div>
              <div className="details-questions">
                <h3>Savollar:</h3>
                {selectedSurvey.questions.map((q, idx) => (
                  <div key={idx} className="detail-question">
                    <span className="question-number">{idx + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
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
    </div>
  );
};

export default Surveys;