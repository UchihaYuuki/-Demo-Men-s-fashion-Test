// src/components/common/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Kiểm tra nếu đang ở trang đăng nhập (auth)
  const isAuthPage = location.pathname === '/auth' || location.pathname.includes('/auth');
  
  // Kiểm tra nếu đang ở trang admin (nếu có)
  const isAdminPage = location.pathname.includes('/admin');

  return (
    <>
      {/* Chỉ hiển thị Header nếu không phải trang auth và không phải trang admin */}
      {!isAuthPage && !isAdminPage && <Header />}
      
      <main>{children}</main>
      
      {/* Chỉ hiển thị Footer nếu không phải trang auth và không phải trang admin */}
      {!isAuthPage && !isAdminPage && <Footer />}
      
      {/* ChatBot chỉ hiển thị khi không phải trang auth và không phải trang admin */}
      {!isAuthPage && !isAdminPage && <ChatBot />}
    </>
  );
};

export default Layout;