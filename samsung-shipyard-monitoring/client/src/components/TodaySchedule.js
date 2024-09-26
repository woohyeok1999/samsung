import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodaySchedule = () => {
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    fetchTodayEvents();
  }, []);

  // 로컬 스토리지에서 체크박스 상태를 저장하고 불러오기
  const loadCheckboxState = (id) => {
    const savedState = localStorage.getItem(`event-${id}`);
    return savedState ? JSON.parse(savedState) : false;
  };

  const saveCheckboxState = (id, checked) => {
    localStorage.setItem(`event-${id}`, JSON.stringify(checked));
  };

  const fetchTodayEvents = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/calendar/today');
      const eventsWithState = response.data.map(event => ({
        ...event,
        checked: loadCheckboxState(event.id)
      }));
      setTodayEvents(eventsWithState);
    } catch (error) {
      console.error('Error fetching today\'s events:', error);
    }
  };

  // 체크박스 상태 변경 함수
  const handleCheckboxChange = (id, checked) => {
    setTodayEvents(prevEvents => prevEvents.map(event =>
      event.id === id ? { ...event, checked } : event
    ));
    saveCheckboxState(id, checked);
  };

  // 현재 시간과 비교하여 일정이 지난 경우 비활성화
  const isEventExpired = (eventTime) => {
    const now = new Date(); // 현재 날짜와 시간
    const [hours, minutes] = eventTime.split(':').map(Number); // 시간 분리
    const eventDate = new Date(); // 오늘의 날짜 사용
    eventDate.setHours(hours, minutes, 0, 0); // 일정 시간 설정

    return eventDate < now; // 일정 시간이 현재 시간보다 이전인지 확인
  };

  return (
    <>
      <h3>Today's Schedule</h3>
      {todayEvents.length > 0 ? (
        <ul>
          {todayEvents.map((event, index) => {
            const expired = isEventExpired(event.eventTime);
            const checkboxDisabled = expired;
            const textClass = expired ? 'event-text disabled' : 'event-text';

            return (
              <li key={index} className="event-card">
                <input
                  type="checkbox"
                  checked={event.checked}
                  disabled={checkboxDisabled}
                  onChange={(e) => handleCheckboxChange(event.id, e.target.checked)}
                  className="event-checkbox"
                />
                <span className={`${textClass} event-time`}>{event.eventTime}</span>
                <span className={`${textClass} event-title`}>{event.title}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No events scheduled for today.</p>
      )}
    </>
  );
};

export default TodaySchedule;
