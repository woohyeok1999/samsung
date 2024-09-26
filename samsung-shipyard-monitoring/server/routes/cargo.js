const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

router.get('/data', cargoController.getCargoData);
router.get('/locations', cargoController.getStorageLocations);
router.get('/materials', cargoController.getMaterials);
router.get('/summary/:storageLocation', cargoController.getStorageLocationSummary);

module.exports = router;