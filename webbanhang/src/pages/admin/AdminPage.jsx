// src/pages/admin/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminRevenue from './AdminRevenue';
import AdminUsers from './AdminUsers';
import AdminChatbot from './AdminChatbot';
import '../../styles/admin.css';  // ĐÃ SỬA - chỉ 2 cấp

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('products');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const renderSection = () => {
    switch(activeSection) {
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'revenue':
        return <AdminRevenue />;
      case 'users':
        return <AdminUsers />;
      case 'chatbot':
        return <AdminChatbot />;
      default:
        return <AdminProducts />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-container">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="admin-main-content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;