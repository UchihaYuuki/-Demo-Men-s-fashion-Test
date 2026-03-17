// src/pages/admin/components/OrderModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const OrderModal = ({ type, show, onClose, order, onSave }) => {
  const [editedOrder, setEditedOrder] = useState(order || {});

  useEffect(() => {
    setEditedOrder(order || {});
  }, [order]);

  if (!show) return null;

  const titles = {
    view: 'Xem Đơn hàng',
    edit: 'Sửa Đơn hàng'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedOrder);
  };

  const statusOptions = ['Chờ xử lý', 'Đang giao', 'Hoàn thành', 'Hủy'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titles[type]}</h3>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          {type === 'view' ? (
            <div className="view-order">
              <p><strong>ID Đơn:</strong> {order?.id}</p>
              <p><strong>Khách hàng:</strong> {order?.customer}</p>
              <p><strong>Tên sản phẩm:</strong> {order?.product}</p>
              <p><strong>Tổng tiền:</strong> {order?.total?.toLocaleString()} VNĐ</p>
              <p><strong>Trạng thái:</strong> {order?.status}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="hidden" value={editedOrder?.id} />
              
              <div className="form-group">
                <label>Khách hàng</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedOrder?.customer || ''}
                  onChange={(e) => setEditedOrder({ ...editedOrder, customer: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedOrder?.product || ''}
                  onChange={(e) => setEditedOrder({ ...editedOrder, product: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tổng tiền</label>
                <input
                  type="number"
                  className="form-control"
                  value={editedOrder?.total || ''}
                  onChange={(e) => setEditedOrder({ ...editedOrder, total: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  className="form-control"
                  value={editedOrder?.status || ''}
                  onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
          {type === 'edit' && (
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;