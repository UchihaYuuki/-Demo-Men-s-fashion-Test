// src/pages/admin/components/PotentialCustomerModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';

const PotentialCustomerModal = ({ type, show, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    interest: '',
    source: 'Chatbot',
    status: 'new',
    notes: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        address: customer.address || '',
        interest: customer.interest || '',
        source: customer.source || 'Chatbot',
        status: customer.status || 'new',
        notes: customer.notes || ''
      });
    }
  }, [customer]);

  if (!show) return null;

  const titles = {
    view: 'Xem khách hàng',
    edit: 'Chỉnh sửa khách hàng',
    add: 'Thêm khách hàng mới'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(customer?.id, formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titles[type]}</h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {type === 'view' ? (
            <div className="customer-detail">
              <div className="detail-section">
                <h4>Thông tin cơ bản</h4>
                <div className="info-row">
                  <label>ID:</label>
                  <span>{customer?.id}</span>
                </div>
                <div className="info-row">
                  <label>Họ tên:</label>
                  <span className="fw-bold">{customer?.name}</span>
                </div>
                <div className="info-row">
                  <label>Số điện thoại:</label>
                  <span>{customer?.phone}</span>
                </div>
                <div className="info-row">
                  <label>Địa chỉ:</label>
                  <span>{customer?.address}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Thông tin tương tác</h4>
                <div className="info-row">
                  <label>Nguồn:</label>
                  <span>{customer?.source}</span>
                </div>
                <div className="info-row">
                  <label>Ngày:</label>
                  <span>{new Date(customer?.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="info-row">
                  <label>Trạng thái:</label>
                  <span>
                    {customer?.status === 'contacted' ? (
                      <span className="badge badge-success">Đã liên hệ</span>
                    ) : (
                      <span className="badge badge-warning">Chưa liên hệ</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4>Sản phẩm quan tâm</h4>
                <p className="interest-text">{customer?.interest || 'Chưa có thông tin'}</p>
              </div>

              <div className="detail-section">
                <h4>Ghi chú</h4>
                <p className="notes-text">{customer?.notes || 'Không có ghi chú'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ tên</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Sản phẩm quan tâm</label>
                <input
                  type="text"
                  name="interest"
                  className="form-control"
                  value={formData.interest}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nguồn</label>
                <select
                  name="source"
                  className="form-control"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="Chatbot">Chatbot</option>
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Zalo">Zalo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="new">Chưa liên hệ</option>
                  <option value="contacted">Đã liên hệ</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
          {type !== 'view' && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              <FaSave className="me-2" /> Lưu thay đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PotentialCustomerModal;