// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice, generateOrderNumber } from '../utils/formatters';
import { FaMoneyBillWave, FaUniversity, FaMobile, FaCreditCard } from 'react-icons/fa';
import orderService from '../services/orderService'; // IMPORT orderService
import toast from 'react-hot-toast';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state loading
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  
  // Flag để đánh dấu đã submit thành công
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const navigatingRef = useRef(false);

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const discount = subtotal > 500000 ? 50000 : 0;
  const total = subtotal + shipping - discount;

  // Xử lý chuyển hướng khi giỏ hàng trống
  useEffect(() => {
    if (items.length === 0 && !orderSubmitted && !navigatingRef.current) {
      navigatingRef.current = true;
      navigate('/cart');
    }
  }, [items.length, navigate, orderSubmitted]);

  if (items.length === 0 && !orderSubmitted) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.city) {
      newErrors.city = 'Vui lòng chọn thành phố';
    }

    if (!formData.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm tạo mã đơn hàng
  const generateOrderId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${year}${month}${day}${random}`;
  };

  // Hàm tạo orderNumber
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `YUK${year}${month}${day}${random}`;
  };

  // THÊM: Hàm xử lý items để đảm bảo có ảnh
  const processItemsForStorage = () => {
    return items.map(item => {
      // Log để debug
      console.log('Processing item:', item);
      
      return {
        id: item.id,
        // Đảm bảo có product object đầy đủ
        product: {
          name: item.product.name,
          price: item.product.price,
          image: item.product.image || 'https://via.placeholder.com/80x80?text=YuuKi', // Đảm bảo có ảnh
          code: item.product.code || ''
        },
        // Giữ lại các trường cũ cho tương thích
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        image: item.product.image || 'https://via.placeholder.com/80x80?text=YuuKi' // Đảm bảo có ảnh ở cả 2 chỗ
      };
    });
  };

  // Hàm xử lý submit - GỌI API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // SỬA: Xử lý items trước khi tạo orderData
      const processedItems = processItemsForStorage();
      
      // Tạo đối tượng đơn hàng với items đã xử lý
      const orderData = {
        id: generateOrderId(),
        orderNumber: generateOrderNumber(),
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.district}, ${formData.city}`,
        items: processedItems, // Dùng items đã xử lý
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
        note: formData.note || ""
      };

      console.log('📦 Đang gửi đơn hàng lên API:', orderData);

      // Gọi API tạo đơn hàng
      const response = await orderService.createOrder(orderData);
      
      console.log('✅ API trả về:', response);

      // SỬA: Lưu vào localStorage với đầy đủ ảnh
      const orderForStorage = {
        ...orderData,
        id: response.id || orderData.id,
        // Đảm bảo items có đủ ảnh khi lưu
        items: processedItems.map(item => ({
          ...item,
          // Đảm bảo ảnh ở mọi cấp độ
          image: item.image || item.product?.image || 'https://via.placeholder.com/80x80?text=YuuKi',
          product: {
            ...item.product,
            image: item.product?.image || item.image || 'https://via.placeholder.com/80x80?text=YuuKi'
          }
        }))
      };
      
      localStorage.setItem('lastOrder', JSON.stringify(orderForStorage));
      
      // THÊM: Lưu backup
      localStorage.setItem('lastOrderBackup', JSON.stringify(orderForStorage));

      // Xóa giỏ hàng
      clearCart();
      
      // Đánh dấu đã submit
      setOrderSubmitted(true);
      
      // Hiển thị thông báo thành công
      toast.success('Đặt hàng thành công!');
      
      // Chuyển đến trang thành công
      setTimeout(() => {
        navigate('/order-success');
      }, 100);

    } catch (error) {
      console.error('❌ Lỗi đặt hàng:', error);
      
      // Xử lý lỗi
      let errorMessage = 'Đặt hàng thất bại. ';
      if (error.response) {
        errorMessage += error.response.data?.message || `Lỗi ${error.response.status}`;
      } else if (error.request) {
        errorMessage += 'Không thể kết nối đến server. Vui lòng thử lại.';
      } else {
        errorMessage += error.message;
      }
      
      toast.error(errorMessage);
      
      // SỬA: Fallback order với đầy đủ ảnh
      const processedItems = processItemsForStorage();
      
      const fallbackOrder = {
        id: generateOrderId(),
        orderNumber: generateOrderNumber(),
        customerName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.district}, ${formData.city}`,
        items: processedItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          image: item.image || 'https://via.placeholder.com/80x80?text=YuuKi', // Đảm bảo có ảnh
          product: {
            name: item.name,
            price: item.price,
            image: item.image || 'https://via.placeholder.com/80x80?text=YuuKi', // Đảm bảo có ảnh
            code: item.product?.code || ''
          }
        })),
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
        note: formData.note || ""
      };
      
      localStorage.setItem('lastOrder', JSON.stringify(fallbackOrder));
      localStorage.setItem('lastOrderBackup', JSON.stringify(fallbackOrder));
      
      // Hỏi người dùng có muốn tiếp tục không
      const continueAnyway = window.confirm(
        'Không thể kết nối đến server. Bạn có muốn đặt hàng và lưu tạm thời không?'
      );
      
      if (continueAnyway) {
        clearCart();
        setOrderSubmitted(true);
        navigate('/order-success');
      }
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Thanh Toán</h1>

        <div className="checkout-container">
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Thông tin giao hàng */}
            <div className="form-section">
              <h3>Thông tin giao hàng</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Nhập họ tên"
                    disabled={isSubmitting}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Nhập số điện thoại"
                    disabled={isSubmitting}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Nhập email"
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Nhập số nhà, tên đường"
                  disabled={isSubmitting}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thành phố *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                    disabled={isSubmitting}
                  >
                    <option value="">Chọn thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP.Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={errors.district ? 'error' : ''}
                    placeholder="Nhập quận/huyện"
                    disabled={isSubmitting}
                  />
                  {errors.district && <span className="error-message">{errors.district}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Ghi chú (tùy chọn)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Ghi chú về đơn hàng..."
                  rows="3"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="form-section">
              <h3>Phương thức thanh toán</h3>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => !isSubmitting && setPaymentMethod('cod')}
                >
                  <FaMoneyBillWave />
                  <span>Thanh toán khi nhận hàng</span>
                </div>

                <div 
                  className={`payment-method ${paymentMethod === 'banking' ? 'selected' : ''}`}
                  onClick={() => !isSubmitting && setPaymentMethod('banking')}
                >
                  <FaUniversity />
                  <span>Chuyển khoản ngân hàng</span>
                </div>

                <div 
                  className={`payment-method ${paymentMethod === 'momo' ? 'selected' : ''}`}
                  onClick={() => !isSubmitting && setPaymentMethod('momo')}
                >
                  <FaMobile />
                  <span>Ví MoMo</span>
                </div>

                <div 
                  className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => !isSubmitting && setPaymentMethod('card')}
                >
                  <FaCreditCard />
                  <span>Thẻ Visa/MasterCard</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  ĐANG XỬ LÝ...
                </>
              ) : (
                'ĐẶT HÀNG'
              )}
            </button>
          </form>

          {/* Tóm tắt đơn hàng */}
          <div className="order-summary">
            <h3>Đơn hàng của bạn</h3>
            
            <div className="order-items">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="order-item">
                  <img 
                    src={item.product.image || 'https://via.placeholder.com/80x80?text=YuuKi'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x80?text=YuuKi';
                    }}
                  />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.product.name}</div>
                    <div className="order-item-meta">
                      Size: {item.size} | SL: {item.quantity}
                    </div>
                  </div>
                  <div className="order-item-price">
                    {formatPrice(item.product.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row">
                <span>Giảm giá:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="summary-row summary-total">
              <span>Tổng cộng:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <a href="/cart" className="back-to-cart">
              ← Quay lại giỏ hàng
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;