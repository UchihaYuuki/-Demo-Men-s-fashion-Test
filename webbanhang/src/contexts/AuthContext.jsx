// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Danh sách tài khoản từ file FromDangNhap.js
const validAccounts = [
  { 
    username: "Yuuki@2k4", 
    password: "123456", 
    role: "user",
    email: "user@yuuki.com",
    fullName: "Xin Chào !!! Yuuki@2k4"
  },
  { 
    username: "Admin", 
    password: "Phuong@789kn", 
    role: "admin",
    email: "admin@yuuki.com",
    fullName: "Admin"
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username, password) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = validAccounts.find(
          account => account.username === username && account.password === password
        );

        if (foundUser) {
          const userData = {
            username: foundUser.username,
            role: foundUser.role,
            email: foundUser.email,
            fullName: foundUser.fullName
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          toast.success('Đăng nhập thành công!');
          resolve({ success: true, user: foundUser });
        } else {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
          reject(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));
        }
        setLoading(false);
      }, 1000);
    });
  };

  // Hàm đăng xuất có xác nhận và trả về kết quả
  const logout = (showConfirm = true) => {
    return new Promise((resolve) => {
      // Nếu showConfirm = true thì hiển thị hộp thoại xác nhận
      if (showConfirm) {
        const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
        if (!confirmLogout) {
          resolve(false); // Người dùng chọn Hủy
          return;
        }
      }
      
      // Thực hiện đăng xuất
      setUser(null);
      localStorage.removeItem('user');
      toast.success('Đã đăng xuất!');
      resolve(true); // Đăng xuất thành công
    });
  };

  // Hàm đăng xuất không cần xác nhận
  const forceLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Đã đăng xuất!');
  };

  const register = (userData) => {
    setLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const exists = validAccounts.some(acc => acc.username === userData.username);
        
        if (exists) {
          toast.error('Tên đăng nhập đã tồn tại');
          reject(new Error('Tên đăng nhập đã tồn tại'));
        } else {
          toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
          resolve({ success: true, message: 'Đăng ký thành công' });
        }
        setLoading(false);
      }, 1000);
    });
  };

  const value = {
    user,
    loading,
    login,
    logout,      // Trả về Promise
    forceLogout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};