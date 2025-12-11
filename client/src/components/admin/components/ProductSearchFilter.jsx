import React, { useState, useEffect } from 'react';

function ProductSearchFilter({ 
  onSearchChange, 
  onCategoryChange, 
  searchValue = '', 
  categoryValue = '', 
  categories = [],
  isLoading = false 
}) {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [selectedCategory, setSelectedCategory] = useState(categoryValue);

  // Update local state when props change
  useEffect(() => {
    setSearchTerm(searchValue);
  }, [searchValue]);

  useEffect(() => {
    setSelectedCategory(categoryValue);
  }, [categoryValue]);

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Debounce search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  // Handle category selection change
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onCategoryChange && onCategoryChange(value);
  };

  // Default categories if none provided
  const defaultCategories = [
    'Table Water',
    'Premium Water', 
    'Mineralized Water',
    'Flavored Water'
  ];

  const categoryOptions = categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="d-flex">
      {/* Search Input */}
      <div className="position-relative me-2">
        <input 
          type="search" 
          className="form-control" 
          placeholder="Search products..." 
          style={{width: '200px'}}
          value={searchTerm}
          onChange={handleSearchChange}
          disabled={isLoading}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y p-1 text-muted"
            style={{ fontSize: '0.8rem', right: '8px' }}
            onClick={() => {
              setSearchTerm('');
              onSearchChange && onSearchChange('');
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter */}
      <select 
        className="form-select" 
        style={{width: '150px'}}
        value={selectedCategory}
        onChange={handleCategoryChange}
        disabled={isLoading}
      >
        <option value="">All Categories</option>
        {categoryOptions.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Loading indicator */}
      {isLoading && (
        <div className="d-flex align-items-center ms-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductSearchFilter;