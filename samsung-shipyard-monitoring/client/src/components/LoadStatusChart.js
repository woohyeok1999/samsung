import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CSSTransition } from 'react-transition-group';
import './LoadStatusChart.css';

const LoadStatusChart = ({ onLocationChange }) => {
  const [chartData, setChartData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);  // 중앙에 표시할 퍼센트 값을 위한 상태 변수 추가
  const prevChartData = useRef(null);

  // 알파벳+숫자 정렬 함수
  const alphanumericSort = (a, b) => {
    const aParts = a.match(/^([A-Za-z]+)-(\d+)$/);
    const bParts = b.match(/^([A-Za-z]+)-(\d+)$/);

    if (!aParts || !bParts) return 0;

    const alphaCompare = aParts[1].localeCompare(bParts[1]);
    return alphaCompare === 0 ? parseInt(aParts[2]) - parseInt(bParts[2]) : alphaCompare;
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchMaterials(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation && selectedMaterial) {
      fetchData();
    }
    onLocationChange(selectedLocation);
  }, [selectedLocation, selectedMaterial]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/cargo/locations');
      const sortedLocations = response.data.sort(alphanumericSort);
      setLocations(sortedLocations);
      setSelectedLocation(sortedLocations[0]);
    } catch (error) {
      console.error('저장 위치 조회 에러:', error);
    }
  };

  const fetchMaterials = async (storageLocation) => {
    try {
      const response = await axios.get(`https://localhost:5000/api/cargo/materials?storageLocation=${storageLocation}`);
      setMaterials(response.data);
      setSelectedMaterial(response.data[0]);
    } catch (error) {
      console.error('자재 조회 에러:', error);
    }
  };

  const fetchData = async () => {
    if (!selectedLocation || !selectedMaterial) return;

    try {
      const response = await axios.get(`https://localhost:5000/api/cargo/data?storageLocation=${selectedLocation}&materialName=${selectedMaterial}`);
      let percentage = parseFloat(response.data.percentage);
      const availablePercentage = parseFloat(response.data.availablePercentage);

      let displayPercentageValue = percentage;

      // 음수일 경우 양수로 바꾼 후 100을 더하여 중앙에 표시할 값 계산
      if (percentage < 0) {
        displayPercentageValue = Math.abs(percentage) + 100;
        percentage = 100;  // 그래프는 100%로 채움
        setChartData([
          { name: '사용 중', value: 100 }, // 100%로 설정하여 꽉 채운 도넛 그래프
        ]);
      } else {
        setChartData([
          { name: '사용 중', value: percentage },
          { name: '사용 가능', value: availablePercentage }
        ]);
      }

      setDisplayPercentage(displayPercentageValue);  // 중앙에 표시할 값을 설정
    } catch (error) {
      console.error('화물 데이터 조회 에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
    onLocationChange(selectedLocation);
  }, [selectedLocation, selectedMaterial]);

  useEffect(() => {
    if (prevChartData.current && chartData) {
      setAnimationKey(prev => prev + 1);
    }
    prevChartData.current = chartData;
  }, [chartData]);

  const COLORS = ['#808080', '#36A2EB'];  // 음수일 때는 회색을 사용할 것이므로 첫 번째 색상은 회색

  if (!chartData) return <div className="loading">로딩 중...</div>;

  return (
    <>
      <h2 className="chart-title">자재별 적재 현황</h2>
      <div className="dropdown-container">
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          {locations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)}>
          {materials.map((material) => (
            <option key={material} value={material}>{material}</option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              key={animationKey}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={displayPercentage > 100 ? '#808080' : COLORS[index % COLORS.length]}  // 음수일 때는 회색
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <CSSTransition
          key={animationKey}
          in={true}
          appear={true}
          timeout={300}
          classNames="fade"
        >
          {/* 중앙에 표시할 값 */}
          <div className="chart-label">{displayPercentage.toFixed(0)}%</div>
        </CSSTransition>
      </div>
      <div className="chart-info">
        <p className="recommended-capacity">권장 저장 용량: 90%</p>
        {chartData.length > 1 && chartData[1]?.value !== undefined && (
          <CSSTransition
            key={animationKey}
            in={true}
            appear={true}
            timeout={300}
            classNames="fade"
          >
            <p className="available-capacity">
              사용 가능 용량: {(chartData[1].value * chartData[0].value / 100).toFixed(2)}ton ({chartData[1].value.toFixed(2)}%)
            </p>
          </CSSTransition>
        )}
      </div>
    </>
  );
};

export default LoadStatusChart;
