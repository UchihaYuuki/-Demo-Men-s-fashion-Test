// src/components/cart/CartItem.jsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/formatters';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrease = () => {
    updateQuantity(item.id, item.size, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.size, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      removeFromCart(item.id, item.size);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
      
      <div className="cart-item-details">
        <h3>{item.product.name}</h3>
        <div className="cart-item-size">Kích thước: {item.size}</div>
        <div className="cart-item-price">{formatPrice(item.product.price)}</div>
        
        <div className="cart-item-quantity">
          <div className="quantity-controls">
            <button className="quantity-btn minus" onClick={handleDecrease}>-</button>
            <input type="text" className="quantity-input" value={item.quantity} readOnly />
            <button className="quantity-btn plus" onClick={handleIncrease}>+</button>
          </div>
          
          <button className="remove-item" onClick={handleRemove}>
            <FaTrash /> Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;