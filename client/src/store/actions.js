// client/src/store/actions.js
import api from '../services/api';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartQuantity = (productId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { productId, quantity },
});

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  payload: products,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Async actions
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get('/products');
    dispatch(setProducts(response.data));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createOrder = (orderData) => async (dispatch) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const submitReview = (reviewData) => async (dispatch) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit review');
  }
};

export const processPayment = (paymentData) => async (dispatch) => {
  try {
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment failed');
  }
};