import React, { useState } from 'react';
import axios from 'axios';
import iconWorkers from '../images/icon_workers.png';
import iconHours from '../images/icon_hours.png';
import iconDowntime from '../images/icon_downtime.png';
import iconShip from '../images/icon_ship.png';
import './ShipbuildingStatus.css';

const PROCESS_STEPS = [
  '설계', '자재 준비 및 가공', '조립', '의장', '도장', 
  '탑재', '진수', '안벽작업', '시운전', '명명식'
];

const ShipbuildingStatus = () => {
  const [vesselId, setVesselId] = useState('');
  const [processData, setProcessData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/shipbuilding/process/${vesselId}`);
      setProcessData(response.data);
    } catch (error) {
      console.error('데이터 가져오기 오류:', error);
    }
  };

  const handleSearch = () => {
    if (vesselId) {
      fetchData();
    }
  };

  const renderProcessVisualization = () => {
    if (!processData) return null;

    const currentProcessIndex = PROCESS_STEPS.indexOf(processData.process_name);

    return (
      <div className="process-visualization">
        <div className="process-line"></div>
        {PROCESS_STEPS.map((step, index) => (
          <div
            key={step}
            className={`process-step ${index <= currentProcessIndex ? 'active' : ''} ${index === currentProcessIndex ? 'current' : ''}`}
          >
            <div className="step-circle"></div>
            {index === currentProcessIndex && (
              <img src={iconShip} alt="Current Step" className="current-step-icon" />
            )}
            <span className="step-name">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderProgressBar = (label, value) => (
    <div className="progress-item">
      <span className="progress-label">{label}</span>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{width: `${value}%`}}
        ></div>
        <span className="progress-text">{value}%</span>
      </div>
    </div>
  );

  const renderDetailItem = (icon, label, value) => (
    <div className="detail-item">
      <img src={icon} alt={label} className="detail-icon" />
      <div className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="shipbuilding-status-section">
      <h2 className="status-title">선박별 건조 현황 조회</h2>
      <div className="search-container">
        <input
          type="text"
          value={vesselId}
          onChange={(e) => setVesselId(e.target.value)}
          placeholder="호선 번호 입력"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">검색</button>
      </div>
      {renderProcessVisualization()}
      {processData && (
        <div className="status-details">
          <div className="detail-row">
            {renderDetailItem(iconWorkers, "작업인원", `${processData.number_of_worker}명`)}
            {renderDetailItem(iconHours, "진행시간", `${processData.operating_hours}시간`)}
            {renderDetailItem(iconDowntime, "지연시간", `${processData.downtime_hours}시간`)}
          </div>
          <div className="progress-bars">
            {renderProgressBar('계획진도율', processData.planned_process_rate)}
            {renderProgressBar('실제진도율', processData.actual_process_rate)}
          </div>
          <div className="remarks">
            <p 
              className="remarks-text"
              style={{ color: processData.remarks_note !== '없음' ? 'red' : 'inherit' }}
            >
              {processData.remarks_note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipbuildingStatus;