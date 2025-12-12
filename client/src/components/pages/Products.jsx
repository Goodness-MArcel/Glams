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
    <div className="container py-4">
      {/* Simple Header */}
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold text-primary mb-2">Our Products</h1>
        <p className="lead text-muted">Premium water collection for your hydration needs</p>
      </div>

      {/* Simple Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">No products found</h3>
          <p>Try adjusting your search or filters</p>
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
    </div>
  );
}

export default Products;