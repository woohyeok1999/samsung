import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getShapData } from '../services/defectRateService';  // 서비스 파일에서 함수 가져오기

const DefectRateBlueSection = () => {
  const [shapData, setShapData] = useState(null);

  useEffect(() => {
    const fetchShapData = async () => {
      try {
        const data = await getShapData();  // 서비스에서 데이터 불러오기
        setShapData(data);
      } catch (error) {
        console.error('Error fetching SHAP data:', error);
      }
    };
    fetchShapData();
  }, []);

  // 절대값 중 가장 큰 값을 찾고, 그래프에 표시할 색상을 결정하는 함수
  const processDataForChart = (shapValues) => {
    const absoluteShapValues = shapValues.map((value) => Math.abs(value));
    const maxShapValue = Math.max(...absoluteShapValues); // 가장 큰 절대값을 찾음

    return shapValues.map((value) => ({
      y: Math.abs(value), // 절대값으로 표시
      actualValue: value, // 툴팁에 실제 값을 표시
      color: Math.abs(value) === maxShapValue ? 'red' : 'gray', // 가장 큰 절대값은 빨간색, 나머지는 회색
    }));
  };

  const options = {
    chart: {
      type: 'bar',
    },
    title: {
      text: '[ SHAP Summary Plot ]',
      style: {
        color: 'gray', // 회색
        fontSize: '18px', // 글자 크기 줄이기
      },
    },
    legend: {
        enabled: false, // 범례 숨기기
    },
    xAxis: {
      categories: ['welding_method', 'reason_details', 'company_type', 'department_code', 'vessel_type_long'],
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'SHAP Value (Absolute)',
        align: 'high',
      },
      labels: {
        overflow: 'justify',
      },
    },
    tooltip: {
        formatter: function () {
          // 툴팁에 실제 SHAP 값을 표시 (음수/양수 포함)
          return `Variable: <b>${this.x}</b><br>SHAP Value: <b>${this.point.actualValue}</b>`;
        },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [
        {
          name: 'SHAP Value (Absolute)',
          data: shapData ? processDataForChart(shapData.shap_values[0]) : [], // 절대값을 사용하여 데이터 변환
        },
    ],
  };

  return (
    <>
      <h3>SHAP 분석을 통한 불량률 기여도 분석</h3>
      {shapData ? (
        <HighchartsReact highcharts={Highcharts} options={options}/>
      ) : (
        <p>데이터를 불러오는 중...</p>
      )}
    </>
  );
};

export default DefectRateBlueSection;
