import React, { useState, useRef, useEffect } from 'react';
import { productAPI } from '../../api/product';
import ProductTable from '../components/ProductTable';
import ProductSearchFilter from '../components/ProductSearchFilter';
import ExportProducts from '../components/ExportProducts';

function AdminProducts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const productTableRef = useRef();

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddProduct = async (productData) => {
    try {
      // Create new product using API
      const newProduct = await productAPI.createProduct(productData);
      console.log('Product created successfully:', newProduct);
      
      // Show success message
      alert('Product created successfully!');
      
      // Close modal and refresh product list
      closeAddModal();
      
      // Refresh the products table and statistics
      if (productTableRef.current) {
        productTableRef.current.refreshProducts();
      }
      
      // Reload statistics after adding new product
      try {
        const response = await productAPI.getAllProducts();
        if (response.success && response.data) {
          calculateStats(response.data);
        }
      } catch (statsError) {
        console.error('Error refreshing statistics:', statsError);
      }
      
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product. Please try again.');
    }
  };

  // Calculate statistics from products data
  const calculateStats = (productsData) => {
    if (!Array.isArray(productsData)) return;
    
    const totalProducts = productsData.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    productsData.forEach(product => {
      const quantity = Number(product.stock_quantity) || 0;
      const reorderLevel = Number(product.reorder_level) || 50;

      if (quantity === 0) {
        outOfStock++;
      } else if (quantity <= reorderLevel) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    setStats({
      totalProducts,
      inStock,
      lowStock,
      outOfStock
    });
    setIsLoadingStats(false);
  };

  // Handle products change from ProductTable
  const handleProductsChange = (productsData) => {
    setProducts(productsData);
    calculateStats(productsData);
    extractCategories(productsData);
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    // Pass filters to ProductTable
    if (productTableRef.current) {
      productTableRef.current.applyFilters({ search: term, category: selectedCategory });
    }
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Pass filters to ProductTable
    if (productTableRef.current) {
      productTableRef.current.applyFilters({ search: searchTerm, category });
    }
  };

  // Extract unique categories from products
  const extractCategories = (productsData) => {
    if (!Array.isArray(productsData)) return;
    
    const categories = [...new Set(productsData.map(product => product.category).filter(Boolean))];
    setAvailableCategories(categories);
  };

  // Load initial statistics
  useEffect(() => {
    const loadInitialStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await productAPI.getAllProducts();
        if (response.success && response.data) {
          setProducts(response.data);
          calculateStats(response.data);
          extractCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading product statistics:', error);
        setIsLoadingStats(false);
      }
    };

    loadInitialStats();
  }, []);
  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <h2 className="mb-1">Product Management</h2>
        <p className="text-muted mb-0">Manage Glams Table Water products and inventory</p>
      </div>

      {/* Action Buttons */}
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <button 
              className="btn btn-primary me-2"
              onClick={openAddModal}
            >
              + Add New Product
            </button>
            <ExportProducts 
              products={products}
              disabled={isLoadingStats}
            />
          </div>
          <ProductSearchFilter
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            searchValue={searchTerm}
            categoryValue={selectedCategory}
            categories={availableCategories}
            isLoading={isLoadingStats}
          />
        </div>
      </div>

      {/* Product Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            {isLoadingStats ? (
              <div className="spinner-border spinner-border-sm text-primary mb-1"></div>
            ) : (
              <h4 className="text-primary mb-1">{stats.totalProducts.toLocaleString()}</h4>
            )}
            <small className="text-muted">Total Products</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            {isLoadingStats ? (
              <div className="spinner-border spinner-border-sm text-success mb-1"></div>
            ) : (
              <h4 className="text-success mb-1">{stats.inStock.toLocaleString()}</h4>
            )}
            <small className="text-muted">In Stock</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            {isLoadingStats ? (
              <div className="spinner-border spinner-border-sm text-warning mb-1"></div>
            ) : (
              <h4 className="text-warning mb-1">{stats.lowStock.toLocaleString()}</h4>
            )}
            <small className="text-muted">Low Stock</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            {isLoadingStats ? (
              <div className="spinner-border spinner-border-sm text-danger mb-1"></div>
            ) : (
              <h4 className="text-danger mb-1">{stats.outOfStock.toLocaleString()}</h4>
            )}
            <small className="text-muted">Out of Stock</small>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        ref={productTableRef}
        onProductsChange={handleProductsChange}
      />

      {/* Add Product Modal */}
      <AddProductModal 
        show={showAddModal} 
        onClose={closeAddModal} 
        onSave={handleAddProduct} 
      />
    </div>
  );
}

