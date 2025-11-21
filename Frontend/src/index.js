import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  // this wraper used only in development to catch any bugs
  <React.StrictMode>
    <App />
  </React.StrictMode>
);