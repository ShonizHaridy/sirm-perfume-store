const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// Get dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    
    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();
    
    // Format recent orders
    const formattedRecentOrders = recentOrders.map(order => ({
      id: order._id,
      orderNumber: order.orderNumber,
      customer: order.user.name,
      date: order.createdAt,
      total: order.totalAmount,
      status: order.status
    }));
    
    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders: formattedRecentOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders with pagination
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Filter by status if provided
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      
      // Get users matching the search query
      const users = await User.find({ 
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ] 
      }).select('_id');
      
      const userIds = users.map(user => user._id);
      
      query.$or = [
        { orderNumber: searchRegex },
        { user: { $in: userIds } }
      ];
    }
    
    // Count total orders matching the query
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    
    // Get paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email phone')
      .populate('items.product', 'name price image')
      .lean();
    
    // Format orders for response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone
      },
      items: order.items.map(item => ({
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.price,
          image: item.product.image
        },
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
    
    res.json({
      orders: formattedOrders,
      page,
      totalPages,
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If changing to cancelled and was not cancelled before, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    // If changing from cancelled to another status, reduce stock again
    if (order.status === 'cancelled' && status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }
        );
      }
    }
    
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all customers
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = { role: 'user' };
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }
    
    // Count total customers matching the query
    const totalCustomers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limit);
    
    // Get paginated customers
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      customers,
      page,
      totalPages,
      totalCustomers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate sales report
router.get('/reports/sales', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate dates
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();
    
    // Ensure end date is the end of the day
    end.setHours(23, 59, 59, 999);
    
    // Query completed orders within date range
    const orders = await Order.find({
      status: 'completed',
      createdAt: { $gte: start, $lte: end }
    }).populate('items.product', 'name category');
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Calculate sales by category
    const salesByCategory = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const category = item.product.category;
        if (!salesByCategory[category]) {
          salesByCategory[category] = 0;
        }
        salesByCategory[category] += item.price * item.quantity;
      });
    });
    
    // Format sales by date (daily)
    const salesByDate = {};
    
    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate[dateStr]) {
        salesByDate[dateStr] = 0;
      }
      salesByDate[dateStr] += order.totalAmount;
    });
    
    res.json({
      period: {
        startDate: start,
        endDate: end
      },
      totalOrders: orders.length,
      totalRevenue,
      salesByCategory,
      salesByDate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;