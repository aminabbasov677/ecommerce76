import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  orders: [
    {
      id: '1',
      product: {
        title: 'Test Product',
        price: 99.99,
        image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      status: 'In Warehouse',
      timestamp: Date.now(),
      orderId: 'ORD-001'
    }
  ],
};

const trackingReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, ...action.payload],
      };
    case 'UPDATE_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    case 'CLEAR_ORDERS':
      return {
        ...state,
        orders: [],
      };
    default:
      return state;
  }
};

export const TrackingContext = createContext({
  state: initialState,
  dispatch: () => {}
});

export const TrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trackingReducer, initialState);
  const value = { state, dispatch };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  return context;
};