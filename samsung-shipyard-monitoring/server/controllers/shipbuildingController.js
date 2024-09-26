const db = require('../config/db');

exports.getShipbuildingProcessData = async (req, res) => {
  const { vesselId } = req.params;

  try {
    const query = `
      SELECT *
      FROM shipbuilding_process_data
      WHERE vessel_id = ?
      ORDER BY process_date DESC
      LIMIT 1
    `;

    const [rows] = await db.query(query, [vesselId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '해당 호선 ID에 대한 데이터를 찾을 수 없습니다' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('조선 공정 데이터 가져오기 오류:', error);
    res.status(500).json({ message: '내부 서버 오류' });
  }
};