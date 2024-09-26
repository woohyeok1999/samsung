import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import VisualizationComponent from '../../components/VisualizationComponent';
import PartnerParticipationVisualization from '../../components/PartnerParticipationVisualization';
import ScheduleComplianceVisualization from '../../components/ScheduleComplianceVisualization';
import MonthlyWorkAmountVisualization from '../../components/MonthlyWorkAmountVisualization';
import FutureWorkPredictionVisualization from '../../components/FutureWorkPredictionVisualization';
import { 
  fetchStructureDesignData, 
  fetchOutfittingDesignData, 
  fetchStructurePartnerParticipation, 
  fetchOutfittingPartnerParticipation,
  fetchStructureComplianceData, 
  fetchOutfittingComplianceData,
  fetchMonthlyWorkAmount,
  fetchAvailableYears,
  fetchFutureWorkPrediction,
} from '../../services/dpbomDepartmentService'; // 새로운 API 호출 추가
import './DesignStructure.css';

const DesignStructure = () => {
  const [predictionData, setPredictionData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [scheduleComplianceData, setScheduleComplianceData] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [partnerData, setPartnerData] = useState([]); // 상태 변수 정의
  const [selectedDesign, setSelectedDesign] = useState('structure');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        const response = await fetchFutureWorkPrediction(selectedDesign);
        setPredictionData(response.data);
      } catch (err) {
        console.error('Error fetching prediction data:', err);
        // 에러 처리 로직 추가 (예: 에러 메시지 표시)
      }
    };

    fetchPredictionData();
  }, [selectedDesign]);

  useEffect(() => {
    // 선택한 디자인 타입에 따른 년도 목록 가져오기
    const loadAvailableYears = async () => {
      try {
        const response = await fetchAvailableYears(selectedDesign);
        setAvailableYears(response.data.map(item => item.year)); // 년도 목록 설정
        if (response.data.length > 0) {
          setSelectedYear(response.data[0].year);  // 첫 번째 년도로 초기화
        }
      } catch (err) {
        console.error('Failed to fetch available years:', err);
      }
    };

    loadAvailableYears();
  }, [selectedDesign]);

  useEffect(() => {
    const loadMonthlyData = async () => {
      if (selectedYear) {
        try {
          const response = await fetchMonthlyWorkAmount(selectedYear, selectedDesign);
          setMonthlyData(response.data);
        } catch (err) {
          console.error('Failed to fetch monthly work amount data:', err);
        }
      }
    };

    loadMonthlyData();
  }, [selectedYear, selectedDesign]);

  // 데이터 가져오는 함수
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (selectedDesign === 'structure') {
        response = await fetchStructureComplianceData();
      } else {
        response = await fetchOutfittingComplianceData();
      }
      setScheduleComplianceData(response.data);
    } catch (err) {
      console.error('Error fetching schedule compliance data:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDesign]);

  // 데이터를 가공하여 비율을 계산하는 함수
  const processPartnerData = (data) => {
    const processedData = [];
    const dpbomMap = new Map();

    data.forEach(item => {
      const dpbomDetail = item.dpbom_details.trim();
      const partnerCode = item.partner_code.trim();
      const workAmount = item.work_amount;

      if (!dpbomMap.has(dpbomDetail)) {
        dpbomMap.set(dpbomDetail, new Map());
      }

      const partnerMap = dpbomMap.get(dpbomDetail);
      partnerMap.set(partnerCode, (partnerMap.get(partnerCode) || 0) + workAmount);
    });

    dpbomMap.forEach((partnerMap, dpbomDetail) => {
      const totalWorkAmount = Array.from(partnerMap.values()).reduce((sum, amount) => sum + amount, 0);
      
      partnerMap.forEach((workAmount, partnerCode) => {
        const workPercentage = (workAmount / totalWorkAmount) * 100;
        processedData.push({
          dpbom_details: dpbomDetail,
          partner_code: partnerCode,
          work_percentage: workPercentage
        });
      });
    });

    return processedData;
  };

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (selectedDesign === 'structure') {
        response = await fetchStructureDesignData();
      } else {
        response = await fetchOutfittingDesignData();
      }

      const processedData = processData(response.data, selectedDesign);
      setVisualizationData(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('데이터를 불러오는데 실패했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [selectedDesign]);

// orange-section에 대한 데이터 가져오기 (구조설계 또는 의장설계에 따라)
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (selectedDesign === 'structure') {
        response = await fetchStructurePartnerParticipation();
      } else {
        response = await fetchOutfittingPartnerParticipation();
      }
      const processedData = processPartnerData(response.data);
      setPartnerData(processedData);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [selectedDesign]);

const processData = (data, selectedDesign) => {
    const detailsMap = new Map();
  
    data.forEach(item => {
      const dpbomDetail = item.dpbom_details.trim();
      const department = item.direct_department.trim();
  
      if (!detailsMap.has(dpbomDetail)) {
        detailsMap.set(dpbomDetail, {
          dpbom_details: dpbomDetail,
          departments: {}
        });
      }
      const detailData = detailsMap.get(dpbomDetail);
  
      if (!detailData.departments[department]) {
        detailData.departments[department] = 0;
      }
      detailData.departments[department] += item.work_amount;
    });
  
    let sortOrder = [];
    if (selectedDesign === 'structure') {
      sortOrder = ['가공', '공작', '족장', '의장', '재마킹', '철의장', '도장'];
    } else if (selectedDesign === 'outfitting') {
      sortOrder = ['계획', '목의', 'Supp 제작', '제작', '의장', '의장(설치)', '철의장'];
    }
  
    const sortedData = Array.from(detailsMap.values()).sort((a, b) => {
      const indexA = sortOrder.indexOf(a.dpbom_details);
      const indexB = sortOrder.indexOf(b.dpbom_details);
  
      if (indexA === -1 && indexB === -1) {
        return a.dpbom_details.localeCompare(b.dpbom_details, 'ko');
      } else if (indexA === -1) {
        return 1;
      } else if (indexB === -1) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });
  
  
    return sortedData;
  };
  

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="design-structure">
      <Header />
      <main className="design-structure-main-content">
        <select value={selectedDesign} onChange={(e) => setSelectedDesign(e.target.value)}>
          <option value="structure">구조설계</option>
          <option value="outfitting">의장설계</option>
        </select>
        <section className="design-structure-page red-section">
          <div className="visualization-container">
            {visualizationData.map((item) => (
              <VisualizationComponent 
                key={item.dpbom_details} 
                dpbomDetails={item.dpbom_details} 
                departmentData={item.departments} 
              />
            ))}
          </div>
        </section>
        <div className="design-structure-content-row">
        <section className="design-structure-page orange-section">
          <PartnerParticipationVisualization data={partnerData} designType={selectedDesign} />
        </section>
        <section className="purple-section">
          <ScheduleComplianceVisualization data={scheduleComplianceData} />
        </section>
        </div>
        <div className="design-structure-content-row">
          <section className="green-section">
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <MonthlyWorkAmountVisualization 
              data={monthlyData} 
              selectedYear={selectedYear} 
            />
          </section>
          <section className="design-structure-page blue-section">
            <FutureWorkPredictionVisualization data={predictionData} />
        </section>
        </div>
      </main>
    </div>
  );
}

export default DesignStructure;
