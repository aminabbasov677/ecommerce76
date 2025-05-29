import { useState, useEffect } from 'react';
import AreaChart from './AreaChart';
import DonutChart from './DonutChart';
import './TimeSpentStatistics.css';

const App = () => {
  const [pageType, setPageType] = useState('view');
  const [startTime, setStartTime] = useState(performance.now());

  // Simulate navigation
  const handleNavigation = (newPageType) => {
    const duration = (performance.now() - startTime) / 1000;
    saveSessionData(pageType, duration);
    setPageType(newPageType);
    setStartTime(performance.now());
  };

  // Save session data to localStorage
  const saveSessionData = (pageType, duration) => {
    const date = new Date().toISOString().split('T')[0];
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
    const existingDay = sessions.find((s) => s.date === date);
    if (existingDay) {
      existingDay[pageType] = (existingDay[pageType] || 0) + duration;
    } else {
      sessions.push({ date, view: 0, cart: 0, checkout: 0, [pageType]: duration });
    }
    localStorage.setItem('sessions', JSON.stringify(sessions));
  };

  // Handle page unload
  useEffect(() => {
    const handleUnload = () => {
      const duration = (performance.now() - startTime) / 1000;
      saveSessionData(pageType, duration);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [pageType, startTime]);

  return (
    <div className="home-container">
      <h1 className="page-title">Session Analytics Dashboard</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="chart-container">
          <h2 className="chart-title">Daily Average Session Time</h2>
          <AreaChart />
        </div>
        <div className="chart-container">
          <h2 className="chart-title">Current Session Breakdown</h2>
          <DonutChart />
        </div>
      </div>
    </div>
  );
};

export default App;