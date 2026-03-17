// src/utils/formatters.js

/**
 * Format giá tiền VND
 * @param {number} price - Giá cần format
 * @returns {string} - Giá đã format (VD: 399.000₫)
 */
export const formatPrice = (price) => {
  // Kiểm tra price hợp lệ
  if (price === undefined || price === null) {
    console.warn('formatPrice nhận giá trị undefined/null');
    return '0₫';
  }
  
  if (isNaN(price)) {
    console.warn('formatPrice nhận giá trị NaN');
    return '0₫';
  }
  
  try {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  } catch (error) {
    console.error('Lỗi formatPrice:', error);
    return price + '₫';
  }
};

/**
 * Tính phần trăm giảm giá
 * @param {number} price - Giá hiện tại
 * @param {number} oldPrice - Giá cũ
 * @returns {number} - Phần trăm giảm giá
 */
export const calculateDiscount = (price, oldPrice) => {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

/**
 * Format số điện thoại
 * @param {string} phone - Số điện thoại cần format
 * @returns {string} - Số điện thoại đã format (VD: 0369 788 865)
 */
export const formatPhone = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return match[1] + ' ' + match[2] + ' ' + match[3];
  }
  return phone;
};

/**
 * Tạo mã đơn hàng ngẫu nhiên
 * @returns {string} - Mã đơn hàng (VD: YUKI123456 hoặc YUK123456)
 */
export const generateOrderNumber = () => {
  // Tạo số ngẫu nhiên 6 chữ số
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  
  // Lấy timestamp để đảm bảo unique
  const timestamp = Date.now().toString().slice(-4);
  
  // Kết hợp để tạo mã đơn hàng
  // Format: YUK + timestamp(4 số) + random(6 số)
  return `YUK${timestamp}${randomNum}`;
};

/**
 * Format ngày tháng
 * @param {Date|string} date - Ngày cần format
 * @returns {string} - Ngày đã format (DD/MM/YYYY)
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN');
};

/**
 * Rút gọn tên sản phẩm
 * @param {string} name - Tên sản phẩm
 * @param {number} maxLength - Độ dài tối đa (mặc định: 50)
 * @returns {string} - Tên đã rút gọn
 */
export const truncateName = (name, maxLength = 50) => {
  if (!name) return '';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
};

/**
 * Format số lượng
 * @param {number} quantity - Số lượng
 * @returns {string} - Số lượng đã format
 */
export const formatQuantity = (quantity) => {
  return new Intl.NumberFormat('vi-VN').format(quantity);
};

/**
 * Tính tổng tiền giỏ hàng
 * @param {Array} cartItems - Mảng các item trong giỏ hàng
 * @returns {number} - Tổng tiền
 */
export const calculateCartTotal = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return 0;
  return cartItems.reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
};

/**
 * Tính phí vận chuyển
 * @param {number} subtotal - Tổng tiền hàng
 * @returns {number} - Phí vận chuyển
 */
export const calculateShipping = (subtotal) => {
  // Miễn phí vận chuyển cho đơn hàng trên 500k
  if (subtotal >= 500000) return 0;
  return 30000; // Phí vận chuyển mặc định 30k
};

/**
 * Format địa chỉ
 * @param {Object} address - Đối tượng địa chỉ
 * @returns {string} - Địa chỉ đã format
 */
export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.ward) parts.push(address.ward);
  if (address.district) parts.push(address.district);
  if (address.city) parts.push(address.city);
  return parts.join(', ');
};

// Tạo object chứa tất cả các hàm để export default
const formatters = {
  formatPrice,
  calculateDiscount,
  formatPhone,
  generateOrderNumber,
  formatDate,
  truncateName,
  formatQuantity,
  calculateCartTotal,
  calculateShipping,
  formatAddress
};

export default formatters;