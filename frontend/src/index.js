// NOTE: IMPORTS ----------------------------------------------------------------------------------
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { APIContextProvider } from './context/APIContext';
import { PostContextProvider } from './context/PostContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

// WRAPPING APP IN CONTEXTS
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PostContextProvider>
      <APIContextProvider>
        <App />
      </APIContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

// END OF DOCUMENT --------------------------------------------------------------------------------