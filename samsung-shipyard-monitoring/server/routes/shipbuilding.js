const express = require('express');
const router = express.Router();
const shipbuildingController = require('../controllers/shipbuildingController');

// '/api/shipbuilding' 접두사가 이미 index.js에서 지정되었으므로, 여기서는 생략합니다.
router.get('/process/:vesselId', shipbuildingController.getShipbuildingProcessData);

module.exports = router;