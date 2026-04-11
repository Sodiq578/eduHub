import React, { useState, useEffect } from 'react';
import { 
  HiOutlineSearch, 
  HiOutlinePlus, 
  HiOutlineBookOpen, 
  HiOutlineUser, 
  HiOutlineCalendar, 
  HiOutlineTrash, 
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineFilter
} from 'react-icons/hi';
import './Library.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('library_books');
    if (stored) {
      setBooks(JSON.parse(stored));
    } else {
      const defaultBooks = [
        { id: 1, title: 'Matematika 10-sinf', author: 'Sh. Ahmedova', isbn: '978-9943-01-001', quantity: 15, available: 12, category: 'Darslik', location: 'A-1', addedDate: '2024-09-01' },
        { id: 2, title: 'Fizika asoslari', author: 'R. Karimov', isbn: '978-9943-01-002', quantity: 10, available: 8, category: 'Darslik', location: 'A-2', addedDate: '2024-09-01' },
        { id: 3, title: 'Ingliz tili grammatikasi', author: 'G. Saidova', isbn: '978-9943-01-003', quantity: 20, available: 18, category: 'Qo\'llanma', location: 'B-1', addedDate: '2024-09-01' },
        { id: 4, title: 'O\'zbek adabiyoti antologiyasi', author: 'A. Qodiriy', isbn: '978-9943-01-004', quantity: 8, available: 5, category: 'Badiiy', location: 'C-1', addedDate: '2024-09-01' },
      ];
      setBooks(defaultBooks);
      localStorage.setItem('library_books', JSON.stringify(defaultBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  const handleAdd = () => {
    setEditingBook({
      title: '',
      author: '',
      isbn: '',
      quantity: 1,
      available: 1,
      category: 'Darslik',
      location: '',
      addedDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!editingBook.title || !editingBook.author || !editingBook.isbn) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    let updatedBooks;
    if (editingBook.id) {
      updatedBooks = books.map(b => b.id === editingBook.id ? editingBook : b);
      alert('Kitob ma\'lumotlari yangilandi!');
    } else {
      const newBook = { ...editingBook, id: Date.now() };
      updatedBooks = [...books, newBook];
      alert('Yangi kitob qo\'shildi!');
    }
    
    setBooks(updatedBooks);
    setShowModal(false);
    setEditingBook(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Kitobni o\'chirmoqchimisiz? Bu amalni qaytarib bo\'lmaydi!')) {
      setBooks(books.filter(b => b.id !== id));
      alert('Kitob o\'chirildi!');
    }
  };

  const categories = ['Barchasi', 'Darslik', 'Qo\'llanma', 'Badiiy', 'Lug\'at', 'Ensiklopediya'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.isbn.includes(searchTerm);
    const matchesCategory = categoryFilter === '' || categoryFilter === 'Barchasi' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.available, 0);
  const borrowedBooks = totalBooks - availableBooks;

  return (
    <div className="library-page">
      <div className="page-header">
        <div>
          <h1>Kutubxona</h1>
          <p>Jami {totalBooks} ta kitob | {availableBooks} ta mavjud | {borrowedBooks} ta o'qilmoqda</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <HiOutlinePlus /> Yangi kitob
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <HiOutlineSearch />
          <input 
            type="text" 
            placeholder="Kitob nomi, muallif yoki ISBN bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="library-stats">
        <div className="stat-card">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">Jami kitoblar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{availableBooks}</div>
          <div className="stat-label">Mavjud</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{borrowedBooks}</div>
          <div className="stat-label">O'qilmoqda</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{books.length}</div>
          <div className="stat-label">Nomi</div>
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <HiOutlineBookOpen size={48} />
            <p>Hech qanday kitob topilmadi</p>
            <button className="btn-primary" onClick={handleAdd}>Yangi kitob qo'shish</button>
          </div>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-icon">
                <HiOutlineBookOpen />
              </div>
              <h3>{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <p className="book-isbn">ISBN: {book.isbn}</p>
              <div className="book-stats">
                <span className="book-category">📚 {book.category}</span>
                <span className={`book-available ${book.available === 0 ? 'out-of-stock' : ''}`}>
                  📖 {book.available}/{book.quantity}
                </span>
              </div>
              <div className="book-location">
                📍 Joylashuv: {book.location || 'Belgilanmagan'}
              </div>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>
                  <HiOutlinePencil /> Tahrirlash
                </button>
                <button className="delete-btn" onClick={() => handleDelete(book.id)}>
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
              <h2>{editingBook?.id ? 'Kitob ma\'lumotlarini tahrirlash' : 'Yangi kitob qo\'shish'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <HiOutlineX />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Kitob nomi *</label>
                  <input 
                    type="text" 
                    placeholder="Kitob nomi" 
                    value={editingBook?.title || ''} 
                    onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Muallif *</label>
                  <input 
                    type="text" 
                    placeholder="Muallif ismi" 
                    value={editingBook?.author || ''} 
                    onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISBN *</label>
                  <input 
                    type="text" 
                    placeholder="ISBN raqami" 
                    value={editingBook?.isbn || ''} 
                    onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Kategoriya</label>
                  <select 
                    value={editingBook?.category || 'Darslik'} 
                    onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                  >
                    <option value="Darslik">Darslik</option>
                    <option value="Qo\'llanma">Qo\'llanma</option>
                    <option value="Badiiy">Badiiy</option>
                    <option value="Lug\'at">Lug\'at</option>
                    <option value="Ensiklopediya">Ensiklopediya</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jami nusxa</label>
                  <input 
                    type="number" 
                    placeholder="1" 
                    value={editingBook?.quantity || 1} 
                    onChange={(e) => setEditingBook({ ...editingBook, quantity: parseInt(e.target.value) || 0, available: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="form-group">
                  <label>Joylashuv</label>
                  <input 
                    type="text" 
                    placeholder="Masalan: A-1" 
                    value={editingBook?.location || ''} 
                    onChange={(e) => setEditingBook({ ...editingBook, location: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleSave}>
                {editingBook?.id ? 'Yangilash' : 'Qo\'shish'}
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

export default Library;