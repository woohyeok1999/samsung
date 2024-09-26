const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/', calendarController.getEvents);
router.post('/', calendarController.addEvent);
router.put('/:id', calendarController.updateEvent);  // 새로운 라우트 추가
router.delete('/:id', calendarController.deleteEvent);
router.get('/today', calendarController.getTodayEvents);  // 새로운 라우트 추가

module.exports = router;