// src/components/common/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsArray } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { getAIResponse, testAIConnection } from '../../services/aiService';
import '../../styles/ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState('greeting');
  const [aiEnabled, setAiEnabled] = useState(false); // THÊM: trạng thái AI
  const [aiAvailable, setAiAvailable] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: '',
    height: '',
    weight: '',
    size: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // THÊM: Tự động kết nối AI khi component mount
  useEffect(() => {
    const initAI = async () => {
      console.log('🤖 Đang khởi tạo kết nối AI...');
      const available = await testAIConnection();
      setAiAvailable(available);
      setAiEnabled(available); // Tự động bật AI nếu kết nối được
      
      if (available) {
        console.log('✅ AI đã sẵn sàng!');
        // Thêm thông báo AI đã kết nối vào messages
        addBotMessage('🤖 AI đã được kết nối! Tôi có thể trả lời thông minh hơn.');
      } else {
        console.log('⚠️ Không kết nối được AI, dùng chế độ cơ bản');
        addBotMessage('💬 Tôi đang ở chế độ cơ bản. Bạn vẫn có thể hỏi về sản phẩm, size nhé!');
      }
    };
    
    initAI();
  }, []); // Chạy 1 lần khi component mount

  // Load lịch sử chat
  useEffect(() => {
    const savedMessages = localStorage.getItem('yuuKiChatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Lỗi parse lịch sử chat:', error);
        sendWelcomeMessage();
      }
    } else {
      sendWelcomeMessage();
    }
  }, []);

  // Lưu lịch sử và scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('yuuKiChatHistory', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  // THÊM: Effect để thông báo trạng thái AI khi mở chat
  useEffect(() => {
    if (isOpen && aiAvailable) {
      // Kiểm tra xem đã có thông báo AI chưa
      const hasAIMessage = messages.some(msg => 
        msg.type === 'bot' && msg.text.includes('AI đã được kết nối')
      );
      
      if (!hasAIMessage && messages.length > 0) {
        addBotMessage('🤖 AI đã sẵn sàng! Bạn có thể hỏi tôi bất cứ điều gì.');
      }
    }
  }, [isOpen, aiAvailable]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
  };

  const addBotMessage = (text, isHtml = false) => {
    setMessages(prev => [...prev, { type: 'bot', text, isHtml }]);
  };

  const addProductMessage = (product) => {
    if (!product) return;
    
    const safeProduct = JSON.stringify(product).replace(/'/g, "&apos;").replace(/"/g, '&quot;');
    
    setMessages(prev => [...prev, {
      type: 'bot',
      text: `
        <div class="product-message" onclick='selectProduct(${safeProduct})'>
          <img src="${product.image || 'https://via.placeholder.com/120x120?text=No+Image'}" 
               alt="${product.name || product.title || 'Sản phẩm'}" 
               onerror="this.src='https://via.placeholder.com/120x120?text=Error'"/>
          <div class="product-info">
            <strong>${product.name || product.title || 'Sản phẩm'}</strong>
            <span>💰 ${formatPrice(product.price || 0)}</span>
          </div>
        </div>
      `
    }]);
  };

  const showProductList = (products, title) => {
    if (products.length === 0) {
      addBotMessage('Rất tiếc, hiện tại chưa có sản phẩm phù hợp. Bạn có thể thử tìm kiếm với từ khóa khác nhé!');
      return;
    }
    
    addBotMessage(title, true);
    
    let productHtml = '<div class="product-list-chat">';
    products.slice(0, 5).forEach(p => {
      const safeProduct = JSON.stringify(p).replace(/'/g, "&apos;").replace(/"/g, '&quot;');
      productHtml += `
        <div class="product-item-chat" onclick='selectProduct(${safeProduct})'>
          <img src="${p.image || 'https://via.placeholder.com/50x50?text=No+Image'}" 
               alt="${p.title || p.name}"
               onerror="this.src='https://via.placeholder.com/50x50?text=Error'"/>
          <div class="product-info-chat">
            <strong>${p.title || p.name}</strong>
            <span>${formatPrice(p.price || 0)}</span>
          </div>
        </div>
      `;
    });
    productHtml += '</div>';
    
    addBotMessage(productHtml, true);
    addBotMessage('👉 Bạn có thể click vào sản phẩm để xem chi tiết. Hoặc nói "xem thêm" để xem tiếp.');
  };

  // SỬA: Hàm gửi tin nhắn - tự động dùng AI nếu có
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    addUserMessage(message);
    setInputValue('');

    // Hiển thị typing indicator
    setMessages(prev => [...prev, { type: 'bot', text: 'Đang suy nghĩ...', isHtml: false, isLoading: true }]);

    try {
      let botResponse = null;

      // Nếu AI khả dụng, ưu tiên dùng AI
      if (aiAvailable && aiEnabled) {
        console.log('🤖 Đang gọi AI cho tin nhắn...');
        botResponse = await getAIResponse(message, messages);
      }

      // Xóa typing indicator
      setMessages(prev => prev.filter(msg => !msg.isLoading));

      // Nếu có AI response, hiển thị
      if (botResponse) {
        addBotMessage(botResponse);
      } else {
        // Nếu không, dùng rule-based
        setTimeout(() => {
          processMessage(message);
        }, 500);
      }
    } catch (error) {
      console.error('Lỗi xử lý tin nhắn:', error);
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      setTimeout(() => {
        processMessage(message);
      }, 500);
    }
  };

  const sendWelcomeMessage = () => {
    let welcomeText = `
      <div style="text-align:center;">
        <span style="font-size:24px;">👕</span>
        <h3 style="margin:5px 0; color:#667eea;">YuuKi Fashion</h3>
        <p>Chào bạn! Tôi là trợ lý ảo của YuuKi.</p>`;
    
    // Thêm thông báo AI nếu có
    if (aiAvailable) {
      welcomeText += `<p style="color:#10b981;">✨ Đã kết nối AI thông minh!</p>`;
    }
    
    welcomeText += `
        <div style="background:#f0f0f0; padding:10px; border-radius:8px; margin-top:10px;">
          <p style="margin:5px 0;">🔍 <strong>Tìm sản phẩm:</strong> "áo sơ mi", "quần jeans"</p>
          <p style="margin:5px 0;">📏 <strong>Tư vấn size:</strong> "tư vấn size"</p>
          <p style="margin:5px 0;">🏷️ <strong>Khuyến mãi:</strong> "sale", "giảm giá"</p>
          <p style="margin:5px 0;">📞 <strong>Liên hệ:</strong> "liên hệ"</p>
        </div>
      </div>
    `;
    
    addBotMessage(welcomeText, true);
  };

  // Hàm tìm kiếm sản phẩm thông minh
  const searchProducts = (keyword) => {
    if (!productsArray || !Array.isArray(productsArray)) return [];
    
    const lowerKeyword = keyword.toLowerCase();
    
    const stopWords = ['tôi', 'muốn', 'xem', 'mua', 'tìm', 'cho', 'có', 'không', 'ạ', 'à', 'nhé', 'nhé'];
    const words = lowerKeyword.split(' ').filter(word => 
      word.length > 1 && !stopWords.includes(word)
    );
    
    const mainKeyword = words.length > 0 ? words.join(' ') : lowerKeyword;
    
    const categoryMap = {
      'polo': ['polo', 'áo polo'],
      'tshirt': ['thun', 't-shirt', 'tee', 'áo thun'],
      'so-mi': ['sơ mi', 'shirt', 'áo sơ mi'],
      'khoac': ['khoác', 'jacket', 'áo khoác'],
      'jeans': ['jeans', 'bò', 'quần jeans', 'quần bò'],
      'au': ['âu', 'tây', 'quần âu'],
      'short': ['short', 'đùi', 'quần short'],
      'dai-kaki': ['kaki', 'quần kaki']
    };
    
    let targetCategories = [];
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(k => mainKeyword.includes(k))) {
        targetCategories.push(cat);
      }
    }
    
    return productsArray.filter(p => {
      if (!p) return false;
      
      const productName = (p.title || p.name || '').toLowerCase();
      const productCategory = (p.category || '').toLowerCase();
      
      if (targetCategories.length > 0) {
        return targetCategories.includes(productCategory);
      }
      
      return productName.includes(mainKeyword);
    });
  };

  // Hàm tư vấn size chuyên nghiệp
  const suggestSize = (height, weight) => {
    const h = parseInt(height);
    const w = parseInt(weight);
    
    if (isNaN(h) || isNaN(w)) return null;
    
    if (h < 160) {
      if (w < 50) return 'S';
      if (w < 60) return 'M';
      return 'L';
    } else if (h < 165) {
      if (w < 55) return 'S';
      if (w < 65) return 'M';
      if (w < 75) return 'L';
      return 'XL';
    } else if (h < 170) {
      if (w < 55) return 'M';
      if (w < 65) return 'L';
      if (w < 75) return 'XL';
      return 'XXL';
    } else if (h < 175) {
      if (w < 60) return 'M';
      if (w < 70) return 'L';
      if (w < 80) return 'XL';
      return 'XXL';
    } else if (h < 180) {
      if (w < 65) return 'L';
      if (w < 75) return 'XL';
      if (w < 85) return 'XXL';
      return 'XXXL';
    } else {
      if (w < 70) return 'XL';
      if (w < 80) return 'XXL';
      return 'XXXL';
    }
  };

  // Xử lý khi chọn sản phẩm
  window.selectProduct = (product) => {
    setSelectedProduct(product);
    addBotMessage(`✅ Đã chọn: <strong>${product.title || product.name}</strong>`, true);
    addBotMessage(`
      <div style="display:flex; flex-direction:column; gap:10px;">
        <button class="chat-option-btn" onclick='handleChatOption("xem chi tiet")'>📋 Xem chi tiết</button>
        <button class="chat-option-btn" onclick='handleChatOption("dat hang")'>🛒 Đặt hàng ngay</button>
        <button class="chat-option-btn" onclick='handleChatOption("tu van size")'>📏 Tư vấn size</button>
      </div>
    `, true);
    setChatState('product_selected');
  };

  // Xử lý các option chat
  window.handleChatOption = (option) => {
    const fakeMessage = document.getElementById('chatbot-input');
    if (fakeMessage) {
      const userMsg = option === "xem chi tiet" ? "Xem chi tiết" : 
                     option === "dat hang" ? "Đặt hàng" : "Tư vấn size";
      addUserMessage(userMsg);
      
      setTimeout(() => {
        processMessage(userMsg);
      }, 500);
    }
  };

  const processMessage = (message) => {
    const lowerMsg = message.toLowerCase().trim();
    
    if (['hủy', 'thôi', 'không', 'quay lại', 'k', 'ko'].includes(lowerMsg)) {
      setChatState('greeting');
      setUserInfo({});
      setSelectedProduct(null);
      addBotMessage('Bạn muốn tôi giúp gì khác không?');
      return;
    }
    
    switch (chatState) {
      case 'greeting':
        handleGreeting(lowerMsg, message);
        break;
      case 'product_selected':
        handleProductSelected(lowerMsg);
        break;
      case 'size_advice':
        handleSizeAdvice(lowerMsg, message);
        break;
      case 'product_search':
        handleProductSearch(lowerMsg);
        break;
      case 'collecting_info':
        handleCollectingInfo(lowerMsg, message);
        break;
      default:
        addBotMessage('Xin lỗi, tôi chưa hiểu. Bạn có thể nói "hủy" để bắt đầu lại?');
    }
  };

  const handleGreeting = (lowerMsg, originalMsg) => {
    const searchPatterns = ['áo', 'quần', 'tìm', 'xem', 'sản phẩm', 'polo', 'sơ mi', 'jeans', 'khoác', 'short', 'thun'];
    if (searchPatterns.some(pattern => lowerMsg.includes(pattern))) {
      const results = searchProducts(originalMsg);
      setSearchResults(results);
      
      if (results.length > 0) {
        showProductList(results, `🔍 Tìm thấy ${results.length} sản phẩm phù hợp:`);
      } else {
        addBotMessage('Rất tiếc, không tìm thấy sản phẩm phù hợp. Bạn có thể thử từ khóa khác nhé!');
      }
      return;
    }
    
    if (lowerMsg.includes('size') || lowerMsg.includes('kích thước') || lowerMsg.includes('cỡ')) {
      addBotMessage('📏 Vui lòng cung cấp chiều cao (cm) và cân nặng (kg) của bạn.\nVí dụ: "cao 175cm nặng 70kg"');
      setChatState('size_advice');
      return;
    }
    
    if (lowerMsg.includes('khuyến mãi') || lowerMsg.includes('sale') || lowerMsg.includes('giảm giá')) {
      addBotMessage(`
        <div style="background:#fff3cd; padding:12px; border-radius:8px;">
          <h4 style="color:#856404; margin:0 0 10px 0;">🔥 KHUYẾN MÃI HOT</h4>
          <p>• Giảm 50% áo khoác mùa đông</p>
          <p>• Mua 2 áo thun giảm 20%</p>
          <p>• Freeship đơn từ 500k</p>
          <p style="margin-top:10px;">👉 Xem thêm tại: <a href="/products" target="_blank">Sản phẩm khuyến mãi</a></p>
        </div>
      `, true);
      return;
    }
    
    if (lowerMsg.includes('liên hệ') || lowerMsg.includes('địa chỉ') || lowerMsg.includes('hotline')) {
      addBotMessage(`
        <div style="background:#e8f4fd; padding:12px; border-radius:8px;">
          <h4 style="color:#0369a1; margin:0 0 10px 0;">📞 THÔNG TIN LIÊN HỆ</h4>
          <p>📍 Địa chỉ: Tổng & tồn nhà Ford, số 351 Trường Chính, An Lão, Hải Phòng</p>
          <p>📞 Hotline: <strong>0369788865</strong></p>
          <p>📧 Email: nguyenducphuong2k4hp@gmail.com</p>
          <p>⏰ Giờ làm việc: 8:00 - 22:00 (T2 - CN)</p>
        </div>
      `, true);
      return;
    }
    
    addBotMessage('Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể chọn một trong các chức năng sau:\n🔍 Tìm sản phẩm\n📏 Tư vấn size\n🏷️ Khuyến mãi\n📞 Liên hệ');
  };

  const handleProductSelected = (lowerMsg) => {
    if (lowerMsg.includes('chi tiết') || lowerMsg.includes('xem')) {
      if (selectedProduct) {
        const features = selectedProduct.features?.map(f => `• ${f}`).join('<br/>') || '• Chất liệu cao cấp';
        addBotMessage(`
          <div style="background:white; padding:15px; border-radius:10px; border:1px solid #e5e7eb;">
            <h3 style="color:#333; margin:0 0 10px 0;">${selectedProduct.title || selectedProduct.name}</h3>
            <img src="${selectedProduct.image}" style="max-width:150px; max-height:150px; border-radius:8px; margin:10px auto; display:block;"/>
            <p><strong>💰 Giá:</strong> <span style="color:#e74c3c;">${formatPrice(selectedProduct.price)}</span></p>
            <p><strong>📏 Size:</strong> ${selectedProduct.sizes?.join(', ') || 'S, M, L, XL'}</p>
            <p><strong>📝 Mô tả:</strong> ${selectedProduct.description || 'Sản phẩm chất lượng cao từ YuuKi'}</p>
            <p><strong>✨ Đặc điểm:</strong><br/>${features}</p>
          </div>
        `, true);
        addBotMessage('Bạn muốn đặt hàng sản phẩm này không? (Trả lời "có" hoặc "không")');
      }
    } else if (lowerMsg.includes('đặt') || lowerMsg.includes('mua')) {
      addBotMessage('🛒 Vui lòng cung cấp thông tin để đặt hàng:');
      addBotMessage('👤 Họ tên của bạn là gì?');
      setChatState('collecting_info');
      setUserInfo({ ...userInfo, product: selectedProduct });
    } else if (lowerMsg.includes('size')) {
      addBotMessage('📏 Vui lòng cung cấp chiều cao (cm) và cân nặng (kg) của bạn:');
      setChatState('size_advice');
    } else {
      addBotMessage('Vui lòng chọn: "xem chi tiết", "đặt hàng" hoặc "tư vấn size".');
    }
  };

  const handleSizeAdvice = (lowerMsg, originalMsg) => {
    const numbers = originalMsg.match(/\d+/g);
    
    if (numbers && numbers.length >= 2) {
      const height = numbers[0];
      const weight = numbers[1];
      
      const size = suggestSize(height, weight);
      
      if (size) {
        setUserInfo({ ...userInfo, height, weight, size });
        addBotMessage(`✅ Dựa trên thông số của bạn, tôi gợi ý size <strong style="color:#e74c3c;">${size}</strong>.`, true);
        addBotMessage('Bạn có muốn xem các sản phẩm size này không? (Trả lời "có" hoặc "không")');
        setChatState('product_search');
      } else {
        addBotMessage('Xin lỗi, tôi không thể xác định size. Vui lòng nhập theo định dạng: "cao 175cm nặng 70kg"');
      }
    } else {
      addBotMessage('Vui lòng cung cấp đầy đủ chiều cao và cân nặng. Ví dụ: "cao 175cm nặng 70kg"');
    }
  };

  const handleProductSearch = (lowerMsg) => {
    if (lowerMsg.includes('có') || lowerMsg.includes('vâng') || lowerMsg.includes('ok') || lowerMsg.includes('đồng ý')) {
      const suggestedSize = userInfo.size;
      
      if (!suggestedSize) {
        addBotMessage('Rất tiếc, tôi không có thông tin size. Bạn vui lòng cung cấp lại nhé!');
        setChatState('size_advice');
        return;
      }

      const productsWithSize = productsArray.filter(p => 
        p.sizes && p.sizes.includes(suggestedSize)
      );

      if (productsWithSize.length > 0) {
        showProductList(productsWithSize, `📦 Các sản phẩm size ${suggestedSize} phù hợp:`);
      } else {
        addBotMessage(`Rất tiếc, hiện tại chưa có sản phẩm size ${suggestedSize}. Bạn có thể thử size khác hoặc tìm sản phẩm khác.`);
      }
      setChatState('greeting');
    } 
    else if (lowerMsg.includes('không') || lowerMsg.includes('thôi') || lowerMsg.includes('hủy')) {
      addBotMessage('Không sao! Bạn có muốn tôi tư vấn sản phẩm khác không?');
      setChatState('greeting');
    } 
    else {
      addBotMessage('Vui lòng trả lời "có" hoặc "không" nhé!');
    }
  };

  const handleCollectingInfo = (lowerMsg, originalMsg) => {
    if (!userInfo.name) {
      if (lowerMsg.includes('áo') || lowerMsg.includes('quần') || lowerMsg.includes('size') || lowerMsg.length < 2) {
        addBotMessage('Vui lòng nhập tên thật của bạn (ví dụ: "Nguyễn Văn A")');
        return;
      }
      setUserInfo({ ...userInfo, name: originalMsg });
      addBotMessage(`👤 Cảm ơn ${originalMsg}! Số điện thoại của bạn là gì?`);
      
    } else if (!userInfo.phone) {
      const phone = originalMsg.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length <= 11) {
        setUserInfo({ ...userInfo, phone: originalMsg });
        addBotMessage('📍 Địa chỉ giao hàng của bạn là gì? (Ví dụ: Số nhà, đường, phường/xã, quận/huyện, thành phố)');
      } else {
        addBotMessage('❌ Số điện thoại không hợp lệ. Vui lòng nhập 10-11 số (ví dụ: 0369788865)');
      }
      
    } else if (!userInfo.address) {
      if (originalMsg.length < 10) {
        addBotMessage('Địa chỉ cần chi tiết hơn. Vui lòng nhập đầy đủ số nhà, tên đường, phường/xã, quận/huyện, thành phố.');
        return;
      }
      
      const orderNumber = 'YUK' + Math.floor(100000 + Math.random() * 900000);
      const product = userInfo.product || selectedProduct || { title: 'Sản phẩm', price: 0 };
      
      addBotMessage(`
        <div style="background:#d4edda; padding:15px; border-radius:10px; border-left:4px solid #28a745;">
          <h3 style="color:#155724; margin:0 0 10px 0;">✅ ĐẶT HÀNG THÀNH CÔNG</h3>
          <p><strong>Mã đơn:</strong> ${orderNumber}</p>
          <p><strong>Khách hàng:</strong> ${userInfo.name}</p>
          <p><strong>SĐT:</strong> ${userInfo.phone}</p>
          <p><strong>Địa chỉ:</strong> ${originalMsg}</p>
          <p><strong>Sản phẩm:</strong> ${product.title || product.name}</p>
          <p><strong>Size:</strong> ${userInfo.size || 'S'}</p>
          <p><strong>Tổng tiền:</strong> ${formatPrice(product.price || 0)}</p>
          <hr style="border-top:1px solid #c3e6cb;"/>
          <p style="margin:10px 0 0 0;"><em>🎉 Cảm ơn bạn đã mua sắm tại YuuKi!</em></p>
        </div>
      `, true);
      
      const orderData = {
        ...userInfo,
        address: originalMsg,
        product: product,
        orderNumber,
        orderDate: new Date().toISOString()
      };
      const orders = JSON.parse(localStorage.getItem('yuuKiOrders') || '[]');
      orders.push(orderData);
      localStorage.setItem('yuuKiOrders', JSON.stringify(orders));
      
      addBotMessage(`📞 Nhân viên YuuKi sẽ liên hệ với bạn qua số ${userInfo.phone} để xác nhận đơn hàng trong ít phút nữa.`);
      
      setChatState('greeting');
      setUserInfo({});
      setSelectedProduct(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
        {aiAvailable && <span className="ai-badge">AI</span>}
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h4>🛍️ YuuKi Bot</h4>
              {aiAvailable && (
                <span style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  AI ACTIVE
                </span>
              )}
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.type}`}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;