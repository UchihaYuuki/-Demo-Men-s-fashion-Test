// src/components/products/ProductFilter.jsx
import React, { useState } from 'react';
import '../../styles/ProductFilter.css';

const ProductFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    categories: [],
    sizes: [],
    priceRange: [0, 2000000],
    search: ''
  });

  const categories = [
    { value: 'polo', label: 'Áo Polo' },
    { value: 'tshirt', label: 'Áo Thun' },
    { value: 'so-mi', label: 'Áo Sơ Mi' },
    { value: 'khoac', label: 'Áo Khoác' },
    { value: 'jeans', label: 'Quần Jeans' },
    { value: 'au', label: 'Quần Âu' },
    { value: 'short', label: 'Quần Short' },
    { value: 'promotions', label: 'Khuyến mãi' },
    { value: 'best-sellers', label: 'Bán chạy' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSizeChange = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    
    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    const newFilters = { ...filters, priceRange: [0, value] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = (e) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      categories: [],
      sizes: [],
      priceRange: [0, 2000000],
      search: ''
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <aside className="sidebar">
      <h3>Bộ lọc sản phẩm</h3>

      <div className="filter-group">
        <h4>Tìm kiếm</h4>
        <input
          type="text"
          placeholder="Tên sản phẩm..."
          value={filters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <h4>Danh mục</h4>
        {categories.map(cat => (
          <label key={cat.value} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat.value)}
              onChange={() => handleCategoryChange(cat.value)}
            />
            {cat.label}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <h4>Kích thước</h4>
        <div className="size-filters">
          {sizes.map(size => (
            <button
              key={size}
              className={`size-filter-btn ${filters.sizes.includes(size) ? 'active' : ''}`}
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Khoảng giá</h4>
        <div className="price-display">
          <span>0đ</span>
          <span>{filters.priceRange[1].toLocaleString()}đ</span>
        </div>
        <input
          type="range"
          className="price-slider"
          min="0"
          max="2000000"
          step="10000"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
        />
      </div>

      <button className="clear-filters-btn" onClick={clearFilters}>
        Xóa bộ lọc
      </button>
    </aside>
  );
};

export default ProductFilter;