// src/pages/admin/components/AdminSidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FaBox, FaShoppingCart, FaChartLine, FaUsers, FaComments, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'products', label: 'Quản lý Sản phẩm', icon: <FaBox /> },
    { id: 'orders', label: 'Quản lý Đơn hàng', icon: <FaShoppingCart /> },
    { id: 'revenue', label: 'Quản lý Doanh thu', icon: <FaChartLine /> },
    { id: 'users', label: 'Quản lý Tài khoản', icon: <FaUsers /> },
    { id: 'chatbot', label: 'Quản lý Chatbot', icon: <FaComments /> },
  ];

  const handleLogout = async () => {
    if (window.confirm('Bạn có muốn đăng xuất không?')) {
      await logout(true);
      navigate('/auth');
    }
  };

  return (
    <div className="admin-sidebar">
      <h3 className="admin-logo">YuuKi Admin</h3>
      
      <ul className="admin-nav">
        {menuItems.map(item => (
          <li key={item.id}>
            <button
              className={`admin-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <button className="admin-logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="me-2" />
        Quay lại trang đăng nhập
      </button>
    </div>
  );
};

export default AdminSidebar;