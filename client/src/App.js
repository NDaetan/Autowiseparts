import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
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
    <Router>
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
            <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </nav>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/products" component={ProductList} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/order/:id" component={OrderTracking} />
          <Route path="/review/:productId" component={Review} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;