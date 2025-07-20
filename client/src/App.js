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
import OrderDetail from './components/OrderDetail';
import Review from './components/Review';
import SearchBar from './components/SearchBar';
import OrderHistory from './components/OrderHistory';
import Profile from './components/Profile';
import SubmitTicket from './components/SubmitTicket';
import TicketList from './components/TicketList';
import Admin from './components/Admin';
import NotificationBox from './components/NotificationBox';
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
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/products" style={{ marginRight: '15px' }}>Products</Link>
          <Link to="/cart" style={{ marginRight: '15px' }}>Cart</Link>
          <Link to="/orders" style={{ marginRight: '15px' }}>Orders</Link>
          <Link to="/tickets" style={{ marginRight: '15px' }}>Tickets</Link>
          {getCurrentUsername() === 'admin' && (
            <Link to="/admin" style={{ marginRight: '15px' }}>Admin</Link>
          )}
        </div>
        <SearchBar />
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAuthenticated ? (
            <>
              <span>Welcome, {getCurrentUsername()}</span>
              <Link to="/profile">Profile</Link>
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
      {isAuthenticated && <NotificationBox />}
      <Switch>
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/products" component={ProductList} />
        <PrivateRoute path="/product/:id" component={ProductDetail} />
        <PrivateRoute path="/cart" component={Cart} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/order/:id" component={OrderDetail} />
        <PrivateRoute path="/orders" component={OrderHistory} />
        <PrivateRoute path="/review/:productId" component={Review} />
        <PrivateRoute path="/tickets" component={TicketList} />
        <PrivateRoute path="/submit-ticket" component={SubmitTicket} />
        <PrivateRoute path="/admin" component={Admin} />
      </Switch>
    </div>
  );
}

export default App;