const db = require('../config/db');
const holtWinters = require('holtwinters');

// 구조설계 데이터 가져오기
exports.getStructureDesignData = async (req, res) => {
  try {
    console.log('Executing structure design query...');
    const [rows] = await db.query('SELECT dpbom_details, direct_department, COUNT(*) as work_amount FROM status_structure_design GROUP BY dpbom_details, direct_department');
    console.log('Structure design query executed successfully');
    res.json(rows);
  } catch (err) {
    console.error('Error in getStructureDesignData:', err);
    res.status(500).json({ error: 'Failed to retrieve structure design data' });
  }
};

// 의장설계 데이터 가져오기
exports.getOutfittingDesignData = async (req, res) => {
  try {
    console.log('Executing outfitting design query...');
    const [rows] = await db.query('SELECT dpbom_details, direct_department, COUNT(*) as work_amount FROM status_outfitting_design GROUP BY dpbom_details, direct_department');
    console.log('Outfitting design query executed successfully');
    res.json(rows);
  } catch (err) {
    console.error('Error in getOutfittingDesignData:', err);
    res.status(500).json({ error: 'Failed to retrieve outfitting design data' });
  }
};

// 협력사 참여 비율 (구조설계 테이블에서 가져오기)
exports.getStructurePartnerParticipation = async (req, res) => {
  try {
    console.log('Executing structure partner participation query...');
    const [rows] = await db.query(
      `SELECT dpbom_details, partner_code, COUNT(*) as work_amount 
       FROM status_structure_design 
       GROUP BY dpbom_details, partner_code`
    );
    console.log('Structure partner participation query executed successfully');
    res.json(rows);
  } catch (err) {
    console.error('Error in getStructurePartnerParticipation:', err);
    res.status(500).json({ error: 'Failed to retrieve structure partner participation data' });
  }
};

// 협력사 참여 비율 (의장설계 테이블에서 가져오기)
exports.getOutfittingPartnerParticipation = async (req, res) => {
  try {
    console.log('Executing outfitting partner participation query...');
    const [rows] = await db.query(
      `SELECT dpbom_details, partner_code, COUNT(*) as work_amount 
       FROM status_outfitting_design 
       GROUP BY dpbom_details, partner_code`
    );
    console.log('Outfitting partner participation query executed successfully');
    res.json(rows);
  } catch (err) {
    console.error('Error in getOutfittingPartnerParticipation:', err);
    res.status(500).json({ error: 'Failed to retrieve outfitting partner participation data' });
  }
};

// 구조설계 일정 준수 데이터 가져오기
exports.getStructureComplianceData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT direct_department, 
             SUM(CASE WHEN release_completed_date <= release_planned_date THEN 1 ELSE 0 END) as compliance_count,
             SUM(CASE WHEN release_completed_date > release_planned_date THEN 1 ELSE 0 END) as non_compliance_count
      FROM status_structure_design
      GROUP BY direct_department
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching structure compliance data:', err);
    res.status(500).json({ error: 'Failed to retrieve structure compliance data' });
  }
};

// 의장설계 일정 준수 데이터 가져오기
exports.getOutfittingComplianceData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT direct_department, 
             SUM(CASE WHEN release_completed_date <= release_planned_date THEN 1 ELSE 0 END) as compliance_count,
             SUM(CASE WHEN release_completed_date > release_planned_date THEN 1 ELSE 0 END) as non_compliance_count
      FROM status_outfitting_design
      GROUP BY direct_department
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching outfitting compliance data:', err);
    res.status(500).json({ error: 'Failed to retrieve outfitting compliance data' });
  }
};

