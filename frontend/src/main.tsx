import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './router';
import './index.css';

const spaRedirect = sessionStorage.getItem('mir_spa_redirect');
if (spaRedirect) {
  sessionStorage.removeItem('mir_spa_redirect');
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (spaRedirect !== current) {
    window.history.replaceState(null, '', spaRedirect);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
