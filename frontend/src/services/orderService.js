// src/services/orderService.js
import api from '../api/config';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/api/orders');
      return response.data;
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },
  
  // Get single order details
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting order ${orderId}:`, error);
      throw error;
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/api/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }
};