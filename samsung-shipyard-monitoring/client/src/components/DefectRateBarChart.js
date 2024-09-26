import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DefectRateBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Sort data by count in descending order and take top 5
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 5);
  const maxCount = sortedData[0].count;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 30, right: 50, left: -10, bottom: -30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="count">
          {sortedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.count === maxCount ? '#FF4136' : '#AAAAAA'} 
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DefectRateBarChart;