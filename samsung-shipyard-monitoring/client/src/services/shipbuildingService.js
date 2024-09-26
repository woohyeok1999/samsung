import axios from 'axios';

const BASE_URL = '/api/shipbuilding';

export const getShipbuildingProcessData = async (vesselId) => {
  try {
    const response = await axios.get(`${BASE_URL}/process/${vesselId}`);
    return response.data;
  } catch (error) {
    console.error('조선 공정 데이터 가져오기 오류:', error);
    throw error;
  }
};