// src/hooks/useChatbot.js
import { useState, useEffect, useCallback } from 'react';
import chatbotService from '../services/chatbotService';
import toast from 'react-hot-toast';

// DỮ LIỆU KHÁCH HÀNG TIỀM NĂNG CŨ
const MOCK_CUSTOMERS = [
  {
    id: 'C001',
    name: 'Nguyễn Văn Anh',
    phone: '0972405120',
    address: 'Hà Nội',
    interest: 'Áo polo, Quần jeans',
    source: 'Chatbot',
    createdAt: '2025-03-15T10:30:00.000Z',
    status: 'contacted',
    notes: 'Khách quan tâm sản phẩm áo polo màu trắng'
  },
  {
    id: 'C002',
    name: 'Nguyễn Đức Phương',
    phone: '0369788865',
    address: 'Hải Phòng',
    interest: 'Áo khoác, Quần âu',
    source: 'Chatbot',
    createdAt: '2025-03-14T15:45:00.000Z',
    status: 'new',
    notes: 'Khách hỏi về áo khoác mùa đông'
  },
  {
    id: 'C003',
    name: 'Trần Hữu Trung',
    phone: '0369788899',
    address: 'TP.HCM',
    interest: 'Áo thun, Quần short',
    source: 'Chatbot',
    createdAt: '2025-03-13T09:20:00.000Z',
    status: 'contacted',
    notes: 'Đã tư vấn và gửi bảng giá'
  },
  {
    id: 'C004',
    name: 'Lê Thị Hương',
    phone: '0987123456',
    address: 'Đà Nẵng',
    interest: 'Váy đầm, Phụ kiện',
    source: 'Chatbot',
    createdAt: '2025-03-12T14:10:00.000Z',
    status: 'new',
    notes: 'Khách muốn tìm váy dự tiệc'
  },
  {
    id: 'C005',
    name: 'Phạm Văn Tuấn',
    phone: '0912345678',
    address: 'Cần Thơ',
    interest: 'Giày dép, Balo',
    source: 'Chatbot',
    createdAt: '2025-03-11T11:30:00.000Z',
    status: 'contacted',
    notes: 'Đã gửi catalog sản phẩm'
  }
];

const MOCK_STATS = {
  total: 5,
  contacted: 3,
  new: 2
};

export const useChatbot = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(MOCK_STATS);

  const fetchPotentialCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatbotService.getPotentialCustomers(params);
      if (response.data && response.data.length > 0) {
        // Thêm khách hàng mới vào sau dữ liệu cũ
        setCustomers(prev => [...prev, ...response.data]);
        
        // Cập nhật thống kê
        const newContacted = response.data.filter(c => c.status === 'contacted').length;
        const newNew = response.data.filter(c => c.status === 'new').length;
        
        setStats(prev => ({
          total: prev.total + response.data.length,
          contacted: prev.contacted + newContacted,
          new: prev.new + newNew
        }));
      }
      return response;
    } catch (err) {
      setError(err.message);
      toast.error('Không thể tải danh sách khách hàng, đang dùng dữ liệu mẫu');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChatbotStats = useCallback(async () => {
    try {
      const response = await chatbotService.getChatbotStats();
      if (response) {
        setStats(prev => ({
          total: prev.total + (response.total || 0),
          contacted: prev.contacted + (response.contacted || 0),
          new: prev.new + (response.new || 0)
        }));
      }
    } catch (err) {
      console.error('Lỗi tải thống kê chatbot, giữ nguyên dữ liệu mẫu');
    }
  }, []);

  const createPotentialCustomer = useCallback(async (customerData) => {
    try {
      const response = await chatbotService.createPotentialCustomer(customerData);
      
      // Thêm khách hàng mới vào đầu danh sách
      const newCustomer = {
        ...customerData,
        id: response.id || `NEW${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      setCustomers(prev => [newCustomer, ...prev]);
      
      // Cập nhật thống kê
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        new: prev.new + 1
      }));
      
      toast.success('Thêm khách hàng thành công!');
      return response;
    } catch (err) {
      toast.error('Không thể thêm khách hàng');
      throw err;
    }
  }, []);

  const updatePotentialCustomer = useCallback(async (customerId, customerData) => {
    try {
      const response = await chatbotService.updatePotentialCustomer(customerId, customerData);
      
      // Cập nhật khách hàng trong danh sách
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? { ...customer, ...customerData } : customer
        )
      );
      
      toast.success('Cập nhật khách hàng thành công!');
      return response;
    } catch (err) {
      toast.error('Không thể cập nhật khách hàng');
      throw err;
    }
  }, []);

  const deletePotentialCustomer = useCallback(async (customerId) => {
    try {
      await chatbotService.deletePotentialCustomer(customerId);
      
      // Xóa khách hàng khỏi danh sách
      const deletedCustomer = customers.find(c => c.id === customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      
      // Cập nhật thống kê
      if (deletedCustomer) {
        setStats(prev => ({
          total: prev.total - 1,
          contacted: prev.contacted - (deletedCustomer.status === 'contacted' ? 1 : 0),
          new: prev.new - (deletedCustomer.status === 'new' ? 1 : 0)
        }));
      }
      
      toast.success('Xóa khách hàng thành công!');
    } catch (err) {
      toast.error('Không thể xóa khách hàng');
      throw err;
    }
  }, [customers]);

  const markAsContacted = useCallback(async (customerId) => {
    try {
      const response = await chatbotService.markAsContacted(customerId);
      
      // Cập nhật trạng thái
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === customerId ? { ...customer, status: 'contacted' } : customer
        )
      );
      
      // Cập nhật thống kê
      setStats(prev => ({
        ...prev,
        contacted: prev.contacted + 1,
        new: prev.new - 1
      }));
      
      toast.success('Đã cập nhật trạng thái!');
      return response;
    } catch (err) {
      toast.error('Không thể cập nhật trạng thái');
      throw err;
    }
  }, []);

  const searchCustomers = useCallback(async (query) => {
    setLoading(true);
    try {
      const response = await chatbotService.searchPotentialCustomers(query);
      
      // Kết hợp kết quả tìm kiếm với dữ liệu cũ
      const searchResults = response.data || [];
      const combinedResults = [...MOCK_CUSTOMERS, ...searchResults].filter(customer => 
        customer.name?.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone?.includes(query) ||
        customer.interest?.toLowerCase().includes(query.toLowerCase())
      );
      
      setCustomers(combinedResults);
      return response;
    } catch (err) {
      toast.error('Không thể tìm kiếm khách hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPotentialCustomers();
    fetchChatbotStats();
  }, [fetchPotentialCustomers, fetchChatbotStats]);

  return {
    customers,
    loading,
    error,
    stats,
    fetchPotentialCustomers,
    createPotentialCustomer,
    updatePotentialCustomer,
    deletePotentialCustomer,
    markAsContacted,
    searchCustomers
  };
};