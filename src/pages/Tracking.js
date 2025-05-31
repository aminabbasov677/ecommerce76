import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTracking } from '../context/TrackingContext';
import { useCart } from '../context/CartContext';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Tracking.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function Tracking() {
  const { state: trackingState, dispatch: trackingDispatch } = useTracking();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const stages = [
    { name: 'In Warehouse', duration: 0 },
    { name: 'Shipped', duration: 10000 },
    { name: 'Arrived in Country', duration: 20000 },
    { name: 'At Post Office', duration: 25000 },
    { name: 'Delivered', duration: 30000 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      trackingState.orders.forEach(order => {
        const elapsed = Date.now() - order.timestamp;
        const currentStage = stages.find(stage => elapsed < stage.duration) || stages[stages.length - 1];
        if (order.status !== currentStage.name) {
          trackingDispatch({ type: 'UPDATE_STATUS', payload: { id: order.id, status: currentStage.name } });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [trackingState.orders, trackingDispatch]);

  const chartData = selectedOrder ? {
    labels: stages.map(stage => stage.name),
    datasets: [{
      label: 'Tracking Progress',
      data: stages.map((stage, index) => {
        const elapsed = currentTime - selectedOrder.timestamp;
        return elapsed >= stage.duration ? index + 1 : 0;
      }),
      borderColor: 'url(#line-gradient)',
      backgroundColor: 'rgba(0, 255, 195, 0.3)',
      pointBackgroundColor: '#00d1ff',
      pointBorderColor: '#00ffc3',
      pointRadius: 8,
      pointHoverRadius: 12,
      tension: 0.4,
      fill: true,
    }],
  } : {};

  const chartOptions = {
    animation: {
      duration: 1500,
      easing: 'easeInOutCubic',
    },
    scales: {
      y: { display: false, max: stages.length },
      x: {
        grid: { color: 'rgba(0, 255, 195, 0.2)', borderDash: [5, 5] },
        ticks: {
          color: '#00d1ff',
          font: { family: "'Orbitron', sans-serif", size: 12 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.9)',
        titleColor: '#00ffc3',
        bodyColor: '#00ffc3',
        borderColor: '#00ffc3',
        borderWidth: 1,
        titleFont: { family: "'Orbitron', sans-serif" },
        bodyFont: { family: "'Orbitron', sans-serif" },
      },
    },
  };

  const handleDeleteOrder = (orderId) => {
    trackingDispatch({ type: 'DELETE_ORDER', payload: orderId });
    toast.success('Order deleted successfully');
  };

  if (trackingState.orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="tracking-container empty-tracking"
      >
        <h1 className="page-title">Order Tracking</h1>
        <p>No orders to track.</p>
        <motion.a
          href="/"
          className="continue-shopping"
          whileHover={{ scale: 1.05, rotateX: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          Shop More
        </motion.a>
      </motion.div>
    );
  }

  if (selectedOrder) {
    const elapsed = currentTime - selectedOrder.timestamp;
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="tracking-container"
      >
        <motion.button
          className="back-button"
          onClick={() => setSelectedOrder(null)}
          whileHover={{ scale: 1.05, rotateX: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <h1 className="page-title">Order Details: {selectedOrder.product.title}</h1>
        <div className="tracking-timeline">
          {stages.map((stage, index) => (
            <div
              key={stage.name}
              className={`tracking-stage ${elapsed >= stage.duration ? 'active' : ''}`}
            >
              <div className="stage-icon"></div>
              <span>{stage.name}</span>
            </div>
          ))}
        </div>
        <div className="tracking-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="tracking-container"
    >
      <h1 className="page-title">Order Tracking</h1>
      <div className="products-grid">
        {trackingState.orders.map(order => (
          <motion.div
            key={order.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="product-card"
          >
            <img src={order.product.image} alt={order.product.title} />
            <div className="content">
              <h3 className="title">{order.product.title}</h3>
              <p className="product-price">${order.product.price}</p>
              <p className="product-status">Order Status: {order.status}</p>
            </div>
            <div className="button-container">
              <motion.button
                className="track-delivery-btn"
                onClick={() => setSelectedOrder(order)}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                Track Order
              </motion.button>
              <motion.button
                className="delete-order-btn"
                onClick={() => handleDeleteOrder(order.id)}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mobile-popup">
        <motion.button
          className="track-delivery-btn"
          onClick={() => setSelectedOrder(trackingState.orders[0])}
          whileHover={{ scale: 1.05, rotateX: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          Track Order
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Tracking;
