CREATE DATABASE samsung_shipyard;
USE samsung_shipyard;

DROP TABLE IF EXISTS status_revised_drawing;
CREATE TABLE status_revised_drawing(
	id INT,
    project_number varchar(50),
    release_department varchar(50),
    task_number varchar(50),
    drawing_name varchar(50),
    release_date DATE,
    release_number varchar(100),
    origin_department varchar(50),
    cause_code varchar(50),
    code_name varchar(50)
);

DROP TABLE IF EXISTS request_design_change;
CREATE TABLE request_design_change(
	registration_type varchar(50),
    status_ongoing varchar(50),
    ecn_number varchar(100),
    project_number varchar(50),
    urgency_level varchar(50),
    importance_level varchar(50),
    registration_date DATE,
    request_department varchar(50),
    planned_date DATE,
    completed_date DATE,
    partner_code varchar(50)
);

DROP TABLE IF EXISTS status_structure_design;
CREATE TABLE status_structure_design(
	id INT,
	project_number varchar(50),
    dpbom_code varchar(100),
    dpbom_details varchar(50),
    design_function varchar(50),
    drawing_type varchar(50),
    partner_code varchar(50),
    direct_department varchar(50),
    release_planned_date DATE,
    release_completed_date DATE
);

DROP TABLE IF EXISTS status_outfitting_design;
CREATE TABLE status_outfitting_design(
	id INT,
    dpbom_code varchar(100),
    dpbom_details varchar(50),
    design_function varchar(50),
    partner_code varchar(50),
    direct_department varchar(50),
    release_planned_date DATE,
    release_completed_date DATE
);

DROP TABLE IF EXISTS welding_defect_rate;
CREATE TABLE welding_defect_rate(
	project_number varchar(50),
    vessel_type_long varchar(50),
    vessel_type_short varchar(50),
    company_type varchar(50),
    inspection_length FLOAT,
    defect_length FLOAT,
    inspection_method varchar(50),
    inspection_id varchar(100),
    department_code varchar(50),
    inspection_record_date DATE,
    nde_code varchar(50),
    usage_decision varchar(50),
    reason_code varchar(50),
    reason_details varchar(100),
    manager_number varchar(100),
    manager_name varchar(50),
    manager_code varchar(50),
    welder_number varchar(100),
    welder_name varchar(50),
    welding_completed_date DATE,
    welding_method TEXT
);

ALTER TABLE welding_defect_rate
ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST;


DROP TABLE IF EXISTS loading_monitoring_data;
CREATE TABLE loading_monitoring_data(
	load_date DATE,
    load_area varchar(50),
    load_zone varchar(50),
    work_phase varchar(50),
    load_volume INT,
    load_capacity INT,
    load_operator varchar(50),
    start_time TIME,
    planned_time TIME,
    completed_time TIME,
    special_notes varchar(100)
);

ALTER USER 'root'@'localhost' IDENTIFIED BY '1111';
SET GLOBAL local_infile = 1;


describe users;






















































