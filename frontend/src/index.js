// NOTE: IMPORTS ----------------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { APIContextProvider } from './context/APIContext';

// WRAPPING APP IN CONTEXTS
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <APIContextProvider>
        <App />
      </APIContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// END OF DOCUMENT --------------------------------------------------------------------------------