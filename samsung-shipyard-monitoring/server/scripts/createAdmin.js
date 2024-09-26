require('dotenv').config();
const bcrypt = require('bcryptjs'); // bcrypt 모듈을 가져옵니다.
const User = require('../models/User');
const db = require('../config/db');

async function createAdminUser() {
    try {
      const email = 'lwhjms30818@gmail.com';
      const password = 'lwhjms123@';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await db.execute(
        'INSERT INTO users (email, password, isAdmin) VALUES (?, ?, ?)',
        [email, hashedPassword, true]
      );
      
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      await db.end();
    }
  }
  
  createAdminUser();