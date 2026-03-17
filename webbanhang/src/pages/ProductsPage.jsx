// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { productsArray } from '../data/products';
import '../styles/ProductsPage.css';

const ProductsPage = () => {
  const [products] = useState(productsArray);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSales, setSelectedSales] = useState([]);
  
  const itemsPerPage = 12; // 12 sản phẩm mỗi trang

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const formatPrice = (price) => {
    return price.toLocaleString() + 'đ';
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      setTimeout(() => applyFilters(newCategories, selectedSizes, selectedSales, minPrice, maxPrice), 0);
      return newCategories;
    });
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size];
      
      setTimeout(() => applyFilters(selectedCategories, newSizes, selectedSales, minPrice, maxPrice), 0);
      return newSizes;
    });
  };

  const handleSaleChange = (sale) => {
    setSelectedSales(prev => {
      const newSales = prev.includes(sale)
        ? prev.filter(s => s !== sale)
        : [...prev, sale];
      
      setTimeout(() => applyFilters(selectedCategories, selectedSizes, newSales, minPrice, maxPrice), 0);
      return newSales;
    });
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setMaxPrice(value);
    applyFilters(selectedCategories, selectedSizes, selectedSales, minPrice, value);
  };

  const applyFilters = (categories, sizes, sales, min, max) => {
    let filtered = [...products];

    // Lọc theo khoảng giá
    filtered = filtered.filter(p => p.price >= min && p.price <= max);

    // Lọc theo danh mục sale
    if (sales.length > 0) {
      filtered = filtered.filter(p => {
        return sales.some(sale => {
          const discountValue = parseInt(sale.split('-')[1]);
          if (sale.includes('tu')) {
            return p.discount >= discountValue;
          } else {
            return p.discount === discountValue;
          }
        });
      });
    }

    // Lọc theo danh mục sản phẩm
    if (categories.length > 0) {
      filtered = filtered.filter(p => categories.includes(p.category));
    }

    // Lọc theo kích cỡ
    if (sizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => sizes.includes(size))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const changePage = (page) => {
    const maxPage = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getCurrentProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="product-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Sản Phẩm Mới</h1>
          <p className="page-subtitle">Khám phá những sản phẩm mới nhất từ YuuKi</p>
        </div>

        <div className="product-layout">
          {/* Sidebar Filter */}
          <aside className="sidebar">
            <h3>Bộ lọc</h3>
            
            <div className="filter-group">
              <h4>Danh mục Sale</h4>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-10" 
                  checked={selectedSales.includes('sale-10')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE 10%
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-15"
                  checked={selectedSales.includes('sale-15')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE 15%
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-20"
                  checked={selectedSales.includes('sale-20')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE từ 20%
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-30"
                  checked={selectedSales.includes('sale-30')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE từ 30%
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-40"
                  checked={selectedSales.includes('sale-40')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE từ 40%
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="sale-50"
                  checked={selectedSales.includes('sale-50')}
                  onChange={(e) => handleSaleChange(e.target.value)}
                /> SALE 50%
              </label>
            </div>

            <div className="filter-group">
              <h4>Danh mục sản phẩm</h4>
              <label>
                <input 
                  type="checkbox" 
                  value="polo"
                  checked={selectedCategories.includes('polo')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Áo Polo
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="tshirt"
                  checked={selectedCategories.includes('tshirt')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Áo Thun
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="so-mi"
                  checked={selectedCategories.includes('so-mi')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Áo Sơ Mi
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="khoac"
                  checked={selectedCategories.includes('khoac')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Áo Khoác
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="short"
                  checked={selectedCategories.includes('short')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Quần Short
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="jeans"
                  checked={selectedCategories.includes('jeans')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Quần Jeans
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="au"
                  checked={selectedCategories.includes('au')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Quần Âu
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="dai-kaki"
                  checked={selectedCategories.includes('dai-kaki')}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                /> Quần Dài Kaki
              </label>
            </div>

            <div className="filter-group">
              <h4>Khoảng giá</h4>
              <div className="price-display">
                <span>{formatPrice(minPrice)}</span>
                <span>{formatPrice(maxPrice)}</span>
              </div>
              <input 
                type="range" 
                className="price-slider" 
                min="0" 
                max="2000000" 
                step="10000"
                value={maxPrice}
                onChange={handlePriceChange}
              />
            </div>

            <div className="filter-group">
              <h4>Kích cỡ</h4>
              <label>
                <input 
                  type="checkbox" 
                  value="S"
                  checked={selectedSizes.includes('S')}
                  onChange={(e) => handleSizeChange(e.target.value)}
                /> S
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="M"
                  checked={selectedSizes.includes('M')}
                  onChange={(e) => handleSizeChange(e.target.value)}
                /> M
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="L"
                  checked={selectedSizes.includes('L')}
                  onChange={(e) => handleSizeChange(e.target.value)}
                /> L
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="XL"
                  checked={selectedSizes.includes('XL')}
                  onChange={(e) => handleSizeChange(e.target.value)}
                /> XL
              </label>
              <label>
                <input 
                  type="checkbox" 
                  value="XXL"
                  checked={selectedSizes.includes('XXL')}
                  onChange={(e) => handleSizeChange(e.target.value)}
                /> XXL
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <div className="product-stats">
              <span>Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">Không có sản phẩm phù hợp.</div>
            ) : (
              <>
                <div className="product-grid">
                  {getCurrentProducts().map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => changePage(currentPage - 1)} 
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => changePage(i + 1)}
                        className={currentPage === i + 1 ? 'active' : ''}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => changePage(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    >
                      &raquo;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;