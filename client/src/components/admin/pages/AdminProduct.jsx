import React, { useState } from 'react';

function AdminProducts() {
  const [showAddModal, setShowAddModal] = useState(false);

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddProduct = (productData) => {
    // Handle product creation logic here
    console.log('Adding product:', productData);
    closeAddModal();
  };
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
            <button className="btn btn-outline-secondary">Export Products</button>
          </div>
          <div className="d-flex">
            <input type="search" className="form-control me-2" placeholder="Search products..." style={{width: '200px'}} />
            <select className="form-select" style={{width: '150px'}}>
              <option>All Categories</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-primary mb-1">45</h4>
            <small className="text-muted">Total Products</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-success mb-1">38</h4>
            <small className="text-muted">In Stock</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-warning mb-1">5</h4>
            <small className="text-muted">Low Stock</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-danger mb-1">2</h4>
            <small className="text-muted">Out of Stock</small>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded">
        <div className="border-bottom p-3 bg-light">
          <h5 className="mb-0">Products List</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="border-bottom">
              <tr>
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
              {/* Sample Row 1 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="border rounded" style={{width: '50px', height: '50px', background: '#f8f9fa'}}>
                    <small className="d-flex align-items-center justify-content-center h-100">IMG</small>
                  </div>
                </td>
                <td className="p-3">
                  <strong>Glams Pure Water</strong><br />
                  <small className="text-muted">Premium table water</small>
                </td>
                <td className="p-3">Table Water</td>
                <td className="p-3">750ml</td>
                <td className="p-3">₦150</td>
                <td className="p-3">1,250</td>
                <td className="p-3"><span className="badge bg-success">In Stock</span></td>
                <td className="p-3">
                  <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
              
              {/* Sample Row 2 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="border rounded" style={{width: '50px', height: '50px', background: '#f8f9fa'}}>
                    <small className="d-flex align-items-center justify-content-center h-100">IMG</small>
                  </div>
                </td>
                <td className="p-3">
                  <strong>Glams Family Pack</strong><br />
                  <small className="text-muted">5-Liter family size</small>
                </td>
                <td className="p-3">Table Water</td>
                <td className="p-3">5L</td>
                <td className="p-3">₦500</td>
                <td className="p-3">85</td>
                <td className="p-3"><span className="badge bg-warning">Low Stock</span></td>
                <td className="p-3">
                  <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>

              {/* Sample Row 3 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="border rounded" style={{width: '50px', height: '50px', background: '#f8f9fa'}}>
                    <small className="d-flex align-items-center justify-content-center h-100">IMG</small>
                  </div>
                </td>
                <td className="p-3">
                  <strong>Glams Premium Plus</strong><br />
                  <small className="text-muted">Mineralized water</small>
                </td>
                <td className="p-3">Premium Water</td>
                <td className="p-3">1.5L</td>
                <td className="p-3">₦300</td>
                <td className="p-3">0</td>
                <td className="p-3"><span className="badge bg-danger">Out of Stock</span></td>
                <td className="p-3">
                  <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                  <button className="btn btn-sm btn-outline-danger">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-top p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">Showing 1-10 of 45 products</small>
          <nav>
            <div className="d-flex">
              <button className="btn btn-sm btn-outline-secondary me-1">Previous</button>
              <button className="btn btn-sm btn-primary me-1">1</button>
              <button className="btn btn-sm btn-outline-secondary me-1">2</button>
              <button className="btn btn-sm btn-outline-secondary me-1">3</button>
              <button className="btn btn-sm btn-outline-secondary">Next</button>
            </div>
          </nav>
        </div>
      </div>

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
    size: '',
    price: '',
    stockQuantity: '',
    image: null
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'Table Water',
      size: '',
      price: '',
      stockQuantity: '',
      image: null
    });
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
                  <label htmlFor="size" className="form-label">Size/Volume *</label>
                  <select
                    id="size"
                    name="size"
                    className="form-select"
                    value={formData.size}
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
                  <label htmlFor="stockQuantity" className="form-label">Initial Stock Quantity *</label>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    className="form-control"
                    placeholder="e.g., 1000"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
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
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <i className="bi bi-check-circle me-2"></i>
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;