import React from 'react';
import { useAuth } from '../services/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <i className="fas fa-tasks"></i>
          SisDis
        </h1>
        <nav className="nav">
          {isAuthenticated ? (
            <div className="user-menu">
              <span>Olá, {user?.name}</span>
              <button className="btn btn-outline" onClick={logout}>
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <span>Sistema de Gerenciamento de Tarefas</span>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;