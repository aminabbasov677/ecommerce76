import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTracking, STAGES } from '../context/TrackingContext';
import { useCart } from '../context/CartContext';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import './Tracking.css';
import { FaTrash } from 'react-icons/fa';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function Tracking() {
  const { state: trackingState, dispatch: trackingDispatch } = useTracking();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [chartData, setChartData] = useState(null);
  const prevProgressDataRef = useRef(null); // Store previous progress data to avoid unnecessary updates

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100); // Update time every 100ms

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const newChartData = getChartData(selectedOrder);
      const newProgressData = newChartData?.datasets[0]?.data;

      // Only update chartData if progressData has changed
      if (
        newProgressData &&
        JSON.stringify(newProgressData) !== JSON.stringify(prevProgressDataRef.current)
      ) {
        setChartData(newChartData);
        prevProgressDataRef.current = newProgressData;
        console.log('Chart Data Updated:', newChartData); // Debugging
      }
    }
  }, [currentTime, selectedOrder]);

  const getChartData = (order) => {
    if (!order) return null;

    const elapsed = currentTime - order.timestamp;
    console.log('Elapsed time:', elapsed); // Debug elapsed time

    // Calculate progress for each stage
    const progressData = STAGES.map((stage, index) => {
      const stageStart = index === 0 ? 0 : STAGES[index - 1].duration;
      const stageEnd = stage.duration;
      const stageDuration = stageEnd - stageStart;

      // If we haven't reached this stage yet
      if (elapsed < stageStart) {
        return 0;
      }
      
      // If we're in this stage
      if (elapsed >= stageStart && elapsed < stageEnd) {
        const stageElapsed = elapsed - stageStart;
        const progress = (stageElapsed / stageDuration) * 100;
        return Math.min(100, Math.max(0, progress));
      }
      
      // If we've completed this stage
      return 100;
    });

    console.log('Progress Data:', progressData); // Debug progress data

    return {
      labels: STAGES.map(stage => stage.name),
      datasets: [{
        label: 'Tracking Progress',
        data: progressData,
        borderColor: '#00ffc3',
        backgroundColor: 'rgba(0, 255, 195, 0.2)',
        pointBackgroundColor: '#00d1ff',
        pointBorderColor: '#00ffc3',
        pointRadius: 8,
        pointHoverRadius: 12,
        tension: 0.4,
        fill: true,
        segment: {
          borderColor: ctx => {
            const index = ctx.p0DataIndex;
            const progress = ctx.p0.parsed.y;
            if (progress === 100) return '#00ffc3';
            if (progress === 0) return 'rgba(0, 255, 195, 0.3)';
            return '#00ffc3';
          }
        }
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Disable animation to prevent flickering
    scales: {
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: {
          color: '#00d1ff',
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            return value + '%';
          },
          stepSize: 20
        },
        grid: {
          color: 'rgba(0, 255, 195, 0.1)',
          borderDash: [5, 5],
          drawBorder: false
        },
        border: {
          color: 'rgba(0, 255, 195, 0.3)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 255, 195, 0.1)',
          borderDash: [5, 5],
          drawBorder: false
        },
        ticks: {
          color: '#00d1ff',
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
            weight: 'bold'
          },
          maxRotation: 45,
          minRotation: 45
        },
        border: {
          color: 'rgba(0, 255, 195, 0.3)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 17, 0.95)',
        titleColor: '#00ffc3',
        bodyColor: '#00ffc3',
        borderColor: '#00ffc3',
        borderWidth: 2,
        padding: 12,
        titleFont: {
          family: "'Orbitron', sans-serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Orbitron', sans-serif",
          size: 13
        },
        callbacks: {
          label: function(context) {
            const stage = STAGES[context.dataIndex];
            const progress = Math.round(context.raw);
            const stageStart = context.dataIndex === 0 ? 0 : STAGES[context.dataIndex - 1].duration;
            const stageEnd = stage.duration;
            const stageDuration = (stageEnd - stageStart) / 1000;
            return [
              `Stage: ${stage.name}`,
              `Progress: ${progress}%`,
              `Duration: ${stageDuration}s`
            ];
          }
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.4
      },
      point: {
        radius: 6,
        hoverRadius: 10,
        borderWidth: 3,
        backgroundColor: '#00d1ff',
        borderColor: '#00ffc3',
        hoverBackgroundColor: '#00ffc3',
        hoverBorderColor: '#00d1ff'
      }
    }
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
    const currentStageIndex = STAGES.findIndex(stage => elapsed < stage.duration);
    const stageIndex = currentStageIndex === -1 ? STAGES.length - 1 : currentStageIndex;

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
        <h1 className="page-title">
          Order Details: {selectedOrder.products && selectedOrder.products[0] 
            ? selectedOrder.products[0].title 
            : `Order #${selectedOrder.id}`}
        </h1>
        <div className="tracking-timeline">
          {STAGES.map((stage, index) => (
            <div
              key={stage.name}
              className={`tracking-stage ${index <= stageIndex ? 'active' : ''}`}
            >
              <div className="stage-icon"></div>
              <span>{stage.name}</span>
            </div>
          ))}
        </div>
        <div className="tracking-chart">
          {chartData && (
            <Line data={chartData} options={chartOptions} />
          )}
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
        {[...trackingState.orders].reverse().map(order => (
          <motion.div
            key={order.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="product-card"
          >
            {order.products && order.products[0] && (
              <img 
                src={order.products[0].image || 'https://via.placeholder.com/300x200'} 
                alt={order.products[0].title || 'Product'} 
              />
            )}
            <div className="content">
              <h3 className="title">
                {order.products && order.products[0] 
                  ? order.products[0].title 
                  : 'Order #' + order.id}
              </h3>
              <p className="product-price">
                ${order.total ? order.total.toFixed(2) : '0.00'}
              </p>
              <p className="product-status">Order Status: {order.status || 'Unknown'}</p>
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
    </motion.div>
  );
}

export default Tracking;