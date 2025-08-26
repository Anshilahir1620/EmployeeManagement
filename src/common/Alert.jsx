import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ 
  type = 'info', 
  message, 
  show = false, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <div className={`alert alert-${type} ${isVisible ? 'alert-show' : ''}`}>
      <div className="alert-content">
        <div className="alert-icon">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        <div className="alert-message">{message}</div>
        <button className="alert-close" onClick={handleClose}>
          ×
        </button>
      </div>
      <div className="alert-progress"></div>
    </div>
  );
};

export default Alert;
