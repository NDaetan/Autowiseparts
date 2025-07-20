// client/src/components/Admin.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [pendingReturns, setPendingReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('returns');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    stock: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [returnsRes, productsRes, ticketsRes] = await Promise.all([
        api.get('/admin/pending-returns'),
        api.get('/products'),
        api.get('/admin/tickets')
      ]);
      setPendingReturns(returnsRes.data);
      setProducts(productsRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnAction = async (orderId, action) => {
    try {
      await api.post(`/admin/returns/${orderId}/${action}`);
      alert(`Return ${action}ed successfully`);
      fetchAdminData();
    } catch (error) {
      alert(`Failed to ${action} return: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock)
      });
      alert('Product added successfully');
      setNewProduct({ name: '', price: '', description: '', stock: '' });
      fetchAdminData();
    } catch (error) {
      alert(`Failed to add product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/admin/products/${productId}`);
      alert('Product deleted successfully');
      fetchAdminData();
    } catch (error) {
      alert(`Failed to delete product: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await api.put(`/admin/products/${productId}/stock`, { stock: newStock });
      alert('Stock updated successfully');
      fetchAdminData();
    } catch (error) {
      alert(`Failed to update stock: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleTicketAction = async (ticketId, action) => {
    try {
      await api.post(`/admin/tickets/${ticketId}/${action}`);
      alert(`Ticket ${action}ed successfully`);
      fetchAdminData();
    } catch (error) {
      alert(`Failed to ${action} ticket: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading admin panel...</div>;
  }

  const sectionStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const buttonStyle = {
    padding: '8px 16px',
    margin: '5px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white'
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  return (
    <div style={sectionStyle}>
      <h2>Admin Panel</h2>
      
      {/* Navigation */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveSection('returns')}
          style={{
            ...buttonStyle,
            backgroundColor: activeSection === 'returns' ? '#007bff' : '#f8f9fa',
            color: activeSection === 'returns' ? 'white' : '#333'
          }}
        >
          Return Orders ({pendingReturns.length})
        </button>
        <button
          onClick={() => setActiveSection('products')}
          style={{
            ...buttonStyle,
            backgroundColor: activeSection === 'products' ? '#007bff' : '#f8f9fa',
            color: activeSection === 'products' ? 'white' : '#333'
          }}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveSection('tickets')}
          style={{
            ...buttonStyle,
            backgroundColor: activeSection === 'tickets' ? '#007bff' : '#f8f9fa',
            color: activeSection === 'tickets' ? 'white' : '#333'
          }}
        >
          Tickets ({tickets.filter(t => t.status === 'Open').length})
        </button>
      </div>

      {/* Return Orders Section */}
      {activeSection === 'returns' && (
        <div>
          <h3>Pending Return Requests</h3>
          {pendingReturns.length === 0 ? (
            <p>No pending return requests</p>
          ) : (
            <div>
              {pendingReturns.map((order) => (
                <div key={order.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <h4>Order #{order.id}</h4>
                  <p><strong>Customer:</strong> User ID {order.userId}</p>
                  <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                  <p><strong>Return Requested:</strong> {new Date(order.returnRequestDate).toLocaleDateString()}</p>
                  <p><strong>Reason:</strong> {order.returnReason}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <div>
                    <strong>Items:</strong>
                    <ul style={{ margin: '5px 0' }}>
                      {order.items.map(item => (
                        <li key={item.id}>{item.name} - ${item.price}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    <button
                      onClick={() => handleReturnAction(order.id, 'approve')}
                      style={successButtonStyle}
                    >
                      Refund issued
                    </button>
                    <button
                      onClick={() => handleReturnAction(order.id, 'reject')}
                      style={dangerButtonStyle}
                    >
                      Reject Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Section */}
      {activeSection === 'products' && (
        <div>
          <h3>Product Management</h3>
          
          {/* Add Product Form */}
          <div style={{
            border: '1px solid #eee',
            borderRadius: '4px',
            padding: '20px',
            marginBottom: '30px',
            backgroundColor: '#f8f9fa'
          }}>
            <h4>Add New Product</h4>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                style={inputStyle}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                style={inputStyle}
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                style={{ ...inputStyle, height: '80px' }}
                required
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                style={inputStyle}
                required
              />
              <button type="submit" style={primaryButtonStyle}>
                Add Product
              </button>
            </form>
          </div>

          {/* Products List */}
          <h4>Existing Products</h4>
          <div>
            {products.map((product) => (
              <div key={product.id} style={{
                border: '1px solid #eee',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '15px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 5px 0' }}>{product.name}</h5>
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>{product.description}</p>
                    <p style={{ margin: '0 0 10px 0' }}>
                      <strong>Price:</strong> ${product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    style={dangerButtonStyle}
                  >
                    Delete
                  </button>
                </div>
                
                {/* Stock Management Section */}
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span><strong>Current Stock:</strong> {product.stock}</span>
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      style={{
                        width: '80px',
                        padding: '4px 8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newStock = parseInt(e.target.value);
                          if (newStock >= 0 && newStock !== product.stock) {
                            handleUpdateStock(product.id, newStock);
                          }
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        const newStock = parseInt(input.value);
                        if (newStock >= 0 && newStock !== product.stock) {
                          handleUpdateStock(product.id, newStock);
                        }
                      }}
                      style={{
                        ...buttonStyle,
                        backgroundColor: '#17a2b8',
                        color: 'white'
                      }}
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tickets Section */}
      {activeSection === 'tickets' && (
        <div>
          <h3>Support Tickets</h3>
          {tickets.length === 0 ? (
            <p>No support tickets</p>
          ) : (
            <div>
              {tickets.map((ticket) => (
                <div key={ticket.id} style={{
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <h4>{ticket.subject}</h4>
                  <p><strong>From:</strong> User ID {ticket.userId}</p>
                  <p><strong>Status:</strong> 
                    <span style={{
                      color: ticket.status === 'Open' ? '#dc3545' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {ticket.status}
                    </span>
                  </p>
                  <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  <p><strong>Description:</strong></p>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px'
                  }}>
                    {ticket.description}
                  </div>
                  {ticket.status === 'Open' && (
                    <div>
                      <button
                        onClick={() => handleTicketAction(ticket.id, 'resolve')}
                        style={successButtonStyle}
                      >
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => handleTicketAction(ticket.id, 'close')}
                        style={dangerButtonStyle}
                      >
                        Close Ticket
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;