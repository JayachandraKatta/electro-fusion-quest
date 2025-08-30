import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  specs: {
    ram?: string;
    storage?: string;
    display?: string;
    processor?: string;
  };
  priceComparison: {
    amazon: number;
    flipkart: number;
    myntra: number;
    meesho: number;
  };
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  date: string;
  status: string;
}

export interface Address {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface User {
  email: string;
  name: string;
}

interface AppState {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: User | null;
  isAuthenticated: boolean;
}

type AppAction =
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_CART_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; product: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; productId: string }
  | { type: 'MOVE_TO_CART'; productId: string }
  | { type: 'ADD_ORDER'; order: Order }
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_FROM_STORAGE'; data: Partial<AppState> };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  orders: [],
  user: null,
  isAuthenticated: false,
};

// LocalStorage utilities
const STORAGE_KEYS = {
  CART: 'electro-fusion-cart',
  WISHLIST: 'electro-fusion-wishlist',
  ORDERS: 'electro-fusion-orders',
  USER: 'electro-fusion-user',
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.product.id);
      let newCart;
      
      if (existingItem) {
        newCart = state.cart.map(item =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...action.product, quantity: 1 }];
      }
      
      saveToStorage(STORAGE_KEYS.CART, newCart);
      return { ...state, cart: newCart };
    }

    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter(item => item.id !== action.productId);
      saveToStorage(STORAGE_KEYS.CART, newCart);
      return { ...state, cart: newCart };
    }

    case 'UPDATE_CART_QUANTITY': {
      const newCart = state.cart.map(item =>
        item.id === action.productId
          ? { ...item, quantity: Math.max(1, action.quantity) }
          : item
      );
      saveToStorage(STORAGE_KEYS.CART, newCart);
      return { ...state, cart: newCart };
    }

    case 'CLEAR_CART':
      saveToStorage(STORAGE_KEYS.CART, []);
      return { ...state, cart: [] };

    case 'ADD_TO_WISHLIST': {
      const isAlreadyInWishlist = state.wishlist.some(item => item.id === action.product.id);
      if (isAlreadyInWishlist) return state;
      
      const newWishlist = [...state.wishlist, action.product];
      saveToStorage(STORAGE_KEYS.WISHLIST, newWishlist);
      return { ...state, wishlist: newWishlist };
    }

    case 'REMOVE_FROM_WISHLIST': {
      const newWishlist = state.wishlist.filter(item => item.id !== action.productId);
      saveToStorage(STORAGE_KEYS.WISHLIST, newWishlist);
      return { ...state, wishlist: newWishlist };
    }

    case 'MOVE_TO_CART': {
      const product = state.wishlist.find(item => item.id === action.productId);
      if (!product) return state;

      const existingInCart = state.cart.find(item => item.id === action.productId);
      let newCart;
      
      if (existingInCart) {
        newCart = state.cart.map(item =>
          item.id === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...state.cart, { ...product, quantity: 1 }];
      }

      const newWishlist = state.wishlist.filter(item => item.id !== action.productId);
      
      saveToStorage(STORAGE_KEYS.CART, newCart);
      saveToStorage(STORAGE_KEYS.WISHLIST, newWishlist);
      
      return { ...state, cart: newCart, wishlist: newWishlist };
    }

    case 'ADD_ORDER': {
      const newOrders = [action.order, ...state.orders];
      saveToStorage(STORAGE_KEYS.ORDERS, newOrders);
      return { ...state, orders: newOrders };
    }

    case 'LOGIN': {
      saveToStorage(STORAGE_KEYS.USER, action.user);
      return { ...state, user: action.user, isAuthenticated: true };
    }

    case 'LOGOUT': {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return initialState;
    }

    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.data };

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    moveToCart: (productId: string) => void;
    addOrder: (order: Order) => void;
    login: (user: User) => void;
    logout: () => void;
    getCartTotal: () => number;
    getCartItemCount: () => number;
    isInWishlist: (productId: string) => boolean;
    isInCart: (productId: string) => boolean;
  };
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const cart = loadFromStorage(STORAGE_KEYS.CART) || [];
    const wishlist = loadFromStorage(STORAGE_KEYS.WISHLIST) || [];
    const orders = loadFromStorage(STORAGE_KEYS.ORDERS) || [];
    const user = loadFromStorage(STORAGE_KEYS.USER);

    dispatch({
      type: 'LOAD_FROM_STORAGE',
      data: {
        cart,
        wishlist,
        orders,
        user,
        isAuthenticated: !!user,
      },
    });
  }, []);

  // Action creators
  const actions = {
    addToCart: (product: Product) => dispatch({ type: 'ADD_TO_CART', product }),
    removeFromCart: (productId: string) => dispatch({ type: 'REMOVE_FROM_CART', productId }),
    updateCartQuantity: (productId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_CART_QUANTITY', productId, quantity }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    addToWishlist: (product: Product) => dispatch({ type: 'ADD_TO_WISHLIST', product }),
    removeFromWishlist: (productId: string) => dispatch({ type: 'REMOVE_FROM_WISHLIST', productId }),
    moveToCart: (productId: string) => dispatch({ type: 'MOVE_TO_CART', productId }),
    addOrder: (order: Order) => dispatch({ type: 'ADD_ORDER', order }),
    login: (user: User) => dispatch({ type: 'LOGIN', user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    getCartTotal: () =>
      state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    getCartItemCount: () =>
      state.cart.reduce((total, item) => total + item.quantity, 0),
    isInWishlist: (productId: string) =>
      state.wishlist.some(item => item.id === productId),
    isInCart: (productId: string) =>
      state.cart.some(item => item.id === productId),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};