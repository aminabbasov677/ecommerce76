import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './DailyActivityCharts.css';

const DailyActivityCharts = () => {
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
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Logins',
              data: [120, 150, 180, 130, 200, 220, 190],
              borderColor: 'rgba(0, 255, 195, 0.8)',
              backgroundColor: 'rgba(0, 255, 195, 0.2)',
              pointBackgroundColor: '#00ffc3',
              pointBorderColor: '#00d1ff',
              pointRadius: 5,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Clicks',
              data: [300, 320, 280, 350, 400, 420, 380],
              borderColor: 'rgba(0, 209, 255, 0.8)',
              backgroundColor: 'rgba(0, 209, 255, 0.2)',
              pointBackgroundColor: '#00d1ff',
              pointBorderColor: '#00ffc3',
              pointRadius: 5,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Product Views',
              data: [500, 480, 520, 450, 600, 650, 580],
              borderColor: 'rgba(255, 77, 77, 0.8)',
              backgroundColor: 'rgba(255, 77, 77, 0.2)',
              pointBackgroundColor: '#ff4d4d',
              pointBorderColor: '#00ffc3',
              pointRadius: 5,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Daily User Activity',
              color: '#00ffc3',
              font: { family: "'Orbitron', sans-serif", size: 24, weight: 'bold' },
              padding: { top: 10, bottom: 20 }
            },
            legend: {
              labels: {
                color: '#00ffc3',
                font: { family: "'Orbitron', sans-serif", size: 14 },
                padding: 20,
                boxWidth: 20,
                usePointStyle: true
              }
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
                text: 'Days',
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
                text: 'Number of Actions',
                color: '#00ffc3',
                font: { family: "'Orbitron', sans-serif", size: 16 }
              },
              ticks: {
                color: '#00d1ff',
                font: { family: "'Orbitron', sans-serif", size: 12 },
                stepSize: 100
              },
              grid: { color: 'rgba(0, 255, 195, 0.2)', borderColor: '#00ffc3' }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeInOutCubic'
          },
          hover: {
            animationDuration: 0
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
      <h1 className="page-title">Daily Activity Charts</h1>
      <div className="chart-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DailyActivityCharts;