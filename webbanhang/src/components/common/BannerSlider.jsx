// src/components/common/BannerSlider.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/BannerSlider.css';

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      title: "Siêu Sale Ngày Đôi",
      subtitle: "Giảm Đến 50 %\n06/10 - 10/10",
      link: "/products"
    },
    {
      id: 2,
      image: "https://theme.hstatic.net/200000690725/1001078549/14/slide_2_img.jpg?v=888",
      title: "YuuKi",
      subtitle: "PHONG CÁCH ĐẲNG CẤP\nVƯỢT THỜI GIAN",
      link: "/products"
    },
    {
      id: 3,
      image: "https://theme.hstatic.net/200000690725/1001078549/14/slide_1_img.jpg?v=888",
      title: "Bộ Sưu Tập Mới",
      subtitle: "THU ĐÔNG 2026\nLỊCH LÃM & TRẺ TRUNG",
      link: "/products"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="banner-slider">
      <div className="slider-container">
        <div 
          className="slider-track" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <img src={slide.image} alt={slide.title} className="slide-image" />
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="slide-link">Xem Ngay</Link>
              </div>
            </div>
          ))}
        </div>

        <button className="slider-arrow prev" onClick={prevSlide}>❮</button>
        <button className="slider-arrow next" onClick={nextSlide}>❯</button>

        <div className="slider-nav">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;