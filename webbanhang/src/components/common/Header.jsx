// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaShoppingCart, FaUser, FaSearch, FaMoon, FaSun, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import '../../styles/Header.css';

const Header = () => {
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
    // Đóng menu trước khi xử lý đăng xuất
    setShowUserMenu(false);
    
    try {
      // Gọi hàm logout có xác nhận và chờ kết quả
      const loggedOut = await logout(true);
      
      if (loggedOut) {
        // Nếu đăng xuất thành công, chuyển về trang đăng nhập
        navigate('/auth');
      }
      // Nếu không thành công (người dùng chọn Cancel) thì không làm gì
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const handleAdminPanel = () => {
    setShowUserMenu(false);
    navigate('/admin');
  };

  const handleProfile = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">YuuKi</Link>
        </div>

        <nav className="main-menu">
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/ai-assistant">🤖 Trợ lý thời trang AI</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <div className="user-menu">
            <button 
              className="account-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Tài khoản"
            >
              <FaUser />
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="user-info">
                      <strong>{user.fullName || user.username}</strong>
                      <span className="user-role">{user.role === 'admin' ? '' : ''}</span>
                    </div>
                    
                    {isAdmin && (
                      <button onClick={handleAdminPanel} className="dropdown-item">
                        <FaUserCog /> Quản trị
                      </button>
                    )}
                    
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <FaSignOutAlt /> Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Đăng nhập
                    </Link>
                    <Link to="/auth?register=true" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="cart-btn">
            <FaShoppingCart />
            <span className="cart-count">{getCartCount()}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;