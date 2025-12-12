import React from "react";

function Users() {
  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="border-bottom pb-3 mb-4">
        <h2 className="mb-1">Customer Management</h2>
        <p className="text-muted mb-0">Customer insights and analytics for Glams Table Water</p>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="text-center py-5">
        <div className="border rounded p-5 bg-light">
          <div className="mb-4">
            <i className="bi bi-bar-chart-line fs-1 text-primary"></i>
          </div>
          <h4 className="text-muted mb-3">Customer Insights Coming Soon</h4>
          <p className="text-muted mb-4">
            Since Glams Table Water uses guest checkout, traditional customer management
            features are not applicable. We're planning to add customer analytics and insights
            based on order data in a future update.
          </p>
          <div className="row text-start">
            <div className="col-md-6">
              <h6 className="text-primary mb-2">Planned Features:</h6>
              <ul className="text-muted small">
                <li>📊 Order-based customer analytics</li>
                <li>📍 Popular delivery areas</li>
                <li>📱 SMS marketing campaigns</li>
                <li>🔄 Repeat customer identification</li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary mb-2">Benefits:</h6>
              <ul className="text-muted small">
                <li>💡 Data-driven business decisions</li>
                <li>🎯 Targeted marketing campaigns</li>
                <li>🚚 Optimized delivery routes</li>
                <li>📈 Customer behavior insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;