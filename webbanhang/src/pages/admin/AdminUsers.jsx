// src/pages/admin/AdminUsers.jsx
import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch, FaUserPlus, FaTimes, FaSave, FaUserShield, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 'U001', name: 'Admin', email: 'admin@yuuki.com', phone: '0369788865', role: 'admin', status: 'active', orders: 0, joined: '2024-01-01' },
    { id: 'U002', name: 'Nguyễn Đức Phương', email: 'phuong.nd@yuuki.com', phone: '0369788865', role: 'user', status: 'active', orders: 25, joined: '2024-02-15' },
    { id: 'U003', name: 'Nguyễn Đức Thịch', email: 'thich.nd@yuuki.com', phone: '0972405120', role: 'user', status: 'active', orders: 18, joined: '2024-03-10' },
    { id: 'U004', name: 'Đào Văn Đức', email: 'duc.dv@yuuki.com', phone: '0987654321', role: 'user', status: 'active', orders: 15, joined: '2024-04-05' },
    { id: 'U005', name: 'Trần Hữu Trung', email: 'trung.th@yuuki.com', phone: '0912345678', role: 'user', status: 'inactive', orders: 8, joined: '2024-05-20' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });

  // Hàm xem người dùng
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Hàm sửa người dùng
  const handleEdit = (user) => {
    setSelectedUser({...user});
    setShowEditModal(true);
  };

  // Hàm xác nhận xóa
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Hàm xóa người dùng
  const handleDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      toast.success(`Đã xóa người dùng ${userToDelete.name} thành công!`);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // Hàm lưu sửa người dùng
  const handleSaveEdit = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setShowEditModal(false);
    toast.success('Đã cập nhật người dùng thành công!');
  };

  // Hàm thêm người dùng mới
  const handleAddUser = () => {
    const newId = 'U' + String(users.length + 1).padStart(3, '0');
    const userToAdd = {
      ...newUser,
      id: newId,
      status: 'active',
      orders: 0,
      joined: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, userToAdd]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', phone: '', role: 'user' });
    toast.success(`Đã thêm người dùng ${newUser.name} thành công!`);
  };

  // Lọc người dùng
  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (statusFilter !== 'all' && user.status !== statusFilter) return false;
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-section">
      {/* Header với nút thêm */}
      <div className="admin-card mb-4">
        <div className="admin-card-header d-flex justify-content-between align-items-center">
          <h5><FaUserShield className="me-2" />Quản lý người dùng</h5>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FaUserPlus className="me-2" />Thêm người dùng
          </button>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <select 
                className="form-control"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tất cả quyền</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Khóa</option>
              </select>
            </div>
            <div className="col-md-6">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách người dùng */}
      <div className="admin-card">
        <div className="admin-card-body">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Quyền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tham gia</th>
                  <th>Đơn hàng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="fw-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        {user.role === 'admin' ? (
                          <span className="badge badge-primary">Admin</span>
                        ) : (
                          <span className="badge badge-info">User</span>
                        )}
                      </td>
                      <td>
                        {user.status === 'active' ? (
                          <span className="badge badge-success">Hoạt động</span>
                        ) : (
                          <span className="badge badge-secondary">Khóa</span>
                        )}
                      </td>
                      <td>{user.joined}</td>
                      <td className="text-center">{user.orders}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon view" 
                            onClick={() => handleView(user)}
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleEdit(user)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              className="btn-icon delete" 
                              onClick={() => handleDeleteClick(user)}
                              title="Xóa người dùng"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL THÊM NGƯỜI DÙNG */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Thêm người dùng mới</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Họ tên</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Nhập email"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="form-group">
                  <label>Quyền</label>
                  <select 
                    className="form-control"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleAddUser}>
                <FaSave className="me-2" />Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM NGƯỜI DÙNG - ĐÃ SỬA */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content view-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Chi tiết người dùng</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="user-detail" style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                {/* Avatar */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: selectedUser.role === 'admin' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>ID</span>
                        <span style={{ color: '#667eea', fontWeight: 600 }}>{selectedUser.id}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Họ tên</span>
                        <span style={{ color: '#1f2937', fontWeight: 500 }}>{selectedUser.name}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Email</span>
                        <span style={{ color: '#1f2937' }}>{selectedUser.email}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Số điện thoại</span>
                        <span style={{ color: '#1f2937' }}>{selectedUser.phone}</span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Quyền</span>
                        <span>
                          {selectedUser.role === 'admin' ? (
                            <span className="badge badge-primary">Admin</span>
                          ) : (
                            <span className="badge badge-info">User</span>
                          )}
                        </span>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Trạng thái</span>
                        <span>
                          {selectedUser.status === 'active' ? (
                            <span className="badge badge-success">Hoạt động</span>
                          ) : (
                            <span className="badge badge-secondary">Khóa</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Ngày tham gia</span>
                        <span style={{ color: '#1f2937' }}>{selectedUser.joined}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, color: '#4b5563', display: 'block', fontSize: '12px' }}>Tổng đơn hàng</span>
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>{selectedUser.orders}</span>
                      </div>
                    </div>
                  </div>
                </div>
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

      {/* MODAL SỬA NGƯỜI DÙNG */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Chỉnh sửa người dùng</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Họ tên</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={selectedUser.phone}
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Quyền</label>
                  <select 
                    className="form-control"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select 
                    className="form-control"
                    value={selectedUser.status}
                    onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Khóa</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSaveEdit}>
                <FaSave className="me-2" />Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {showDeleteConfirm && userToDelete && (
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
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>Bạn có chắc chắn muốn xóa người dùng?</p>
              <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px', marginBottom: '5px' }}>{userToDelete.name}</p>
              <p style={{ color: '#6b7280', marginBottom: '15px' }}>Email: {userToDelete.email}</p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;