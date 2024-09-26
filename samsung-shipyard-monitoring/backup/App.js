import React, { useState } from 'react';
import Header from './components/Header';
import LoadStatusChart from './components/LoadStatusChart';
import Summary from './components/Summary';
import TodaySchedule from './components/TodaySchedule';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import ShipbuildingStatus from './components/ShipbuildingStatus';
import './App.css';

function App({ onLogout }) {
  const [selectedLocation, setSelectedLocation] = useState('');

  return (
    <div className="App">
      <Header onLogout={onLogout} />
      <div className="main-content">
        <div className="left-section">
          <div className="top-row">
            <div className="chart-section">
              <LoadStatusChart onLocationChange={setSelectedLocation} />
            </div>
            <div className="summary-section">
              <Summary selectedLocation={selectedLocation} />
            </div>
          </div>
          <div className="bottom-row">
            <ShipbuildingStatus />
          </div>
        </div>
        <div className="right-section">
          <div className="top-row">
            <div className="schedule-section">
              <TodaySchedule />
            </div>
            <div className="todo-section">
              <TodoList />
            </div>
          </div>
          <div className="bottom-row">
            <div className="calendar-section">
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;