import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ProductViewStatistics.css';

const ProductViewStatistics = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Create gradient for chart background
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#1a1a1a');

      // Chart configuration
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Tablet', 'Camera'],
          datasets: [
            {
              label: 'Product Views',
              data: [1200, 950, 800, 650, 500, 400],
              backgroundColor: 'rgba(0, 255, 195, 0.5)',
              borderColor: '#00ffc3',
              borderWidth: 2,
              borderRadius: 10,
              hoverBackgroundColor: 'rgba(0, 255, 195, 0.5)',
              hoverBorderColor: '#00ffc3'
            }
          ]
        },
        options: {
          indexAxis: 'y', // Horizontal bar chart
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Product View Statistics',
              color: '#00ffc3',
              font: { family: "'Orbitron', sans-serif", size: 24, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            },
            legend: {
              display: false // Hide legend as there's only one dataset
            },
            tooltip: {
              backgroundColor: 'rgba(17, 17, 17, 0.9)',
              titleFont: { family: "'Orbitron', sans-serif", size: 16 },
              bodyFont: { family: "'Orbitron', sans-serif", size: 14 },
              borderColor: '#00ffc3',
              borderWidth: 2,
              cornerRadius: 10,
              boxPadding: 5
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'View Count',
                color: '#00ffc3',
                font: { family: "'Orbitron', sans-serif", size: 16 }
              },
              ticks: {
                color: '#00d1ff',
                font: { family: "'Orbitron', sans-serif", size: 12 }
              },
              grid: { color: 'rgba(0, 255, 195, 0.2)', borderColor: '#00ffc3' }
            },
            y: {
              title: {
                display: true,
                text: 'Products',
                color: '#00ffc3',
                font: { family: "'Orbitron', sans-serif", size: 16 }
              },
              ticks: {
                color: '#00d1ff',
                font: { family: "'Orbitron', sans-serif", size: 12 }
              },
              grid: { color: 'rgba(0, 255, 195, 0.2)', borderColor: '#00ffc3' }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutCubic'
          },
          hover: {
            animationDuration: 0,
            mode: null
          },
          onHover: (event, elements) => {
            event.native.target.style.cursor = elements.length ? 'default' : 'default';
          }
        },
        plugins: [
          {
            id: 'customCanvasBackground',
            beforeDraw(chart) {
              const ctx = chart.ctx;
              const canvas = chart.canvas;
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#0a0a0a');
              gradient.addColorStop(1, '#1a1a1a');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
        ]
      });

      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }
      };
    }
  }, []);

  return (
    <div className="home-container">
      <h1 className="page-title">Product View Statistics</h1>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ProductViewStatistics;