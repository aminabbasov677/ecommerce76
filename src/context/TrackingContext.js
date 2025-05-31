import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  orders: []
};

const trackingReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, ...action.payload]
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { ...order, status: action.payload.status }
            : order
        )
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};

const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trackingReducer, initialState);

  // Load orders from localStorage on initial render
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        try {
          const orders = JSON.parse(storedOrders);
          if (Array.isArray(orders) && orders.length > 0) {
            dispatch({ type: 'LOAD_ORDERS', payload: orders });
          }
        } catch (error) {
          console.error('Error loading orders from localStorage:', error);
        }
      }
    };

    loadOrders();
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (state.orders.length > 0) {
      try {
        localStorage.setItem('orders', JSON.stringify(state.orders));
      } catch (error) {
        console.error('Error saving orders to localStorage:', error);
      }
    }
  }, [state.orders]);

  return (
    <TrackingContext.Provider value={{ state, dispatch }}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};