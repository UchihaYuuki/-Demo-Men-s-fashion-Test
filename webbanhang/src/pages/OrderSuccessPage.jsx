// src/pages/OrderSuccessPage.jsx - Thêm debug ở đầu file
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaShoppingBag, 
  FaTruck, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaHome,
  FaPrint,
  FaShareAlt
} from 'react-icons/fa';
import { formatPrice } from '../utils/formatters';
import '../styles/OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(50);

  // DEBUG: Kiểm tra xem component có được render không
  console.log('🔥 OrderSuccessPage RENDERED!');

  useEffect(() => {
    console.log('🔄 OrderSuccessPage mounted - useEffect chạy');
    
    // Lấy thông tin đơn hàng từ localStorage
    try {
      const lastOrder = localStorage.getItem('lastOrder');
      console.log('📦 Dữ liệu từ localStorage:', lastOrder);
      
      if (lastOrder) {
        const parsedOrder = JSON.parse(lastOrder);
        console.log('✅ Đã parse đơn hàng:', parsedOrder);
        setOrderData(parsedOrder);
      } else {
        console.log('❌ KHÔNG tìm thấy lastOrder trong localStorage');
      }
    } catch (error) {
      console.error('❌ Lỗi khi đọc đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Countdown để chuyển về trang chủ
    if (orderData && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      console.log('⏰ Countdown kết thúc, chuyển về trang chủ');
      navigate('/');
    }
  }, [countdown, navigate, orderData]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Đơn hàng YuuKi',
        text: `Mã đơn hàng: ${orderData?.orderNumber}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`Mã đơn hàng: ${orderData?.orderNumber}`);
      alert('Đã copy mã đơn hàng!');
    }
  };

  if (loading) {
    console.log('⏳ Đang loading...');
    return (
      <div className="order-success-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!orderData) {
    console.log('❌ Không có orderData, hiển thị thông báo lỗi');
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="success-header">
            <div className="success-icon-wrapper">
              <FaCheckCircle className="success-icon" />
            </div>
            <h1>KHÔNG TÌM THẤY ĐƠN HÀNG!</h1>
            <p>Rất tiếc, không thể tìm thấy thông tin đơn hàng của bạn.</p>
            <p>Mã lỗi: ORDER_NOT_FOUND</p>
            <Link to="/" className="btn-primary" style={{ marginTop: '20px' }}>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎯 Rendering với orderData:', orderData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const orderDate = formatDate(orderData.orderDate || new Date());
  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const estimatedDate = estimatedDelivery.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        {/* Header với icon thành công */}
        <div className="success-header">
          <div className="success-icon-wrapper">
            <FaCheckCircle className="success-icon" />
          </div>
          <h1>ĐẶT HÀNG THÀNH CÔNG!</h1>
          <p>Cảm ơn bạn đã tin tưởng và mua sắm tại YuuKi</p>
        </div>

        {/* Mã đơn hàng nổi bật */}
        <div className="order-number-card">
          <div className="order-number-label">MÃ ĐƠN HÀNG</div>
          <div className="order-number-value">{orderData.orderNumber}</div>
          <div className="order-number-actions">
            <button className="action-btn" onClick={handlePrint}>
              <FaPrint /> In
            </button>
            <button className="action-btn" onClick={handleShare}>
              <FaShareAlt /> Chia sẻ
            </button>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="order-info-grid">
          {/* Thông tin khách hàng */}
          <div className="info-card">
            <div className="info-card-header">
              <FaHome className="info-icon" />
              <h3>Thông tin giao hàng</h3>
            </div>
            <div className="info-card-body">
              <p><strong>Người nhận:</strong> {orderData.customerName || orderData.fullName || 'Khách hàng'}</p>
              <p><strong>Số điện thoại:</strong> {orderData.phone || 'Chưa cập nhật'}</p>
              <p><strong>Địa chỉ:</strong> {orderData.address || 'Chưa cập nhật'}</p>
            </div>
          </div>

          {/* Thông tin vận chuyển */}
          <div className="info-card">
            <div className="info-card-header">
              <FaTruck className="info-icon" />
              <h3>Vận chuyển</h3>
            </div>
            <div className="info-card-body">
              <p><strong>Phương thức:</strong> Giao hàng tiêu chuẩn</p>
              <p><strong>Thời gian dự kiến:</strong> {estimatedDate}</p>
              <p><strong>Phí vận chuyển:</strong> {orderData.shipping === 0 ? 'Miễn phí' : formatPrice(orderData.shipping)}</p>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <div className="info-card">
            <div className="info-card-header">
              <FaClock className="info-icon" />
              <h3>Thanh toán</h3>
            </div>
            <div className="info-card-body">
              <p><strong>Phương thức:</strong> {
                orderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                orderData.paymentMethod === 'banking' ? 'Chuyển khoản' :
                orderData.paymentMethod === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng'
              }</p>
              <p><strong>Ngày đặt:</strong> {orderDate}</p>
              <p><strong>Trạng thái:</strong> <span className="status-badge">Chờ xác nhận</span></p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="order-items-card">
          <div className="order-items-header">
            <FaShoppingBag className="items-icon" />
            <h3>Chi tiết đơn hàng ({orderData.items?.length || 0} sản phẩm)</h3>
          </div>
          
          <div className="order-items-list">
            {orderData.items && orderData.items.length > 0 ? (
              orderData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-image">
                    <img 
                      src={item.product?.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.product?.name || 'Sản phẩm'}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80x80?text=Error';
                      }}
                    />
                  </div>
                  <div className="order-item-info">
                    <h4>{item.product?.name || 'Sản phẩm'}</h4>
                    <p className="order-item-meta">Size: {item.size || 'M'} | Số lượng: {item.quantity || 1}</p>
                    <p className="order-item-price">{formatPrice(item.product?.price || 0)}</p>
                  </div>
                  <div className="order-item-total">
                    <span>Tổng:</span>
                    <strong>{formatPrice((item.product?.price || 0) * (item.quantity || 1))}</strong>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Không có sản phẩm nào trong đơn hàng</p>
            )}
          </div>

          {/* Tổng kết đơn hàng */}
          <div className="order-total-section">
            <div className="total-row">
              <span>Tạm tính:</span>
              <span>{formatPrice(orderData.subtotal || 0)}</span>
            </div>
            <div className="total-row">
              <span>Phí vận chuyển:</span>
              <span>{orderData.shipping === 0 ? 'Miễn phí' : formatPrice(orderData.shipping)}</span>
            </div>
            {orderData.discount > 0 && (
              <div className="total-row discount">
                <span>Giảm giá:</span>
                <span>-{formatPrice(orderData.discount)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Tổng cộng:</span>
              <span className="total-amount">{formatPrice(orderData.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Hướng dẫn và hỗ trợ */}
        <div className="support-section">
          <div className="support-content">
            <h4>📞 Cần hỗ trợ?</h4>
            <p>Nếu có bất kỳ thắc mắc nào về đơn hàng, vui lòng liên hệ với chúng tôi:</p>
            <div className="support-contacts">
              <a href="tel:0369788865" className="contact-link">
                <FaPhone /> 0369788865
              </a>
              <a href="mailto:nguyenducphuong2k4hp@gmail.com" className="contact-link">
                <FaEnvelope /> nguyenducphuong2k4hp@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="action-buttons">
          <Link to="/" className="btn-primary">
            Tiếp tục mua sắm
          </Link>
          <Link to="/products" className="btn-secondary">
            Xem sản phẩm khác
          </Link>
        </div>

        {/* Countdown */}
        <div className="redirect-countdown">
          Tự động chuyển về trang chủ sau <strong>{countdown}</strong> giây...
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;