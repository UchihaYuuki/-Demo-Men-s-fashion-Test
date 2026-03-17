// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Thời trang nam YuuKi</h3>
            <p>
              Hệ thống thời trang cho phát mạnh hàng đầu Việt Nam, 
              hướng tới phong cách nam tính, lịch lãm và trẻ trung.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/nguyen.phuong.453652" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 155.139 155.139">
                  <path d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452v20.341H37.29v27.585h23.814v70.761H89.584z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@phuonghocit" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 512 512">
                  <path d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/dtxomcac/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 512.00096 512.00096">
                  <path d="m373.40625 0h-234.8125c-76.421875 0-138.59375 62.171875-138.59375 138.59375v234.816406c0 76.417969 62.171875 138.589844 138.59375 138.589844h234.816406c76.417969 0 138.589844-62.171875 138.589844-138.589844v-234.816406c0-76.421875-62.171875-138.59375-138.59375-138.59375zm108.578125 373.410156c0 59.867188-48.707031 108.574219-108.578125 108.574219h-234.8125c-59.871094 0-108.578125-48.707031-108.578125-108.574219v-234.816406c0-59.871094 48.707031-108.578125 108.578125-108.578125h234.816406c59.867188 0 108.574219 48.707031 108.574219 108.578125zm0 0"></path>
                  <path d="m256 116.003906c-77.195312 0-139.996094 62.800782-139.996094 139.996094s62.800782 139.996094 139.996094 139.996094 139.996094-62.800782 139.996094-139.996094-62.800782-139.996094-139.996094-139.996094zm0 249.976563c-60.640625 0-109.980469-49.335938-109.980469-109.980469 0-60.640625 49.339844-109.980469 109.980469-109.980469 60.644531 0 109.980469 49.339844 109.980469 109.980469 0 60.644531-49.335938 109.980469-109.980469 109.980469zm0 0"></path>
                  <path d="m399.34375 66.285156c-22.8125 0-41.367188 18.558594-41.367188 41.367188 0 22.8125 18.554688 41.371094 41.367188 41.371094s41.371094-18.558594 41.371094-41.371094-18.558594-41.367188-41.371094-41.367188zm0 52.71875c-6.257812 0-11.351562-5.09375-11.351562-11.351562 0-6.261719 5.09375-11.351563 11.351562-11.351563 6.261719 0 11.355469 5.089844 11.355469 11.351563 0 6.257812-5.09375 11.351562-11.355469 11.351562zm0 0"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Thông tin liên hệ</h4>
            <p>📍 Tổng & tồn nhà Ford, số 351 Trường Chính, An Lão, Hải Phòng</p>
            <p>📞 0369788865</p>
            <p>✉️ nguyenducphuong2k4hp@gmail.com</p>
          </div>

          <div className="footer-section">
            <h4>Hỗ trợ khách hàng</h4>
            <p><Link to="/policy/returns">Chính sách đổi trả</Link></p>
            <p><Link to="/policy/privacy">Chính sách bảo mật</Link></p>
            <p><Link to="/guide">Hướng dẫn mua hàng</Link></p>
          </div>

          <div className="footer-section">
            <h4>Đăng ký nhận tin</h4>
            <p>Để cập nhật những sản phẩm mới và ưu đãi độc quyền</p>
            <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email của bạn" required />
              <button type="submit">Đăng ký</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 YuuKi. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;