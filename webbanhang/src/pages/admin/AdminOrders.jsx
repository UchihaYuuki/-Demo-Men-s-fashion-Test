// src/pages/admin/AdminOrders.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaTimes, 
  FaCheck, 
  FaTruck, 
  FaClock,
  FaBoxOpen,
  FaUser,
  FaMoneyBillWave,
  FaSyncAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import orderService from '../../services/orderService';

// GIỮ NGUYÊN MOCK DATA CŨ
const MOCK_ORDERS = [
  {
    id: 'ORD240301',
    customer: { name: 'Nguyễn Đức Thịch', phone: '0972405120', email: 'thich.nd@gmail.com' },
    items: [
      { name: 'Sơ mi dài tay EATB011', quantity: 2, price: 250000 }
    ],
    total: 500000,
    status: 'completed',
    createdAt: '2025-03-15T10:30:00.000Z',
    paymentMethod: 'Chuyển khoản',
    address: '123 Đường Láng, Đống Đa, Hà Nội'
  },
  {
    id: 'ORD240302',
    customer: { name: 'Nguyễn Đức Phương', phone: '0369788865', email: 'phuong.nd@gmail.com' },
    items: [
      { name: 'Quần âu slim-fit FABT007', quantity: 1, price: 250000 }
    ],
    total: 250000,
    status: 'shipping',
    createdAt: '2025-03-14T15:45:00.000Z',
    paymentMethod: 'COD',
    address: '456 Đường Lê Lợi, Ngô Quyền, Hải Phòng'
  },
  {
    id: 'ORD240303',
    customer: { name: 'Đào Văn Đức', phone: '0987654321', email: 'duc.dv@gmail.com' },
    items: [
      { name: 'Áo polo monogram GSTP051', quantity: 1, price: 299000 }
    ],
    total: 299000,
    status: 'pending',
    createdAt: '2025-03-13T09:20:00.000Z',
    paymentMethod: 'Chuyển khoản',
    address: '789 Đường Nguyễn Huệ, Quận 1, TP.HCM'
  },
  {
    id: 'ORD240304',
    customer: { name: 'Trần Hữu Trung', phone: '0912345678', email: 'trung.th@gmail.com' },
    items: [
      { name: 'Áo T shirt GSTS018', quantity: 2, price: 249000 },
      { name: 'Quần jeans GABJ861', quantity: 1, price: 285000 }
    ],
    total: 783000,
    status: 'shipping',
    createdAt: '2025-03-12T14:10:00.000Z',
    paymentMethod: 'MoMo',
    address: '321 Đường Bạch Đằng, Hải Châu, Đà Nẵng'
  },
  {
    id: 'ORD240305',
    customer: { name: 'Nguyễn Văn Anh', phone: '0909123456', email: 'anh.nv@gmail.com' },
    items: [
      { name: 'Áo khoác 3 lớp EWCP001', quantity: 1, price: 350000 }
    ],
    total: 350000,
    status: 'completed',
    createdAt: '2025-03-11T11:30:00.000Z',
    paymentMethod: 'COD',
    address: '654 Đường Nguyễn Trãi, Ninh Kiều, Cần Thơ'
  }
];

// MOCK STATS
const MOCK_STATS = {
  total: 5,
  completed: 2,
  shipping: 2,
  pending: 1,
  cancelled: 0
};


