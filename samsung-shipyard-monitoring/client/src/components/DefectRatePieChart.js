import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

const DefectRatePieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Sort data by percentage in descending order
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  // Separate data into two groups: above 10% and below 10%
  const mainData = sortedData.filter(item => item.percentage >= 10);
  const otherData = sortedData.filter(item => item.percentage < 10);

  // Calculate total percentage and count for "Others"
  const otherPercentage = otherData.reduce((sum, item) => sum + item.percentage, 0);
  const otherCount = otherData.reduce((sum, item) => sum + item.count, 0);

  // Combine mainData with "Others"
  const chartData = [
    ...mainData,
    { name: 'Others', percentage: otherPercentage, count: otherCount }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{`${data.name}: ${data.percentage.toFixed(2)}%`}</p>
          <p>{`Count: ${data.count}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ marginBottom: '5px' }}>
            <span style={{ color: entry.color, marginRight: '5px' }}>●</span>
            {entry.value === 'Others' ? (
              <span title={otherData.map(item => `${item.name}: ${item.percentage.toFixed(2)}%`).join('\n')}>
                {entry.value}
              </span>
            ) : (
              entry.value
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={370}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="60%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="percentage"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#AAAAAA' : COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DefectRatePieChart;