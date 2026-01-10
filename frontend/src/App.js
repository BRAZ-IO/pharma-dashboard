import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
