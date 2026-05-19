import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Dynamic Backend URL router interceptor for production/development parity
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const BACKEND_URL = isProduction 
  ? 'https://capstone-project-1-o8xd.onrender.com' 
  : 'http://localhost:4000';

axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('http://localhost:4000')) {
    config.url = config.url.replace('http://localhost:4000', BACKEND_URL);
  }
  if (config.url && config.url.includes(BACKEND_URL)) {
    config.withCredentials = true;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

createRoot(document.getElementById('root')).render(
    <App />
)
