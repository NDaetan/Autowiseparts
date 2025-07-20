// client/src/store/reducers.js
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY, CLEAR_CART, SET_PRODUCTS, SET_LOADING, SET_ERROR } from './actions';

const initialState = {
  products: [],
  cart: [],
  loading: false,
  error: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
    case REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };
    case UPDATE_CART_QUANTITY:
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => item.id !== action.payload.productId) };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case CLEAR_CART:
      return { ...state, cart: [] };
    case SET_PRODUCTS:
      return { ...state, products: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default rootReducer;