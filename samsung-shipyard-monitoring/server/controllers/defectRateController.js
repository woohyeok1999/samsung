const pool = require('../config/db');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.getDefectRateData = async (req, res) => {
  const { selectedMenu } = req.params;
  
  try {
    const query = `
      SELECT 
        ${selectedMenu} as name,
        COUNT(*) as count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM welding_defect_rate WHERE defect_length > 0) as percentage
      FROM welding_defect_rate
      WHERE defect_length != 0
      GROUP BY ${selectedMenu}
      ORDER BY count DESC
    `;

    const [results] = await pool.query(query);

    // 총 개수 계산
    const totalCount = results.reduce((sum, item) => sum + item.count, 0);

    // 백분율 계산 및 반올림
    const formattedResults = results.map(item => ({
      ...item,
      percentage: Number((item.count / totalCount * 100).toFixed(2))
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching defect rate data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//-----------------------
exports.getDefectDataForProject = async (req, res) => {
    const { project_number } = req.params;

    try {
        const query = `
            SELECT id, vessel_type_long, department_code, company_type, reason_details, welding_method
            FROM welding_defect_rate
            WHERE project_number = ? AND defect_length != 0
        `;

        const [results] = await pool.query(query, [project_number]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching defect data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateDefectData = async (req, res) => {
    const { id } = req.params;
    const { vessel_type_long, department_code, company_type, reason_details, welding_method } = req.body;

    try {
        const query = `
            UPDATE welding_defect_rate
            SET vessel_type_long = ?, department_code = ?, company_type = ?, reason_details = ?, welding_method = ?
            WHERE id = ?
        `;

        await pool.query(query, [vessel_type_long, department_code, company_type, reason_details, welding_method, id]);
        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating defect data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteDefectData = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM welding_defect_rate WHERE id = ?`;
        await pool.query(query, [id]);
        res.json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting defect data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addDefectData = async (req, res) => {
    const { project_number, vessel_type_long, department_code, company_type, inspection_length, defect_length, inspection_method, inspection_id, reason_code, reason_details, welding_method } = req.body;

    try {
        const query = `
            INSERT INTO welding_defect_rate (project_number, vessel_type_long, department_code, company_type, inspection_length, defect_length, inspection_method, inspection_id, reason_code, reason_details, welding_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [project_number, vessel_type_long, department_code, company_type, inspection_length, defect_length, inspection_method, inspection_id, reason_code, reason_details, welding_method]);
        res.json({ message: 'Data added successfully' });
    } catch (error) {
        console.error('Error adding defect data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//---------------------
exports.getShapValues = async (req, res) => {
  // 아나콘다 가상환경의 Python 경로를 명시적으로 지정
  const pythonPath = 'C:\\Users\\user\\.conda\\envs\\work\\python.exe';
  exec(`${pythonPath} server/scripts/shap_analysis.py`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      console.error(`Python stderr: ${stderr}`);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // SHAP 결과 파일 읽기
    const shapResultsPath = path.join(__dirname, '..', 'scripts', 'shap_results.json');
    fs.readFile(shapResultsPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading SHAP results:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      // 결과를 JSON으로 응답
      const shapData = JSON.parse(data);
      res.json(shapData);
    });
  });
};
