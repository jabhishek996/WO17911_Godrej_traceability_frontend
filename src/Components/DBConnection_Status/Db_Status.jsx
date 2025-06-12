import React, { useEffect, useState } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DBStatusIndicator = () => {
  const [isConnected, setIsConnected] = useState(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/test-db-conn`);
      const data = await response.json();
      setIsConnected(data.STATUS === true);
    } catch (error) {
      console.error('Error checking DB connection:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    fetchStatus(); // Initial fetch

    const interval = setInterval(() => {
      fetchStatus(); // Fetch every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  const getStatusText = () => {
    if (isConnected === null) return 'Checking...';
    return isConnected ? 'DB Connected' : 'DB Not Connected';
  };

  const getStatusColor = () => {
    if (isConnected === null) return '#999';
    return isConnected ? '#28c76f' : '#ea5455'; // green or red
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 12px',
     
      background: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: '14px',
      color: '#333',
      backdropFilter: 'blur(6px)',
      transition: 'all 0.3s ease-in-out',
    }}>
      <span style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: getStatusColor(),
        marginRight: '8px',
        transition: 'background-color 0.3s ease-in-out',
        boxShadow: `0 0 4px ${getStatusColor()}`,
      }}></span>
      {getStatusText()}
    </div>
  );
};

export default DBStatusIndicator;
