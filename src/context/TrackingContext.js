import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const TrackingContext = createContext();

export const STAGES = [
  { name: 'In Warehouse', duration: 0 },
  { name: 'Shipped', duration: 5000 }, // 5 seconds
  { name: 'Arrived in Country', duration: 10000 }, // 10 seconds
  { name: 'At Post Office', duration: 15000 }, // 15 seconds
  { name: 'Delivered', duration: 20000 }, // 20 seconds
];

const trackingReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ORDER":
      const newOrders = action.payload.map(order => ({
        ...order,
        id: order.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        status: 'In Warehouse',
        products: order.products.map(product => ({
          ...product,
          id: product.id || `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'In Warehouse'
        }))
      }));

      const existingOrderIds = new Set(state.orders.map(order => order.id));
      const uniqueNewOrders = newOrders.filter(order => !existingOrderIds.has(order.id));

      if (uniqueNewOrders.length === 0) {
        return state;
      }

      const updatedOrders = [...state.orders, ...uniqueNewOrders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return { ...state, orders: updatedOrders };

    case "UPDATE_ORDER_STATUS":
      const ordersWithUpdatedStatus = state.orders.map(order => {
        if (order.id === action.payload.id) {
          const elapsed = Date.now() - order.timestamp;
          const currentStage = STAGES.find(stage => elapsed < stage.duration) || STAGES[STAGES.length - 1];
          
          // Only update if status has changed
          if (order.status !== currentStage.name) {
            return {
              ...order,
              status: currentStage.name,
              products: order.products.map(product => ({
                ...product,
                status: currentStage.name
              }))
            };
          }
        }
        return order;
      });

      localStorage.setItem('orders', JSON.stringify(ordersWithUpdatedStatus));
      return { ...state, orders: ordersWithUpdatedStatus };

    case "DELETE_ORDER":
      const filteredOrders = state.orders.filter(order => order.id !== action.payload);
      localStorage.setItem('orders', JSON.stringify(filteredOrders));
      return { ...state, orders: filteredOrders };

    case "LOAD_ORDERS":
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        return { ...state, orders: storedOrders };
      } catch (error) {
        console.error('Error loading orders:', error);
        localStorage.removeItem('orders');
        return { ...state, orders: [] };
      }

    default:
      return state;
  }
};

export const TrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trackingReducer, { orders: [] });
  const ordersRef = useRef(state.orders);

  useEffect(() => {
    ordersRef.current = state.orders;
  }, [state.orders]);

  useEffect(() => {
    // Load orders from localStorage on initial render
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    dispatch({ type: "LOAD_ORDERS", payload: storedOrders });

    // Set up background status update
    const interval = setInterval(() => {
      ordersRef.current.forEach(order => {
        const elapsed = Date.now() - order.timestamp;
        const currentStage = STAGES.find(stage => elapsed < stage.duration) || STAGES[STAGES.length - 1];
        
        // Only dispatch if status needs to be updated
        if (order.status !== currentStage.name) {
          dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id: order.id } });
        }
      });
    }, 100); // Check every 100ms for smoother updates

    return () => clearInterval(interval);
  }, []); // Empty dependency array since we're using ref

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