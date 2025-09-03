import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-surface rounded-lg shadow-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}