const AdminOrders = () => {
  // THÊM: State cho API thật
  const [apiOrders, setApiOrders] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // GIỮ NGUYÊN state cũ - QUAN TRỌNG: Phải có setOrders
  const [orders, setOrders] = useState(MOCK_ORDERS);  // <-- PHẢI CÓ DÒNG NÀY
  const [loading] = useState(false);
  const [stats] = useState(MOCK_STATS);

  // THÊM: State để chọn dùng mock hay API
  const [useRealAPI, setUseRealAPI] = useState(false);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ===========================================
  // BƯỚC 1: SỬA HÀM fetchOrdersFromAPI
  // ===========================================
  const fetchOrdersFromAPI = async () => {
    setApiLoading(true);
    setApiError(null);
    
    try {
      console.log('📡 Đang gọi API lấy danh sách đơn hàng...');
      
      // Gọi API với filter và search
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (searchTerm) params.search = searchTerm;
      
      const response = await orderService.getOrders(params);
      
      console.log('✅ API trả về:', response);
      
      // XỬ LÝ DỮ LIỆU TỪ API
      let ordersData = [];
      
      // Kiểm tra cấu trúc response
      if (Array.isArray(response)) {
        // Nếu response là mảng trực tiếp
        ordersData = response;
      } else if (response && response.data) {
        // Nếu response có dạng { data: [...] }
        ordersData = response.data;
      } else if (response && response.orders) {
        // Nếu response có dạng { orders: [...] }
        ordersData = response.orders;
      } else {
        ordersData = [];
      }
      
      console.log('📦 Dữ liệu orders sau khi xử lý:', ordersData);
      
      // CHUYỂN ĐỔI DỮ LIỆU API SANG FORMAT COMPONENT HIỂU
      const formattedOrders = ordersData.map(order => {
        // Xử lý items
        let items = [];
        if (Array.isArray(order.items)) {
          items = order.items.map(item => ({
            name: item.name || item.product?.name || 'Sản phẩm',
            quantity: item.quantity || 1,
            price: item.price || item.product?.price || 0
          }));
        }
        
        // Xử lý customer
        const customerName = order.customerName || order.customer?.name || 'Khách hàng';
        const customerPhone = order.phone || order.customer?.phone || 'N/A';
        const customerEmail = order.email || order.customer?.email || '';
        
        return {
          id: order.id,
          // Format cho phần customer (dùng trong modal)
          customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail
          },
          // Format cho phần bảng (dùng trực tiếp)
          customerName: customerName,
          phone: customerPhone,
          items: items,
          total: order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || new Date().toISOString(),
          paymentMethod: order.paymentMethod || 'cod',
          address: order.address || ''
        };
      });
      
      console.log('🎨 Dữ liệu đã format:', formattedOrders);
      
      // Cập nhật state
      setApiOrders(formattedOrders);
      
      // Tính toán stats
      const newStats = {
        total: formattedOrders.length,
        completed: formattedOrders.filter(o => o.status === 'completed').length,
        shipping: formattedOrders.filter(o => o.status === 'shipping').length,
        pending: formattedOrders.filter(o => o.status === 'pending').length,
        cancelled: formattedOrders.filter(o => o.status === 'cancelled').length
      };
      setApiStats(newStats);
      
      console.log('📊 Stats mới:', newStats);
      
    } catch (error) {
      console.error('❌ Lỗi fetch API:', error);
      setApiError(error.message);
      toast.error('Không thể tải đơn hàng từ server');
    } finally {
      setApiLoading(false);
    }
  };

  // Hàm cập nhật trạng thái đơn hàng qua API
  // THÊM: Hàm cập nhật trạng thái đơn hàng qua API
const updateOrderStatusAPI = async (orderId, newStatus) => {
  try {
    console.log(`📡 Đang cập nhật đơn hàng ${orderId} sang ${newStatus}...`);
    
    // SỬA: Dùng đúng endpoint
    const response = await orderService.updateOrderStatus(orderId, newStatus);
    
    console.log('✅ API cập nhật thành công:', response);
    
    // Cập nhật local state
    setApiOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast.success(`Đã cập nhật trạng thái đơn hàng!`);
    return true;
  } catch (error) {
    console.error('❌ Lỗi cập nhật API:', error);
    
    // Hiển thị lỗi chi tiết
    if (error.response) {
      toast.error(`Lỗi ${error.response.status}: ${error.response.data?.message || 'Không thể cập nhật'}`);
    } else if (error.request) {
      toast.error('Không thể kết nối đến server');
    } else {
      toast.error('Cập nhật thất bại: ' + error.message);
    }
    
    return false;
  }
};

  // Hàm xóa đơn hàng qua API
  const deleteOrderAPI = async (orderId) => {
    try {
      console.log(`📡 Đang xóa đơn hàng ${orderId}...`);
      
      await orderService.deleteOrder(orderId);
      
      console.log('✅ Xóa đơn hàng thành công');
      
      // Cập nhật local state
      setApiOrders(prev => prev.filter(order => order.id !== orderId));
      
      toast.success('Đã xóa đơn hàng!');
      return true;
    } catch (error) {
      console.error('❌ Lỗi xóa API:', error);
      toast.error('Xóa đơn hàng thất bại');
      return false;
    }
  };

  // Effect để fetch API khi filter/search thay đổi
  useEffect(() => {
    if (useRealAPI) {
      fetchOrdersFromAPI();
    }
  }, [useRealAPI, filter, searchTerm]);

  // Các hàm xử lý
  const handleView = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      if (useRealAPI) {
        const success = await deleteOrderAPI(orderToDelete.id);
        if (success) {
          setShowDeleteConfirm(false);
          setOrderToDelete(null);
        }
      } else {
        toast.success(`Đã xóa đơn hàng ${orderToDelete.id} (Demo)`);
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
      }
    }
  };

  // SỬA: Hàm cập nhật trạng thái - thêm logic API
