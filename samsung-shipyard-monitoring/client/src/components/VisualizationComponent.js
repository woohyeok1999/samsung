import React from 'react';
import PropTypes from 'prop-types';

const VisualizationComponent = ({ dpbomDetails, departmentData }) => {
  if (!departmentData || Object.keys(departmentData).length === 0) {
    return <div className="visualization-card">No data available for {dpbomDetails}</div>;
  }

  const totalWorkAmount = Object.values(departmentData).reduce((sum, amount) => sum + amount, 0);

  // Sort departments by percentage in descending order
  const sortedDepartments = Object.entries(departmentData)
    .map(([department, amount]) => ({
      department,
      amount,
      percentage: (amount / totalWorkAmount * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="visualization-card">
      <h3 className="dpbom-details-title">{dpbomDetails}</h3>
      <div className="department-list">
        {sortedDepartments.map(({ department, amount, percentage }) => (
          <div key={department} className="department-item">
            <div className="department-name">{department}</div>
            <div className="department-info">
              <span className="department-amount">{amount}</span>
              <span className="department-percentage">{percentage.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: '#3CB371'  // Changed from green to red
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="total-work">Total: {totalWorkAmount}</div>
    </div>
  );
};

VisualizationComponent.propTypes = {
  dpbomDetails: PropTypes.string.isRequired,
  departmentData: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default VisualizationComponent;