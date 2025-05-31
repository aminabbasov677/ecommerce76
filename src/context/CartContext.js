import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useTracking } from "./TrackingContext";

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      console.log("ADD_TO_CART Payload:", action.payload);
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item
          ),
          total: state.total + (action.payload.price * (action.payload.quantity || 1)),
        };
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
        total: state.total + (action.payload.price * (action.payload.quantity || 1)),
      };
    }
    case "REMOVE_FROM_CART": {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - item.price * item.quantity,
      };
    }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (!item) return state;
      const quantityDiff = quantity - item.quantity;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
      };
    case "CHECKOUT":
      return {
        ...state,
        items: [],
        total: 0,
      };
    default:
      return state;
  }
};

const generateTrackingNumber = () => {
  return 'TRK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const trackingContext = useTracking();

  const enhancedDispatch = (action) => {
    if (action.type === "CHECKOUT" && trackingContext?.dispatch) {
      const orderId = Date.now();
      const trackingNumber = generateTrackingNumber();
      
      // Create orders for each item in the cart
      const orders = state.items.map(item => ({
        id: `${item.id}-${orderId}`,
        product: {
          ...item,
          image: item.image || 'default-image-url.jpg',
          title: item.title || 'Product',
          price: item.price || 0
        },
        status: 'In Warehouse',
        timestamp: Date.now(),
        orderId,
        trackingNumber,
      }));

      // Save orders to localStorage first
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      storedOrders.push(...orders);
      localStorage.setItem('orders', JSON.stringify(storedOrders));

      // Then add orders to tracking context
      trackingContext.dispatch({ type: "ADD_ORDER", payload: orders });
      
      // Finally clear the cart
      dispatch({ type: "CLEAR_CART" });
    }
    dispatch(action);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Loaded Cart from localStorage:", parsedCart);
        if (parsedCart.items && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach((item) => {
            if (item.id && item.price && item.quantity) {
              dispatch({ 
                type: "ADD_TO_CART", 
                payload: { 
                  ...item, 
                  quantity: Number(item.quantity) || 1 
                } 
              });
            }
          });
        }
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
      console.log("Saved Cart to localStorage:", state);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};