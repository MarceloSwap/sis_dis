import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';

const AuthSection = ({ showToast }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          showToast('Login realizado com sucesso!', 'success');
        } else {
          showToast(result.message, 'error');
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          showToast('Cadastro realizado com sucesso! Faça login.', 'success');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '' });
        } else {
          showToast(result.message, 'error');
        }
      }
    } catch (error) {
      showToast('Erro interno do servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <section className="auth-section">
      <div className="container">
        <div className="auth-container">
          <div className="auth-form">
            <h2>{isLogin ? 'Entrar' : 'Cadastrar'}</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </button>
            </form>
            <p className="auth-switch">
              {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
              <button 
                type="button" 
                className="link-button" 
                onClick={toggleMode}
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthSection;