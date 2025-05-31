import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const quantity = action.payload.quantity || 1;
      
      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          total: state.total + (action.payload.price * quantity)
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, quantity }],
          total: state.total + (action.payload.price * quantity)
        };
      }
      break;

    case "REMOVE_FROM_CART":
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== action.payload),
          total: state.total - (itemToRemove.price * itemToRemove.quantity)
        };
      } else {
        newState = state;
      }
      break;

    case "UPDATE_QUANTITY":
      const itemToUpdate = state.items.find(item => item.id === action.payload.id);
      if (itemToUpdate) {
        const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
          total: state.total + (itemToUpdate.price * quantityDiff)
        };
      } else {
        newState = state;
      }
      break;

    case "CLEAR_CART":
      newState = {
        ...state,
        items: [],
        total: 0
      };
      break;

    case "LOAD_CART":
      newState = {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0
      };
      break;

    default:
      return state;
  }

  // Save to localStorage after each state change
  localStorage.setItem('cart', JSON.stringify(newState));
  return newState;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};