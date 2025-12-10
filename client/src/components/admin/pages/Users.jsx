import React from "react";

function Users() {
  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <h2 className="mb-1">Customer Management</h2>
        <p className="text-muted mb-0">Manage Glams Table Water customers and delivery preferences</p>
      </div>

      {/* Customer Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-primary mb-1">1,247</h4>
            <small className="text-muted">Total Customers</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-success mb-1">856</h4>
            <small className="text-muted">Active Customers</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-warning mb-1">67</h4>
            <small className="text-muted">VIP Customers</small>
          </div>
        </div>
        <div className="col-md-3">
          <div className="border rounded p-3 text-center">
            <h4 className="text-info mb-1">324</h4>
            <small className="text-muted">New This Month</small>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border rounded p-3 mb-4 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex">
            <button className="btn btn-primary me-2">+ Add New Customer</button>
            <button className="btn btn-outline-secondary me-2">Send Bulk SMS</button>
            <button className="btn btn-outline-info">Export Customer List</button>
          </div>
          <div className="d-flex">
            <select className="form-select me-2" style={{width: '140px'}}>
              <option>All Customers</option>
              <option>Active</option>
              <option>VIP Members</option>
              <option>Inactive</option>
            </select>
            <input type="search" className="form-control" placeholder="Search customers..." style={{width: '200px'}} />
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="border rounded">
        <div className="border-bottom p-3 bg-light">
          <h5 className="mb-0">Customer Database</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="border-bottom">
              <tr>
                <th className="p-3">Customer Info</th>
                <th className="p-3">Contact Details</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3">Order History</th>
                <th className="p-3">Customer Type</th>
                <th className="p-3">Last Order</th>
                <th className="p-3">Total Spent</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* VIP Customer */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="border rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '45px', height: '45px', background: '#f8f9fa'}}>
                      <i className="bi bi-person-fill text-primary"></i>
                    </div>
                    <div>
                      <strong>Mrs. Adunni Lagos</strong>
                      <br />
                      <small className="text-muted">Customer ID: GLM-C-001</small>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div>+234 802 345 6789</div>
                  <small className="text-muted">adunni.lagos@email.com</small>
                </td>
                <td className="p-3">
                  <small>
                    15 Admiralty Way<br />
                    Lekki Phase 1, Lagos<br />
                    <span className="text-primary">Primary Address</span>
                  </small>
                </td>
                <td className="p-3">
                  <div><strong>47 Orders</strong></div>
                  <small className="text-muted">Member since Jan 2024</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-warning">VIP Member</span><br />
                  <small className="text-muted">Monthly Subscription</small>
                </td>
                <td className="p-3">
                  <div>Dec 8, 2025</div>
                  <small className="text-success">₦2,400</small>
                </td>
                <td className="p-3">
                  <strong>₦67,800</strong>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">View Profile</button>
                    <button className="btn btn-outline-info btn-sm">Order History</button>
                  </div>
                </td>
              </tr>

              {/* Regular Active Customer */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="border rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '45px', height: '45px', background: '#f8f9fa'}}>
                      <i className="bi bi-person-fill text-success"></i>
                    </div>
                    <div>
                      <strong>Mr. Chidi Okafor</strong>
                      <br />
                      <small className="text-muted">Customer ID: GLM-C-002</small>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div>+234 703 987 1234</div>
                  <small className="text-muted">chidi.okafor@email.com</small>
                </td>
                <td className="p-3">
                  <small>
                    22 Allen Avenue<br />
                    Ikeja, Lagos<br />
                    <span className="text-success">Verified Address</span>
                  </small>
                </td>
                <td className="p-3">
                  <div><strong>12 Orders</strong></div>
                  <small className="text-muted">Member since Aug 2024</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-success">Active</span><br />
                  <small className="text-muted">Regular Customer</small>
                </td>
                <td className="p-3">
                  <div>Dec 6, 2025</div>
                  <small className="text-success">₦1,200</small>
                </td>
                <td className="p-3">
                  <strong>₦18,600</strong>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">View Profile</button>
                    <button className="btn btn-outline-secondary btn-sm">Send Message</button>
                  </div>
                </td>
              </tr>

              {/* Corporate Customer */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="border rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '45px', height: '45px', background: '#f8f9fa'}}>
                      <i className="bi bi-building text-info"></i>
                    </div>
                    <div>
                      <strong>TechHub Office Complex</strong>
                      <br />
                      <small className="text-muted">Customer ID: GLM-C-003</small>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div>+234 701 234 5678</div>
                  <small className="text-muted">procurement@techhub.ng</small>
                </td>
                <td className="p-3">
                  <small>
                    Plot 456 Victoria Island<br />
                    Lagos State<br />
                    <span className="text-info">Corporate Address</span>
                  </small>
                </td>
                <td className="p-3">
                  <div><strong>89 Orders</strong></div>
                  <small className="text-muted">Member since Mar 2024</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-info">Corporate</span><br />
                  <small className="text-muted">Bulk Orders</small>
                </td>
                <td className="p-3">
                  <div>Dec 9, 2025</div>
                  <small className="text-success">₦27,500</small>
                </td>
                <td className="p-3">
                  <strong>₦487,300</strong>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-primary btn-sm mb-1">Manage Account</button>
                    <button className="btn btn-outline-warning btn-sm">Bulk Pricing</button>
                  </div>
                </td>
              </tr>

              {/* New Customer */}
              <tr className="border-bottom">
                <td className="p-3">
                  <div className="d-flex align-items-center">
                    <div className="border rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '45px', height: '45px', background: '#f8f9fa'}}>
                      <i className="bi bi-person-plus text-warning"></i>
                    </div>
                    <div>
                      <strong>Ms. Fatima Yusuf</strong>
                      <br />
                      <small className="text-muted">Customer ID: GLM-C-004</small>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div>+234 806 555 9876</div>
                  <small className="text-muted">fatima.yusuf@email.com</small>
                </td>
                <td className="p-3">
                  <small>
                    7 Wuse II District<br />
                    Abuja, FCT<br />
                    <span className="text-warning">Address Pending</span>
                  </small>
                </td>
                <td className="p-3">
                  <div><strong>2 Orders</strong></div>
                  <small className="text-muted">Member since Dec 2025</small>
                </td>
                <td className="p-3">
                  <span className="badge bg-light text-dark">New Customer</span><br />
                  <small className="text-muted">First Time Buyer</small>
                </td>
                <td className="p-3">
                  <div>Dec 9, 2025</div>
                  <small className="text-success">₦900</small>
                </td>
                <td className="p-3">
                  <strong>₦1,650</strong>
                </td>
                <td className="p-3">
                  <div className="btn-group-vertical btn-group-sm">
                    <button className="btn btn-outline-success btn-sm mb-1">Welcome Call</button>
                    <button className="btn btn-outline-primary btn-sm">Setup Profile</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="border-top p-3 d-flex justify-content-between align-items-center">
          <small className="text-muted">Showing 1-20 of 1,247 customers</small>
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

export default Users;