const handleStatusChange = async (orderId, newStatus) => {
  if (useRealAPI) {
    // Cập nhật qua API
    const success = await updateOrderStatusAPI(orderId, newStatus);
    if (success) {
      // Nếu thành công, fetch lại danh sách để đồng bộ
      fetchOrdersFromAPI();
    }
  } else {
    // Cập nhật mock - PHẢI DÙNG setOrders
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus} (Demo)`);
  }
};

  // Component toggle API
  // THÊM: Component toggle API với giao diện đẹp hơn
const APIToggle = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '15px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      color: 'white'
    }}>
      {/* Phần tiêu đề */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '8px 12px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          📡 NGUỒN DỮ LIỆU
        </div>
        
        {/* Switch đẹp */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '4px',
          borderRadius: '40px'
        }}>
          <button
            onClick={() => setUseRealAPI(false)}
            style={{
              padding: '6px 20px',
              borderRadius: '30px',
              border: 'none',
              background: !useRealAPI ? 'white' : 'transparent',
              color: !useRealAPI ? '#667eea' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: !useRealAPI ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '16px' }}>🔄</span> MOCK
            </span>
          </button>
          <button
            onClick={() => setUseRealAPI(true)}
            style={{
              padding: '6px 20px',
              borderRadius: '30px',
              border: 'none',
              background: useRealAPI ? 'white' : 'transparent',
              color: useRealAPI ? '#667eea' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: useRealAPI ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '16px' }}>🌐</span> API
            </span>
          </button>
        </div>
      </div>

      {/* Phần nút làm mới */}
      {useRealAPI && (
        <button
          onClick={fetchOrdersFromAPI}
          disabled={apiLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '30px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            cursor: apiLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            opacity: apiLoading ? 0.7 : 1
          }}
        >
          <span style={{
            animation: apiLoading ? 'spin 1s linear infinite' : 'none',
            display: 'inline-block'
          }}>
            🔄
          </span>
          {apiLoading ? 'ĐANG LÀM MỚI...' : 'LÀM MỚI'}
        </button>
      )}
    </div>
  );
};

  // Hàm lấy badge trạng thái
  const getStatusBadge = (status) => {
    const badges = {
      completed: { class: 'badge-success', text: 'Hoàn thành', icon: <FaCheck /> },
      shipping: { class: 'badge-warning', text: 'Đang giao', icon: <FaTruck /> },
      pending: { class: 'badge-danger', text: 'Chờ xử lý', icon: <FaClock /> },
      cancelled: { class: 'badge-secondary', text: 'Đã hủy', icon: <FaTimes /> }
    };
    return badges[status] || badges.pending;
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format tiền
  const formatPrice = (price) => {
    if (!price && price !== 0) return '0đ';
    return price.toLocaleString() + 'đ';
  };

  // ===========================================
  // BƯỚC 2: KIỂM TRA PHẦN RENDER DỮ LIỆU
  // ===========================================
  
  // Lấy đơn hàng hiển thị
  const displayedOrders = useRealAPI ? apiOrders : orders;
  const displayedStats = useRealAPI 
    ? (apiStats || { total: 0, completed: 0, shipping: 0, pending: 0, cancelled: 0 })
    : stats;
  const isLoading = useRealAPI ? apiLoading : false;

  // Lọc đơn hàng theo filter và searchTerm
  const filteredOrders = displayedOrders.filter(order => {
    // Lọc theo status
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Lọc theo searchTerm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const orderIdMatch = order.id?.toLowerCase().includes(searchLower);
      const customerNameMatch = (order.customerName || order.customer?.name || '').toLowerCase().includes(searchLower);
      const phoneMatch = (order.phone || order.customer?.phone || '').includes(searchTerm);
      
      return orderIdMatch || customerNameMatch || phoneMatch;
    }
    
    return true;
  });

  // Log để debug
  console.log('🔍 State hiện tại:', {
    useRealAPI,
    apiOrders: apiOrders.length,
    orders: orders.length,
    displayedOrders: displayedOrders.length,
    filteredOrders: filteredOrders.length,
    apiLoading,
    apiError
  });

  return (
    <div className="admin-section">
      {/* Toggle API */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <APIToggle />
          {apiError && useRealAPI && (
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#fee2e2', 
              color: '#dc2626',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              Lỗi: {apiError}
            </div>
          )}
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FaEye />
            </div>
            <div className="stat-content">
              <span className="stat-label">Tổng đơn hàng</span>
              <h3 className="stat-value">{displayedStats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
              <FaCheck />
            </div>
            <div className="stat-content">
              <span className="stat-label">Hoàn thành</span>
              <h3 className="stat-value text-success">{displayedStats.completed}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' }}>
              <FaTruck />
            </div>
            <div className="stat-content">
              <span className="stat-label">Đang giao</span>
              <h3 className="stat-value text-warning">{displayedStats.shipping}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)' }}>
              <FaClock />
            </div>
            <div className="stat-content">
              <span className="stat-label">Chờ xử lý</span>
              <h3 className="stat-value text-danger">{displayedStats.pending}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="filter-group d-flex align-items-center">
                <FaFilter className="me-2 text-primary" />
                <select 
                  className="form-control"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
            <div className="col-md-6 offset-md-3">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h5>Danh sách đơn hàng ({filteredOrders.length})</h5>
        </div>
        <div className="admin-card-body">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner"></div>
              <p className="mt-3">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày</th>
                    <th>Khách hàng</th>
                    <th>SĐT</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => {
                      const status = getStatusBadge(order.status);
                      return (
                        <tr key={order.id}>
                          <td className="order-id fw-bold">{order.id}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td className="customer-name">
                            {order.customer?.name || order.customerName || 'N/A'}
                          </td>
                          <td>{order.customer?.phone || order.phone || 'N/A'}</td>
                          <td>
                            <div className="product-list">
                              {(order.items || []).length > 0 ? (
                                order.items.map((item, i) => (
                                  <div key={i} className="product-item">
                                    {item.name} x{item.quantity}
                                  </div>
                                ))
                              ) : (
                                <span className="text-muted">Không có sản phẩm</span>
                              )}
                            </div>
                          </td>
                          <td className="amount fw-bold text-danger">
                            {formatPrice(order.total)}
                          </td>
                          <td>{order.paymentMethod || 'N/A'}</td>
                          <td>
                            <select
                              className={`badge ${status.class}`}
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              style={{ 
                                border: 'none', 
                                cursor: 'pointer',
                                padding: '5px 10px',
                                borderRadius: '20px',
                                fontWeight: '500'
                              }}
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="shipping">Đang giao</option>
                              <option value="completed">Hoàn thành</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-icon view" 
                                onClick={() => handleView(order)}
                                title="Xem chi tiết"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="btn-icon delete" 
                                onClick={() => handleDeleteClick(order)}
                                title="Xóa đơn hàng"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        <FaSearch style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }} />
                        <h5>Không tìm thấy đơn hàng nào</h5>
                        <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT ĐƠN HÀNG */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng {selectedOrder.id}</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin khách hàng</h4>
                <div className="info-row">
                  <label>Họ tên:</label>
                  <span>{selectedOrder.customer?.name || selectedOrder.customerName}</span>
                </div>
                <div className="info-row">
                  <label>Số điện thoại:</label>
                  <span>{selectedOrder.customer?.phone || selectedOrder.phone}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{selectedOrder.customer?.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <label>Địa chỉ:</label>
                  <span>{selectedOrder.address || 'N/A'}</span>
                </div>
              </div>
              <div className="detail-section">
                <h4>Thông tin đơn hàng</h4>
                <div className="info-row">
                  <label>Ngày đặt:</label>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="info-row">
                  <label>Thanh toán:</label>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <label>Trạng thái:</label>
                  <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                    {getStatusBadge(selectedOrder.status).text}
                  </span>
                </div>
              </div>
              <div className="detail-section">
                <h4>Sản phẩm</h4>
                <table className="product-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).length > 0 ? (
                      selectedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">Không có sản phẩm</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                      <td className="total-amount">{formatPrice(selectedOrder.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteConfirm && orderToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <FaTrash style={{ fontSize: '48px', color: '#ef4444', marginBottom: '15px' }} />
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>Bạn có chắc chắn muốn xóa đơn hàng?</p>
              <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '18px', marginBottom: '5px' }}>
                {orderToDelete.id}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '15px' }}>
                {orderToDelete.customer?.name || orderToDelete.customerName} - {formatPrice(orderToDelete.total)}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;