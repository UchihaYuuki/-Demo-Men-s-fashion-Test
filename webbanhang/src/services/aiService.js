// src/services/aiService.js
import axios from 'axios';

// Cấu hình AI - ĐÃ CẬP NHẬT MODEL MỚI NHẤT
const AI_CONFIG = {
  provider: 'gemini',
  apiKey: process.env.REACT_APP_AI_API_KEY || 'AIzaSyD26bQsXkytXOTing3JkuqKLObumtP069U',
  model: 'gemini-2.5-flash', // ĐÃ SỬA: dùng model mới nhất
  temperature: 0.7,
  maxTokens: 500
};

// API endpoints - CẬP NHẬT CHO MODEL MỚI
const API_ENDPOINTS = {
  // Các model mới nhất
  gemini25Flash: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  gemini25Pro: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
  gemini20Flash: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
  gemini20FlashLite: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent',
  
  // Fallback (giữ lại để an toàn)
  gemini15Pro: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
  geminiPro: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
  
  // OpenAI
  openai: 'https://api.openai.com/v1/chat/completions'
};

// Hệ thống prompt - GIỮ NGUYÊN
const SYSTEM_PROMPT = `Bạn là trợ lý ảo của YuuKi Fashion - thương hiệu thời trang nam hàng đầu Việt Nam.

KIẾN THỨC VỀ SẢN PHẨM:
- Áo Polo: GSTP846 (294.100đ), GSTP845 (424.150đ), GSTP068 (250.000đ), GSTP051 (299.000đ), GSTP642 (240.000đ)
- Áo Thun: GSTS018 (249.000đ), FSTS026 (250.000đ), FSTS020 (250.000đ), FSTS002 (250.000đ)
- Quần Jeans: GABJ861 (285.000đ), EABJ012 (250.000đ), GABJ844 (480.000đ)
- Quần Short: GSBW005 (280.000đ), FSBK010 (220.000đ)
- Áo Khoác: EWCP001 (350.000đ), EWCU001 (1.250.000đ)

QUY TẮC TƯ VẤN SIZE:
- Chiều cao < 160cm, cân nặng < 50kg: Size S
- Chiều cao < 165cm, cân nặng < 55kg: Size S
- Chiều cao < 165cm, cân nặng 55-65kg: Size M
- Chiều cao < 170cm, cân nặng < 55kg: Size M
- Chiều cao < 170cm, cân nặng 55-65kg: Size L
- Chiều cao < 175cm, cân nặng < 60kg: Size M
- Chiều cao < 175cm, cân nặng 60-70kg: Size L
- Chiều cao < 180cm, cân nặng < 65kg: Size L
- Chiều cao < 180cm, cân nặng 65-75kg: Size XL
- Chiều cao > 180cm, cân nặng < 70kg: Size XL
- Chiều cao > 180cm, cân nặng > 70kg: Size XXL

KHUYẾN MÃI HIỆN TẠI:
- Giảm 50% áo khoác mùa đông
- Mua 2 áo thun giảm 20%
- Freeship đơn từ 500k

THÔNG TIN LIÊN HỆ:
- Hotline: 0369788865
- Email: nguyenducphuong2k4hp@gmail.com
- Địa chỉ: Thái Sơn, An Lão, Hải Phòng

HƯỚNG DẪN:
1. Trả lời ngắn gọn, thân thiện
2. Tư vấn size dựa trên chiều cao/cân nặng
3. Gợi ý sản phẩm phù hợp
4. Hỗ trợ đặt hàng
5. Giới thiệu khuyến mãi

KHÔNG được trả lời các câu hỏi ngoài lĩnh vực thời trang.`;

// Hàm kiểm tra có nên dùng AI không
const shouldUseAI = (message) => {
  const lowerMsg = message.toLowerCase();
  
  const skipAIPatterns = [
    'size', 'kích thước', 'cỡ',
    'đặt', 'mua', 'thanh toán',
    'liên hệ', 'địa chỉ', 'hotline',
    'khuyến mãi', 'sale', 'giảm giá',
    'áo', 'quần', 'tìm', 'xem',
    'giá', 'bao nhiêu'
  ];

  if (skipAIPatterns.some(pattern => lowerMsg.includes(pattern))) {
    return false;
  }

  const useAIPatterns = [
    'xin chào', 'chào', 'hello', 'hi',
    'cảm ơn', 'thanks',
    'tạm biệt', 'bye',
    'bạn là ai',
    'làm gì',
    'giới thiệu',
    'tư vấn'
  ];

  return useAIPatterns.some(pattern => lowerMsg.includes(pattern));
};