// Add Product Modal Component
function AddProductModal({ show, onClose, onSave }) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      await onSave(formData);
      
      // Reset form only on successful save
      setFormData({
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
    } catch (error) {
      // Error handling is done in parent component
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle text-primary me-2"></i>
              Add New Product
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
                {/* Product Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="e.g., Glams Pure Water"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    id="category"
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

                {/* Size/Volume */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="size_volume" className="form-label">Size/Volume *</label>
                  <select
                    id="size_volume"
                    name="size_volume"
                    className="form-select"
                    value={formData.size_volume}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="350ml">350ml - Sachet</option>
                    <option value="500ml">500ml - Small Bottle</option>
                    <option value="750ml">750ml - Standard Bottle</option>
                    <option value="1L">1L - Large Bottle</option>
                    <option value="1.5L">1.5L - Family Size</option>
                    <option value="5L">5L - Family Pack</option>
                    <option value="10L">10L - Office Pack</option>
                    <option value="18.9L">18.9L - Dispenser Bottle</option>
                  </select>
                </div>

                {/* Price */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">Price (₦) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    placeholder="e.g., 150"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Stock Quantity */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="stock_quantity" className="form-label">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    className="form-control"
                    placeholder="e.g., 1000"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                {/* Cost Price */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="cost_price" className="form-label">Cost Price (₦)</label>
                  <input
                    type="number"
                    id="cost_price"
                    name="cost_price"
                    className="form-control"
                    placeholder="e.g., 80"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                  <small className="text-muted">Your cost to produce/purchase</small>
                </div>

                {/* Reorder Level */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="reorder_level" className="form-label">Reorder Level</label>
                  <input
                    type="number"
                    id="reorder_level"
                    name="reorder_level"
                    className="form-control"
                    placeholder="e.g., 50"
                    value={formData.reorder_level}
                    onChange={handleInputChange}
                    min="0"
                  />
                  <small className="text-muted">Alert when stock reaches this level</small>
                </div>

                {/* Product Image */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="image" className="form-label">Product Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <small className="text-muted">Recommended: 500x500px, JPG/PNG format</small>
                </div>

                {/* Water Source */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="water_source" className="form-label">Water Source</label>
                  <select
                    id="water_source"
                    name="water_source"
                    className="form-select"
                    value={formData.water_source}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Source</option>
                    <option value="Deep Borehole">Deep Borehole</option>
                    <option value="Spring Water">Spring Water</option>
                    <option value="Treated Municipal">Treated Municipal</option>
                    <option value="Artesian Well">Artesian Well</option>
                  </select>
                </div>

                {/* Product Code */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="product_code" className="form-label">Product Code</label>
                  <input
                    type="text"
                    id="product_code"
                    name="product_code"
                    className="form-control"
                    placeholder="e.g., GLM-PW-750"
                    value={formData.product_code}
                    onChange={handleInputChange}
                  />
                  <small className="text-muted">Unique identifier for this product</small>
                </div>

                {/* Treatment Process */}
                <div className="col-12 mb-3">
                  <label htmlFor="treatment_process" className="form-label">Treatment Process</label>
                  <textarea
                    id="treatment_process"
                    name="treatment_process"
                    className="form-control"
                    rows="2"
                    placeholder="e.g., Multi-stage filtration, UV sterilization, Ozonation..."
                    value={formData.treatment_process}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">Product Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="3"
                    placeholder="Brief description of the product..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              {/* Preview Section */}
              <div className="border rounded p-3 bg-light">
                <h6 className="mb-2">Preview:</h6>
                <div className="d-flex">
                  <div className="border rounded me-3" style={{width: '60px', height: '60px', background: '#fff'}}>
                    <small className="d-flex align-items-center justify-content-center h-100 text-muted">
                      {formData.image ? '📷' : 'IMG'}
                    </small>
                  </div>
                  <div>
                    <strong>{formData.name || 'Product Name'}</strong><br />
                    <small className="text-muted">{formData.description || 'Product description'}</small><br />
                    <span className="badge bg-secondary me-2">{formData.category}</span>
                    <span className="text-primary">₦{formData.price || '0'}</span>
                  </div>
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
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Add Product
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

export default AdminProducts;