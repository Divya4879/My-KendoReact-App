// src/components/ProgressChart.tsx
import React, { useState } from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from '@progress/kendo-react-charts';
import '@progress/kendo-theme-default/dist/all.css';

// Utility function to get the current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Utility function to get the start of the current week (Monday)
const getStartOfWeek = (): Date => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(today.setDate(diff));
};

// Utility function to get the dates for the current week in YYYY-MM-DD
const getWeekDates = (): string[] => {
  const startOfWeek = getStartOfWeek();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Custom hook to manage localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  };

  return [storedValue, setValue];
}

// Component to add a study session
const AddStudySession: React.FC<{ onAddSession: (date: string, duration: number) => void }> = ({
  onAddSession,
}) => {
  const [date, setDate] = useState<string>(getCurrentDate());
  const [duration, setDuration] = useState<number | ''>('');

  const handleAddSession = () => {
    if (duration && duration > 0) {
      onAddSession(date, duration);
      setDuration('');
    } else {
      alert('Please enter a valid duration.');
    }
  };

  return (
    <div style={{ 
      margin: "1.5rem auto", 
      padding: "1rem",
      maxWidth: "600px",
      backgroundColor: "#e6f2e6",
      borderRadius: "8px",
      border: "1px solid #b3d7b3",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "Roboto, sans-serif"
    }}>
      <h2 style={{ 
        fontSize: "1.5rem", 
        fontWeight: "bold", 
        color: "#1b5e20", 
        marginBottom: "1rem", 
        textAlign: "center" 
      }}>
        Add Study Session
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <label style={{ flex: "1 1 100px", color: "#1b5e20", fontWeight: "bold" }}>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={getCurrentDate()}
            style={{
              marginLeft: "0.5rem",
              padding: "0.4rem",
              borderRadius: "4px",
              border: "1px solid #b3d7b3",
              backgroundColor: "#f1f8e9",
              color: "#1b5e20"
            }}
          />
        </label>
        <label style={{ flex: "1 1 120px", color: "#1b5e20", fontWeight: "bold" }}>
          Duration (min):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{
              marginLeft: "0.5rem",
              padding: "0.4rem",
              borderRadius: "4px",
              border: "1px solid #b3d7b3",
              backgroundColor: "#f1f8e9",
              color: "#1b5e20",
              width: "80px"
            }}
          />
        </label>
        <button
          onClick={handleAddSession}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#a5d6a7",
            border: "none",
            borderRadius: "4px",
            color: "#1b5e20",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "0.5rem"
          }}
        >
          Add Session
        </button>
      </div>
    </div>
  );
};

// Main component to display the progress chart
const ProgressChart: React.FC = () => {
  const [sessions, setSessions] = useLocalStorage<{ date: string; duration: number }[]>('studySessions', []);

  // Function to add a new study session
  const addSession = (date: string, duration: number) => {
    setSessions((prevSessions) => [...prevSessions, { date, duration }]);
  };

  // Calculate total study time for each day of the current week
  const weekDates = getWeekDates();
  const weeklyData = weekDates.map((date) => {
    const dailySessions = sessions.filter((session) => session.date === date);
    const totalDuration = dailySessions.reduce((sum, session) => sum + session.duration, 0);
    return { date, totalDuration };
  });

  // Convert weekDates to Date objects for chart categories
  const categoryDates = weekDates.map((d) => new Date(d));

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", padding: "2rem" }}>
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "1rem", 
        fontSize: "2rem", 
       
      }}>
        Weekly Study Pulse
      </h1>
      <AddStudySession onAddSession={addSession} />
      <div style={{ 
        margin: "1.5rem auto", 
        maxWidth: "800px", 
        backgroundColor: "#f1f8e9", 
        borderRadius: "8px",
        border: "1px solid #b3d7b3",
        padding: "1rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <Chart style={{ height: "400px" }}>
          
          <ChartCategoryAxis>
            <ChartCategoryAxisItem
              categories={categoryDates}
              // Format the labels to show only Month and Day, e.g. "Mar 22"
              labels={{
                format: '{0:MMM dd}',
                color: "#1b5e20",
                font: "14px Roboto, sans-serif",
                rotation: 0
              }}
              line={{ color: "#b3d7b3" }}
              majorGridLines={{ visible: false }}
              title={{ text: 'Date', color: "#1b5e20", font: "bold 16px Roboto, sans-serif" }}
            />
          </ChartCategoryAxis>
          <ChartSeries>
            <ChartSeriesItem
              type="column"
              data={weeklyData.map((data) => data.totalDuration)}
              name="Study Duration (minutes)"
              color="#a5d6a7"
              labels={{
                visible: true,
                background: "transparent",
                color: "#1b5e20",
                format: "{0}"
              }}
            />
          </ChartSeries>
        </Chart>
      </div>
    </div>
  );
};

export default ProgressChart;
