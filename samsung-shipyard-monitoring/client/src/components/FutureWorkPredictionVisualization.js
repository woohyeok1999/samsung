import { Bold } from 'lucide-react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FutureWorkPredictionVisualization = ({ data }) => {
  if (!data || data.length === 0) return <div>No prediction data available</div>;

  return (
    <div className="future-work-prediction">
      <h3 style={{ marginBottom: '60px', textAlign: 'center', marginTop: '40px' }}>향후 12개월 간 작업량 예측</h3>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart 
            data={data}
            margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: '#fffbf1', fontSize: '14px' }} />
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            iconSize={24} /* 범례 기호 크기 증가 */
            wrapperStyle={{ 
              fontSize: '18px', /* 범례 글자 크기 증가 */
              fontWeight: 'bold', /* 글자 진하게 */
              display: 'flex',
              justifyContent: 'center', /* 범례를 가로 중앙 정렬 */
              position: 'relative', // 범례 위치를 조정
              top:'10px',
              gap: '25px', /* 기호와 글자 간 간격 조정 */
              width:'100%',
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="predicted_work_amount" 
            stroke="#ff6b6b" 
            strokeWidth={3} 
            dot={{ r: 5 }} 
            activeDot={{ r: 7 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FutureWorkPredictionVisualization;
