// src/services/productService.js
import api from '../api/config';

export const productService = {
  // Get all products with optional filtering
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  },
  
  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting product ${id}:`, error);
      throw error;
    }
  },
  
  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await api.get('/api/products', { params: { featured: true } });
      return response.data;
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw error;
    }
  },
  
  // Search products
  searchProducts: async (query) => {
    try {
      const response = await api.get('/api/products', { params: { search: query } });
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw error;
    }
  },
  
  // Filter products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get('/api/products', { params: { category } });
      return response.data;
    } catch (error) {
      console.error(`Error getting products for category "${category}":`, error);
      throw error;
    }
  }
};