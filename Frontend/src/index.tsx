import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);

root.render(
  // This wrapper is used only in development to catch potential bugs
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
