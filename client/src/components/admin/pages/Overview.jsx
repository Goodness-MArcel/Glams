import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabase/config.js';
import { productAPI } from '../../api/product.js';
import WeeklySalesChart from '../components/WeeklySalesChart';

// Cache configuration
const OVERVIEW_CACHE_CONFIG = {
  kpis: 'overview_kpis_cache',
  topProducts: 'overview_top_products_cache',
  deliveryStatus: 'overview_delivery_status_cache',
  inventoryAlerts: 'overview_inventory_alerts_cache',
  recentOrders: 'overview_recent_orders_cache',
  customerInsights: 'overview_customer_insights_cache',
  ttl: 20 * 60 * 1000 // 20 minutes
};

// Cache utility functions
const overviewCacheUtils = {
  setCache: (key, data, ttl = OVERVIEW_CACHE_CONFIG.ttl) => {
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
    Object.values(OVERVIEW_CACHE_CONFIG).forEach(key => {
      if (typeof key === 'string') {
        localStorage.removeItem(key);
      }
    });
  }
};

function Overview() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    bottlesSold: 0,
    activeDeliveries: 0
  });
  const [topProducts, setTopProducts] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0
  });
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [customerInsights, setCustomerInsights] = useState({
    newCustomers: 0,
    vipMembers: 0,
    repeatRate: 0
  });

  const fetchKPIs = async () => {
    try {
      // Check cache first
      const cachedKPIs = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.kpis);
      if (cachedKPIs) {
        console.log('Using cached KPIs');
        setKpis(cachedKPIs);
        return;
      }

      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch today's orders
      const { data: todayOrders, error } = await supabase
        .from('orders')
        .select('*')
        .gte('order_date', startOfDay.toISOString())
        .lte('order_date', endOfDay.toISOString());

      if (error) throw error;

      // Calculate KPIs
      const revenue = todayOrders?.reduce((sum, order) => sum + (order.totals?.total || 0), 0) || 0;
      const orderCount = todayOrders?.length || 0;
      const bottles = todayOrders?.reduce((sum, order) => {
        return sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0);
      }, 0) || 0;

      // Count active deliveries (processing + shipped)
      const activeDeliveries = todayOrders?.filter(order =>
        order.status === 'processing' || order.status === 'shipped'
      ).length || 0;

      const kpisData = {
        todayRevenue: revenue,
        todayOrders: orderCount,
        bottlesSold: bottles,
        activeDeliveries: activeDeliveries
      };

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.kpis, kpisData);
      setKpis(kpisData);
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      // Check cache first
      const cachedTopProducts = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.topProducts);
      if (cachedTopProducts) {
        console.log('Using cached top products');
        setTopProducts(cachedTopProducts);
        return;
      }

      // Get all orders from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: recentOrders, error } = await supabase
        .from('orders')
        .select('items')
        .gte('order_date', sevenDaysAgo.toISOString());

      if (error) throw error;

      // Aggregate product sales
      const productSales = {};
      recentOrders?.forEach(order => {
        order.items?.forEach(item => {
          const key = `${item.name} (${item.size_volume})`;
          if (!productSales[key]) {
            productSales[key] = { quantity: 0, name: item.name, size: item.size_volume };
          }
          productSales[key].quantity += item.quantity;
        });
      });

      // Sort and get top 3
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.topProducts, topProducts);
      setTopProducts(topProducts);
    } catch (error) {
      console.error('Error fetching top products:', error);
    }
  };

  const fetchDeliveryStatus = async () => {
    try {
      // Check cache first
      const cachedStatus = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.deliveryStatus);
      if (cachedStatus) {
        console.log('Using cached delivery status');
        setDeliveryStatus(cachedStatus);
        return;
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('status')
        .in('status', ['pending', 'processing', 'shipped', 'delivered']);

      if (error) throw error;

      const status = {
        pending: orders?.filter(order => order.status === 'pending').length || 0,
        inTransit: orders?.filter(order => order.status === 'processing' || order.status === 'shipped').length || 0,
        delivered: orders?.filter(order => order.status === 'delivered').length || 0
      };

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.deliveryStatus, status);
      setDeliveryStatus(status);
    } catch (error) {
      console.error('Error fetching delivery status:', error);
    }
  };

  const fetchInventoryAlerts = async () => {
    try {
      // Check cache first
      const cachedAlerts = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.inventoryAlerts);
      if (cachedAlerts) {
        console.log('Using cached inventory alerts');
        setInventoryAlerts(cachedAlerts);
        return;
      }

      const response = await productAPI.getAllProducts();
      if (!response.success || !response.data) return;

      const alerts = response.data
        .filter(product => {
          const quantity = Number(product.stock_quantity) || 0;
          const reorderLevel = Number(product.reorder_level) || 50;
          return quantity <= reorderLevel;
        })
        .map(product => ({
          name: product.name,
          size: product.size_volume,
          quantity: product.stock_quantity,
          reorderLevel: product.reorder_level,
          status: product.stock_quantity === 0 ? 'out' :
                  product.stock_quantity <= (product.reorder_level * 0.5) ? 'critical' : 'low'
        }))
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 3); // Show top 3 alerts

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.inventoryAlerts, alerts);
      setInventoryAlerts(alerts);
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      // Check cache first
      const cachedOrders = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.recentOrders);
      if (cachedOrders) {
        console.log('Using cached recent orders');
        setRecentOrders(cachedOrders);
        return;
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.recentOrders, orders || []);
      setRecentOrders(orders || []);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchCustomerInsights = async () => {
    try {
      // Check cache first
      const cachedInsights = overviewCacheUtils.getCache(OVERVIEW_CACHE_CONFIG.customerInsights);
      if (cachedInsights) {
        console.log('Using cached customer insights');
        setCustomerInsights(cachedInsights);
        return;
      }

      // For guest checkout, we'll calculate insights from order data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentOrders, error } = await supabase
        .from('orders')
        .select('customer, order_date')
        .gte('order_date', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Count unique customers (by phone number as identifier)
      const uniqueCustomers = new Set();
      recentOrders?.forEach(order => {
        if (order.customer?.phone) {
          uniqueCustomers.add(order.customer.phone);
        }
      });

      // Calculate repeat customers (customers with multiple orders)
      const customerOrderCount = {};
      recentOrders?.forEach(order => {
        if (order.customer?.phone) {
          customerOrderCount[order.customer.phone] = (customerOrderCount[order.customer.phone] || 0) + 1;
        }
      });

      const repeatCustomers = Object.values(customerOrderCount).filter(count => count > 1).length;
      const totalCustomers = uniqueCustomers.size;
      const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

      const insightsData = {
        newCustomers: totalCustomers,
        vipMembers: repeatCustomers, // Using repeat customers as "VIP"
        repeatRate: repeatRate
      };

      // Cache the data
      overviewCacheUtils.setCache(OVERVIEW_CACHE_CONFIG.customerInsights, insightsData);
      setCustomerInsights(insightsData);
    } catch (error) {
      console.error('Error fetching customer insights:', error);
    }
  };

  const fetchOverviewData = useCallback(async (skipCache = false) => {
    try {
      setLoading(true);
      
      // Clear cache if user manually refreshes
      if (skipCache) {
        overviewCacheUtils.clearAllCache();
      }
      
      await Promise.all([
        fetchKPIs(),
        fetchTopProducts(),
        fetchDeliveryStatus(),
        fetchInventoryAlerts(),
        fetchRecentOrders(),
        fetchCustomerInsights()
      ]);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData();
  }, [fetchOverviewData]);

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">Business Overview</h2>
            <p className="text-muted mb-0">Real-time insights into Glams Table Water operations and performance</p>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={() => fetchOverviewData(true)}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Refreshing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-primary text-white">
            {loading ? (
              <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
            ) : (
              <h3 className="mb-1">₦{kpis.todayRevenue.toLocaleString()}</h3>
            )}
            <small>Today's Revenue</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-success text-white">
            {loading ? (
              <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
            ) : (
              <h3 className="mb-1">{kpis.todayOrders}</h3>
            )}
            <small>Orders Today</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-info text-white">
            {loading ? (
              <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
            ) : (
              <h3 className="mb-1">{kpis.bottlesSold}</h3>
            )}
            <small>Bottles Sold</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-warning text-white">
            {loading ? (
              <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
            ) : (
              <h3 className="mb-1">{kpis.activeDeliveries}</h3>
            )}
            <small>Active Deliveries</small>
          </div>
        </div>
      </div>

      {/* Charts and Analytics Row */}
      <div className="row mb-4">
        {/* Sales Chart */}
        <div className="col-md-8">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Sales Performance</h5>
            <WeeklySalesChart />
          </div>
        </div>

        {/* Top Products */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Top Products</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="mb-3 border-bottom pb-2">
                  <div className="d-flex justify-content-between">
                    <span>{product.name} ({product.size})</span>
                    <strong>{product.quantity} sold</strong>
                  </div>
                  <small className="text-muted">Last 7 days</small>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-muted">
                <small>No sales data available</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operational Metrics Row */}
      <div className="row mb-4">
        {/* Delivery Status */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Delivery Status</h5>
            <div className="row text-center">
              <div className="col-4">
                <div className="border rounded p-2 mb-2">
                  {loading ? (
                    <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
                  ) : (
                    <h6 className="text-warning mb-1">{deliveryStatus.pending}</h6>
                  )}
                  <small>Pending</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 mb-2">
                  {loading ? (
                    <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
                  ) : (
                    <h6 className="text-info mb-1">{deliveryStatus.inTransit}</h6>
                  )}
                  <small>In Transit</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 mb-2">
                  {loading ? (
                    <div className="spinner-border spinner-border-sm mb-1" role="status"></div>
                  ) : (
                    <h6 className="text-success mb-1">{deliveryStatus.delivered}</h6>
                  )}
                  <small>Delivered</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Alert */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Inventory Alerts</h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : inventoryAlerts.length > 0 ? (
              inventoryAlerts.map((alert, index) => (
                <div key={index} className={`border rounded p-2 mb-2 ${
                  alert.status === 'out' ? 'bg-danger bg-opacity-25' :
                  alert.status === 'critical' ? 'bg-danger bg-opacity-25' :
                  'bg-warning bg-opacity-25'
                }`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small">{alert.name} ({alert.size})</span>
                    <span className={`badge ${
                      alert.status === 'out' ? 'bg-danger' :
                      alert.status === 'critical' ? 'bg-danger' :
                      'bg-warning'
                    }`}>
                      {alert.status === 'out' ? 'Out of Stock' :
                       alert.status === 'critical' ? 'Critical' :
                       'Low Stock'}
                    </span>
                  </div>
                  <small className="text-muted">{alert.quantity} units remaining</small>
                </div>
              ))
            ) : (
              <div className="border rounded p-2 mb-2 bg-success bg-opacity-25">
                <small className="text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  All products are well-stocked
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Customer Insights</h5>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">Active Customers</span>
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <strong>{customerInsights.newCustomers}</strong>
                )}
              </div>
              <small className="text-muted">Last 30 days</small>
            </div>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">Repeat Customers</span>
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <strong>{customerInsights.vipMembers}</strong>
                )}
              </div>
              <small className="text-info">Multiple orders</small>
            </div>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">Repeat Rate</span>
                {loading ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <strong>{customerInsights.repeatRate}%</strong>
                )}
              </div>
              <small className="text-success">Customer loyalty</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="row mb-4">
        {/* Recent Orders */}
        <div className="col-md-8">
          <div className="border rounded p-3">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h5 className="mb-0">Recent Orders</h5>
              <button className="btn btn-sm btn-outline-primary">View All</button>
            </div>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr className="border-bottom">
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        <div className="mt-2 small text-muted">Loading recent orders...</div>
                      </td>
                    </tr>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-bottom">
                        <td>#{order.id.slice(-8).toUpperCase()}</td>
                        <td>{order.customer?.firstName} {order.customer?.lastName}</td>
                        <td>
                          {order.items?.map(item => `${item.quantity}x ${item.size_volume}`).join(', ')}
                        </td>
                        <td>₦{order.totals?.total?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            order.status === 'pending' ? 'bg-warning' :
                            order.status === 'processing' ? 'bg-primary' :
                            order.status === 'shipped' ? 'bg-info' :
                            order.status === 'delivered' ? 'bg-success' :
                            'bg-secondary'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        <small>No recent orders</small>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Quick Actions</h5>
            <div className="d-grid gap-2">
              <button className="btn btn-primary border rounded">
                <i className="bi bi-plus-circle me-2"></i>New Order
              </button>
              <button className="btn btn-success border rounded">
                <i className="bi bi-truck me-2"></i>Schedule Delivery
              </button>
              <button className="btn btn-info border rounded">
                <i className="bi bi-box-seam me-2"></i>Add Product
              </button>
              <button className="btn btn-warning border rounded">
                <i className="bi bi-envelope me-2"></i>Send SMS Alert
              </button>
              <button className="btn btn-secondary border rounded">
                <i className="bi bi-file-earmark-text me-2"></i>Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="border rounded p-3 mb-4 bg-light">
        <h6 className="mb-2">System Alerts</h6>
        <div className="row">
          {inventoryAlerts.length > 0 && (
            <div className="col-md-4">
              <div className="border rounded p-2 mb-2 bg-warning bg-opacity-25">
                <small><i className="bi bi-exclamation-triangle text-warning me-1"></i>
                {inventoryAlerts.length} product{inventoryAlerts.length > 1 ? 's' : ''} running low on stock
                </small>
              </div>
            </div>
          )}
          {deliveryStatus.pending > 0 && (
            <div className="col-md-4">
              <div className="border rounded p-2 mb-2 bg-info bg-opacity-25">
                <small><i className="bi bi-truck text-info me-1"></i>
                {deliveryStatus.pending} order{deliveryStatus.pending > 1 ? 's' : ''} pending delivery
                </small>
              </div>
            </div>
          )}
          {kpis.todayOrders > 0 && (
            <div className="col-md-4">
              <div className="border rounded p-2 mb-2 bg-success bg-opacity-25">
                <small><i className="bi bi-check-circle text-success me-1"></i>
                {kpis.todayOrders} order{kpis.todayOrders > 1 ? 's' : ''} processed today
                </small>
              </div>
            </div>
          )}
          {inventoryAlerts.length === 0 && deliveryStatus.pending === 0 && (
            <div className="col-12">
              <div className="border rounded p-2 mb-2 bg-success bg-opacity-25">
                <small><i className="bi bi-check-circle-fill text-success me-1"></i>
                All systems operating normally - no alerts at this time
                </small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;