// 선택된 년도에 따른 월별 작업량 계산
exports.getMonthlyWorkAmount = async (req, res) => {
  const { year, designType } = req.query; // 클라이언트에서 전달한 년도와 디자인 타입 받기
  let tableName = '';

  // 구조설계 또는 의장설계 테이블 선택
  if (designType === 'structure') {
    tableName = 'status_structure_design';
  } else if (designType === 'outfitting') {
    tableName = 'status_outfitting_design';
  }

  try {
    const query = `
      SELECT MONTH(release_completed_date) as month, COUNT(*) as work_amount
      FROM ${tableName}
      WHERE YEAR(release_completed_date) = ?
      GROUP BY MONTH(release_completed_date)
      ORDER BY month ASC
    `;
    const [rows] = await db.query(query, [year]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching monthly work amount:', err);
    res.status(500).json({ error: 'Failed to retrieve monthly work amount data' });
  }
};

// 데이터베이스에서 존재하는 년도를 가져오는 함수
exports.getAvailableYears = async (req, res) => {
  const { designType } = req.query; // 구조설계/의장설계에 따른 테이블 선택
  let tableName = '';

  if (designType === 'structure') {
    tableName = 'status_structure_design';
  } else if (designType === 'outfitting') {
    tableName = 'status_outfitting_design';
  }

  try {
    const query = `
      SELECT DISTINCT YEAR(release_completed_date) as year
      FROM ${tableName}
      ORDER BY year DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching available years:', err);
    res.status(500).json({ error: 'Failed to retrieve available years' });
  }
};

exports.getFutureWorkPrediction = async (req, res) => {
  const { designType } = req.query;
  let tableName = designType === 'structure' ? 'status_structure_design' : 'status_outfitting_design';

  try {
    const [latestDate] = await db.query(`
      SELECT MAX(release_completed_date) as latest_date
      FROM ${tableName}
    `);
    const startDate = new Date(latestDate[0].latest_date);

    const [historicalData] = await db.query(`
      SELECT DATE_FORMAT(release_completed_date, '%Y-%m-01') as month, COUNT(*) as work_amount
      FROM ${tableName}
      WHERE release_completed_date >= DATE_SUB(?, INTERVAL 3 YEAR)
      GROUP BY DATE_FORMAT(release_completed_date, '%Y-%m-01')
      ORDER BY month ASC
    `, [startDate]);

    console.log('Historical data:', historicalData);

    if (historicalData.length === 0) {
      return res.status(400).json({ error: 'No historical data available' });
    }

    // 간단한 이동 평균 및 계절성 고려 예측 함수
    const predictFutureWorkAmount = (data, periodsToPredict) => {
      const seasonalPeriod = 12; // 12개월을 한 주기로 가정
      const recentData = data.slice(-seasonalPeriod * 2); // 최근 2년 데이터 사용

      // 계절성 계수 계산
      const seasonalFactors = Array(seasonalPeriod).fill(0);
      for (let i = 0; i < recentData.length; i++) {
        const monthIndex = i % seasonalPeriod;
        seasonalFactors[monthIndex] += recentData[i].work_amount / 2; // 2년 평균
      }

      // 전체 평균 계산
      const totalAvg = recentData.reduce((sum, item) => sum + item.work_amount, 0) / recentData.length;

      // 계절성 조정
      seasonalFactors.forEach((factor, index) => {
        seasonalFactors[index] = factor / totalAvg;
      });

      // 예측
      const predictions = [];
      for (let i = 0; i < periodsToPredict; i++) {
        const monthIndex = i % seasonalPeriod;
        const predictedValue = Math.round(totalAvg * seasonalFactors[monthIndex]);
        predictions.push(predictedValue);
      }

      return predictions;
    };

    const forecast = predictFutureWorkAmount(historicalData, 12);  // 12개월 예측

    console.log('Forecast:', forecast);

    const predictionResults = forecast.map((predictedValue, index) => {
      const predictionDate = new Date(startDate);
      predictionDate.setMonth(startDate.getMonth() + index + 1);
      return {
        month: predictionDate.toISOString().slice(0, 7),
        predicted_work_amount: predictedValue
      };
    });

    res.json(predictionResults);

  } catch (err) {
    console.error('Error in getFutureWorkPrediction:', err);
    res.status(500).json({ error: 'Failed to predict future work amount' });
  }
};