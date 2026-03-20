// main.tsx — Side Panel React 入口，挂载根组件
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../../assets/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
