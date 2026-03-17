// src/components/products/QuickViewModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FaTimes } from 'react-icons/fa';
import '../../styles/Modal.css';

const QuickViewModal = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước!');
      return;
    }
    addToCart(product, selectedSize, quantity);
    alert('Đã thêm vào giỏ hàng!');
    onClose();
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước!');
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={e => e.stopPropagation()}>
        <div className="qv-header">
          <h3>{product.title}</h3>
          <button className="qv-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="qv-content">
          <div className="qv-image">
            <img src={product.image} alt={product.title} />
          </div>

          <div className="qv-details">
            <h2 className="qv-name">{product.title}</h2>
            <div className="qv-price">
              {formatPrice(product.price)}
              {product.originalPrice && (
                <span className="qv-old-price">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            
            <p className="qv-description">{product.description}</p>

            <div className="qv-sizes">
              <h4>Kích thước có sẵn:</h4>
              <div className="qv-size-options">
                {product.sizes.map(size => (
                  <div
                    key={size}
                    className={`qv-size-option ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="qv-quantity">
              <h4>Số lượng:</h4>
              <div className="qv-quantity-controls">
                <button 
                  className="qv-quantity-btn minus"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input 
                  type="text" 
                  className="qv-quantity-input" 
                  value={quantity} 
                  readOnly 
                />
                <button 
                  className="qv-quantity-btn plus"
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="qv-actions">
              <button className="qv-add-cart" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
              <button className="qv-buy-now" onClick={handleBuyNow}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;