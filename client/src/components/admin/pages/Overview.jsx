function Overview() {
  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <h2 className="mb-1">Business Overview</h2>
        <p className="text-muted mb-0">Real-time insights into Glams Table Water operations and performance</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-primary text-white">
            <h3 className="mb-1">₦245,750</h3>
            <small>Today's Revenue</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-success text-white">
            <h3 className="mb-1">127</h3>
            <small>Orders Today</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-info text-white">
            <h3 className="mb-1">2,340</h3>
            <small>Bottles Sold</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center bg-warning text-white">
            <h3 className="mb-1">15</h3>
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
            <div className="border rounded-3 p-4 text-center" style={{height: '250px', backgroundColor: '#f8f9fa'}}>
              <div className="d-flex justify-content-center align-items-center h-100">
                <div>
                  <i className="bi bi-bar-chart-fill text-primary" style={{fontSize: '3rem'}}></i>
                  <div className="mt-2">
                    <strong>Weekly Sales Chart</strong><br />
                    <small className="text-muted">Revenue trends for last 7 days</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Top Products</h5>
            <div className="mb-3 border-bottom pb-2">
              <div className="d-flex justify-content-between">
                <span>Glams Pure Water (750ml)</span>
                <strong>1,245 sold</strong>
              </div>
              <small className="text-success">↑ 15% from yesterday</small>
            </div>
            <div className="mb-3 border-bottom pb-2">
              <div className="d-flex justify-content-between">
                <span>Family Pack (5L)</span>
                <strong>678 sold</strong>
              </div>
              <small className="text-success">↑ 8% from yesterday</small>
            </div>
            <div className="mb-3 border-bottom pb-2">
              <div className="d-flex justify-content-between">
                <span>Premium Plus (1.5L)</span>
                <strong>417 sold</strong>
              </div>
              <small className="text-warning">↓ 3% from yesterday</small>
            </div>
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
                  <h6 className="text-warning mb-1">23</h6>
                  <small>Pending</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 mb-2">
                  <h6 className="text-info mb-1">15</h6>
                  <small>In Transit</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-2 mb-2">
                  <h6 className="text-success mb-1">89</h6>
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
            <div className="border rounded p-2 mb-2 bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">750ml Bottles</span>
                <span className="badge bg-success">Normal</span>
              </div>
              <small className="text-muted">2,450 units remaining</small>
            </div>
            <div className="border rounded p-2 mb-2 bg-warning bg-opacity-25">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">5L Containers</span>
                <span className="badge bg-warning">Low Stock</span>
              </div>
              <small className="text-muted">85 units remaining</small>
            </div>
            <div className="border rounded p-2 mb-2 bg-danger bg-opacity-25">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small">Premium 1.5L</span>
                <span className="badge bg-danger">Critical</span>
              </div>
              <small className="text-muted">12 units remaining</small>
            </div>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="col-md-4">
          <div className="border rounded p-3">
            <h5 className="border-bottom pb-2 mb-3">Customer Insights</h5>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">New Customers</span>
                <strong>24</strong>
              </div>
              <small className="text-success">Today</small>
            </div>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">VIP Members</span>
                <strong>67</strong>
              </div>
              <small className="text-info">Active subscriptions</small>
            </div>
            <div className="border rounded p-2 mb-2">
              <div className="d-flex justify-content-between">
                <span className="small">Repeat Rate</span>
                <strong>78%</strong>
              </div>
              <small className="text-success">↑ 5% this month</small>
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
                  <tr className="border-bottom">
                    <td>#GLM-001234</td>
                    <td>John Adebayo</td>
                    <td>2x 750ml, 1x 5L</td>
                    <td>₦1,800</td>
                    <td><span className="badge bg-warning">Pending</span></td>
                  </tr>
                  <tr className="border-bottom">
                    <td>#GLM-001235</td>
                    <td>Sarah Okafor</td>
                    <td>5x 750ml, 2x 5L</td>
                    <td>₦1,750</td>
                    <td><span className="badge bg-info">In Transit</span></td>
                  </tr>
                  <tr className="border-bottom">
                    <td>#GLM-001236</td>
                    <td>Ahmed Ibrahim</td>
                    <td>10x 750ml, 1x 1.5L</td>
                    <td>₦1,800</td>
                    <td><span className="badge bg-success">Delivered</span></td>
                  </tr>
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
          <div className="col-md-4">
            <div className="border rounded p-2 mb-2 bg-warning bg-opacity-25">
              <small><i className="bi bi-exclamation-triangle text-warning me-1"></i>
              Low stock alert for Premium 1.5L bottles</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border rounded p-2 mb-2 bg-info bg-opacity-25">
              <small><i className="bi bi-info-circle text-info me-1"></i>
              15 deliveries scheduled for tomorrow</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border rounded p-2 mb-2 bg-success bg-opacity-25">
              <small><i className="bi bi-check-circle text-success me-1"></i>
              Daily sales target achieved (102%)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;