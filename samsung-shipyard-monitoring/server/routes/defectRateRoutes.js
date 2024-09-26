const express = require('express');
const router = express.Router();
const defectRateController = require('../controllers/defectRateController');

router.get('/:selectedMenu', defectRateController.getDefectRateData);

router.get('/green-section/:project_number', defectRateController.getDefectDataForProject);
router.put('/green-section/:id', defectRateController.updateDefectData);
router.delete('/green-section/:id', defectRateController.deleteDefectData);
router.post('/green-section', defectRateController.addDefectData);

router.get('/blue-section/shap-analysis', defectRateController.getShapValues);

module.exports = router;