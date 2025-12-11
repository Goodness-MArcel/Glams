import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

function CartSidebar({ isOpen, onClose }) {
  const { items, cartTotal, cartItemsCount, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" 
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div 
        className="position-fixed top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
        style={{ 
          width: '400px', 
          maxWidth: '90vw', 
          zIndex: 1051,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-cart3 me-2 text-primary"></i>
            Shopping Cart ({cartItemsCount})
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close cart"
          ></button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow-1 overflow-auto">
          {items.length === 0 ? (
            <div className="text-center p-5">
              <div className="mb-4">
                <i className="bi bi-cart-x display-4 text-muted"></i>
              </div>
              <h6 className="text-muted">Your cart is empty</h6>
              <p className="small text-muted mb-4">Add some premium water products to get started!</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-3">
              {items.map(item => (
                <div key={item.id} className="card mb-3 border-0 shadow-sm">
                  <div className="card-body p-3">
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-3">
                        <div 
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ height: '60px' }}
                        >
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="img-fluid rounded"
                              style={{ maxHeight: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <i className="bi bi-droplet text-primary fs-4"></i>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="col-6">
                        <h6 className="card-title mb-1 small fw-bold">{item.name}</h6>
                        <p className="small text-muted mb-2">{item.size_volume}</p>
                        <div className="fw-bold text-primary">
                          ₦{Number(item.price).toLocaleString()}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-3">
                        <div className="d-flex flex-column align-items-center">
                          <div className="btn-group-vertical btn-group-sm mb-2">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                            >
                              +
                            </button>
                            <span className="px-2 py-1 text-center small fw-bold">
                              {item.quantity}
                            </span>
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              style={{ fontSize: '12px', padding: '2px 8px' }}
                            >
                              -
                            </button>
                          </div>
                          <button 
                            className="btn btn-link text-danger p-0 small"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash"></i>
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

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-top p-4">
            {/* Subtotal */}
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Subtotal:</span>
              <span className="fw-bold fs-5 text-primary">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <a 
                href="/checkout" 
                className="btn btn-primary btn-lg"
                onClick={onClose}
              >
                <i className="bi bi-credit-card me-2"></i>
                Proceed to Checkout
              </a>
              <button 
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>

            {/* Clear Cart */}
            <div className="text-center mt-3">
              <button 
                className="btn btn-link text-muted small"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
              >
                <i className="bi bi-trash me-1"></i>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CartSidebar;