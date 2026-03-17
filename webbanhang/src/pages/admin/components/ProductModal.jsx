// src/pages/admin/components/ProductModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductModal = ({ type, show, onClose, onSave, product, setProduct, onImageChange }) => {
  if (!show) return null;

  const titles = {
    add: 'Thêm Sản phẩm',
    edit: 'Sửa Sản phẩm',
    view: 'Xem Sản phẩm'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{titles[type]}</h3>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          {type === 'view' ? (
            <div className="view-product">
              <p><strong>ID:</strong> {product?.id}</p>
              <p><strong>Tên:</strong> {product?.title}</p>
              <p><strong>Giá:</strong> {product?.price?.toLocaleString()} VNĐ</p>
              <p><strong>Số lượng:</strong> 1</p>
              <p><strong>Mô tả:</strong> {product?.description || 'Chưa có mô tả'}</p>
              {product?.image && (
                <img src={product.image} alt={product.title} className="modal-image" />
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input type="hidden" value={product?.id} />
              
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={product?.title || ''}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                  required={type === 'add'}
                  disabled={type === 'view'}
                />
              </div>

              {type === 'add' && (
                <>
                  <div className="form-group">
                    <label>Size áo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập size áo"
                    />
                  </div>
                </>
              )}

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Giá</label>
                    <input
                      type="number"
                      className="form-control"
                      value={product?.price || ''}
                      onChange={(e) => setProduct({ ...product, price: e.target.value })}
                      required={type === 'add'}
                      disabled={type === 'view'}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Số lượng</label>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue="1"
                      disabled={type === 'view'}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={product?.description || ''}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  disabled={type === 'view'}
                />
              </div>

              {type === 'add' && (
                <div className="form-group">
                  <label>Hình ảnh sản phẩm</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                  {product?.image && (
                    <img src={product.image} alt="Preview" className="image-preview" />
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
          {type !== 'view' && (
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;