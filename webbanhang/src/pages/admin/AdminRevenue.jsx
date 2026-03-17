// src/pages/admin/AdminRevenue.jsx
import React, { useState } from 'react';
import { FaChartLine, FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
// ĐÃ XÓA import formatPrice không dùng

const AdminRevenue = () => {
  const [period, setPeriod] = useState('monthly');

  // Dữ liệu doanh thu theo các kỳ
  const revenueData = {
    weekly: {
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
      data: [5000000, 7000000, 6000000, 8000000, 9000000],
      total: '35,000,000 VNĐ'
    },
    monthly: {
      labels: ['Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3'],
      data: [12000000, 19000000, 3000000, 5000000, 2000000, 30000000],
      total: '71,000,000 VNĐ'
    },
    yearly: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      data: [50000000, 70000000, 90000000, 120000000, 150000000],
      total: '480,000,000 VNĐ'
    }
  };

  // Thống kê
  const statistics = {
    totalRevenue: '480,000,000 VNĐ',
    averageOrder: '450,000 VNĐ',
    totalOrders: '1,067',
    bestMonth: 'Tháng 3 - 30,000,000 VNĐ',
    growth: '+15.3%',
    topProduct: 'Áo T shirt GSTS018 - 150 sản phẩm'
  };

  const currentData = revenueData[period];

  // Format tiền (dùng nội bộ)
  const formatPrice = (price) => {
    return price.toLocaleString() + ' VNĐ';
  };

  // Tính phần trăm thay đổi
  const getGrowthPercent = (current, previous) => {
    if (!previous) return '+0%';
    const growth = ((current - previous) / previous) * 100;
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  return (
    <div className="admin-section">
      {/* Thống kê nhanh */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <span className="stat-label">Tổng doanh thu</span>
              <h3 className="stat-value">{statistics.totalRevenue}</h3>
              <span className="stat-trend positive">
                <FaArrowUp /> +12.5%
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <FaShoppingCart />
            </div>
            <div className="stat-content">
              <span className="stat-label">Tổng đơn hàng</span>
              <h3 className="stat-value">{statistics.totalOrders}</h3>
              <span className="stat-trend positive">
                <FaArrowUp /> +8.2%
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <FaChartLine />
            </div>
            <div className="stat-content">
              <span className="stat-label">Đơn trung bình</span>
              <h3 className="stat-value">{statistics.averageOrder}</h3>
              <span className="stat-trend positive">
                <FaArrowUp /> +5.7%
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <FaChartLine />
            </div>
            <div className="stat-content">
              <span className="stat-label">Tăng trưởng</span>
              <h3 className="stat-value">{statistics.growth}</h3>
              <span className="stat-trend positive">Hot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng doanh thu */}
      <div className="admin-card">
        <div className="admin-card-header d-flex justify-content-between align-items-center">
          <h5><FaChartLine className="me-2" />Chi tiết Doanh thu</h5>
          <div className="d-flex align-items-center">
            <FaCalendarAlt className="me-2" style={{ color: 'white' }} />
            <select 
              className="form-select period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="weekly">Theo Tuần</option>
              <option value="monthly">Theo Tháng</option>
              <option value="yearly">Theo Năm</option>
            </select>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kỳ</th>
                  <th>Doanh thu</th>
                  <th>So với kỳ trước</th>
                </tr>
              </thead>
              <tbody>
                {currentData.labels.map((label, index) => {
                  const currentRevenue = currentData.data[index];
                  const previousRevenue = index > 0 ? currentData.data[index - 1] : null;
                  const growth = previousRevenue ? getGrowthPercent(currentRevenue, previousRevenue) : '-';
                  
                  return (
                    <tr key={index}>
                      <td className="fw-bold">{label}</td>
                      <td className="text-danger fw-bold">{formatPrice(currentRevenue)}</td>
                      <td>
                        {growth !== '-' ? (
                          <span className={growth.includes('+') ? 'text-success' : 'text-danger'}>
                            {growth.includes('+') ? <FaArrowUp /> : <FaArrowDown />} {growth}
                          </span>
                        ) : '-'}
                      </td>
                    </tr>
                  );
                })}
                <tr className="table-active">
                  <td className="fw-bold">Tổng cộng</td>
                  <td className="fw-bold text-primary">{currentData.total}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bảng doanh thu chi tiết theo tháng */}
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h5>Doanh thu theo tháng gần đây</h5>
        </div>
        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Doanh thu</th>
                <th>Số đơn hàng</th>
                <th>Đơn trung bình</th>
                <th>Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tháng 3/2025</td>
                <td className="text-danger fw-bold">30,000,000 VNĐ</td>
                <td>67</td>
                <td>447,761 VNĐ</td>
                <td className="text-success"><FaArrowUp /> +15.3%</td>
              </tr>
              <tr>
                <td>Tháng 2/2025</td>
                <td className="text-danger fw-bold">26,000,000 VNĐ</td>
                <td>58</td>
                <td>448,276 VNĐ</td>
                <td className="text-success"><FaArrowUp /> +8.7%</td>
              </tr>
              <tr>
                <td>Tháng 1/2025</td>
                <td className="text-danger fw-bold">24,000,000 VNĐ</td>
                <td>53</td>
                <td>452,830 VNĐ</td>
                <td className="text-danger"><FaArrowDown /> -4.2%</td>
              </tr>
              <tr>
                <td>Tháng 12/2024</td>
                <td className="text-danger fw-bold">25,000,000 VNĐ</td>
                <td>55</td>
                <td>454,545 VNĐ</td>
                <td className="text-success"><FaArrowUp /> +2.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top sản phẩm */}
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h5>Top sản phẩm bán chạy</h5>
        </div>
        <div className="admin-card-body">
          <table className="admin-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Doanh thu</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Áo T shirt GSTS018</td><td>150</td><td>37,350,000 VNĐ</td></tr>
              <tr><td>2</td><td>Áo polo GSTP846</td><td>120</td><td>35,280,000 VNĐ</td></tr>
              <tr><td>3</td><td>Quần Jeans GABJ861</td><td>100</td><td>28,500,000 VNĐ</td></tr>
              <tr><td>4</td><td>Quần short GSBW005</td><td>80</td><td>22,400,000 VNĐ</td></tr>
              <tr><td>5</td><td>Áo khoác EWCP001</td><td>60</td><td>21,000,000 VNĐ</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;