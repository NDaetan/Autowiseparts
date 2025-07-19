import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Register from './components/Register';
import OrderTracking from './components/OrderTracking';
import Review from './components/Review';
import SearchBar from './components/SearchBar';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, logout, getCurrentUsername } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <div className="App">
      <nav style={{
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/products" style={{ marginRight: '15px' }}>Products</Link>
          <Link to="/cart" style={{ marginRight: '15px' }}>Cart</Link>
        </div>
        <SearchBar />
        <div>
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: '15px' }}>Welcome, {getCurrentUsername()}</span>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/products" component={ProductList} />
        <PrivateRoute path="/product/:id" component={ProductDetail} />
        <PrivateRoute path="/cart" component={Cart} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/order/:id" component={OrderTracking} />
        <PrivateRoute path="/review/:productId" component={Review} />
      </Switch>
    </div>
  );
}

export default App;