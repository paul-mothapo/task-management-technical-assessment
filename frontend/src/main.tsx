import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';
import './index.css';

// Configure axios defaults
axios.defaults.baseURL = '';  // Empty baseURL to use relative paths that will go through the Vite proxy
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Set auth token if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);