import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...product, quantity }]
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.productId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }
    
    default:
      return state;
  }
};

// Initial cart state
const initialState = {
  items: [],
  isOpen: false
};

// Cart Provider Component
export function CartProvider({ children }) {
  // Initialize state from localStorage using lazy initializer so the
  // cart is immediately available on first render (avoids flash of empty cart)
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (init) => {
      try {
        if (typeof window === 'undefined') return init;
        const saved = localStorage.getItem('glams-cart');
        if (!saved) return init;
        const parsed = JSON.parse(saved);
        return {
          ...init,
          items: Array.isArray(parsed.items) ? parsed.items : []
        };
      } catch (err) {
        console.error('Error reading cart from localStorage during init', err);
        return init;
      }
    }
  );

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem('glams-cart', JSON.stringify({ items: state.items }));
    } catch (err) {
      console.error('Error saving cart to localStorage', err);
    }
  }, [state.items]);

  // Cart helper functions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Cart calculations
  const cartTotal = state.items.reduce(
    (total, item) => total + (Number(item.price) * item.quantity), 
    0
  );

  const cartItemsCount = state.items.reduce(
    (total, item) => total + item.quantity, 
    0
  );

  const cartValue = {
    items: state.items,
    cartTotal,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isEmpty: state.items.length === 0
  };

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;