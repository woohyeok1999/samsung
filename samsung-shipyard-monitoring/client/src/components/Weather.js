import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState('날씨 정보를 불러오는 중입니다...'); // 위치 정보 상태 추가
    const h2Ref = useRef(null);  // h2 태그를 위한 ref 생성
  
    useEffect(() => {
      const fetchWeather = async () => {
        try {
          const response = await axios.get('https://localhost:5000/api/weather');
          setWeatherData(response.data);
          setLoading(false);
          // DOM에서 직접 h2 태그의 내용을 읽어 상태 업데이트
          if (h2Ref.current) {
            setLocation(h2Ref.current.textContent);
        }
        } catch (error) {
          console.error('Error fetching weather:', error);
          setError('날씨 정보를 불러오는데 실패했습니다.');
          setLoading(false);
        }
      };
  
      fetchWeather();
    }, []);

    useEffect(() => {
      if (h2Ref.current) {
          setLocation(h2Ref.current.textContent);
          h2Ref.current.style.display = 'none'; // h2 태그를 숨깁니다.
      }
    }, [h2Ref.current]);
  
    if (loading) return <div className="loading">로딩 중...</div>;
    if (error) return <div className="error">에러: {error}</div>;
  
    const { todayDetails, dailyForecast } = weatherData || { todayDetails: {}, dailyForecast: [] }; // 데이터가 없는 경우를 대비한 기본값 설정
    
    return (
      <div className="weather-card">
        <h2 ref={h2Ref} className="Card--cardHeading--2H1-_">오늘 거제시, 경상남도의 날씨 예보</h2>
        <div className="card-header">{location}</div>
        <div className="main-info">
          <div className="temperature">
            <WeatherIcon name={todayDetails.currentCondition} size="large" />
            <span className="current-temp">{todayDetails.currentTemp}</span>
          </div>
          <div className="sun-times">
            <div><WeatherIcon name="sunrise" /> {todayDetails.sunrise}</div>
            <div><WeatherIcon name="sunset" /> {todayDetails.sunset}</div>
          </div>
        </div>
        <div className="weather-details">
          <WeatherItem icon="thermometer" label="체감온도" value={todayDetails.feelsLike} />
          <WeatherItem icon="wind" label="바람" value={todayDetails.wind} />
          <WeatherItem icon="droplet" label="습도" value={todayDetails.humidity} />
          <WeatherItem icon="sun" label="자외선 지수" value={todayDetails.uvIndex} />
        </div>
        <div className="daily-forecast">
          <h3>일일 예보</h3>
          <ul className="forecast-list">
            {dailyForecast.map((day, index) => (
              <ForecastItem key={index} {...day} />
            ))}
          </ul>
        </div>
      </div>
    );
  };

const WeatherItem = ({ icon, label, value }) => {
    let displayValue = value;
  
    // 바람 정보에 대한 특별한 처리
    if (label === "바람") {
      const matches = value.match(/(\d+)\s*km\/h/); // 첫 번째 km/h와 숫자를 추출
      if (matches) {
        displayValue = `${matches[1]} km/h`; // 첫 번째 km/h 값만 사용
      }
    }
  
    return (
      <div className="weather-item">
        <WeatherIcon name={icon} />
        <div>
          <div className="weather-label">{label}</div>
          <div className="weather-value">{displayValue}</div>
        </div>
      </div>
    );
  };

const ForecastItem = ({ day, icon, highTemp, lowTemp, precipitation }) => {
    // 강수확률 데이터에서 "Rain"을 제거하고, "강수확률"만 사용
    const cleanPrecipitation = precipitation.replace(/Rain\d*%/i, '').trim();
  
    return (
      <li className="forecast-item">
        <div className="forecast-day">{day}</div>
        <WeatherIcon name={icon} />
        <div className="forecast-temp">{highTemp}/{lowTemp}</div>
        <div className="forecast-precip">{cleanPrecipitation}</div>
      </li>
    );
  };

const WeatherIcon = ({ name, size = "normal" }) => (
  <svg className={`weather-icon ${size}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {getIconPath(name)}
  </svg>
);

const getIconPath = (name) => {
  const icons = {
    thermometer: <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />,
    wind: <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />,
    droplet: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
    sun: <>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </>,
    sunrise: <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="8 6 12 2 16 6" />
    </>,
    sunset: <>
      <path d="M17 18a5 5 0 0 0-10 0" />
      <line x1="12" y1="9" x2="12" y2="2" />
      <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
      <line x1="1" y1="18" x2="3" y2="18" />
      <line x1="21" y1="18" x2="23" y2="18" />
      <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
      <line x1="23" y1="22" x2="1" y2="22" />
      <polyline points="16 5 12 9 8 5" />
    </>,
    cloudy: <>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </>,
    rainy: <>
      <line x1="16" y1="13" x2="16" y2="21" />
      <line x1="8" y1="13" x2="8" y2="21" />
      <line x1="12" y1="15" x2="12" y2="23" />
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
    </>,
    // Add more icons as needed
    Cloudy: <>
      <path d="M3.5 17.5h17a5.5 5.5 0 0 0 0-11h-.711a7.503 7.503 0 0 0-14.577 0H3.5a5.5 5.5 0 0 0 0 11z" />
    </>,
    "Mostly Cloudy": <>
      <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor"/>
      <path d="M20 10.5h-1.26a7 7 0 0 0-12.477-3 5.5 5.5 0 0 0-.763 10.99" fill="none" stroke="currentColor"/>
    </>,
    "Partly Cloudy": <>
      <circle cx="17" cy="9" r="3" fill="none" stroke="currentColor"/>
      <path d="M15 19.5h5a4.5 4.5 0 0 0 0-9h-.5a6.5 6.5 0 0 0-12.995.25" fill="none" stroke="currentColor"/>
    </>,
    Sunny: <>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor"/>
      <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor"/>
      <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor"/>
      <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor"/>
      <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" stroke="currentColor"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="currentColor"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" stroke="currentColor"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" stroke="currentColor"/>
    </>,
    "Mostly Sunny": <>
      <circle cx="17" cy="9" r="4" fill="none" stroke="currentColor"/>
      <path d="M7 19.5h14a4.5 4.5 0 0 0 0-9h-1" fill="none" stroke="currentColor"/>
    </>,
    "Scattered Showers": <>
      <path d="M7.5 22.5s1-3 4.5-3 4.5 3 4.5 3" fill="none" stroke="currentColor"/>
      <path d="M12 6v1M15.364 7.364l-.707.707M18 12h-1M15.364 16.636l-.707-.707M12 18v-1M8.636 16.636l.707-.707M6 12h1M8.636 7.364l.707.707" fill="none" stroke="currentColor"/>
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor"/>
    </>,
    // Add more icons as needed
  };
  return icons[name] || null;
};

export default Weather;