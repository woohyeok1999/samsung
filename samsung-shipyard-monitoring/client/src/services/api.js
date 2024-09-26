import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const api = axios.create({
  baseURL: isProduction ? process.env.REACT_APP_API_URL : 'https://localhost:5000',
  withCredentials: true
});

// Axios 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;