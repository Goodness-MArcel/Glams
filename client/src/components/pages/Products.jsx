import React, { useState, useEffect } from "react";
import { productAPI } from '../api/product';
import ProductCard from '../ui/ProductCard';
import { useCart } from '../contexts/CartContext';

// Add custom styles
const customStyles = `
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
  }
  
  .hover-overlay {
    transition: opacity 0.3s ease;
  }
  
  .card:hover .hover-overlay {
    opacity: 1 !important;
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  .progress-bar-animated {
    animation: progress-bar-stripes 1s linear infinite;
  }
  
  @keyframes progress-bar-stripes {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [addingToCart, setAddingToCart] = useState(null);
  
  const { addToCart } = useCart();

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getAllProducts();
        const productData = response.data || response;
        setProducts(productData);
      } catch (error) {
        console.error('Error loading products:', error);
        setError(error.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handle add to cart with animation
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      setAddingToCart(product.id);
      addToCart(product, quantity);
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(null);
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch = !searchTerm || 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && product.stock_quantity > 0; // Only show in-stock products
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'name':
        default:
          return a.name?.localeCompare(b.name) || 0;
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="mb-4">
            <div className="spinner-border text-primary mb-3" style={{width: '4rem', height: '4rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <h2 className="fw-bold text-primary mb-3">Loading Premium Products</h2>
          <p className="lead text-muted mb-4">Fetching the finest water products just for you...</p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="progress" style={{height: '8px'}}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                     style={{width: '70%'}}></div>
              </div>
              <p className="small text-muted mt-3">This won't take long • Ensuring freshest inventory</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="alert alert-danger d-inline-block">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Error loading products:</strong> {error}
          </div>
          <div className="mt-3">
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="position-relative overflow-hidden rounded-4 mb-5" style={{
        background: 'linear-gradient(135deg, #2cc0e0 0%, #005f73 100%)',
        minHeight: '400px'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5
        }}></div>
        
        <div className="position-relative d-flex align-items-center justify-content-center text-center text-white" style={{minHeight: '400px'}}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <h1 className="display-3 fw-bold mb-4 text-white">Premium Water Collection</h1>
                <p className="lead mb-4 opacity-90">
                  Discover pure refreshment with Glams Table Water's premium range
                </p>
                <p className="fs-5 mb-5 opacity-75">
                  Crafted with the highest quality standards • 100% Pure • Health Conscious • Family Safe
                </p>
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                  <div className="badge bg-light text-dark px-4 py-2 fs-6">
                    <i className="bi bi-shield-check me-2"></i>Quality Assured
                  </div>
                  <div className="badge bg-light text-dark px-4 py-2 fs-6">
                    <i className="bi bi-droplet me-2"></i>100% Pure
                  </div>
                  <div className="badge bg-light text-dark px-4 py-2 fs-6">
                    <i className="bi bi-heart me-2"></i>Health Focused
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-light rounded-4 p-4 mb-5 shadow-sm">
        <div className="row align-items-end">
          <div className="col-lg-9">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-5">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-search me-2"></i>Search Products
                </label>
                <div className="position-relative">
                  <input
                    type="search"
                    className="form-control form-control-lg border-0 shadow-sm"
                    placeholder="Find your perfect water..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{paddingLeft: '20px', paddingRight: '50px'}}
                  />
                  <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
              </div>

              {/* Category Filter */}
              <div className="col-md-4">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-funnel me-2"></i>Category
                </label>
                <select
                  className="form-select form-select-lg border-0 shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="col-md-3">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-sort-down me-2"></i>Sort By
                </label>
                <select
                  className="form-select form-select-lg border-0 shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price ↑</option>
                  <option value="price-high">Price ↓</option>
                </select>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mt-3 mt-lg-0">
            <div className="text-lg-end">
              <div className="badge bg-primary fs-6 px-3 py-2">
                <i className="bi bi-box-seam me-2"></i>
                {filteredProducts.length} Products
              </div>
              <div className="text-muted small mt-2">
                of {products.filter(p => p.stock_quantity > 0).length} available
              </div>
              {(searchTerm || selectedCategory) && (
                <button 
                  className="btn btn-outline-secondary btn-sm mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 my-5">
          <div className="mb-4">
            <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                 style={{width: '120px', height: '120px'}}>
              <i className="bi bi-droplet display-3 text-primary"></i>
            </div>
          </div>
          <h3 className="fw-bold text-dark mb-3">
            {searchTerm || selectedCategory ? 'No Products Match Your Search' : 'No Products Available'}
          </h3>
          <p className="text-muted mb-4 fs-5">
            {searchTerm || selectedCategory 
              ? 'Try different keywords or browse all categories to find what you\'re looking for.' 
              : 'We\'re restocking our premium water collection. Check back soon for fresh arrivals!'}
          </p>
          {(searchTerm || selectedCategory) ? (
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button 
                className="btn btn-primary btn-lg px-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>View All Products
              </button>
              <button className="btn btn-outline-primary btn-lg px-4">
                <i className="bi bi-telephone me-2"></i>Contact Support
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-lg px-5">
              <i className="bi bi-bell me-2"></i>Notify When Available
            </button>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm hover-lift position-relative overflow-hidden" style={{transition: 'all 0.3s ease'}}>
                {/* Stock Badge */}
                {product.stock_quantity <= (product.reorder_level || 50) && product.stock_quantity > 0 && (
                  <div className="position-absolute top-0 start-0 z-3">
                    <span className="badge bg-warning text-dark m-3">
                      <i className="bi bi-exclamation-triangle me-1"></i>Low Stock
                    </span>
                  </div>
                )}
                
                {/* Product Image */}
                <div className="position-relative overflow-hidden" style={{height: '280px'}}>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      className="card-img-top h-100 w-100" 
                      alt={product.name}
                      style={{objectFit: 'cover', transition: 'transform 0.3s ease'}}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDI4MCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xNDAgMTAwQzE1Mi4xIDEwMCAxNjIgMTA5LjkgMTYyIDEyMkMxNjIgMTM0LjEgMTUyLjEgMTQ0IDE0MCAxNDRDMTI3LjkgMTQ0IDExOCAxMzQuMSAxMTggMTIyQzExOCAxMDkuOSAxMjcuOSAxMDAgMTQwIDEwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTExMCAxNjZIMTcwVjE4MEgxMTBWMTY2WiIgZmlsbD0iI0QxRDVEQiIvPgo8dGV4dCB4PSIxNDAiIHk9IjIwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzkzOUZBNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <div className="text-center text-muted">
                        <i className="bi bi-droplet display-4 mb-3"></i>
                        <div className="fw-bold">{product.name}</div>
                        <small>{product.category}</small>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 hover-overlay" 
                       style={{background: 'rgba(44, 192, 224, 0.9)', transition: 'opacity 0.3s ease'}}>
                    <button className="btn btn-light btn-lg fw-bold">
                      <i className="bi bi-eye me-2"></i>Quick View
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="card-body d-flex flex-column p-4">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Product Name */}
                  <h5 className="card-title fw-bold text-dark mb-2 lh-sm">{product.name}</h5>
                  
                  {/* Product Details */}
                  <div className="mb-3 flex-grow-1">
                    <p className="card-text text-muted small mb-2">
                      {product.description || 'Premium quality water for your daily hydration needs.'}
                    </p>
                    <div className="d-flex align-items-center text-muted small">
                      <i className="bi bi-droplet me-2"></i>
                      <span className="fw-medium">{product.size_volume}</span>
                      <span className="mx-2">•</span>
                      <i className="bi bi-box me-2"></i>
                      <span>{product.stock_quantity} in stock</span>
                    </div>
                  </div>
                  
                  {/* Price and Action */}
                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    <div className="price-section">
                      <div className="h4 text-primary fw-bold mb-0">
                        ₦{Number(product.price).toLocaleString()}
                      </div>
                      {product.cost_price && (
                        <small className="text-muted text-decoration-line-through">
                          ₦{Number(product.cost_price * 1.3).toLocaleString()}
                        </small>
                      )}
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm" title="Add to Wishlist">
                        <i className="bi bi-heart"></i>
                      </button>
                      <button 
                        className="btn btn-primary px-4"
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === product.id}
                      >
                        {addingToCart === product.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-plus me-2"></i>Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Categories Info */}
      {categories.length > 0 && (
        <div className="mt-5 pt-5">
          <div className="bg-light rounded-4 p-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark mb-3">Shop by Category</h2>
              <p className="lead text-muted mb-0">Find the perfect water solution for every occasion</p>
            </div>
            <div className="row g-4">
              {categories.map(category => {
                const categoryProducts = products.filter(p => p.category === category && p.stock_quantity > 0);
                const categoryIcon = {
                  'Table Water': 'bi-droplet-fill',
                  'Premium Water': 'bi-gem',
                  'Mineralized Water': 'bi-lightning-fill',
                  'Flavored Water': 'bi-palette'
                }[category] || 'bi-droplet';
                
                return (
                  <div key={category} className="col-sm-6 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm hover-lift cursor-pointer" 
                         onClick={() => setSelectedCategory(category)}
                         style={{transition: 'all 0.3s ease'}}>
                      <div className="card-body text-center p-4">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '60px', height: '60px'}}>
                          <i className={`${categoryIcon} text-primary fs-3`}></i>
                        </div>
                        <h5 className="card-title fw-bold text-dark mb-2">{category}</h5>
                        <p className="text-muted mb-3">
                          {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                        </p>
                        <div className="btn btn-outline-primary btn-sm px-4">
                          Explore <i className="bi bi-arrow-right ms-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;