const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const getAIResponse = async (prompt, context = '') => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Siz EduManage maktab boshqaruv tizimining yordamchi AI assisentisiz. 
            Sizga quyidagi ma'lumotlar bilan ishlash kerak: ${context}
            Siz faqat maktab, o'quvchilar, o'qituvchilar, baholar, davomat, to'lovlar va 
            boshqa maktab bilan bog'liq savollarga javob berasiz.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI xatosi:', error);
    return "Kechirasiz, hozircha javob bera olmayapman. Iltimos, keyinroq urinib ko'ring.";
  }
};

// O'quvchi haqida ma'lumot olish
export const getStudentInfo = async (studentName, studentsData) => {
  const context = JSON.stringify(studentsData);
  const prompt = `O'quvchi ${studentName} haqida batafsil ma'lumot bering. Uning sinfi, o'rtacha bahosi, davomati va to'lov holati haqida yozing.`;
  return await getAIResponse(prompt, context);
};

// Hisobot yaratish
export const generateReport = async (type, data) => {
  const context = JSON.stringify(data);
  const prompts = {
    academic: "O'quvchilarning akademik ko'rsatkichlari haqida batafsil hisobot tuzing.",
    attendance: "Davomat statistikasi haqida tahliliy hisobot tuzing.",
    financial: "To'lovlar va moliyaviy holat haqida hisobot tuzing.",
    general: "Maktab faoliyati haqida umumiy hisobot tuzing."
  };
  return await getAIResponse(prompts[type] || prompts.general, context);
};

// Tavsiyalar olish
export const getRecommendations = async (studentName, grades, attendance) => {
  const context = JSON.stringify({ grades, attendance });
  const prompt = `O'quvchi ${studentName} uchun o'quv faoliyatini yaxshilash bo'yicha 3-5 ta tavsiya bering. Uning baholari: ${grades}, davomati: ${attendance}%.`;
  return await getAIResponse(prompt, context);
};