const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 인증 미들웨어 추가
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, department, email, phone FROM users WHERE id != ? ORDER BY name ASC', [req.session.userId]);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

router.get('/friends', async (req, res) => {
  const userId = req.session.userId;
  try {
    const [friends] = await db.query(`
      SELECT u.id, u.name, u.department, u.email, u.phone FROM friends f
      JOIN users u ON f.friend_id = u.id
      WHERE f.user_id = ?
      ORDER BY u.name ASC
    `, [userId]);
    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).send('Server error');
  }
});

// 친구 추가 부분
router.post('/add-friend', async (req, res) => {
  const { friendId } = req.body;
  const userId = req.session.userId;

  try {
    // 이미 친구인지 확인
    const [existingFriend] = await db.query('SELECT * FROM friends WHERE user_id = ? AND friend_id = ?', [userId, friendId]);
    
    if (existingFriend.length > 0) {
      return res.status(400).json({ message: 'Already friends' });
    }

    await db.query('INSERT INTO friends (user_id, friend_id) VALUES (?, ?)', [userId, friendId]);
    res.status(201).json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Error adding friend' });
  }
});

// 친구 삭제
router.delete('/remove-friend', async (req, res) => {
  const { friendId } = req.body;
  const userId = req.session.userId;

  try {
    await db.query('DELETE FROM friends WHERE user_id = ? AND friend_id = ?', [userId, friendId]);
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Error removing friend' });
  }
});

// 메시지 전송
router.post('/messages', async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.session.userId;
  
    if (!senderId) {
      return res.status(403).json({ message: 'Unauthorized. Please login.' });
    }
  
    try {
      await db.query('INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)', 
                     [senderId, receiverId, message]);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message', error: error.message });
    }
  });
  
// 채팅 내역 가져오기
router.get('/messages/:friendId', async (req, res) => {
    const userId = req.session.userId;
    const { friendId } = req.params;
  
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }
  
    try {
      const [messages] = await db.query(`
        SELECT m.*, 
               CASE WHEN m.sender_id = ? THEN true ELSE false END AS is_sent
        FROM messages m
        WHERE (m.sender_id = ? AND m.receiver_id = ?) 
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.timestamp ASC
      `, [userId, userId, friendId, friendId, userId]);
      
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
  });

  router.get('/departments', async (req, res) => {
    try {
      const [departments] = await db.query('SELECT DISTINCT department FROM users ORDER BY department ASC');
      res.json(departments.map(dep => dep.department));
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).send('Server error');
    }
  });
  
  router.get('/search-users', async (req, res) => {
    const { department, name } = req.query;
    const userId = req.session.userId;
  
    let query = 'SELECT id, name, department, email, phone FROM users WHERE id != ?';
    let params = [userId];
  
    if (department !== '전체') {
      query += ' AND department = ?';
      params.push(department);
    }
  
    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
  
    query += ' ORDER BY name ASC';
  
    try {
      const [users] = await db.query(query, params);
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).send('Server error');
    }
  });



module.exports = router;