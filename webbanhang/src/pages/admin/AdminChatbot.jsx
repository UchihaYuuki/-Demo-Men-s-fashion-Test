// src/pages/admin/AdminChatbot.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaStar, 
  FaUserSlash, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTimes, 
  FaComments, 
  FaCheck 
} from 'react-icons/fa'; // Đã xóa FaSave không dùng
import { useChatbot } from '../../hooks/useChatbot';
import PotentialCustomerModal from './components/PotentialCustomerModal';

// ... phần còn lại giữ nguyên

const AdminChatbot = () => {
  const {
    customers,
    loading,
    stats,
    updatePotentialCustomer,
    deletePotentialCustomer,
    markAsContacted,
    searchCustomers
  } = useChatbot();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Hàm xem khách hàng
  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  // Hàm sửa khách hàng
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // Hàm xác nhận xóa
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  // Hàm xóa khách hàng
  const handleDelete = async () => {
    if (customerToDelete) {
      await deletePotentialCustomer(customerToDelete.id);
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
    }
  };

  // Hàm đánh dấu đã liên hệ
  const handleMarkContacted = async (customerId) => {
    await markAsContacted(customerId);
  };

  // Lọc khách hàng
  const filteredCustomers = customers.filter(customer => {
    if (filter !== 'all' && customer.status !== filter) return false;
    if (searchTerm && !customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !customer.phone?.includes(searchTerm)) {
      return false;
    }
    return true;
  });

  // Tìm kiếm khi gõ
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        searchCustomers(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, searchCustomers]);

  return (
    <div className="admin-section">
      {/* Thống kê nhanh */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FaComments />
            </div>
            <div className="stat-content">
              <span className="stat-label">Tổng khách hàng</span>
              <h3 className="stat-value">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
              <FaStar />
            </div>
            <div className="stat-content">
              <span className="stat-label">Đã liên hệ</span>
              <h3 className="stat-value text-success">{stats.contacted}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card small">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' }}>
              <FaUserSlash />
            </div>
            <div className="stat-content">
              <span className="stat-label">Chưa liên hệ</span>
              <h3 className="stat-value text-warning">{stats.new}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <select 
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="contacted">Đã liên hệ</option>
                <option value="new">Chưa liên hệ</option>
              </select>
            </div>
            <div className="col-md-6 offset-md-3">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo tên hoặc SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách khách hàng tiềm năng */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h5><FaStar className="me-2" />Khách hàng tiềm năng</h5>
        </div>
        <div className="admin-card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>SĐT</th>
                    <th>Địa chỉ</th>
                    <th>Quan tâm</th>
                    <th>Nguồn</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td className="fw-bold">{customer.name}</td>
                        <td>
                          <FaPhone className="me-1 text-primary" />
                          {customer.phone}
                        </td>
                        <td>
                          <FaMapMarkerAlt className="me-1 text-danger" />
                          {customer.address}
                        </td>
                        <td>{customer.interest}</td>
                        <td>{customer.source}</td>
                        <td>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          {customer.status === 'contacted' ? (
                            <span className="badge badge-success">Đã liên hệ</span>
                          ) : (
                            <span className="badge badge-warning">Chưa liên hệ</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon view" 
                              onClick={() => handleView(customer)}
                              title="Xem chi tiết"
                            >
                              <FaEye />
                            </button>
                            <button 
                              className="btn-icon edit" 
                              onClick={() => handleEdit(customer)}
                              title="Chỉnh sửa"
                            >
                              <FaEdit />
                            </button>
                            {customer.status !== 'contacted' && (
                              <button 
                                className="btn-icon" 
                                onClick={() => handleMarkContacted(customer.id)}
                                title="Đánh dấu đã liên hệ"
                                style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button 
                              className="btn-icon delete" 
                              onClick={() => handleDeleteClick(customer)}
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        Không tìm thấy khách hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Khách hàng không tiềm năng */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h5><FaUserSlash className="me-2" />Khách hàng không tiềm năng</h5>
        </div>
        <div className="admin-card-body">
          <div className="text-center p-5">
            <FaUserSlash className="fa-4x text-muted mb-3" />
            <h5 className="text-muted">Không có dữ liệu</h5>
            <p className="text-muted">Tổng số: 0 khách hàng</p>
          </div>
        </div>
      </div>

      {/* MODAL XEM CHI TIẾT KHÁCH HÀNG */}
      {showViewModal && selectedCustomer && (
        <PotentialCustomerModal
          type="view"
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          customer={selectedCustomer}
        />
      )}

      {/* MODAL SỬA KHÁCH HÀNG */}
      {showEditModal && selectedCustomer && (
        <PotentialCustomerModal
          type="edit"
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          customer={selectedCustomer}
          onSave={updatePotentialCustomer}
        />
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteConfirm && customerToDelete && (
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
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>Bạn có chắc chắn muốn xóa khách hàng này?</p>
              <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px', marginBottom: '5px' }}>{customerToDelete.name}</p>
              <p style={{ color: '#6b7280', marginBottom: '15px' }}>SĐT: {customerToDelete.phone}</p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa khách hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatbot;