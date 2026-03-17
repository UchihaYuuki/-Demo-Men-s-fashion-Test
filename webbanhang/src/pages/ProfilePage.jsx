// src/pages/ProfilePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignOutAlt, FaHome, FaUser, FaEnvelope, FaTag } from 'react-icons/fa';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Nếu chưa đăng nhập, chuyển về trang đăng nhập
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = async () => {
    try {
      const loggedOut = await logout(true); // Có xác nhận
      if (loggedOut) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Thông Tin Tài Khoản</h1>
        
        <div className="profile-card">
          <div className="profile-avatar">
            <FaUser />
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <label>Họ và tên</label>
                <p>{user?.fullName || user?.username || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <label>Email</label>
                <p>{user?.email || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            <div className="info-item">
              <FaTag className="info-icon" />
              <div>
                <label>Vai trò</label>
                <p>
                  <span className={`role-badge ${user?.role}`}>
                    {user?.role === 'admin' ? '' : ''}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="info-item">
              <FaUser className="info-icon" />
              <div>
                <label>Tên đăng nhập</label>
                <p>{user?.username}</p>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={handleBackToHome} className="home-btn">
              <FaHome /> Về trang chủ
            </button>
            
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;