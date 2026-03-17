// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, loading } = useAuth();

  const [isLogin, setIsLogin] = useState(!searchParams.get('register'));
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLogin()) return;

    try {
      await login(formData.username, formData.password);
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegister()) return;

    try {
      await register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        fullname: formData.fullname
      });
      // Chuyển sang form đăng nhập sau khi đăng ký thành công
      setIsLogin(true);
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        email: ''
      });
      setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="decoration"></div>
      <div className="decoration"></div>

      <div className="brand-header">
        <h1>YuuKi</h1>
        <p>THỜI TRANG NAM - Cao Cấp</p>
      </div>

      <div className="auth-container">
        <div className="form-container">
          {/* Login Form */}
          {isLogin ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-header">
                <h2>Đăng Nhập</h2>
                <p>Chào mừng trở lại với YuuKi</p>
              </div>

              {message && <div className="success-message">{message}</div>}

              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Tên đăng nhập</label>
                <FaUser className="input-icon" />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Mật khẩu</label>
                <FaLock className="input-icon" />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {message && !message.includes('thành công') && <p className="error-message text-center">{message}</p>}

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
              </button>

              <div className="form-footer">
                <p>
                  Bạn chưa có tài khoản?{' '}
                  <button type="button" onClick={handleToggle} className="toggle-link">
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Register Form */
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-header">
                <h2>Đăng Ký</h2>
                <p>Tham gia cùng YuuKi ngay hôm nay</p>
              </div>

              {message && <div className="success-message">{message}</div>}

              <div className="input-group">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Họ và tên</label>
                <FaUser className="input-icon" />
                {errors.fullname && <span className="error-message">{errors.fullname}</span>}
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Email</label>
                <FaEnvelope className="input-icon" />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Tên đăng nhập</label>
                <FaUserTag className="input-icon" />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Mật khẩu</label>
                <FaLock className="input-icon" />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="input-group">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label>Xác nhận mật khẩu</label>
                <FaLock className="input-icon" />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {message && !message.includes('thành công') && <p className="error-message text-center">{message}</p>}

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng Ký'}
              </button>

              <div className="form-footer">
                <p>
                  Đã có tài khoản?{' '}
                  <button type="button" onClick={handleToggle} className="toggle-link">
                    Đăng nhập ngay
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;