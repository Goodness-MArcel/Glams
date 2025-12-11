import React, { useState } from 'react';
import { productAPI } from '../../api/product';

function ExportProducts({ products = [], disabled = false }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    includeImages: false,
    dateRange: 'all',
    startDate: '',
    endDate: '',
    categories: [],
    fields: {
      name: true,
      category: true,
      size_volume: true,
      price: true,
      cost_price: false,
      stock_quantity: true,
      reorder_level: false,
      water_source: false,
      treatment_process: false,
      product_code: true,
      description: false,
      created_at: true
    }
  });

  // Get unique categories from products
  const availableCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const closeExportModal = () => {
    setShowExportModal(false);
  };

  const handleOptionChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFieldToggle = (field) => {
    setExportOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [field]: !prev.fields[field]
      }
    }));
  };

  const handleCategoryToggle = (category) => {
    setExportOptions(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const filterProducts = (productsData) => {
    let filtered = [...productsData];

    // Filter by date range
    if (exportOptions.dateRange === 'custom' && exportOptions.startDate && exportOptions.endDate) {
      const startDate = new Date(exportOptions.startDate);
      const endDate = new Date(exportOptions.endDate);
      filtered = filtered.filter(product => {
        const productDate = new Date(product.created_at);
        return productDate >= startDate && productDate <= endDate;
      });
    }

    // Filter by categories
    if (exportOptions.categories.length > 0) {
      filtered = filtered.filter(product => 
        exportOptions.categories.includes(product.category)
      );
    }

    return filtered;
  };

  const exportToCSV = (data) => {
    const selectedFields = Object.entries(exportOptions.fields)
      .filter(([_, selected]) => selected)
      .map(([field, _]) => field);

    // Create CSV headers
    const headers = selectedFields.map(field => {
      const headerMap = {
        name: 'Product Name',
        category: 'Category',
        size_volume: 'Size/Volume',
        price: 'Price (₦)',
        cost_price: 'Cost Price (₦)',
        stock_quantity: 'Stock Quantity',
        reorder_level: 'Reorder Level',
        water_source: 'Water Source',
        treatment_process: 'Treatment Process',
        product_code: 'Product Code',
        description: 'Description',
        created_at: 'Created Date'
      };
      return headerMap[field] || field;
    });

    // Create CSV rows
    const rows = data.map(product => 
      selectedFields.map(field => {
        let value = product[field] || '';
        
        // Format specific fields
        if (field === 'created_at' && value) {
          value = new Date(value).toLocaleDateString();
        }
        if ((field === 'price' || field === 'cost_price') && value) {
          value = Number(value).toFixed(2);
        }
        
        // Escape commas and quotes for CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      })
    );

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  };

  const exportToJSON = (data) => {
    const selectedFields = Object.entries(exportOptions.fields)
      .filter(([_, selected]) => selected)
      .map(([field, _]) => field);

    const filteredData = data.map(product => {
      const filtered = {};
      selectedFields.forEach(field => {
        filtered[field] = product[field];
      });
      return filtered;
    });

    return JSON.stringify(filteredData, null, 2);
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Filter products based on options
      const filteredProducts = filterProducts(products);
      
      if (filteredProducts.length === 0) {
        alert('No products match the selected criteria.');
        return;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `glams-products-${timestamp}.${exportOptions.format}`;

      // Export based on format
      let content, mimeType;
      
      if (exportOptions.format === 'csv') {
        content = exportToCSV(filteredProducts);
        mimeType = 'text/csv;charset=utf-8;';
      } else if (exportOptions.format === 'json') {
        content = exportToJSON(filteredProducts);
        mimeType = 'application/json;charset=utf-8;';
      }

      // Download file
      downloadFile(content, filename, mimeType);
      
      // Close modal and show success message
      closeExportModal();
      alert(`Successfully exported ${filteredProducts.length} products to ${exportOptions.format.toUpperCase()}`);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export products. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button 
        className="btn btn-outline-secondary"
        onClick={handleExportClick}
        disabled={disabled || isExporting || products.length === 0}
      >
        {isExporting ? (
          <>
            <span className="spinner-border spinner-border-sm me-1"></span>
            Exporting...
          </>
        ) : (
          <>
            <i className="bi bi-download me-1"></i>
            Export Products
          </>
        )}
      </button>

      {/* Export Options Modal */}
      {showExportModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-download text-primary me-2"></i>
                  Export Products
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeExportModal}
                ></button>
              </div>
              
              <div className="modal-body">
                <div className="row">
                  {/* Export Format */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Export Format</label>
                    <select 
                      className="form-select"
                      value={exportOptions.format}
                      onChange={(e) => handleOptionChange('format', e.target.value)}
                    >
                      <option value="csv">CSV (Comma Separated)</option>
                      <option value="json">JSON (JavaScript Object)</option>
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date Range</label>
                    <select 
                      className="form-select"
                      value={exportOptions.dateRange}
                      onChange={(e) => handleOptionChange('dateRange', e.target.value)}
                    >
                      <option value="all">All Products</option>
                      <option value="custom">Custom Date Range</option>
                    </select>
                  </div>

                  {/* Custom Date Range */}
                  {exportOptions.dateRange === 'custom' && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={exportOptions.startDate}
                          onChange={(e) => handleOptionChange('startDate', e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={exportOptions.endDate}
                          onChange={(e) => handleOptionChange('endDate', e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Categories Filter */}
                  {availableCategories.length > 0 && (
                    <div className="col-12 mb-3">
                      <label className="form-label">Categories (Leave empty for all)</label>
                      <div className="d-flex flex-wrap gap-2">
                        {availableCategories.map(category => (
                          <div key={category} className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`category-${category}`}
                              checked={exportOptions.categories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                            />
                            <label className="form-check-label" htmlFor={`category-${category}`}>
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fields Selection */}
                  <div className="col-12 mb-3">
                    <label className="form-label">Fields to Export</label>
                    <div className="row">
                      {Object.entries(exportOptions.fields).map(([field, selected]) => (
                        <div key={field} className="col-md-6 col-lg-4 mb-2">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`field-${field}`}
                              checked={selected}
                              onChange={() => handleFieldToggle(field)}
                            />
                            <label className="form-check-label" htmlFor={`field-${field}`}>
                              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Summary */}
                  <div className="col-12">
                    <div className="alert alert-info">
                      <strong>Export Summary:</strong><br />
                      • Format: {exportOptions.format.toUpperCase()}<br />
                      • Total Products: {filterProducts(products).length}<br />
                      • Selected Fields: {Object.values(exportOptions.fields).filter(Boolean).length}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeExportModal}
                  disabled={isExporting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExport}
                  disabled={isExporting || filterProducts(products).length === 0}
                >
                  {isExporting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-2"></i>
                      Export {filterProducts(products).length} Products
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExportProducts;