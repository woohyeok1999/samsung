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
    cvd.storage_location = 'C-1'
GROUP BY 
    cvd.material_name;