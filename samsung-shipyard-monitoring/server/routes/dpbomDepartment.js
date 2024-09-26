const express = require('express');
const {
    getStructureDesignData, 
    getOutfittingDesignData, 
    getStructurePartnerParticipation, 
    getOutfittingPartnerParticipation,
    getStructureComplianceData,
    getOutfittingComplianceData,
    getMonthlyWorkAmount,
    getAvailableYears,
    getFutureWorkPrediction,
  } = require('../controllers/dpbomDepartmentController');

const router = express.Router();

router.get('/structure-design', getStructureDesignData);
router.get('/outfitting-design', getOutfittingDesignData);

// 새로 추가된 협력사 참여 비율 라우트
router.get('/structure-partner-participation', getStructurePartnerParticipation);
router.get('/outfitting-partner-participation', getOutfittingPartnerParticipation);

router.get('/structure-compliance', getStructureComplianceData);
router.get('/outfitting-compliance', getOutfittingComplianceData);

router.get('/monthly-work-amount', getMonthlyWorkAmount);  // 새로운 라우트 추가
router.get('/available-years', getAvailableYears);  // 새로운 라우트 추가

router.get('/future-work-prediction', getFutureWorkPrediction);

module.exports = router;