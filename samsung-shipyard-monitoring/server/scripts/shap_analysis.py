import pymysql
import pandas as pd
import xgboost
import shap
import json
from sklearn.preprocessing import LabelEncoder
import os

# MySQL 연결
connection = pymysql.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASS'),
    database=os.getenv('DB_NAME')
)

# SQL 쿼리 실행 (불량 데이터 추출)
query = """
SELECT defect_length, vessel_type_long, department_code, company_type, reason_details, welding_method
FROM welding_defect_rate
WHERE defect_length != 0
"""
data = pd.read_sql(query, connection)

# 데이터 전처리
X = data[['vessel_type_long', 'department_code', 'company_type', 'reason_details', 'welding_method']]
y = data['defect_length']

# 범주형 데이터를 숫자형으로 변환 (Label Encoding)
le = LabelEncoder()
for column in X.columns:
    X[column] = le.fit_transform(X[column])

# XGBoost 모델 학습
model = xgboost.XGBRegressor()
model.fit(X, y)

# SHAP 값 계산
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X)

# SHAP Summary 데이터 저장
shap_summary = {
    "shap_values": shap_values.tolist(),
    "base_value": explainer.expected_value.tolist()
}

# JSON 파일로 저장
output_path = os.path.join(os.path.dirname(__file__), 'shap_results.json')
with open(output_path, 'w') as f:
    json.dump(shap_summary, f)

# MySQL 연결 종료
connection.close()
