// src/services/chatbotService.js
import API from './api';

const chatbotService = {
  // Lấy danh sách khách hàng tiềm năng
  getPotentialCustomers: async (params = {}) => {
    try {
      const response = await API.get('/chatbot/potential-customers', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết khách hàng tiềm năng
  getPotentialCustomerById: async (customerId) => {
    try {
      const response = await API.get(`/chatbot/potential-customers/${customerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Thêm khách hàng tiềm năng mới
  createPotentialCustomer: async (customerData) => {
    try {
      const response = await API.post('/chatbot/potential-customers', customerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin khách hàng tiềm năng
  updatePotentialCustomer: async (customerId, customerData) => {
    try {
      const response = await API.put(`/chatbot/potential-customers/${customerId}`, customerData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa khách hàng tiềm năng
  deletePotentialCustomer: async (customerId) => {
    try {
      const response = await API.delete(`/chatbot/potential-customers/${customerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch sử chat
  getChatHistory: async (customerId) => {
    try {
      const response = await API.get(`/chatbot/history/${customerId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thống kê chatbot
  getChatbotStats: async () => {
    try {
      const response = await API.get('/chatbot/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gửi tin nhắn chatbot
  sendMessage: async (message) => {
    try {
      const response = await API.post('/chatbot/message', { message });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã liên hệ
  markAsContacted: async (customerId) => {
    try {
      const response = await API.patch(`/chatbot/potential-customers/${customerId}/contacted`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm khách hàng tiềm năng
  searchPotentialCustomers: async (query) => {
    try {
      const response = await API.get('/chatbot/potential-customers/search', { 
        params: { q: query } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default chatbotService;