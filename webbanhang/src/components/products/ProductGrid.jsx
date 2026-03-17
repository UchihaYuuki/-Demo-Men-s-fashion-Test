// src/components/products/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="product-grid-loading">
        <div className="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;