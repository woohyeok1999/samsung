import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import RegisterModal from '../../components/RegisterModal';  // RegisterModal 임포트
import './styles_login.css';
import gifLogin from './images/gif_login.gif';
import logoSHI from './images/logo_shi.png';
import iconShip from './images/icon_ship.png';

const LoginPage = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { id, password });
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token, response.data.isAdmin);
      navigate('/');
    } catch (error) {
      setError('Invalid employee ID or password');
      console.error('Login error:', error);
    }
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  return (
    <div className="login-page">
      <header className="login-page-header">
        <div className="login-page-header-gradient"></div>
      </header>
      <main className="login-page-main">
        <div className="login-page-content">
          <img src={gifLogin} alt="Animated Logo" className="login-page-animated-logo" />
          <form onSubmit={handleSubmit} className="login-page-form">
            <div className="login-page-form-group">
              <label htmlFor="id">Employee ID</label>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className="login-page-input"
              />
            </div>
            <div className="login-page-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-page-input"
              />
            </div>
            <button type="submit" className="login-page-button">Sign In</button>
            <div className="login-page-links-container">
              <a href="#" onClick={handleRegister} className="login-page-link">Register</a>
              <a href="#" className="login-page-link">Forgot password?</a>
            </div>
          </form>
        </div>
        {error && <p className="login-page-error-message">{error}</p>}
      </main>
      <img src={iconShip} alt="Container Ship" className="login-page-ship-image" />
      <footer className="login-page-footer">
        <div className="login-page-footer-content">
          <img src={logoSHI} alt="Samsung Heavy Industries Logo" className="login-page-footer-logo" />
          <div className="login-page-footer-text">
            <p>경기도 성남시 분당구 판교로 227번길23</p>
            <p>대표번호: 031-5171-7900</p><br />
            <p>Copyright © 2024 SAMSUNG HEAVY INDUSTRIES<br />Co., Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onRegister={() => {
            setShowRegisterModal(false);
            setError('Registration successful. Please log in.');
          }}
        />
      )}
    </div>
  );
};

export default LoginPage;
