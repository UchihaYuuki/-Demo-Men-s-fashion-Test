// src/pages/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFire, 
  FaUserTie, 
  FaTimes, 
  FaSave,
  FaUpload,
  FaTag
} from 'react-icons/fa';
import { productsArray } from '../../data/products';
import toast from 'react-hot-toast';

// Hàm tạo mã sản phẩm tự động
const generateProductCode = (category, index) => {
  const prefix = {
    'tshirt': 'TS',
    'polo': 'PL',
    'so-mi': 'SM',
    'khoac': 'KC',
    'jeans': 'JN',
    'au': 'AU',
    'short': 'ST',
    'dai-kaki': 'KK'
  };
  const catPrefix = prefix[category] || 'SP';
  const num = String(index + 1).padStart(3, '0');
  return `${catPrefix}${num}`;
};

// Lấy dữ liệu từ localStorage khi khởi tạo
const loadProductsFromStorage = () => {
  const savedProducts = localStorage.getItem('adminProducts');
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  // Nếu chưa có, lấy từ productsArray và thêm mã sản phẩm
  return productsArray.slice(0, 10).map((product, index) => ({
    ...product,
    productCode: generateProductCode(product.category, index),
    image: product.image || 'https://via.placeholder.com/200x200?text=No+Image'
  }));
};

const AdminProducts = () => {
  const [products, setProducts] = useState(loadProductsFromStorage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // State cho form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    productCode: '',
    title: '',
    price: '',
    originalPrice: '',
    category: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '',
    description: '',
    stock: 10
  });

  // State cho preview ảnh
  const [imagePreview, setImagePreview] = useState(null);

  // Lưu sản phẩm vào localStorage mỗi khi products thay đổi
  useEffect(() => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
  }, [products]);

  // Dữ liệu sản phẩm bán chạy (giữ nguyên)
  const bestSellers = [
    { id: 'Ts01', name: 'Áo T shirt trơn in thể thao GSTS018', sold: 150, revenue: 37350000 },
    { id: 'PL02', name: 'Áo polo trơn kẻ in logo ngực GSTP846', sold: 120, revenue: 35280000 },
    { id: 'QJ03', name: 'Quần Jeans basic slim GABJ861', sold: 100, revenue: 28500000 },
    { id: 'QS04', name: 'Quần short gió cạp lót chun GSBW005', sold: 80, revenue: 22400000 },
    { id: 'K05', name: 'Áo khoác 3 lớp cổ đứng khuy bấm EWCP001', sold: 60, revenue: 21000000 },
  ];

  // Dữ liệu người mua nhiều nhất
  const topCustomers = [
    { id: '001', name: 'Nguyễn Đức Thịch', orders: 25, total: 12500000 },
    { id: '002', name: 'Nguyễn Đức Phương', orders: 20, total: 10200000 },
    { id: '003', name: 'Đào Văn Đức', orders: 18, total: 9800000 },
    { id: '004', name: 'Trần Hữu Trung', orders: 15, total: 8100000 },
    { id: '005', name: 'Nguyễn Văn Anh', orders: 12, total: 6500000 },
  ];

  // Lọc sản phẩm theo tìm kiếm
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý upload ảnh
  const handleImageUpload = (e, isNewProduct = true) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (tối đa 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ảnh không được lớn hơn 2MB');
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.match('image.*')) {
        toast.error('Vui lòng chọn file hình ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (isNewProduct) {
          setNewProduct({ ...newProduct, image: reader.result });
          setImagePreview(reader.result);
        } else {
          setSelectedProduct({ ...selectedProduct, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm thêm sản phẩm mới
  const handleAddProduct = () => {
    // Validate
    if (!newProduct.title || !newProduct.price) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Tạo mã sản phẩm tự động
    const newCode = generateProductCode(newProduct.category, products.length);

    const productToAdd = {
      ...newProduct,
      id: Date.now(), // ID duy nhất
      productCode: newCode,
      price: parseInt(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseInt(newProduct.originalPrice) : null,
      image: newProduct.image || 'https://via.placeholder.com/200x200?text=New+Product',
      sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : ['S', 'M', 'L', 'XL']
    };

    setProducts([productToAdd, ...products]);
    setShowAddModal(false);
    resetNewProductForm();
    toast.success(`Đã thêm sản phẩm ${newProduct.title} thành công!`);
  };

  // Reset form thêm sản phẩm
  const resetNewProductForm = () => {
    setNewProduct({
      productCode: '',
      title: '',
      price: '',
      originalPrice: '',
      category: 'tshirt',
      sizes: ['S', 'M', 'L', 'XL'],
      image: '',
      description: '',
      stock: 10
    });
    setImagePreview(null);
  };

  // Hàm xem sản phẩm
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Hàm sửa sản phẩm
  const handleEdit = (product) => {
    setSelectedProduct({...product});
    setShowEditModal(true);
  };

  // Hàm lưu sửa sản phẩm
  const handleSaveEdit = () => {
    setProducts(products.map(p => 
      p.id === selectedProduct.id ? selectedProduct : p
    ));
    setShowEditModal(false);
    toast.success('Đã cập nhật sản phẩm thành công!');
  };

  // Hàm xác nhận xóa
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  // Hàm xóa sản phẩm
  const handleDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success(`Đã xóa sản phẩm "${productToDelete.title}" thành công!`);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  // Format giá
  const formatPrice = (price) => {
    if (!price) return '0 VNĐ';
    return parseInt(price).toLocaleString() + ' VNĐ';
  };

  return (
    <div className="admin-section">
      {/* Header với nút thêm sản phẩm */}
      <div className="admin-card mb-4">
        <div className="admin-card-header d-flex justify-content-between align-items-center">
          <h5><FaTag className="me-2" />Quản lý sản phẩm</h5>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FaPlus className="me-2" />Thêm sản phẩm mới
          </button>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="admin-card mb-4">
        <div className="admin-card-body">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo mã sản phẩm hoặc tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h5>Danh sách sản phẩm ({filteredProducts.length})</h5>
        </div>
        <div className="admin-card-body">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Size</th>
                  <th>Giá</th>
                  <th>Giá cũ</th>
                  <th>Tồn kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id || index}>
                      <td className="fw-bold text-primary">{product.productCode || `SP${String(index + 1).padStart(3, '0')}`}</td>
                      <td>
                        <img 
                          src={product.image || 'https://via.placeholder.com/50x50?text=No+Image'} 
                          alt={product.title}
                          className="product-thumbnail"
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                          }}
                        />
                      </td>
                      <td className="product-name">{product.title}</td>
                      <td>{product.category || 'Chưa phân loại'}</td>
                      <td>{product.sizes?.join(', ') || 'S, M, L, XL'}</td>
                      <td className="text-danger fw-bold">{formatPrice(product.price)}</td>
                      <td className="text-muted text-decoration-line-through">
                        {product.originalPrice ? formatPrice(product.originalPrice) : '-'}
                      </td>
                      <td className="text-center">{product.stock || 10}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon view" 
                            onClick={() => handleView(product)}
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleEdit(product)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDeleteClick(product)}
                            title="Xóa sản phẩm"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <FaSearch style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }} />
                      <h5>Không tìm thấy sản phẩm nào</h5>
                      <p className="text-muted">Thử thay đổi từ khóa tìm kiếm hoặc thêm sản phẩm mới</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sản phẩm bán chạy và Người mua nhiều nhất */}
      <div className="row">
        <div className="col-md-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5><FaFire className="me-2" />Sản phẩm bán chạy</h5>
            </div>
            <div className="admin-card-body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Đã bán</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {bestSellers.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td className="text-success fw-bold">{item.sold}</td>
                      <td className="text-primary fw-bold">{formatPrice(item.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h5><FaUserTie className="me-2" />Khách hàng thân thiết</h5>
            </div>
            <div className="admin-card-body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên khách hàng</th>
                    <th>Số đơn</th>
                    <th>Tổng chi tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{index + 1}</td>
                      <td>{customer.name}</td>
                      <td className="text-warning fw-bold">{customer.orders}</td>
                      <td className="text-success fw-bold">{formatPrice(customer.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL THÊM SẢN PHẨM */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddModal(false);
          resetNewProductForm();
        }}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm sản phẩm mới</h3>
              <button className="modal-close" onClick={() => {
                setShowAddModal(false);
                resetNewProductForm();
              }}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  {/* Upload ảnh */}
                  <div className="form-group">
                    <label>Hình ảnh sản phẩm</label>
                    <div 
                      className="image-upload-area"
                      style={{
                        border: '2px dashed #e9ecef',
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginBottom: '15px'
                      }}
                      onClick={() => document.getElementById('productImage').click()}
                    >
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                        />
                      ) : (
                        <>
                          <FaUpload style={{ fontSize: '40px', color: '#667eea', marginBottom: '10px' }} />
                          <p>Click để chọn ảnh sản phẩm</p>
                          <p className="text-muted small">Hỗ trợ JPG, PNG (tối đa 2MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Thông tin sản phẩm */}
                  <div className="form-group">
                    <label>Tên sản phẩm *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục</label>
                    <select
                      className="form-control"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="tshirt">Áo Thun</option>
                      <option value="polo">Áo Polo</option>
                      <option value="so-mi">Áo Sơ Mi</option>
                      <option value="khoac">Áo Khoác</option>
                      <option value="jeans">Quần Jeans</option>
                      <option value="au">Quần Âu</option>
                      <option value="short">Quần Short</option>
                      <option value="dai-kaki">Quần Kaki</option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Giá bán *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Giá cũ</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Size (cách nhau bằng dấu phẩy)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.sizes.join(', ')}
                      onChange={(e) => setNewProduct({
                        ...newProduct, 
                        sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Nhập mô tả sản phẩm..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => {
                setShowAddModal(false);
                resetNewProductForm();
              }}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleAddProduct}>
                <FaSave className="me-2" />Thêm sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XEM SẢN PHẨM */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết sản phẩm</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-5">
                  <img 
                    src={selectedProduct.image || 'https://via.placeholder.com/200x200?text=No+Image'} 
                    alt={selectedProduct.title}
                    style={{ width: '100%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x200?text=Error';
                    }}
                  />
                </div>
                <div className="col-md-7">
                  <h4 className="mb-3">{selectedProduct.title}</h4>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '120px' }}>Mã SP:</td>
                        <td className="text-primary">{selectedProduct.productCode || 'Chưa có'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Danh mục:</td>
                        <td>{selectedProduct.category || 'Chưa phân loại'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Giá bán:</td>
                        <td className="text-danger fw-bold">{formatPrice(selectedProduct.price)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Giá cũ:</td>
                        <td className="text-muted text-decoration-line-through">
                          {selectedProduct.originalPrice ? formatPrice(selectedProduct.originalPrice) : '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Size:</td>
                        <td>{selectedProduct.sizes?.join(', ') || 'S, M, L, XL'}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Tồn kho:</td>
                        <td>{selectedProduct.stock || 10}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-3">
                <h5>Mô tả:</h5>
                <p className="text-muted">{selectedProduct.description || 'Chưa có mô tả'}</p>
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

      {/* MODAL SỬA SẢN PHẨM */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sửa sản phẩm</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct.title}
                  onChange={(e) => setSelectedProduct({...selectedProduct, title: e.target.value})}
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Giá bán</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedProduct.price}
                      onChange={(e) => setSelectedProduct({...selectedProduct, price: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Giá cũ</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedProduct.originalPrice || ''}
                      onChange={(e) => setSelectedProduct({...selectedProduct, originalPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Size (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct.sizes?.join(', ') || ''}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                />
              </div>
              <div className="form-group">
                <label>Tồn kho</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedProduct.stock || 10}
                  onChange={(e) => setSelectedProduct({...selectedProduct, stock: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={selectedProduct.description || ''}
                  onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Thay đổi ảnh (tùy chọn)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </div>
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
      {showDeleteConfirm && productToDelete && (
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
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>Bạn có chắc chắn muốn xóa sản phẩm?</p>
              <p style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px', marginBottom: '5px' }}>
                {productToDelete.title}
              </p>
              <p className="text-muted">Mã SP: {productToDelete.productCode}</p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;