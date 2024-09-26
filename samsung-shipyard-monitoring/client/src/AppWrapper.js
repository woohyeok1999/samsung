import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import App from './App';
import api from './services/api';
import DesignStructure from './pages/DesignStructure_Page/DesignStructure'; // 새로 추가
import DefectRate from './pages/DefectRate_Page/DefectRate'; // 새로 추가

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // 세션 스토리지에서 토큰 가져오기
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      await api.get('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Token verification failed:', error);
      sessionStorage.removeItem('token'); // 세션 스토리지에서 토큰 제거
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (token) => {
    sessionStorage.setItem('token', token); // 로그인 성공 시 세션 스토리지에 토큰 저장
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // 로그아웃 시 세션 스토리지에서 토큰 제거
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="AppWrapper">
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />} />
          <Route path="/" element={!isLoggedIn ? <Navigate to="/login" replace /> : <App onLogout={handleLogout} />} />
          <Route path="/design-structure" element={<DesignStructure />} />
          <Route path="/defect-rate" element={<DefectRate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppWrapper;
