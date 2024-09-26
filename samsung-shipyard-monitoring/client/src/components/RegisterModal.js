import React, { useState } from 'react';
import api from '../services/api';
import './RegisterModal.css';

const RegisterModal = ({ onClose, onRegister }) => {
  const [id, setId] = useState('');  // 사번 입력 필드 추가
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');  // 부서 입력 필드 추가
  const [phone, setPhone] = useState('');  // 전화번호 입력 필드 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { id, name, email, password, department, phone });
      onRegister();
      onClose();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>사용자 등록</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Employee ID (사번)"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="설계">설계</option>
            <option value="생산">생산</option>
          </select>
          <input
            type="text"
            placeholder="Phone Number (010-0000-0000)"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
