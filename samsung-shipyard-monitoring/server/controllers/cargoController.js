const pool = require('../config/db');

exports.getCargoData = async (req, res) => {
    const { storageLocation, materialName } = req.query;
    try {
        const volumeQuery = `
            SELECT 
                SUM(incoming_volume - outcoming_volume) AS current_volume,
                MAX(maximum_storage_volume) AS maximum_storage_volume
            FROM 
                cargo_volume_data cvd
            JOIN 
                storage_capabilities_data scd ON cvd.storage_location = scd.storage_location 
                AND cvd.material_name = scd.material_name
            WHERE 
                cvd.storage_location = ? AND cvd.material_name = ?
        `;
        const [volumeRows] = await pool.query(volumeQuery, [storageLocation, materialName]);

        if (volumeRows.length === 0 || volumeRows[0].current_volume === null) {
            return res.status(404).json({ message: "No data found for this storage location and material" });
        }

        const currentVolume = volumeRows[0].current_volume;
        const maxVolume = volumeRows[0].maximum_storage_volume;
        const percentage = (currentVolume / maxVolume) * 100;
        const availableCapacity = maxVolume - currentVolume;

        res.json({
            currentVolume,
            maxVolume,
            percentage: percentage.toFixed(2),
            availableCapacity,
            availablePercentage: ((availableCapacity / maxVolume) * 100).toFixed(2)
        });
    } catch (error) {
        console.error('getCargoData 에러:', error);
        res.status(500).json({ error: '서버 내부 오류', details: error.message });
    }
};

exports.getStorageLocations = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT storage_location FROM cargo_volume_data');
        const locations = rows.map(row => row.storage_location);
        res.json(locations);
    } catch (error) {
        console.error('저장 위치 조회 에러:', error);
        res.status(500).json({ error: '서버 내부 오류', details: error.message });
    }
};

exports.getMaterials = async (req, res) => {
    const { storageLocation } = req.query;
    try {
        const query = `
            SELECT DISTINCT material_name 
            FROM storage_capabilities_data
            WHERE storage_location = ?
        `;
        const [rows] = await pool.query(query, [storageLocation]);
        const materials = rows.map(row => row.material_name);
        res.json(materials);
    } catch (error) {
        console.error('자재 조회 에러:', error);
        res.status(500).json({ error: '서버 내부 오류', details: error.message });
    }
};

exports.getStorageLocationSummary = async (req, res) => {
    const { storageLocation } = req.params;
    try {
        const query = `
            SELECT 
                cvd.material_name,
                SUM(cvd.incoming_volume - cvd.outcoming_volume) AS current_volume,
                MAX(scd.maximum_storage_volume) AS maximum_storage_volume
            FROM 
                cargo_volume_data cvd
            JOIN 
                storage_capabilities_data scd ON cvd.storage_location = scd.storage_location 
                AND cvd.material_name = scd.material_name
            WHERE 
                cvd.storage_location = ?
            GROUP BY 
                cvd.material_name
        `;
        const [rows] = await pool.query(query, [storageLocation]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "No data found for this storage location" });
        }
        
        const summary = rows.map(row => ({
            materialName: row.material_name,
            currentVolume: row.current_volume,
            maxVolume: row.maximum_storage_volume,
            percentage: ((row.current_volume / row.maximum_storage_volume) * 100).toFixed(2)
        }));

        res.json(summary);
    } catch (error) {
        console.error('getStorageLocationSummary 에러:', error);
        res.status(500).json({ error: '서버 내부 오류', details: error.message });
    }
};
