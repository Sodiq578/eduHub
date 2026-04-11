import React, { useState, useRef, useEffect } from 'react';
import { 
  HiOutlineChat, 
  HiOutlineX, 
  HiOutlinePaperAirplane, 
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineCash,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineChevronRight,
  HiOutlineQuestionMarkCircle,
  HiOutlineStar,
  HiOutlineClock
} from 'react-icons/hi';
import './AiAssistant.css';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Assalomu alaykum! 👋\n\nMen EduManage yordamchisiman.\n\nMaktab haqidagi barcha ma'lumotlarni bera olaman:\n\n• Jami o'quvchilar soni\n• Davomat statistikasi\n• Eng yaxshi o'quvchilar\n• To'lovlar holati\n• Sinflar haqida ma'lumot\n• Umumiy statistika\n\nSavolingizni yozing, tezda javob beraman! 💬", 
      sender: 'ai', 
      time: new Date().toLocaleTimeString() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const quickTimeoutRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleQuickMouseEnter = () => {
    if (quickTimeoutRef.current) clearTimeout(quickTimeoutRef.current);
    setIsQuickOpen(true);
  };

  const handleQuickMouseLeave = () => {
    quickTimeoutRef.current = setTimeout(() => {
      setIsQuickOpen(false);
    }, 300);
  };

  const getSchoolData = () => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes') || '[]');
    return { students, teachers, payments, attendance, classes };
  };

  const generateResponse = (question) => {
    const data = getSchoolData();
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('salom') || lowerQuestion.includes('assalom') || lowerQuestion.includes('hey')) {
      return "👋 Assalomu alaykum! Maktab boshqaruv tizimiga xush kelibsiz.\n\nSizga qanday yordam bera olaman?\n\nQuyidagi savollarni berishingiz mumkin:\n\n• Jami nechta o'quvchi bor?\n• Bugungi davomat qanday?\n• Eng yaxshi o'quvchilar kimlar?\n• To'lovlar holati qanday?\n• Umumiy statistika\n\nSavolingizni yozing!";
    }
    
    if (lowerQuestion.includes('nechta o\'quvchi') || lowerQuestion.includes('jami o\'quvchi')) {
      const activeCount = data.students.filter(s => s.status === 'active').length;
      return `📊 Jami o'quvchilar: ${data.students.length} nafar\n\n✅ Aktiv o'quvchilar: ${activeCount} nafar\n❌ Noaktiv o'quvchilar: ${data.students.length - activeCount} nafar`;
    }
    
    if (lowerQuestion.includes('nechta o\'qituvchi') || lowerQuestion.includes('jami o\'qituvchi')) {
      return `👩‍🏫 Jami o'qituvchilar: ${data.teachers.length} nafar`;
    }
    
    if (lowerQuestion.includes('davomat')) {
      const present = data.attendance.filter(a => a.status === 'present').length;
      const total = data.attendance.length;
      const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
      return `📅 Davomat statistikasi:\n\n✅ Kelganlar: ${present} (${percent}%)\n📊 Jami: ${total} o'quvchi`;
    }
    
    if (lowerQuestion.includes('eng yaxshi o\'quvchi') || lowerQuestion.includes('top o\'quvchi')) {
      const topStudents = [...data.students].sort((a, b) => b.grade - a.grade).slice(0, 5);
      if (topStudents.length > 0) {
        let response = "🏆 Eng yaxshi 5 o'quvchi:\n\n";
        topStudents.forEach((s, i) => {
          response += `${i+1}. ${s.name} - ${s.grade}% (${s.class})\n`;
        });
        return response;
      }
      return "Hozircha ma'lumot yo'q.";
    }
    
    if (lowerQuestion.includes('to\'lov') || lowerQuestion.includes('qarzdorlik')) {
      const paid = data.payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
      const pending = data.payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
      return `💰 To'lovlar statistikasi:\n\n✅ To'langan: ${paid.toLocaleString()} so'm\n⏳ Kutilayotgan: ${pending.toLocaleString()} so'm`;
    }
    
    if (lowerQuestion.includes('sinf') || lowerQuestion.includes('sinflar')) {
      if (data.classes.length === 0) return "Hozircha sinf ma'lumotlari mavjud emas.";
      let response = "📚 Sinflar haqida ma'lumot:\n\n";
      data.classes.forEach(c => {
        response += `🏫 ${c.name}\n   • O'quvchilar: ${c.students}\n   • O'rtacha baho: ${c.average}%\n   • Sinf rahbari: ${c.teacher}\n\n`;
      });
      return response;
    }
    
    if (lowerQuestion.includes('statistika') || lowerQuestion.includes('umumiy')) {
      const avgGrade = (data.students.reduce((s, st) => s + st.grade, 0) / (data.students.length || 1)).toFixed(1);
      const attendanceRate = data.attendance.length > 0 ? ((data.attendance.filter(a => a.status === 'present').length / data.attendance.length) * 100).toFixed(1) : 0;
      const totalPayments = data.payments.reduce((s, p) => s + p.amount, 0);
      
      return `📊 Maktab umumiy statistikasi:\n\n👨‍🎓 O'quvchilar: ${data.students.length} nafar\n👩‍🏫 O'qituvchilar: ${data.teachers.length} nafar\n📚 Sinflar: ${data.classes.length} ta\n\n⭐ O'rtacha baho: ${avgGrade}%\n📅 Davomat: ${attendanceRate}%\n💰 Jami to'lovlar: ${totalPayments.toLocaleString()} so'm`;
    }
    
    if (lowerQuestion.includes('yordam') || lowerQuestion.includes('help')) {
      return "🤖 Men sizga quyidagi savollarga javob bera olaman:\n\n📌 Jami nechta o'quvchi bor?\n📌 Jami nechta o'qituvchi bor?\n📌 Bugungi davomat qanday?\n📌 Eng yaxshi o'quvchilar kimlar?\n📌 To'lovlar holati qanday?\n📌 Sinflar haqida ma'lumot\n📌 Umumiy statistika\n\n💡 Savolingizni oddiy tilda yozishingiz mumkin!";
    }
    
    return "🤔 Kechirasiz, savolingizni to'liq tushunmadim.\n\n📋 Men quyidagi savollarga javob bera olaman:\n\n• Jami nechta o'quvchi bor?\n• Bugungi davomat qanday?\n• Eng yaxshi o'quvchilar kimlar?\n• To'lovlar holati qanday?\n• Umumiy statistika\n\n✏️ Savolingizni aniqroq yozib ko'ring yoki 'yordam' deb yozing.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateResponse(question);
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        time: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Assalomu alaykum! 👋\n\nMen EduManage yordamchisiman.\n\nMaktab haqidagi barcha ma'lumotlarni bera olaman:\n\n• Jami o'quvchilar soni\n• Davomat statistikasi\n• Eng yaxshi o'quvchilar\n• To'lovlar holati\n• Sinflar haqida ma'lumot\n• Umumiy statistika\n\nSavolingizni yozing, tezda javob beraman! 💬",
      sender: 'ai',
      time: new Date().toLocaleTimeString()
    }]);
  };

  const quickQuestions = [
    { text: "Jami nechta o'quvchi bor?", icon: <HiOutlineUsers /> },
    { text: "Bugungi davomat qanday?", icon: <HiOutlineCalendar /> },
    { text: "Eng yaxshi o'quvchilar?", icon: <HiOutlineStar /> },
    { text: "To'lovlar holati?", icon: <HiOutlineCash /> },
    { text: "Sinflar haqida", icon: <HiOutlineAcademicCap /> },
    { text: "Umumiy statistika", icon: <HiOutlineChartBar /> }
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
    setIsQuickOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <button className="ai-assistant-btn" onClick={() => setIsOpen(true)}>
          <HiOutlineChat />
          <span className="ai-badge">AI</span>
        </button>
      )}

      {isOpen && (
        <>
          <div 
            className={`ai-quick-sidebar ${isQuickOpen ? 'open' : ''}`}
            onMouseEnter={handleQuickMouseEnter}
            onMouseLeave={handleQuickMouseLeave}
          >
            <div className="quick-sidebar-trigger">
              <HiOutlineChevronRight className={`trigger-icon ${isQuickOpen ? 'rotated' : ''}`} />
              <span className="trigger-text">Tezkor savollar</span>
              <HiOutlineQuestionMarkCircle className="trigger-question" />
            </div>
            <div className="quick-sidebar-content">
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="quick-sidebar-btn"
                  onClick={() => handleQuickQuestion(q.text)}
                >
                  <span className="btn-icon">{q.icon}</span>
                  <span className="btn-text">{q.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ai-assistant-window">
            <div className="ai-header">
              <div className="ai-header-info">
                <div className="ai-avatar">🤖</div>
                <div>
                  <h3>EduManage Yordamchi</h3>
                  <p>AI Assistant • 24/7</p>
                </div>
              </div>
              <div className="ai-header-actions">
                <button onClick={clearChat} title="Tozalash">
                  <HiOutlineTrash />
                </button>
                <button onClick={() => setIsOpen(false)} title="Yopish">
                  <HiOutlineX />
                </button>
              </div>
            </div>

            <div className="ai-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`ai-message ${msg.sender}`}>
                  <div className="message-bubble">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      <HiOutlineClock className="time-icon" />
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="ai-message ai">
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                      <span className="typing-text">Yozmoqda</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-input">
              <input
                type="text"
                placeholder="Savolingizni yozing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
                <HiOutlinePaperAirplane />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AiAssistant;