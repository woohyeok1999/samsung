import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

const MonthlyWorkAmountVisualization = ({ data, selectedYear }) => {
  if (!data || data.length === 0) return <div>데이터가 없습니다.</div>;

  const labels = data.map(item => `${item.month}월`);
  const workAmounts = data.map(item => item.work_amount);

  const chartData = {
    labels,
    datasets: [
      {
        label: '작업량',
        data: workAmounts,
        fill: false,
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        pointBackgroundColor: '#36A2EB',
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#36A2EB',
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  const CustomLegend = () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '20px',
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#36A2EB',
        marginRight: '10px',
      }}></div>
      <span>작업량</span>
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box', // 추가
      paddingBottom: '10px',
    }}>
      <h2 style={{
        fontSize: '20px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        {`${selectedYear}년 월별 작업량`}
      </h2>
      <div style={{
        width: 'calc(100% - 40px)',
        height: '400px',
        marginBottom: '30px',
      }}>
        <Line data={chartData} options={options} />
      </div>
      <CustomLegend />
    </div>
  );
};

export default MonthlyWorkAmountVisualization;