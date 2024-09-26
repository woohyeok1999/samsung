import mysql.connector

# MySQL 연결 설정 (기존 연결 사용)
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='1111',
    database='samsung_shipyard',
    allow_local_infile=True
)

cursor = connection.cursor()

# 추가 CSV 파일 경로
additional_file_path = 'C:/Users/user/Desktop/samsung-shipyard-monitoring/data/processed/processed_data/processed_data_5.csv'

# 데이터 삽입 쿼리
load_data_query = f"""
LOAD DATA LOCAL INFILE '{additional_file_path}'
INTO TABLE welding_defect_rate
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\\n'
IGNORE 1 ROWS;
"""

try:
    cursor.execute(load_data_query)
    connection.commit()
    print(f"Data insertion completed for processed_data_load.csv into table test.")
except mysql.connector.Error as err:
    print(f"Error: {err} for file processed_data_load.csv into table loading_monitoring.")
    connection.rollback()

# 리소스 정리
cursor.close()
connection.close()