// src/pages/CartPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { FaShoppingCart } from 'react-icons/fa';
import '../styles/CartPage.css';

const CartPage = () => {
  const { items, getCartTotal } = useCart();
  const subtotal = getCartTotal();

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="container">
          <h1>Giỏ Hàng Của Bạn</h1>
          <div className="empty-cart">
            <FaShoppingCart />
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy thêm một số sản phẩm vào giỏ hàng!</p>
            <Link to="/products" className="continue-shopping" style={{ 
              display: 'inline-block', 
              marginTop: '15px', 
              padding: '12px 24px', 
              background: '#3498db', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px' 
            }}>
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <h1>Giỏ Hàng Của Bạn</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {items.map(item => (
              <CartItem key={`${item.id}-${item.size}`} item={item} />
            ))}
          </div>
          
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </section>
  );
};

export default CartPage;