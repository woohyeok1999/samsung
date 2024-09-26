import axios from 'axios';

const API_URL = 'https://localhost:5000/api';

export const getDefectRateData = async (selectedMenu) => {
    try {
      console.log(`Requesting data from: ${API_URL}/defect-rate/${selectedMenu}`);
      const response = await axios.get(`${API_URL}/defect-rate/${selectedMenu}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching defect rate data:', error);
      throw error;
    }
  };

//-----------------------
export const getDefectData = async (projectNumber) => {
    try {
        const response = await axios.get(`${API_URL}/defect-rate/green-section/${projectNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching defect data:', error);
        throw error;
    }
};

export const updateDefectData = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/defect-rate/green-section/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating defect data:', error);
        throw error;
    }
};

export const deleteDefectData = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/defect-rate/green-section/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting defect data:', error);
        throw error;
    }
};

export const addDefectData = async (newData) => {
    try {
        const response = await axios.post(`${API_URL}/defect-rate/green-section`, newData);
        return response.data;
    } catch (error) {
        console.error('Error adding defect data:', error);
        throw error;
    }
};

export const getShapData = async () => {
    try {
        const response = await axios.get(`${API_URL}/defect-rate/blue-section/shap-analysis`);
        return response.data;
    } catch (error) {
        console.error('Error fetching SHAP data:', error);
        throw error;
    }
};
