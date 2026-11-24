import React from 'react';

export default function SimpleCircleLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%'
    }}>
      <div className="loader-circle" />
      <style>{`
        .loader-circle {
          border: 4px solid #e0e0e0;
          border-top: 4px solid #06b6d4;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
