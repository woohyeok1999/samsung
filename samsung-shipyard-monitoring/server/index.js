const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const socketIo = require('socket.io');
const initializeDatabase = require('./db/initDb');  // initDb.js 파일 import
const cargoRoutes = require('./routes/cargo');
const shipbuildingRoutes = require('./routes/shipbuilding');
const dpbomDepartmentRoutes = require('./routes/dpbomDepartment');
const defectRateRoutes = require('./routes/defectRateRoutes');
const chatRoutes = require('./routes/chat');



require('dotenv').config();

const app = express();

// CORS 설정
app.use(cors({
  origin: ['https://localhost:3000', 'https://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: 'none' }
}));

// HTTPS 서버 설정
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'localhost+2-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '..', 'localhost+2.pem'), 'utf8');

const httpsServer = https.createServer({
  key: privateKey,
  cert: certificate,
}, app);

// Socket.IO 서버 설정
const io = socketIo(httpsServer, {
  cors: {
    origin: "https://localhost:3000",  // 클라이언트 도메인
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO 연결 설정
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // 메시지 수신
  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);  // 모든 클라이언트에게 메시지 전송
  });

  // 연결 해제 처리
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 데이터베이스 초기화
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
  });

// 라우트 설정
app.use('/auth', require('./routes/auth'));
app.use('/api/cargo', cargoRoutes);
app.use('/api/weather', require('./routes/weather'));
app.use('/api/news', require('./routes/news'));
app.use('/api/calendar', require('./routes/calendar'));
app.use('/api/todo', require('./routes/todo'));
app.use('/api/shipbuilding', shipbuildingRoutes);
app.use('/api/dpbom-department', dpbomDepartmentRoutes);
app.use('/api/defect-rate', defectRateRoutes);
app.use('/api/chat', chatRoutes);

// 로그 기록 미들웨어
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// HTTPS 서버 실행
const PORT = process.env.PORT || 5000;
httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});