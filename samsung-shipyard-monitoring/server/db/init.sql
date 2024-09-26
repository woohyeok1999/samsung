USE samsung_shipyard;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS cargo_volume_data;
CREATE TABLE cargo_volume_data(
	material_code varchar(50),
    material_name varchar(100),
    incoming_volume FLOAT,
    outcoming_volume FLOAT,
    storage_location varchar(50),
    vessel_id varchar(100),
    storage_date DATE,
    storage_time TIME
);

DROP TABLE IF EXISTS storage_capabilities_data;
CREATE TABLE storage_capabilities_data(
	storage_location varchar(50),
    material_code varchar(50),
    material_name varchar(100),
    maximum_storage_volume FLOAT
);

DROP TABLE IF EXISTS shipbuilding_process_data;
CREATE TABLE shipbuilding_process_data(
	process_date DATETIME,
    process_name text,
    detailed_process_name text,
    vessel_id text,
    planned_process_rate float,
    actual_process_rate float,
    number_of_worker INT,
    operating_hours INT,
    downtime_hours INT,
    remarks_note TEXT
);

SET GLOBAL local_infile = 1;