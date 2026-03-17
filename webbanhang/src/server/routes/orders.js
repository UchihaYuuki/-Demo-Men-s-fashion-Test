// server/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET /api/orders - Lấy danh sách đơn hàng (có phân trang)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      data: orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Tạo đơn hàng mới
router.post('/', async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      status: 'pending',
      orderNumber: 'YUK' + Date.now()
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH /api/orders/:id/status - Cập nhật trạng thái
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});