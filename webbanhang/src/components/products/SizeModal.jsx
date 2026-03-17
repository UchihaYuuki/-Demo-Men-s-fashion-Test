// src/components/products/SizeModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
import '../../styles/Modal.css';

const SizeModal = ({ product, onClose }) => {
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
      <div className="size-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Chọn kích thước</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-product">
          <img src={product.image} alt={product.title} />
          <div className="modal-product-info">
            <h4>{product.title}</h4>
            <div className="price">{formatPrice(product.price)}</div>
          </div>
        </div>

        <div className="size-selection">
          <h4>Kích thước:</h4>
          <div className="size-options">
            {product.sizes.map(size => (
              <div
                key={size}
                className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <div className="quantity-selection">
          <h4>Số lượng:</h4>
          <div className="quantity-controls">
            <button 
              className="quantity-btn minus"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              -
            </button>
            <input 
              type="text" 
              className="quantity-input" 
              value={quantity} 
              readOnly 
            />
            <button 
              className="quantity-btn plus"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;