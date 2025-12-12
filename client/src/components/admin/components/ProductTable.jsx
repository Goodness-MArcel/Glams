import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { productAPI } from '../../api/product';

// Cache configuration
const PRODUCT_TABLE_CACHE_CONFIG = {
  products: 'product_table_cache',
  ttl: 20 * 60 * 1000 // 20 minutes
};

// Cache utility functions
const productTableCacheUtils = {
  setCache: (key, data, ttl = PRODUCT_TABLE_CACHE_CONFIG.ttl) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  },

  getCache: (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp, ttl } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > ttl;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  clearCache: (key) => {
    localStorage.removeItem(key);
  },

  clearAllCache: () => {
    localStorage.removeItem(PRODUCT_TABLE_CACHE_CONFIG.products);
  }
};

const ProductTable = forwardRef(({ onProductsChange }, ref) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '' });

  // Apply filters to products
  const applyFilters = (newFilters = filters) => {
    let filtered = [...products];

    // Apply search filter
    if (newFilters.search && newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.product_code?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (newFilters.category && newFilters.category.trim()) {
      filtered = filtered.filter(product => 
        product.category === newFilters.category
      );
    }

    setFilteredProducts(filtered);
    setFilters(newFilters);
  };

  // Load products from database
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedProducts = productTableCacheUtils.getCache(PRODUCT_TABLE_CACHE_CONFIG.products);
      if (cachedProducts) {
        console.log('Using cached products');
        setProducts(cachedProducts);
        setFilteredProducts(cachedProducts);
        
        // Notify parent component of products change
        if (onProductsChange) {
          onProductsChange(cachedProducts);
        }
        setLoading(false);
        return;
      }

      const response = await productAPI.getAllProducts();
      console.log('Fetched products:', response);
      const productData = response.data || response;
      setProducts(productData);
      setFilteredProducts(productData); // Initialize filtered products
      
      // Cache the data
      productTableCacheUtils.setCache(PRODUCT_TABLE_CACHE_CONFIG.products, productData);
      
      // Notify parent component of products change
      if (onProductsChange) {
        onProductsChange(productData);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters when products change
  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products]);

  // Expose functions to parent via ref
  useImperativeHandle(ref, () => ({
    refreshProducts: loadProducts,
    applyFilters: (newFilters) => {
      applyFilters(newFilters);
    },
    clearFilters: () => {
      setFilters({ search: '', category: '' });
      setFilteredProducts(products);
    }
  }));

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async (productData) => {
    try {
      await productAPI.updateProduct(editingProduct.id, productData);
      alert('Product updated successfully!');
      setShowEditModal(false);
      setEditingProduct(null);
      
      // Clear cache to force refresh
      productTableCacheUtils.clearAllCache();
      
      await loadProducts(); // Refresh the table
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product. Please try again.');
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
  };

  // Handle delete product
  const handleDeleteProduct = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    try {
      await productAPI.deleteProduct(deletingProduct.id);
      alert('Product deleted successfully!');
      setShowDeleteModal(false);
      setDeletingProduct(null);
      
      // Clear cache to force refresh
      productTableCacheUtils.clearAllCache();
      
      await loadProducts(); // Refresh the table
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.message || 'Failed to delete product. Please try again.');
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };
  return (
    <div className="border rounded">
      <div className="border-bottom p-3 bg-light">
        <h5 className="mb-0">Products List</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="border-bottom">
            <tr style={{fontSize: '13px'}}>
              <th className="p-3">Product Image</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Size/Volume</th>
              <th className="p-3">Price (₦)</th>
              <th className="p-3">Stock Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-2">Loading products...</div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <div className="text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={loadProducts}
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : !filteredProducts || filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  <div className="text-muted">
                    <i className="bi bi-box-seam me-2"></i>
                    {filters.search || filters.category ? 'No products match your search criteria.' : 'No products found. Create your first product!'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-bottom">
                  <td className="p-3">
                    <div className="border rounded" style={{width: '50px', height: '50px', background: '#f8f9fa'}}>
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-100 h-100 object-fit-cover rounded"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            console.log('Image load error for:', product.image_url);
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<small class="d-flex align-items-center justify-content-center h-100 text-danger">ERR</small>';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', product.image_url);
                          }}
                        />
                      ) : (
                        <small className="d-flex align-items-center justify-content-center h-100">IMG</small>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <strong>{product.name}</strong><br />
                    <small className="text-muted">{product.description || 'No description'}</small>
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.size_volume}</td>
                  <td className="p-3">₦{Number(product.price).toLocaleString()}</td>
                  <td className="p-3">{product.stock_quantity}</td>
                  <td className="p-3">
                    <span className={`badge ${
                      product.stock_quantity === 0 ? 'bg-danger' :
                      product.stock_quantity <= (product.reorder_level || 50) ? 'bg-warning' :
                      'bg-success'
                    }`}>
                      {product.stock_quantity === 0 ? 'Out of Stock' :
                       product.stock_quantity <= (product.reorder_level || 50) ? 'Low Stock' :
                       'In Stock'}
                    </span>
                  </td>
                    <td className="p-3">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEditProduct(product)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <div className="border-top p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </small>
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={loadProducts}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      <EditProductModal
        show={showEditModal}
        product={editingProduct}
        onClose={closeEditModal}
        onSave={handleUpdateProduct}
      />

      {/* Delete Product Modal */}
      {showDeleteModal && deletingProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Delete Product
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="alert alert-danger" role="alert">
                  <strong>Warning!</strong> This action cannot be undone.
                </div>
                
                <div className="row">
                  {deletingProduct.image_url && (
                    <div className="col-md-4">
                      <img 
                        src={deletingProduct.image_url} 
                        alt={deletingProduct.name}
                        className="img-fluid rounded mb-3"
                      />
                    </div>
                  )}
                  <div className={deletingProduct.image_url ? 'col-md-8' : 'col-12'}>
                    <h6 className="mb-3">Are you sure you want to delete this product?</h6>
                    <div className="product-details">
                      <p><strong>Name:</strong> {deletingProduct.name}</p>
                      <p><strong>Category:</strong> {deletingProduct.category}</p>
                      <p><strong>Price:</strong> ₦{Number(deletingProduct.price).toLocaleString()}</p>
                      <p><strong>Stock:</strong> {deletingProduct.stock_quantity} units</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDeleteProduct}
                >
                  <i className="bi bi-trash me-1"></i>
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// Edit Product Modal Component
const EditProductModal = ({ show, product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Table Water',
    size_volume: '',
    unit_type: 'bottle',
    price: '',
    cost_price: '',
    stock_quantity: '',
    reorder_level: '50',
    water_source: '',
    treatment_process: '',
    product_code: '',
    image: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  // Update form data when product changes
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || 'Table Water',
        size_volume: product.size_volume || '',
        unit_type: product.unit_type || 'bottle',
        price: product.price || '',
        cost_price: product.cost_price || '',
        stock_quantity: product.stock_quantity || '',
        reorder_level: product.reorder_level || '50',
        water_source: product.water_source || '',
        treatment_process: product.treatment_process || '',
        product_code: product.product_code || '',
        image: null // Reset image field for editing
      });
      
      // Reset image states and cleanup previous preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setRemoveCurrentImage(false);
    }
  }, [product]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    // Create preview URL for new image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setRemoveCurrentImage(false);
    }
  };

  const handleRemoveImage = () => {
    setRemoveCurrentImage(true);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    // Reset file input
    const fileInput = document.getElementById('edit_image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Prepare data for submission
      const submitData = { ...formData };
      
      // Handle image logic:
      // 1. If no new image selected and not removing current image, don't send image field
      // 2. If new image selected, send the new image file
      // 3. If removing current image, send null or empty to indicate removal
      
      if (!formData.image && !removeCurrentImage) {
        // Keep current image - don't send image field at all
        delete submitData.image;
      } else if (removeCurrentImage && !formData.image) {
        // Remove current image - send null to indicate removal
        submitData.image = null;
      }
      // If formData.image exists, send it as is (new image file)
      
      console.log('Submitting edit form data:', {
        ...submitData,
        image: submitData.image ? 'File object' : submitData.image
      });
      
      await onSave(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show || !product) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-pencil-square text-primary me-2"></i>
              Edit Product: {product.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Product Image Management */}
                <div className="col-12 mb-4">
                  <label className="form-label">Product Image</label>
                  
                  {/* Current/Preview Image Display */}
                  <div className="d-flex align-items-start gap-3 mb-3">
                    {/* Current Image */}
                    {product.image_url && !removeCurrentImage && !imagePreview && (
                      <div className="position-relative">
                        <div className="border rounded p-2">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            style={{width: '120px', height: '120px', objectFit: 'cover'}}
                            className="rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="mt-2">
                          <small className="text-muted d-block">Current Image</small>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleRemoveImage}
                          >
                            <i className="bi bi-trash me-1"></i>Remove
                          </button>
                        </div>
                      </div>
                    )}

                    {/* New Image Preview */}
                    {imagePreview && (
                      <div className="position-relative">
                        <div className="border rounded p-2 border-success">
                          <img 
                            src={imagePreview} 
                            alt="New image preview"
                            style={{width: '120px', height: '120px', objectFit: 'cover'}}
                            className="rounded"
                          />
                        </div>
                        <div className="mt-2">
                          <small className="text-success d-block">
                            <i className="bi bi-check-circle me-1"></i>New Image Preview
                          </small>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData(prev => ({ ...prev, image: null }));
                              document.getElementById('edit_image').value = '';
                            }}
                          >
                            <i className="bi bi-x me-1"></i>Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Removed Image Indicator */}
                    {removeCurrentImage && !imagePreview && (
                      <div className="position-relative">
                        <div className="border rounded p-2 border-warning bg-light d-flex align-items-center justify-content-center" style={{width: '120px', height: '120px'}}>
                          <div className="text-center">
                            <i className="bi bi-image text-muted" style={{fontSize: '2rem'}}></i>
                            <div className="small text-muted mt-1">No Image</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <small className="text-warning d-block">
                            <i className="bi bi-exclamation-triangle me-1"></i>Image Removed
                          </small>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setRemoveCurrentImage(false)}
                          >
                            <i className="bi bi-arrow-counterclockwise me-1"></i>Restore
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File Upload Input */}
                  <div className="mb-2">
                    <input
                      type="file"
                      id="edit_image"
                      name="image"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <small className="text-muted">
                    {product.image_url && !removeCurrentImage ? 
                      'Upload a new image to replace the current one, or remove the current image.' : 
                      'Select an image file (JPG, PNG, GIF, WebP)'}
                  </small>
                </div>

                {/* Product Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit_name" className="form-label">Product Name *</label>
                  <input
                    type="text"
                    id="edit_name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit_category" className="form-label">Category *</label>
                  <select
                    id="edit_category"
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Table Water">Table Water</option>
                    <option value="Premium Water">Premium Water</option>
                    <option value="Mineralized Water">Mineralized Water</option>
                    <option value="Flavored Water">Flavored Water</option>
                  </select>
                </div>

                {/* Price */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit_price" className="form-label">Price (₦) *</label>
                  <input
                    type="number"
                    id="edit_price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock Quantity */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="edit_stock_quantity" className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    id="edit_stock_quantity"
                    name="stock_quantity"
                    className="form-control"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label htmlFor="edit_description" className="form-label">Description</label>
                  <textarea
                    id="edit_description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

ProductTable.displayName = 'ProductTable';

export default ProductTable;