import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:5000';

export const fetchStructureDesignData = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/structure-design`, { withCredentials: true });
};

export const fetchOutfittingDesignData = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/outfitting-design`, { withCredentials: true });
};

// 구조설계 협력사 참여 데이터 호출
export const fetchStructurePartnerParticipation = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/structure-partner-participation`, { withCredentials: true });
};

// 의장설계 협력사 참여 데이터 호출
export const fetchOutfittingPartnerParticipation = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/outfitting-partner-participation`, { withCredentials: true });
};

export const fetchStructureComplianceData = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/structure-compliance`, { withCredentials: true });
};

export const fetchOutfittingComplianceData = () => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/outfitting-compliance`, { withCredentials: true });
};

export const fetchMonthlyWorkAmount = (year, designType) => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/monthly-work-amount`, {
    params: { year, designType },
    withCredentials: true
  });
};

// 사용 가능한 년도 목록을 가져오는 API
export const fetchAvailableYears = (designType) => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/available-years`, {
    params: { designType },
    withCredentials: true
  });
};

export const fetchFutureWorkPrediction = (designType) => {
  return axios.get(`${API_BASE_URL}/api/dpbom-department/future-work-prediction`, {
    params: { designType },
    withCredentials: true
  });
};