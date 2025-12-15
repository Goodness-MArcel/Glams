import React from 'react';

function UsersSkeleton() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-1">Customer Management</h2>
          <p className="text-muted mb-0">Sketch: layout and placeholders before live data</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="me-2">
            <input className="form-control" style={{width: '240px'}} placeholder="Search customers..." disabled />
          </div>
          <button className="btn btn-outline-primary me-2" disabled>Export</button>
          <button className="btn btn-primary" disabled>+ Add Customer</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row mb-4">
        {[{
          title: 'Total Customers',
          value: '—'
        },{
          title: 'New This Month',
          value: '—'
        },{
          title: 'Repeat Rate',
          value: '—'
        },{
          title: 'Active Deliveries',
          value: '—'
        }].map((card, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="border rounded p-3 text-center bg-light">
              <div className="placeholder-glow">
                <span className="placeholder col-6" style={{height: '28px'}}></span>
              </div>
              <div className="mt-2">
                <h4 className="mb-0 text-primary">{card.value}</h4>
                <small className="text-muted">{card.title}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content: table + right panel */}
      <div className="row">
        <div className="col-lg-8">
          <div className="border rounded mb-4">
            <div className="border-bottom p-3 bg-light">
              <h5 className="mb-0">Customers List (Preview)</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="border-bottom">
                  <tr style={{fontSize: '13px'}}>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Orders</th>
                    <th className="p-3">Last Order</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className="border-bottom">
                      <td className="p-3">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-secondary me-3" style={{width:36,height:36}} />
                          <div>
                            <div className="placeholder-glow"><span className="placeholder col-6"></span></div>
                            <div className="text-muted small">—</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3"><div className="placeholder-glow"><span className="placeholder col-6"></span></div></td>
                      <td className="p-3"><div className="placeholder-glow"><span className="placeholder col-3"></span></div></td>
                      <td className="p-3"><div className="placeholder-glow"><span className="placeholder col-4"></span></div></td>
                      <td className="p-3">
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-secondary" disabled>View</button>
                          <button className="btn btn-sm btn-outline-danger" disabled>Remove</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="border rounded p-3 mb-4 bg-light">
            <h6 className="fw-bold mb-3">Customer Filters</h6>
            <div className="mb-2">
              <label className="form-label small">Location</label>
              <select className="form-select" disabled>
                <option>All Areas</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label small">Order Count</label>
              <select className="form-select" disabled>
                <option>Any</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label small">Loyalty</label>
              <select className="form-select" disabled>
                <option>All</option>
              </select>
            </div>
          </div>

          <div className="border rounded p-3">
            <h6 className="fw-bold mb-3">Quick Insights</h6>
            <ul className="small text-muted">
              <li>Most orders come from central areas</li>
              <li>Repeat purchases trending up</li>
              <li>Consider SMS promos for low-repeat segments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersSkeleton;
