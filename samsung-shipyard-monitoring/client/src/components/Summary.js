import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { CSSTransition } from 'react-transition-group';
import './Summary.css';

const Summary = ({ selectedLocation }) => {
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    if (selectedLocation) {
      fetchSummaryData();
    }
  }, [selectedLocation]);

  const fetchSummaryData = async () => {
    try {
      const response = await axios.get(`https://localhost:5000/api/cargo/summary/${selectedLocation}`);
      setSummaryData(response.data);
    } catch (error) {
      console.error('요약 데이터 조회 에러:', error);
    }
  };

  if (!summaryData) return <div className="loading">로딩 중...</div>;

  const chartData = summaryData.map(item => {
    const percentage = parseFloat(item.percentage);
    const adjustedPercentage = percentage < 0 ? Math.abs(percentage) + 100 : percentage;

    return {
      name: item.materialName,
      percentage: percentage < 0 ? 100 : percentage, // 음수면 100%로 표시
      adjustedPercentage: adjustedPercentage, // 음수면 100 더한 값으로 툴팁에 표시
    };
  });

  // 내림차순 정렬
  const sortedChartData = chartData.sort((a, b) => b.percentage - a.percentage);

  // 가장 큰 퍼센트 값을 가진 항목의 percentage 값을 찾기
  const maxPercentage = Math.max(...sortedChartData.map(item => item.percentage));

  return (
    <>
      <h3 className="summary-title">{selectedLocation} 구역 적재 현황</h3>
      <CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames="fade"
      >
        <div className="summary-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={sortedChartData} 
              layout="vertical"
              margin={{ top: 20, right: 100, left: 10, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip 
                formatter={(value, name, props) => {
                  const { payload } = props;
                  return [`${payload.adjustedPercentage.toFixed(2)}%`, "적재율"];
                }}
              />
              <Bar dataKey="percentage" animationBegin={0} animationDuration={800} animationEasing="ease-out">
                {sortedChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.percentage === maxPercentage ? '#FF0000' : '#808080'} // 가장 큰 퍼센트는 빨간색으로 표시
                  />
                ))}
                <LabelList 
                  dataKey="percentage" 
                  position="right" 
                  formatter={(value) => `${value.toFixed(2)}%`} 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CSSTransition>
    </>
  );
};

export default Summary;