import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase/config";

// Cache configuration
const CACHE_CONFIG = {
  key: 'orders_cache',
  statsKey: 'orders_stats_cache',
  ttl: 20 * 60 * 1000 // 20 minutes in milliseconds
};

// Cache utility functions
const cacheUtils = {
  setCache: (key, data, ttl = CACHE_CONFIG.ttl) => {
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
    localStorage.removeItem(CACHE_CONFIG.key);
    localStorage.removeItem(CACHE_CONFIG.statsKey);
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Check cache first
      const cachedOrders = cacheUtils.getCache(CACHE_CONFIG.key);
      if (cachedOrders) {
        console.log('Using cached orders');
        setOrders(cachedOrders);
        updateStats(cachedOrders);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      // Cache the data
      cacheUtils.setCache(CACHE_CONFIG.key, data || []);

      setOrders(data || []);
      updateStats(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (data) => {
    // Calculate statistics
    const total = data?.length || 0;
    const pending = data?.filter(order => order.status === 'pending').length || 0;
    const inTransit = data?.filter(order => order.status === 'processing' || order.status === 'shipped').length || 0;
    const delivered = data?.filter(order => order.status === 'delivered').length || 0;

    const newStats = { total, pending, inTransit, delivered };
    setStats(newStats);
    
    // Cache stats as well
    cacheUtils.setCache(CACHE_CONFIG.statsKey, newStats);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
        return;
      }

      // Invalidate cache and refresh orders
      cacheUtils.clearAllCache();
      fetchOrders();
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const exportOrdersToCSV = () => {
    // Prepare CSV headers
    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Products',
      'Total Amount',
      'Order Date',
      'Delivery Address',
      'Status'
    ];

    // Prepare CSV data rows
    const csvData = filteredOrders.map(order => {
      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
      const products = order.items?.map(item => `${item.quantity}x ${item.name} (${item.size_volume})`).join('; ') || '';
      const deliveryAddress = order.delivery_address && order.delivery_city
        ? `${order.delivery_address}, ${order.delivery_city}${order.delivery_state ? ', ' + order.delivery_state : ''}`
        : order.customer?.address && order.customer?.city
        ? `${order.customer.address}, ${order.customer.city}${order.customer?.state ? ', ' + order.customer.state : ''}`
        : 'N/A';

      return [
        order.id.slice(-8).toUpperCase(),
        customerName,
        order.customer?.email || '',
        order.customer?.phone || '',
        products,
        order.totals?.total || 0,
        formatDate(order.order_date),
        deliveryAddress,
        order.status
      ];
    });

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to check if order date matches filter
  const isOrderInDateRange = (orderDate, filter) => {
    const orderDateTime = new Date(orderDate);
    const now = new Date();
    
    switch (filter) {
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return orderDateTime >= today && orderDateTime < tomorrow;
      
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDateTime >= weekAgo;
      
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orderDateTime >= monthAgo;
      
      case 'all':
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = !searchTerm ||
      order.customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesDate = isOrderInDateRange(order.order_date, dateFilter);

    return matchesFilter && matchesSearch && matchesDate;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      paid: 'bg-info',
      processing: 'bg-primary',
      shipped: 'bg-info',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };

    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getOrderItemsSummary = (items) => {
    if (!items || items.length === 0) return 'No items';

    return items.map(item =>
      `• ${item.quantity}x ${item.name} (${item.size_volume})`
    ).join('\n');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <h2 className="mb-1">Order Management</h2>
        <p className="text-muted mb-0">Track and manage Glams Table Water orders and deliveries</p>
      </div>

      {/* Order Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-primary mb-1">{stats.total}</h4>
            <small className="text-muted">Total Orders</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-warning mb-1">{stats.pending}</h4>
            <small className="text-muted">Pending Orders</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-info mb-1">{stats.inTransit}</h4>
            <small className="text-muted">In Transit</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-success mb-1">{stats.delivered}</h4>
            <small className="text-muted">Delivered</small>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <select
              className="form-select me-2"
              style={{width: '150px'}}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="form-select me-2" style={{width: '120px'}}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="d-flex">
            <input
              type="search"
              className="form-control me-2"
              placeholder="Search orders..."
              style={{width: '200px'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={exportOrdersToCSV}>Export Orders</button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded">
        <div className="border-bottom p-3 bg-light">
          <h5 className="mb-0">Recent Orders</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="border-bottom">
              <tr  style={{fontSize: '13px'}}>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Products</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4">
                    <div className="text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No orders found
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-bottom">
                    <td className="p-3">
                      <strong>#{order.id.slice(-8).toUpperCase()}</strong>
                    </td>
                    <td className="p-3">
                      <strong>{order.customer?.firstName} {order.customer?.lastName}</strong><br />
                      <small className="text-muted">{order.customer?.phone}</small><br />
                      <small className="text-muted">{order.customer?.email}</small>
                    </td>
                    <td className="p-3">
                      <div className="small" style={{whiteSpace: 'pre-line'}}>
                        {getOrderItemsSummary(order.items)}
                      </div>
                    </td>
                    <td className="p-3">
                      <strong>₦{order.totals?.total?.toLocaleString() || '0'}</strong>
                    </td>
                    <td className="p-3">
                      <div>{formatDate(order.order_date)}</div>
                      <small className="text-muted">{formatTime(order.order_date)}</small>
                    </td>
                    <td className="p-3">
                      <small>
                        {order.delivery_address && order.delivery_city ?
                          `${order.delivery_address}, ${order.delivery_city}` :
                          order.customer?.address && order.customer?.city ?
                          `${order.customer.address}, ${order.customer.city}` :
                          'N/A'
                        }
                        {order.delivery_state && <br />}{order.delivery_state}
                      </small>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-3">
                      <div className="btn-group-vertical btn-group-sm">
                        {order.status === 'pending' && (
                          <button
                            className="btn btn-outline-success btn-sm mb-1"
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                          >
                            Start Processing
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            className="btn btn-outline-info btn-sm mb-1"
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {(order.status === 'shipped' || order.status === 'paid') && (
                          <button
                            className="btn btn-outline-success btn-sm mb-1"
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Delivered
                          </button>
                        )}
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          type="button"
                          onClick={() => viewOrderDetails(order)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-top p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing 1-{Math.min(filteredOrders.length, 20)} of {filteredOrders.length} orders
          </small>
          <nav>
            <div className="d-flex">
              <button className="btn btn-sm btn-outline-secondary me-1" type="button" disabled>Previous</button>
              <button className="btn btn-sm btn-primary me-1" type="button">1</button>
              <button className="btn btn-sm btn-outline-secondary" type="button">Next</button>
            </div>
          </nav>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1055 }}
            onClick={closeOrderDetails}
          ></div>

          {/* Modal */}
          <div
            className="modal fade show d-block"
            style={{ zIndex: 1060 }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - #{selectedOrder.id.slice(-8).toUpperCase()}</h5>
                  <button type="button" className="btn-close" onClick={closeOrderDetails}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    {/* Customer Information */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Customer Information</h6>
                      <div className="mb-2">
                        <strong>Name:</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {selectedOrder.customer?.email}
                      </div>
                      <div className="mb-2">
                        <strong>Phone:</strong> {selectedOrder.customer?.phone}
                      </div>
                      <div className="mb-2">
                        <strong>Address:</strong><br />
                        {selectedOrder.delivery_address || selectedOrder.customer?.address}, {selectedOrder.delivery_city || selectedOrder.customer?.city}<br />
                        {selectedOrder.delivery_state || selectedOrder.customer?.state}
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Order Information</h6>
                      <div className="mb-2">
                        <strong>Order Date:</strong> {formatDate(selectedOrder.order_date)} at {formatTime(selectedOrder.order_date)}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div className="mb-2">
                        <strong>Delivery Method:</strong> {selectedOrder.delivery_method === 'home' ? 'Home Delivery' : 'Store Pickup'}
                      </div>
                      {selectedOrder.special_instructions && (
                        <div className="mb-2">
                          <strong>Special Instructions:</strong><br />
                          {selectedOrder.special_instructions}
                        </div>
                      )}
                    </div>
                  </div>

                  <hr />

                  {/* Order Items */}
                  <h6 className="fw-bold mb-3">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Size</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.size_volume}</td>
                            <td>{item.quantity}</td>
                            <td>₦{item.price?.toLocaleString()}</td>
                            <td>₦{(item.price * item.quantity)?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <hr />

                  {/* Order Totals */}
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold mb-3">Payment Information</h6>
                      {selectedOrder.payment && (
                        <>
                          <div className="mb-2">
                            <strong>Payment Method:</strong> {selectedOrder.payment.channel || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Reference:</strong> {selectedOrder.payment.reference}
                          </div>
                          <div className="mb-2">
                            <strong>Amount Paid:</strong> ₦{selectedOrder.payment.amount?.toLocaleString()}
                          </div>
                          {selectedOrder.payment.paid_at && (
                            <div className="mb-2">
                              <strong>Paid At:</strong> {formatDate(selectedOrder.payment.paid_at)} at {formatTime(selectedOrder.payment.paid_at)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="col-md-6 text-end">
                      <h6 className="fw-bold mb-3">Order Summary</h6>
                      <div className="mb-2">
                        <strong>Subtotal:</strong> ₦{selectedOrder.totals?.subtotal?.toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <strong>Delivery Fee:</strong> ₦{selectedOrder.totals?.deliveryFee?.toLocaleString()}
                      </div>
                      <div className="border-top pt-2">
                        <strong className="fs-5">Total: ₦{selectedOrder.totals?.total?.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeOrderDetails}>
                    Close
                  </button>
                  {selectedOrder.status === 'pending' && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'processing');
                        closeOrderDetails();
                      }}
                    >
                      Start Processing
                    </button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'shipped');
                        closeOrderDetails();
                      }}
                    >
                      Mark as Shipped
                    </button>
                  )}
                  {(selectedOrder.status === 'shipped' || selectedOrder.status === 'paid') && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'delivered');
                        closeOrderDetails();
                      }}
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default Orders;