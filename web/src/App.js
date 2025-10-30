import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthSection from './pages/AuthSection';
import TasksSection from './pages/TasksSection';
import Toast from './components/Toast';
import { AuthProvider, useAuth } from './services/AuthContext';
import './styles/App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
        {isAuthenticated ? (
          <TasksSection showToast={showToast} />
        ) : (
          <AuthSection showToast={showToast} />
        )}
      </main>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;