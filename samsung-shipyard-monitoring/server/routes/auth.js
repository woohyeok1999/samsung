const express = require('express');
const xss = require('xss-clean');
const User = require('../models/User');
const router = express.Router();

const jwt = require('jsonwebtoken');

// XSS Clean 미들웨어 적용
router.use(xss());

router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await User.findById(id);
    if (!user || !(await User.verifyPassword(user, password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 세션에 사용자 ID 저장
    req.session.userId = user.id; 

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin === 1 },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, isAdmin: user.isAdmin === 1, name: user.name || '' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { id, name, email, password, department, phone } = req.body;

    // 이메일 형식 검증
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // 사번 중복 체크
    const existingUser = await User.findById(id);
    if (existingUser) {
      return res.status(400).json({ message: 'Employee ID already in use' });
    }

    // 새 사용자 생성
    await User.create(id, name, email, password, department, phone);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.get('/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);  // 토큰에서 사용자 ID를 가져와 사용자 정보 조회

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Token is valid', name: user.name });  // 사용자 이름도 함께 반환
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { id, name, email, password, department, phone } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findById(id);
    if (existingUser) {
      return res.status(400).json({ message: 'Employee ID already in use' });
    }

    // 새 사용자 생성
    await User.create(id, name, email, password, department, phone);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering new user' });
  }
});

module.exports = router;