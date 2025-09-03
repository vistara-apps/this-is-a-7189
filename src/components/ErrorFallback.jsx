import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorFallback component to display when an error occurs
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was thrown
 * @param {Object} props.errorInfo - Component stack information
 * @param {Function} props.resetError - Function to reset the error state
 */
export function ErrorFallback({ error, errorInfo, resetError }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-full bg-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-white/70">An error occurred in the application</p>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 mb-6 overflow-auto max-h-60">
            <p className="text-red-400 font-mono text-sm mb-2">{error?.toString()}</p>
            {errorInfo && (
              <pre className="text-white/70 font-mono text-xs whitespace-pre-wrap">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-white/70 text-sm">
              Try refreshing the page or contact support if the problem persists.
            </p>
            
            <button
              onClick={resetError}
              className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

