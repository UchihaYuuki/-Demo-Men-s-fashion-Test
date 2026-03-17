// src/components/products/ProductCard.jsx
import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import SizeModal from './SizeModal';
import QuickViewModal from './QuickViewModal';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import '../../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <>
      <div className="product-card">
        <div className="product-image">
          <img src={product.image} alt={product.title} loading="lazy" />
          {discount > 0 && (
            <span className="discount-badge">-{discount}%</span>
          )}
          
          <div className="product-actions">
            <button 
              className="quick-view-btn"
              onClick={() => setShowQuickView(true)}
            >
              Xem nhanh
            </button>
            <button 
              className="add-to-cart-btn"
              onClick={() => setShowSizeModal(true)}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          
          <div className="product-price">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <div className="sizes">
            {product.sizes.map(size => (
              <span key={size} className="size-btn">{size}</span>
            ))}
          </div>
        </div>
      </div>

      {showSizeModal && (
        <SizeModal
          product={product}
          onClose={() => setShowSizeModal(false)}
        />
      )}

      {showQuickView && (
        <QuickViewModal
          product={product}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
};

export default ProductCard;