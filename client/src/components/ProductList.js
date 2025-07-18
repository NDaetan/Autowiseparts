// client/src/components/ProductList.js
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

function ProductList() {
  const { products, loading, error } = useSelector((state) => state);
  const location = useLocation();

  // Get search term from URL query params
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading products...</div>;
  if (error) return <div style={{ padding: '20px', textAlign: 'center' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      {searchTerm && (
        <p>Search results for: "{searchTerm}" ({filteredProducts.length} found)</p>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredProducts.map((product) => (
          <li key={product.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
              <div>
                <strong>{product.name}</strong> - ${product.price}
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                  {product.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {filteredProducts.length === 0 && searchTerm && (
        <p>No products found matching "{searchTerm}"</p>
      )}
      {filteredProducts.length === 0 && !searchTerm && (
        <p>No products available</p>
      )}
    </div>
  );
}

export default ProductList;