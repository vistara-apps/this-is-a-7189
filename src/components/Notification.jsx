import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

/**
 * Notification component for displaying alerts and messages
 * @param {Object} props - Component props
 * @param {string} props.type - Notification type ('success', 'error', 'info', 'warning')
 * @param {string} props.message - Notification message
 * @param {number} [props.duration=5000] - Duration in milliseconds before auto-dismissing
 * @param {Function} props.onClose - Function to call when notification is closed
 */
export function Notification({ type = 'info', message, duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-dismiss after duration
  useEffect(() => {
    if (!duration) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  // Handle close button click
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };
  
  // Get icon and styles based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          iconColor: 'text-green-400',
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          iconColor: 'text-red-400',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          iconColor: 'text-yellow-400',
        };
      case 'info':
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          iconColor: 'text-blue-400',
        };
    }
  };
  
  const { icon: Icon, bgColor, borderColor, iconColor } = getTypeConfig();
  
  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className={`p-4 rounded-lg shadow-lg ${bgColor} border ${borderColor} backdrop-blur-md`}>
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${iconColor} mt-0.5`} />
          
          <div className="flex-1">
            <p className="text-white">{message}</p>
          </div>
          
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

