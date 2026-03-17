// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import BannerSlider from '../components/common/BannerSlider';
import ProductCard from '../components/products/ProductCard';
import { productsArray } from '../data/products';
import '../styles/HomePage.css';

const HomePage = () => {
  // Lọc sản phẩm khuyến mãi (có originalPrice)
  const promotionProducts = productsArray.filter(p => p.originalPrice).slice(0, 6);
  
  // Lọc sản phẩm bán chạy (có discount cao)
  const bestSellers = productsArray.filter(p => p.discount >= 30).slice(0, 10);

  const categories = [
    { name: 'Áo Polo', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=888', link: '/products?category=polo' },
    { name: 'Áo Thun', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_2_img.jpg?v=888', link: '/products?category=tshirt' },
    { name: 'Quần Jeans', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_3_img.jpg?v=888', link: '/products?category=jeans' },
    { name: 'Quần Âu', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_4_img.jpg?v=888', link: '/products?category=au' },
    { name: 'Áo Sơ Mi', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_5_img.jpg?v=888', link: '/products?category=so-mi' },
    { name: 'Áo Khoác', image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_category_8_img.jpg?v=888', link: '/products?category=khoac' }
  ];

  const outfits = [
    {
      id: 1,
      image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_1_img.jpg?v=888',
      title: 'OUTFIT TRẺ TRUNG',
      description: 'Full Bộ Thu Đông 2026',
      price: 750000,
      link: '/products'
    },
    {
      id: 2,
      image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_2_img.jpg?v=888',
      title: 'OUTFIT TRƯỞNG THÀNH',
      description: 'Áo Khoác + Quần KaKi',
      price: 350000,
      link: '/products'
    },
    {
      id: 3,
      image: 'https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_3_img.jpg?v=888',
      title: 'OUTFIT ĐI CHƠI',
      description: 'Áo Khoác + Áo Thun + Quần KaKi',
      price: 650000,
      link: '/products'
    },
    {
      id: 4,
      image: 'https://luvinus.com/wp-content/uploads/2019/09/phoi-do-nam-di-choi-3.jpg',
      title: 'OUTFIT HẸN HÒ',
      description: 'Áo thun + Quần Jeans',
      price: 550000,
      link: '/products'
    }
  ];

  return (
    <div className="home-page">
      <BannerSlider />

      {/* Danh mục sản phẩm */}
      <section className="product-categories">
        <div className="container">
          <h2>Danh Mục Sản Phẩm</h2>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <div key={index} className="category-item">
                <img src={cat.image} alt={cat.name} />
                <div className="category-title">
                  <Link to={cat.link}>
                    <h3>{cat.name}</h3>
                    <span className="arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm khuyến mãi */}
      <section className="promotions">
        <div className="container">
          <h2>Sản Phẩm Khuyến Mãi</h2>
          <div className="products-grid">
            {promotionProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="promo-view-all">
            <Link to="/products?filter=sale" className="cta-button">
              Xem tất cả sản phẩm khuyến mãi
            </Link>
          </div>
        </div>
      </section>

      {/* Sản phẩm bán chạy */}
      <section className="best-sellers">
        <div className="container">
          <h2>Sản Phẩm Bán Chạy</h2>
          <div className="products-grid">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Outfit of the Day */}
      <section className="outfit-of-day">
        <div className="container">
          <h2>OUTFIT OF THE DAY</h2>
          <div className="outfit-grid">
            {outfits.map(outfit => (
              <div key={outfit.id} className="outfit-item">
                <div className="outfit-image">
                  <img src={outfit.image} alt={outfit.title} />
                  <div className="outfit-price">{outfit.price.toLocaleString()}₫</div>
                </div>
                <div className="outfit-info">
                  <h3>{outfit.title}</h3>
                  <p>{outfit.description}</p>
                  <div className="outfit-tags">
                    <Link to={outfit.link} className="tag">MUA FULLSET</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;