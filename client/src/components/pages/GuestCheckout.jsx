import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function GuestCheckout() {
  const { items, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: 'card',
    deliveryMethod: 'home',
    specialInstructions: ''
  });

  const deliveryFee = paymentInfo.deliveryMethod === 'pickup' ? 0 : 2000;
  const totalAmount = cartTotal + deliveryFee;

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return items.length > 0;
      case 2:
        return customerInfo.firstName && 
               customerInfo.lastName && 
               customerInfo.email && 
               customerInfo.phone &&
               (paymentInfo.deliveryMethod === 'pickup' || 
                (customerInfo.address && customerInfo.city && customerInfo.state));
      case 3:
        return true; // Paystack handles payment method selection
      default:
        return false;
    }
  };

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);

      console.log('Initializing payment...');
      console.log('Paystack available:', !!window.PaystackPop);
      console.log('Public key:', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY);

      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          size_volume: item.size_volume,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        })),
        customer: customerInfo,
        payment: paymentInfo,
        totals: {
          subtotal: cartTotal,
          deliveryFee,
          total: totalAmount
        },
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Order data:', orderData);
      console.log('Total amount:', totalAmount);

      // Initialize Paystack inline payment
      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx';
      console.log('Using Paystack key:', paystackKey);

      if (!window.PaystackPop) {
        throw new Error('Paystack script not loaded');
      }

      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: customerInfo.email,
        amount: totalAmount * 100, // Paystack expects kobo
        currency: 'NGN',
        ref: 'GLAMS_' + Date.now(), // Unique reference
        metadata: {
          order: orderData
        },
        callback: function(response) {
          console.log('Payment callback received:', response);
          // Payment successful - verify and save order
          fetch(`/api/payments/paystack/verify?reference=${response.reference}`)
            .then(verifyResp => {
              if (verifyResp.ok) {
                return verifyResp.json().then(verifyData => {
                  clearCart();
                  setOrderComplete(true);
                });
              } else {
                return verifyResp.json().then(verifyData => {
                  console.error('Payment verification failed:', verifyData);
                  alert('Payment verification failed. Please contact support.');
                });
              }
            })
            .catch(err => {
              console.error('Error verifying payment:', err);
              alert('Error verifying payment. Please contact support.');
            });
        },
        onClose: function() {
          console.log('Payment modal closed');
          setIsSubmitting(false);
          alert('Payment cancelled');
        }
      });

      console.log('Paystack handler created:', handler);
      handler.openIframe();

    } catch (error) {
      console.error('Error initializing payment:', error);
      alert(`Failed to initialize payment: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{width: '120px', height: '120px'}}>
                  <i className="bi bi-check-circle-fill text-success display-3"></i>
                </div>
              </div>
              <h2 className="fw-bold text-success mb-3">Order Confirmed!</h2>
              <p className="lead text-muted mb-4">
                Thank you for your order! We'll send you a confirmation email shortly.
              </p>
              <div className="bg-light rounded-3 p-4 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Order Total:</span>
                  <span className="fw-bold">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Delivery Method:</span>
                  <span className="text-capitalize">{paymentInfo.deliveryMethod}</span>
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/products" className="btn btn-primary px-4">
                  Continue Shopping
                </Link>
                <Link to="/" className="btn btn-outline-primary px-4">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Progress Steps */}
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="d-flex align-items-center flex-fill">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                      currentStep >= step ? 'bg-primary text-white' : 'bg-light text-muted'
                    }`}
                    style={{ width: '40px', height: '40px' }}
                  >
                    {currentStep > step ? (
                      <i className="bi bi-check"></i>
                    ) : (
                      <span className="fw-bold">{step}</span>
                    )}
                  </div>
                  <div className="flex-fill">
                    <div className={`fw-bold ${currentStep >= step ? 'text-primary' : 'text-muted'}`}>
                      {step === 1 && 'Review Cart'}
                      {step === 2 && 'Customer Info'}
                      {step === 3 && 'Payment & Review'}
                    </div>
                  </div>
                  {step < 3 && (
                    <div 
                      className={`flex-fill border-top mx-3 ${
                        currentStep > step ? 'border-primary' : 'border-light'
                      }`}
                      style={{ height: '2px' }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="card border-0 shadow-sm mt-5">
              <div className="card-header bg-light">
                <h5 className="mb-0">Review Your Order</h5>
              </div>
              <div className="card-body">
                {items.map(item => (
                  <div key={item.id} className="d-flex align-items-center border-bottom py-3">
                    <div className="me-3">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-droplet text-primary fs-4"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted small mb-1">{item.size_volume}</p>
                      <div className="d-flex align-items-center">
                        <span className="me-3">Qty: {item.quantity}</span>
                        <span className="fw-bold text-primary">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-end mt-3">
                  <button 
                    className="btn btn-primary px-4"
                    onClick={() => setCurrentStep(2)}
                    disabled={!validateStep(1)}
                  >
                    Continue to Customer Info
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="card border-0 shadow-sm mt-5">
              <div className="card-header bg-light">
                <h5 className="mb-0">Customer Information</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={customerInfo.firstName}
                        onChange={handleCustomerInfoChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={customerInfo.lastName}
                        onChange={handleCustomerInfoChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={customerInfo.email}
                        onChange={handleCustomerInfoChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={customerInfo.phone}
                        onChange={handleCustomerInfoChange}
                        required
                      />
                    </div>
                    
                    {/* Delivery Method */}
                    <div className="col-12">
                      <label className="form-label">Delivery Method *</label>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <div className="form-check border rounded p-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryMethod"
                              value="home"
                              checked={paymentInfo.deliveryMethod === 'home'}
                              onChange={handlePaymentInfoChange}
                            />
                            <label className="form-check-label">
                              <strong>Home Delivery</strong><br />
                              <small className="text-muted">₦2,000 delivery fee</small>
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check border rounded p-3">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="deliveryMethod"
                              value="pickup"
                              checked={paymentInfo.deliveryMethod === 'pickup'}
                              onChange={handlePaymentInfoChange}
                            />
                            <label className="form-check-label">
                              <strong>Store Pickup</strong><br />
                              <small className="text-muted">Free - Ready in 30 mins</small>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Fields (only for home delivery) */}
                    {paymentInfo.deliveryMethod === 'home' && (
                      <>
                        <div className="col-12">
                          <label className="form-label">Street Address *</label>
                          <input
                            type="text"
                            name="address"
                            className="form-control"
                            value={customerInfo.address}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">City *</label>
                          <input
                            type="text"
                            name="city"
                            className="form-control"
                            value={customerInfo.city}
                            onChange={handleCustomerInfoChange}
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">State *</label>
                          <select
                            name="state"
                            className="form-select"
                            value={customerInfo.state}
                            onChange={handleCustomerInfoChange}
                            required
                          >
                            <option value="">Select State</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja">Abuja</option>
                            <option value="Kano">Kano</option>
                            <option value="Rivers">Rivers</option>
                            <option value="Oyo">Oyo</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            className="form-control"
                            value={customerInfo.zipCode}
                            onChange={handleCustomerInfoChange}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back to Cart
                    </button>
                    <button 
                      type="button"
                      className="btn btn-primary px-4"
                      onClick={() => setCurrentStep(3)}
                      disabled={!validateStep(2)}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Payment & Final Review</h5>
              </div>
              <div className="card-body">
                {/* Special Instructions */}
                <div className="mb-4">
                  <label className="form-label">Special Instructions (Optional)</label>
                  <textarea
                    name="specialInstructions"
                    className="form-control"
                    rows="3"
                    placeholder="Any special delivery instructions or notes..."
                    value={paymentInfo.specialInstructions}
                    onChange={handlePaymentInfoChange}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back to Info
                  </button>
                  <button 
                    type="button"
                    className="btn btn-success btn-lg px-5"
                    onClick={handleSubmitOrder}
                    disabled={!validateStep(3) || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-light">
              <h6 className="mb-0">Order Summary</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({items.length} items)</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestCheckout;