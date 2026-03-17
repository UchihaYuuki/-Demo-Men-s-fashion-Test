// src/services/orderService.js
import API from './api';

const orderService = {
  // Lấy danh sách đơn hàng
  getOrders: async (params = {}) => {
    try {
      const response = await API.get('/orders', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
  // Tạo đơn hàng mới
createOrder: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await API.post('/orders', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật đơn hàng
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await API.put(`/orders/${orderId}`, orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId) => {
    try {
      const response = await API.delete(`/orders/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng - SỬA LẠI ĐÂY
  updateOrderStatus: async (orderId, status) => {
    try {
      // Với JSON Server, dùng PATCH hoặc PUT
      const response = await API.patch(`/orders/${orderId}`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê đơn hàng
  getOrderStats: async () => {
    try {
      const response = await API.get('/orders/stats/summary');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm đơn hàng
  searchOrders: async (query) => {
    try {
      const response = await API.get('/orders/search', { params: { q: query } });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy đơn hàng theo khách hàng
  getOrdersByCustomer: async (customerId) => {
    try {
      const response = await API.get(`/orders/customer/${customerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default orderService;