// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Liên Hệ Với Chúng Tôi</h1>
          <p>
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ để được tư vấn về sản phẩm 
            hoặc bất kỳ câu hỏi nào khác.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-header">
            <h2>Gửi Lời Nhắn Cho YuuKi</h2>
            <p>Hãy điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ.</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-info-card">
                <div className="contact-icon">📍</div>
                <h3>Địa Chỉ</h3>
                <p>Thái Sơn, An Lão, Hải Phòng</p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">📞</div>
                <h3>Số Điện Thoại</h3>
                <p><a href="tel:0369788865">0369788865</a></p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">✉️</div>
                <h3>Email</h3>
                <p><a href="mailto:nguyenducphuong2k4hp@gmail.com">nguyenducphuong2k4hp@gmail.com</a></p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">🕒</div>
                <h3>Giờ Làm Việc</h3>
                <p>Thứ 2 - Thứ CN : 8:00 - 16:00</p>
              </div>
            </div>

            <div className="contact-form">
              {submitSuccess && (
                <div className="success-message">
                  Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ sớm nhất.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Họ và Tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số Điện Thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tin Nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Viết tin nhắn của bạn ở đây..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                </button>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.5!2d106.678!3d20.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313d0b0a0a0a0a0a%3A0x0!2zVGjDoWkgU8ahbiwgQW4gTMOhbywgSOG6o2kgUGjDsm5n!5e0!3m2!1svi!2svi!4v1728450000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="YuuKi Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;