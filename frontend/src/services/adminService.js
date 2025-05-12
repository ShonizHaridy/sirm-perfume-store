// src/services/adminService.js
import api from '../api/config';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },
  
  // Get all orders with pagination and filtering
  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/api/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      throw error;
    }
  },
  
  // Create product
  createProduct: async (formData) => {
    try {
      const response = await api.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update product
  updateProduct: async (productId, formData) => {
    try {
      const response = await api.put(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },
  
  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${productId}:`, error);
      throw error;
    }
  },
  
  // Get all customers
  getAllCustomers: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting customers:', error);
      throw error;
    }
  }
};