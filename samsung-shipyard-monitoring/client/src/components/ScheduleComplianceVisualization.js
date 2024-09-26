import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ScheduleComplianceVisualization = ({ data }) => {
  const departmentMap = new Map();

  data.forEach(item => {
    const department = item.direct_department.trim();
    const compliance = Number(item.compliance_count);
    const nonCompliance = Number(item.non_compliance_count);

    if (!departmentMap.has(department)) {
      departmentMap.set(department, { compliance_count: 0, non_compliance_count: 0 });
    }

    const depData = departmentMap.get(department);
    depData.compliance_count += compliance;
    depData.non_compliance_count += nonCompliance;
  });

  const departments = [];
  const complianceData = [];
  const nonComplianceData = [];
  const totalCounts = [];

  departmentMap.forEach((value, key) => {
    departments.push(key);
    complianceData.push(value.compliance_count);
    nonComplianceData.push(value.non_compliance_count);
    totalCounts.push(value.compliance_count + value.non_compliance_count);
  });

  const chartData = {
    labels: departments,
    datasets: [
      {
        label: '준수',
        data: complianceData,
        backgroundColor: '#cccccc',  // 이 부분을 수정
        borderColor: '#cccccc',      // 이 부분을 추가
        borderWidth: 1,
      },
      {
        label: '지연',
        data: nonComplianceData,
        backgroundColor: 'red',      // 이 부분을 수정
        borderColor: 'red',          // 이 부분을 추가
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '부서별 일정 준수 여부(지연 강조)',
        color: '#000000',
        padding: {
            top: 10,
            bottom: 50  // 이 부분을 수정하여 제목 아래 여유 공간 추가
          },
        font: (context) => {
          const containerHeight = context.chart.height;
          return {
            size: Math.max(12, Math.min(20, containerHeight * 0.05)),
            weight: 'bold',
          };
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          color: '#000000',  // 이 부분을 추가하여 범례 글자색 변경
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        color: (context) => {
          return context.datasetIndex === 1 ? '#FF0000' : '#000000';
        },
        anchor: 'end',
        align: 'top',
        offset: 5,
        font: {
          size: 12,
        },
        formatter: (value, context) => {
          const datasetIndex = context.datasetIndex;
          const dataIndex = context.dataIndex;
          const total = totalCounts[dataIndex];
          const nonCompliance = nonComplianceData[dataIndex];

          const percentage = ((nonCompliance / total) * 100).toFixed(1);

          if (datasetIndex === 1) {
            return [
              `총 ${total}건 중`,
              `${nonCompliance}건(${percentage}%)`
            ];
          } else {
            return null;
          }
        },
        textAlign: 'center',
      },
    },
    scales: {
      x: { 
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
            color: '#000000',  // 이 부분을 추가하여 x축 라벨 글자색 변경
        },
      },
      y: { 
        stacked: true,
        beginAtZero: true,
        grid: {
            display: false,  // 이 부분을 추가
          },
        ticks: {
          callback: (value) => `${value}건`,
        },
      },
    },
  };

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ScheduleComplianceVisualization;