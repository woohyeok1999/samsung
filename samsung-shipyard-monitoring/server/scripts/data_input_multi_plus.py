import mysql.connector

# MySQL 연결 설정
connection = mysql.connector.connect(
    host='localhost',
    user='root',        # MySQL 사용자명
    password='1111',    # MySQL 비밀번호
    database='samsung_shipyard',  # 사용할 데이터베이스 이름
    allow_local_infile=True  # local_infile 옵션 활성화
)

cursor = connection.cursor()

# CSV 파일과 대상 테이블 매핑
file_table_mapping = {
    'processed_data_cargo_volume.csv': 'cargo_volume_data',
    'processed_data_shipbuilding_process.csv': 'shipbuilding_process_data',
    'processed_data_storage_capabilities.csv': 'storage_capabilities_data',
}

# 파일 경로의 기본 디렉토리
base_path = 'C:/Users/user/Desktop/samsung-shipyard-monitoring/data_plus/processed/processed_data/'

# 각 파일을 처리하여 데이터 삽입
for file_name, table_name in file_table_mapping.items():
    file_path = base_path + file_name
    load_data_query = f"""
    LOAD DATA LOCAL INFILE '{file_path}'
    INTO TABLE {table_name}
    FIELDS TERMINATED BY ',' 
    ENCLOSED BY '"'
    LINES TERMINATED BY '\\n'
    IGNORE 1 ROWS;
    """
    
    try:
        cursor.execute(load_data_query)
        connection.commit()
        print(f"Data insertion completed for {file_name} into table {table_name}.")
    except mysql.connector.Error as err:
        print(f"Error: {err} for file {file_name} into table {table_name}.")
        connection.rollback()

# 리소스 정리
cursor.close()
connection.close()