// Hàm gọi OpenAI API
const callOpenAIAPI = async (userMessage, chatHistory = []) => {
  try {
    console.log('📡 Đang gọi OpenAI API...');
    
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: userMessage }
    ];

    const response = await axios.post(
      API_ENDPOINTS.openai,
      {
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
};

// Hàm gọi API custom
const callCustomAPI = async (userMessage) => {
  try {
    console.log('📡 Đang gọi Custom API...');
    
    const response = await axios.post(
      'http://localhost:5000/api/chatbot/ai',
      { message: userMessage },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );
    
    return response.data.reply || response.data.message || null;
  } catch (error) {
    console.error('Custom AI error:', error);
    return null;
  }
};

// Hàm gọi Gemini API với model mới nhất
const callGeminiAPI = async (userMessage, chatHistory = []) => {
  // Danh sách các endpoint - ƯU TIÊN MODEL MỚI NHẤT
  const endpointsToTry = [
    {
      name: 'Gemini 2.5 Flash',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${AI_CONFIG.apiKey}`
    },
    {
      name: 'Gemini 2.5 Pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${AI_CONFIG.apiKey}`
    },
    {
      name: 'Gemini 2.0 Flash',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${AI_CONFIG.apiKey}`
    },
    {
      name: 'Gemini 2.0 Flash Lite',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${AI_CONFIG.apiKey}`
    },
    // Fallback
    {
      name: 'Gemini 1.5 Pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${AI_CONFIG.apiKey}`
    },
    {
      name: 'Gemini Pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${AI_CONFIG.apiKey}`
    }
  ];

  // Tạo prompt
  let historyText = "";
  if (chatHistory && chatHistory.length > 0) {
    historyText = "\n\nLịch sử trò chuyện:\n";
    chatHistory.slice(-3).forEach(msg => {
      historyText += `${msg.type === 'user' ? 'Người dùng' : 'Bot'}: ${msg.text}\n`;
    });
  }
  
  const fullPrompt = SYSTEM_PROMPT + historyText + "\n\nNgười dùng: " + userMessage + "\n\nBot:";

  // Thử từng endpoint
  for (const endpoint of endpointsToTry) {
    try {
      console.log(`📡 Đang thử ${endpoint.name}...`);
      
      const response = await axios.post(
        endpoint.url,
        {
          contents: [
            {
              parts: [
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: AI_CONFIG.maxTokens,
            topP: 0.95
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        console.log(`✅ ${endpoint.name} thành công!`);
        const text = response.data.candidates[0]?.content?.parts[0]?.text;
        if (text) return text;
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name} thất bại:`, error.response?.status || error.message);
      // Tiếp tục thử endpoint tiếp theo
    }
  }

  console.log('❌ Tất cả các endpoint đều thất bại');
  return null;
};

// Hàm kiểm tra kết nối AI - CẬP NHẬT VỚI MODEL MỚI
export const testAIConnection = async () => {
  try {
    console.log('🔍 Đang kiểm tra kết nối Gemini API...');
    console.log('🔑 API Key:', AI_CONFIG.apiKey ? '✅ Đã có' : '❌ Chưa có');
    
    // Thử lấy danh sách models
    try {
      console.log('📡 Đang lấy danh sách models khả dụng...');
      const modelsResponse = await axios.get(
        `https://generativelanguage.googleapis.com/v1/models?key=${AI_CONFIG.apiKey}`
      );
      
      if (modelsResponse.data && modelsResponse.data.models) {
        console.log('✅ Các models khả dụng:');
        modelsResponse.data.models.forEach(model => {
          console.log(`  - ${model.name} (${model.supportedGenerationMethods?.join(', ')})`);
        });
      }
    } catch (error) {
      console.log('❌ Không thể lấy danh sách models');
    }

    // Test với model mới nhất
    const testEndpoints = [
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${AI_CONFIG.apiKey}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${AI_CONFIG.apiKey}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${AI_CONFIG.apiKey}`
    ];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`📡 Testing endpoint: ${endpoint.split('?')[0]}`);
        
        const response = await axios.post(
          endpoint,
          {
            contents: [
              {
                parts: [
                  {
                    text: "Xin chào, hãy trả lời 'OK'"
                  }
                ]
              }
            ]
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000
          }
        );

        if (response.data && response.data.candidates) {
          console.log('✅ Kết nối thành công với endpoint này!');
          return true;
        }
      } catch (error) {
        console.log(`❌ Endpoint thất bại: ${error.response?.status || error.message}`);
      }
    }

    return false;
  } catch (error) {
    console.error('❌ Lỗi kết nối AI:', error.message);
    return false;
  }
};

// Hàm xử lý chính
export const getAIResponse = async (userMessage, chatHistory = []) => {
  try {
    if (!shouldUseAI(userMessage)) {
      console.log('🤖 Không dùng AI cho message này (dùng rule-based)');
      return null;
    }

    console.log('🤖 Đang gọi AI cho message:', userMessage);

    let aiResponse = null;

    switch (AI_CONFIG.provider) {
      case 'gemini':
        aiResponse = await callGeminiAPI(userMessage, chatHistory);
        break;
      case 'openai':
        aiResponse = await callOpenAIAPI(userMessage, chatHistory);
        break;
      case 'custom':
        aiResponse = await callCustomAPI(userMessage);
        break;
      default:
        aiResponse = null;
    }

    if (aiResponse) {
      console.log('✅ AI response nhận được');
      return aiResponse;
    }

    return null;
  } catch (error) {
    console.error('AI service error:', error);
    return null;
  }
};