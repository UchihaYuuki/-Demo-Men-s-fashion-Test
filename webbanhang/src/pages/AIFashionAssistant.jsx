// src/pages/AIFashionAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsArray } from '../data/products';
import { formatPrice } from '../utils/formatters';
import { getAIResponse } from '../services/aiService';
import QuickViewModal from '../components/products/QuickViewModal';
import { FaRobot, FaUser, FaPaperPlane, FaShoppingBag, FaFire, FaTimes, FaMagic } from 'react-icons/fa';
import '../styles/AIFashionAssistant.css';

const AIFashionAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [outfitSuggestions, setOutfitSuggestions] = useState([]);
  const [showOutfit, setShowOutfit] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false); // THÊM state cho gợi ý sản phẩm
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Dữ liệu phối đồ
  const outfitData = {
    'áo thun': {
      title: 'Áo Thun',
      image: '👕',
      matches: [
        { 
          type: 'Quần Short', 
          icon: '🩳',
          items: productsArray.filter(p => p.category === 'short').slice(0, 3)
        },
        { 
          type: 'Quần Âu', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'au').slice(0, 3)
        },
        { 
          type: 'Quần Kaki', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'dai-kaki').slice(0, 3)
        },
        { 
          type: 'Quần Jeans', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'jeans').slice(0, 3)
        }
      ],
      shoes: 'Giày thể thao, Sandal, Lười',
      occasion: 'Đi chơi, dạo phố, thể thao, hẹn hò'
    },
    'áo polo': {
      title: 'Áo Polo',
      image: '👔',
      matches: [
        { 
          type: 'Quần Âu', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'au').slice(0, 3)
        },
        { 
          type: 'Quần Kaki', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'dai-kaki').slice(0, 3)
        },
        { 
          type: 'Quần Jeans', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'jeans').slice(0, 3)
        }
      ],
      shoes: 'Giày tây, Lười, Giày thể thao',
      occasion: 'Đi làm, gặp đối tác, hẹn hò, sự kiện nhẹ'
    },
    'áo sơ mi': {
      title: 'Áo Sơ Mi',
      image: '👔',
      matches: [
        { 
          type: 'Quần Âu', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'au').slice(0, 3)
        },
        { 
          type: 'Quần Kaki', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'dai-kaki').slice(0, 3)
        },
        { 
          type: 'Quần Jeans', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'jeans').slice(0, 3)
        }
      ],
      shoes: 'Giày tây, Lười, Giày da',
      occasion: 'Đi làm, sự kiện, tiệc tùng, gặp gỡ'
    },
    'áo khoác': {
      title: 'Áo Khoác',
      image: '🧥',
      matches: [
        { 
          type: 'Quần Short', 
          icon: '🩳',
          items: productsArray.filter(p => p.category === 'short').slice(0, 3)
        },
        { 
          type: 'Quần Âu', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'au').slice(0, 3)
        },
        { 
          type: 'Quần Kaki', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'dai-kaki').slice(0, 3)
        },
        { 
          type: 'Quần Jeans', 
          icon: '👖',
          items: productsArray.filter(p => p.category === 'jeans').slice(0, 3)
        }
      ],
      shoes: 'Giày thể thao, Boots, Giày cao cổ',
      occasion: 'Mùa đông, đi chơi, du lịch, dạo phố'
    }
  };

  // Lấy sản phẩm nổi bật
  const featuredProducts = productsArray.slice(0, 8);
  const trendingProducts = productsArray.filter(p => p.discount >= 30).slice(0, 8);

  // Khởi tạo tin nhắn chào
  useEffect(() => {
    const welcomeMessage = {
      type: 'bot',
      text: `Xin chào! Tôi là **Trợ lý Thời trang AI** của YuuKi.

Tôi có thể giúp bạn:
• 🔍 **Xem sản phẩm:** "xem áo sơ mi", "áo thun", "quần jeans"
• 👔 **Phối đồ:** "áo sơ mi mặc với quần gì?"
• 📏 **Tư vấn size:** "tư vấn size cho tôi"

Bạn muốn xem gì hôm nay?`,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Auto scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages, outfitSuggestions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // BƯỚC 1: Kiểm tra nếu là yêu cầu XEM SẢN PHẨM
      if (checkProductViewRequest(inputValue)) {
        handleProductViewRequest(inputValue);
      }
      // BƯỚC 2: Kiểm tra nếu là yêu cầu PHỐI ĐỒ
      else if (checkOutfitQuery(inputValue)) {
        const outfitMatch = getOutfitData(inputValue);
        if (outfitMatch) {
          setOutfitSuggestions(outfitMatch);
          setShowOutfit(true);
          setShowSuggestions(false); // Ẩn gợi ý sản phẩm nếu đang hiện
          
          const botMessage = {
            type: 'bot',
            text: `✨ **Gợi ý phối đồ với ${outfitMatch.title}**`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
      // BƯỚC 3: Gọi AI cho các câu hỏi khác
      else {
        const aiResponse = await getAIResponse(inputValue, messages);
        
        if (aiResponse) {
          const botMessage = {
            type: 'bot',
            text: aiResponse,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const fallbackResponse = getFallbackResponse(inputValue);
          const botMessage = {
            type: 'bot',
            text: fallbackResponse.text,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      }
    } catch (error) {
      console.error('Lỗi chat:', error);
      
      const errorMessage = {
        type: 'bot',
        text: `❌ Rất tiếc, đã xảy ra lỗi. Bạn có thể thử lại sau.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Kiểm tra yêu cầu xem sản phẩm
  const checkProductViewRequest = (message) => {
    const lowerMsg = message.toLowerCase();
    
    const hasViewKeyword = lowerMsg.includes('xem') || lowerMsg.includes('tìm') || lowerMsg.includes('cho xem');
    
    const productKeywords = [
      'áo sơ mi', 'áo thun', 'áo polo', 'áo khoác',
      'quần jeans', 'quần âu', 'quần kaki', 'quần short',
      'sơ mi', 'jeans', 'khoác'
    ];
    
    const hasProductKeyword = productKeywords.some(keyword => lowerMsg.includes(keyword));
    
    return (hasViewKeyword && hasProductKeyword) || 
           (hasProductKeyword && !lowerMsg.includes('mặc với') && !lowerMsg.includes('phối'));
  };

  // Xử lý yêu cầu xem sản phẩm
  const handleProductViewRequest = (message) => {
    const lowerMsg = message.toLowerCase();
    let products = [];
    let title = '';

    if (lowerMsg.includes('áo sơ mi') || lowerMsg.includes('sơ mi')) {
      products = productsArray.filter(p => p.category === 'so-mi').slice(0, 6);
      title = '👕 **Áo Sơ Mi**';
    } else if (lowerMsg.includes('áo thun') || lowerMsg.includes('thun')) {
      products = productsArray.filter(p => p.category === 'tshirt').slice(0, 6);
      title = '👕 **Áo Thun**';
    } else if (lowerMsg.includes('áo polo') || lowerMsg.includes('polo')) {
      products = productsArray.filter(p => p.category === 'polo').slice(0, 6);
      title = '👔 **Áo Polo**';
    } else if (lowerMsg.includes('áo khoác') || lowerMsg.includes('khoác')) {
      products = productsArray.filter(p => p.category === 'khoac').slice(0, 6);
      title = '🧥 **Áo Khoác**';
    } else if (lowerMsg.includes('quần jeans') || lowerMsg.includes('jeans')) {
      products = productsArray.filter(p => p.category === 'jeans').slice(0, 6);
      title = '👖 **Quần Jeans**';
    } else if (lowerMsg.includes('quần âu')) {
      products = productsArray.filter(p => p.category === 'au').slice(0, 6);
      title = '👖 **Quần Âu**';
    } else if (lowerMsg.includes('quần kaki')) {
      products = productsArray.filter(p => p.category === 'dai-kaki').slice(0, 6);
      title = '👖 **Quần Kaki**';
    } else if (lowerMsg.includes('quần short')) {
      products = productsArray.filter(p => p.category === 'short').slice(0, 6);
      title = '🩳 **Quần Short**';
    }

    if (products.length > 0) {
      // Hiển thị sản phẩm
      setSuggestedProducts(products);
      setShowSuggestions(true); // THÊM: Hiện gợi ý
      setShowOutfit(false); // Ẩn outfit nếu đang hiện
      
      const botMessage = {
        type: 'bot',
        text: `${title}\n\nĐây là những sản phẩm đang có sẵn:`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } else {
      const botMessage = {
        type: 'bot',
        text: `❌ Rất tiếc, không tìm thấy sản phẩm nào.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  // THÊM: Hàm đóng gợi ý sản phẩm
  const closeSuggestions = () => {
    setShowSuggestions(false);
    setSuggestedProducts([]);
  };

  // Kiểm tra câu hỏi về phối đồ
  const checkOutfitQuery = (message) => {
    const lowerMsg = message.toLowerCase();
    
    const outfitKeywords = ['mặc với', 'phối', 'kết hợp', 'mặc cùng'];
    const hasOutfitKeyword = outfitKeywords.some(keyword => lowerMsg.includes(keyword));
    
    const productKeywords = ['áo sơ mi', 'áo thun', 'áo polo', 'áo khoác', 'quần jeans'];
    const hasProductKeyword = productKeywords.some(keyword => lowerMsg.includes(keyword));
    
    return hasOutfitKeyword && hasProductKeyword;
  };

  // Lấy dữ liệu phối đồ
  const getOutfitData = (message) => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('áo sơ mi')) return outfitData['áo sơ mi'];
    if (lowerMsg.includes('áo thun')) return outfitData['áo thun'];
    if (lowerMsg.includes('áo polo')) return outfitData['áo polo'];
    if (lowerMsg.includes('áo khoác')) return outfitData['áo khoác'];
    
    return null;
  };

  const closeOutfitSuggestions = () => {
    setShowOutfit(false);
    setOutfitSuggestions([]);
  };

  const getFallbackResponse = (message) => {
    return {
      text: `Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể thử:

• 🔍 **Xem sản phẩm:** "xem áo sơ mi", "áo thun"
• 👔 **Phối đồ:** "áo sơ mi mặc với quần gì?"
• 📏 **Tư vấn size:** "tư vấn size 175cm 70kg"`,
      products: []
    };
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleCloseModal = () => {
    setShowQuickView(false);
    setSelectedProduct(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-assistant-container">
      {showQuickView && selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}

      <div className="ai-header">
        <div className="ai-header-content">
          <FaRobot className="ai-icon" />
          <div>
            <h1>Trợ Lý Thời Trang AI</h1>
            <p>Được huấn luyện bởi YuuKi Fashion - Tư vấn thông minh 24/7</p>
          </div>
        </div>
      </div>

      <div className="ai-main">
        {/* Sidebar */}
        <div className="ai-sidebar">
          <div className="ai-sidebar-header">
            <h3>Khám phá</h3>
          </div>
          <div className="ai-sidebar-menu">
            <button 
              className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <FaRobot /> Trò chuyện AI
            </button>
            <button 
              className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <FaShoppingBag /> Sản phẩm nổi bật
            </button>
            <button 
              className={`menu-item ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <FaFire /> Đang thịnh hành
            </button>
          </div>

          <div className="ai-stats">
            <div className="stat-item">
              <span className="stat-value">50%</span>
              <span className="stat-label">Giảm giá</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">12</span>
              <span className="stat-label">Danh mục</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">721</span>
              <span className="stat-label">Sản phẩm</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">38</span>
              <span className="stat-label">Đã bán</span>
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="ai-chat-area">
          {activeTab === 'chat' ? (
            <>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === 'bot' ? <FaRobot /> : <FaUser />}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">
                          {msg.type === 'bot' ? 'YuuKi AI' : 'Bạn'}
                        </span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot">
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Outfit Suggestions */}
              {showOutfit && outfitSuggestions && (
                <div className="outfit-suggestions">
                  <div className="outfit-header">
                    <h4>
                      <FaMagic /> {outfitSuggestions.title} {outfitSuggestions.image}
                    </h4>
                    <button className="close-outfit" onClick={closeOutfitSuggestions}>
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="outfit-content">
                    <div className="outfit-matches">
                      {outfitSuggestions.matches.map((match, index) => (
                        <div key={index} className="match-category">
                          <h5>{match.icon} {match.type}:</h5>
                          <div className="match-items">
                            {match.items.map(item => (
                              <div key={item.id} className="match-item" onClick={() => handleQuickView(item)}>
                                <img src={item.image} alt={item.title} />
                                <span>{item.title.length > 25 ? item.title.substring(0, 22) + '...' : item.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="outfit-info">
                      <p><strong>👟 Giày:</strong> {outfitSuggestions.shoes}</p>
                      <p><strong>🎉 Dịp:</strong> {outfitSuggestions.occasion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Products - THÊM NÚT X */}
              {suggestedProducts.length > 0 && showSuggestions && !showOutfit && (
                <div className="suggested-products">
                  <div className="suggested-header">
                    <h4>Gợi ý cho bạn</h4>
                    <button className="close-suggestions" onClick={closeSuggestions}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="product-suggestions">
                    {suggestedProducts.map(product => (
                      <div key={product.id} className="suggestion-card">
                        <img src={product.image} alt={product.title} />
                        <div className="suggestion-info">
                          <h5>{product.title}</h5>
                          <p className="price">{formatPrice(product.price)}</p>
                          <button onClick={() => handleQuickView(product)}>
                            Xem nhanh
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="chat-input-area">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="VD: xem áo sơ mi, áo thun mặc với quần gì?"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </>
          ) : activeTab === 'products' ? (
            <div className="products-grid">
              <h2>Sản phẩm nổi bật</h2>
              <div className="grid-container">
                {featuredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p className="price">{formatPrice(product.price)}</p>
                    <button onClick={() => handleQuickView(product)}>Xem nhanh</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="products-grid">
              <h2>Đang thịnh hành 🔥</h2>
              <div className="grid-container">
                {trendingProducts.map(product => (
                  <div key={product.id} className="product-card trending">
                    <span className="discount-badge">-{product.discount}%</span>
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p className="price">{formatPrice(product.price)}</p>
                    <button onClick={() => handleQuickView(product)}>Xem nhanh</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIFashionAssistant;