import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import DefectRateMenu from '../../components/DefectRateMenu';
import DefectRatePieChart from '../../components/DefectRatePieChart';
import DefectRateBarChart from '../../components/DefectRateBarChart';
import DefectRateGreenSection from '../../components/DefectRateGreenSection';
import DefectRateBlueSection from '../../components/DefectRateBlueSection';
import { getDefectRateData } from '../../services/defectRateService';
import './DefectRate.css';

const DefectRate = () => {
  const [selectedMenu, setSelectedMenu] = useState('vessel_type_long');
  const [data, setData] = useState([]);
  const [projectNumber, setProjectNumber] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDefectRateData(selectedMenu);
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedMenu]);

  const handleMenuSelect = (menuId) => {
    setSelectedMenu(menuId);
  };

  const handleSearch = () => {
    if (projectNumber.trim() === '') {
      alert('Project Number를 입력하세요.');
      return;
    }
    setIsSearched(true);
  };

  return (
    <div>
      <Header />
      <div className="defect-rate-main-content">
        <div className="defect-rate-top-row">
          <div className="defect-rate-red-section">
            <DefectRateMenu selectedMenu={selectedMenu} onMenuSelect={handleMenuSelect} />
          </div>
          <div className="defect-rate-orange-yellow">
            <div className="defect-rate-orange-section">
              <h4 className="chart-title">불량률 분포</h4>
              <DefectRatePieChart data={data} />
            </div>
            <div className="defect-rate-yellow-section">
              <h4 className="chart-title">불량 건수</h4>
              <DefectRateBarChart data={data} />
            </div>
          </div>
        </div>
        <div className="defect-rate-bottom-row">
          <div className="defect-rate-green-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="선박 식별코드 입력"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
              />
              <button onClick={handleSearch}>검색</button>
            </div>
            {isSearched && projectNumber.trim() !== '' && (
              <DefectRateGreenSection projectNumber={projectNumber} />
            )}
          </div>
          <div className="defect-rate-blue-section">
            <DefectRateBlueSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefectRate;