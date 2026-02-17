import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Admin />} />
          </Routes>
        </main>
      </div>

      <style>{`
        .label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        .dark .label {
          color: #d1d5db;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          background-color: #ffffff;
          color: #111827;
          outline: none;
          transition: ring 0.2s;
        }
        .dark .input-field {
          background-color: #374151;
          border-color: #4b5563;
          color: #ffffff;
        }
        .input-field:focus {
          ring: 2px;
          ring-color: #3b82f6;
          border-color: #3b82f6;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out forwards;
        }
      `}</style>
    </Router>
  );
};

export default App;