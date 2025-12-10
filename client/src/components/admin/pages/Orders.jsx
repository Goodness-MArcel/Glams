import React from "react";

function Orders() {
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
            <h4 className="text-primary mb-1">127</h4>
            <small className="text-muted">Total Orders</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-warning mb-1">23</h4>
            <small className="text-muted">Pending Orders</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-info mb-1">15</h4>
            <small className="text-muted">In Transit</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-success mb-1">89</h4>
            <small className="text-muted">Delivered</small>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <select className="form-select me-2" style={{width: '150px'}}>
              <option>All Orders</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
            <select className="form-select me-2" style={{width: '120px'}}>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div className="d-flex">
            <input type="search" className="form-control me-2" placeholder="Search orders..." style={{width: '200px'}} />
            <button className="btn btn-outline-secondary">Export Orders</button>
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
              <tr>
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
              {/* Sample Order 1 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <strong>#GLM-001234</strong>
                </td>
                <td className="p-3">
                  <strong>John Adebayo</strong><br />
                  <small className="text-muted">+234 802 123 4567</small><br />
                  <small className="text-muted">john.adebayo@email.com</small>
                </td>
                <td className="p-3">
                  <div className="small">
                    • 2x Glams Pure Water (750ml)<br />
                    • 1x Glams Family Pack (5L)<br />
                    • 3x Glams Premium Plus (1.5L)
                  </div>
                </td>
                <td className="p-3">
                  <strong>₦1,800</strong>
                </td>
                <td className="p-3">
                  <div>Dec 10, 2025</div>
                  <small className="text-muted">2:30 PM</small>
                </td>
                <td className="p-3">
                  <small>15 Admiralty Way, Lekki<br />Lagos State</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-warning">Pending</span>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">View Details</button>
                    <button className="btn btn-outline-success btn-sm">Mark Delivered</button>
                  </div>
                </td>
              </tr>

              {/* Sample Order 2 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <strong>#GLM-001235</strong>
                </td>
                <td className="p-3">
                  <strong>Sarah Okafor</strong><br />
                  <small className="text-muted">+234 703 987 6543</small><br />
                  <small className="text-muted">sarah.okafor@email.com</small>
                </td>
                <td className="p-3">
                  <div className="small">
                    • 5x Glams Pure Water (750ml)<br />
                    • 2x Glams Family Pack (5L)
                  </div>
                </td>
                <td className="p-3">
                  <strong>₦1,750</strong>
                </td>
                <td className="p-3">
                  <div>Dec 10, 2025</div>
                  <small className="text-muted">1:15 PM</small>
                </td>
                <td className="p-3">
                  <small>22 Allen Avenue, Ikeja<br />Lagos State</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-info">In Transit</span>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">Track Order</button>
                    <button className="btn btn-outline-secondary btn-sm">Contact Customer</button>
                  </div>
                </td>
              </tr>

              {/* Sample Order 3 */}
              <tr className="border-bottom">
                <td className="p-3">
                  <strong>#GLM-001236</strong>
                </td>
                <td className="p-3">
                  <strong>Ahmed Ibrahim</strong><br />
                  <small className="text-muted">+234 806 555 0123</small><br />
                  <small className="text-muted">ahmed.ibrahim@email.com</small>
                </td>
                <td className="p-3">
                  <div className="small">
                    • 10x Glams Pure Water (750ml)<br />
                    • 1x Glams Premium Plus (1.5L)
                  </div>
                </td>
                <td className="p-3">
                  <strong>₦1,800</strong>
                </td>
                <td className="p-3">
                  <div>Dec 9, 2025</div>
                  <small className="text-muted">4:45 PM</small>
                </td>
                <td className="p-3">
                  <small>7 Wuse II, Abuja<br />FCT</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-success">Delivered</span>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">View Receipt</button>
                    <button className="btn btn-outline-info btn-sm">Customer Feedback</button>
                  </div>
                </td>
              </tr>

              {/* Bulk Order Sample */}
              <tr className="border-bottom">
                <td className="p-3">
                  <strong>#GLM-001237</strong><br />
                  <small className="badge bg-secondary">Bulk Order</small>
                </td>
                <td className="p-3">
                  <strong>Lagos Office Complex</strong><br />
                  <small className="text-muted">+234 701 234 5678</small><br />
                  <small className="text-muted">procurement@lagosoffice.com</small>
                </td>
                <td className="p-3">
                  <div className="small">
                    • 50x Glams Pure Water (750ml)<br />
                    • 20x Glams Family Pack (5L)<br />
                    • 30x Glams Premium Plus (1.5L)
                  </div>
                </td>
                <td className="p-3">
                  <strong>₦27,500</strong><br />
                  <small className="text-success">Bulk Discount Applied</small>
                </td>
                <td className="p-3">
                  <div>Dec 9, 2025</div>
                  <small className="text-muted">10:00 AM</small>
                </td>
                <td className="p-3">
                  <small>Plot 456 Victoria Island<br />Lagos State</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-primary">Processing</span>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-warning btn-sm mb-1">Schedule Delivery</button>
                    <button className="btn btn-outline-primary btn-sm">Print Invoice</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-top p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">Showing 1-20 of 127 orders</small>
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
    </div>
  );
}

export default Orders;