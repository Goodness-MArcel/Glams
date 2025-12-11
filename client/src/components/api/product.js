import axiosInstance from './axiosInstance';

// Product API functions
export const productAPI = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await axiosInstance.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product' };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      // Convert to FormData for file upload support
      const formData = new FormData();
      
      // Append all product fields to FormData
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });

      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create product' };
    }
  },

  // Update existing product
  updateProduct: async (productId, productData) => {
    try {
      // Convert to FormData for file upload support
      const formData = new FormData();
      
      // Append all product fields to FormData
      Object.keys(productData).forEach(key => {
        const value = productData[key];
        
        // Handle different cases for image field:
        // - undefined: don't include (keep current image)
        // - null: include as null (remove current image)  
        // - File object: include the file (new image)
        if (key === 'image') {
          if (value !== undefined) {
            formData.append(key, value);
          }
          // If undefined, don't append image field at all
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      console.log('Sending FormData for update. Image field:', productData.image === undefined ? 'undefined (keep current)' : productData.image === null ? 'null (remove)' : 'File object (new image)');

      const response = await axiosInstance.put(`/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product' };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete product' };
    }
  },

  // Get products with low stock
  getLowStockProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch low stock products' };
    }
  },

  // Update product stock
  updateProductStock: async (productId, quantity) => {
    try {
      const response = await axiosInstance.patch(`/products/${productId}/stock`, {
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update product stock' };
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await axiosInstance.get('/products/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product statistics' };
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    try {
      const response = await axiosInstance.get(`/products/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search products' };
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await axiosInstance.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch products by category' };
    }
  },

  // Upload product image
  uploadProductImage: async (productId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosInstance.post(`/products/${productId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload product image' };
    }
  },

  // Bulk update products
  bulkUpdateProducts: async (updates) => {
    try {
      const response = await axiosInstance.patch('/products/bulk-update', { updates });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to bulk update products' };
    }
  },

  // Export products
  exportProducts: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      params.append('format', format);

      const response = await axiosInstance.get(`/products/export?${params.toString()}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to export products' };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await axiosInstance.get('/products/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured products' };
    }
  },

  // Toggle product featured status
  toggleFeatured: async (productId) => {
    try {
      const response = await axiosInstance.patch(`/products/${productId}/toggle-featured`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle featured status' };
    }
  },

  // Get product sales data
  getProductSales: async (productId, dateRange = {}) => {
    try {
      const params = new URLSearchParams(dateRange);
      const response = await axiosInstance.get(`/products/${productId}/sales?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch product sales data' };
    }
  }
};

export default productAPI;
