// src/components/cart/CartSummary.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const CartSummary = ({ subtotal }) => {
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const discount = subtotal > 500000 ? 50000 : 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="cart-summary">
      <h2>Tổng Đơn Hàng</h2>
      
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
      
      <Link to="/checkout" className="checkout-btn">
        THANH TOÁN
      </Link>
      
      <Link to="/products" className="continue-shopping">
        ← Tiếp tục mua sắm
      </Link>
    </div>
  );
};

export default CartSummary;