import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { NumericTextBox, NumericTextBoxChangeEvent } from '@progress/kendo-react-inputs';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '@progress/kendo-theme-default/dist/all.css';

const PomodoroTimer: React.FC = () => {
  // Duration in seconds (default 25 minutes)
  const [duration, setDuration] = useState<number>(25 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Reference for audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Timer reference (using window.setInterval returns a number)
  const timerRef = useRef<number | null>(null);

  // Timer effect: update every second when active
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (interval !== null) clearInterval(interval);
      setIsActive(false);
      // Restart audio if the session is ongoing
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Control audio playback when the active state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isActive) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive]);

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
    }
    setIsActive(prev => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleDurationChange = (e: NumericTextBoxChangeEvent) => {
    // e.value is number | null; default to 25 if null.
    const value = e.value !== null ? e.value : 25;
    if (value >= 25 && value <= 120) {
      const newDuration = value * 60;
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate percentage for the circular progress bar.
  const percentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Pomodoro Timer</h1>
      {/* Circular Progress Indicator */}
      <div style={{ width: '200px', height: '200px', margin: '0 auto' }}>
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: 'var(--text-color)',
            pathColor: 'lightgreen',
            trailColor: 'green',
          })}
        />
      </div>
      {/* Duration Input */}
      <div style={{ marginTop: '20px'}}>
        <NumericTextBox
          value={duration / 60}
          onChange={handleDurationChange}
          format="n0"
          min={25}
          max={120}
          step={1}
          width="100px"
          disabled={isActive}
        />
        <span style={{ marginLeft: '10px' }}>minutes</span>
      </div>
      {/* Control Buttons */}
      <div style={{ marginTop: '20px' }}>
        <Button
        style={{
          zIndex: 10,
          fontSize: '1rem',
          fontWeight: 'bold',
          marginLeft: '10px'
          }}
           onClick={handleStartPause}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button
        style={{
        zIndex: 10,
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: '10px'
        }}
        onClick={handleReset}>
          Reset
        </Button>
      </div>
      {/* Audio Element */}
      <audio ref={audioRef} src="/pomodoro.mp3" loop />
    </div>
  );
};

export default PomodoroTimer;
