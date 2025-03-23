import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { TimePicker } from '@progress/kendo-react-dateinputs';
import { Notification } from '@progress/kendo-react-notification';
import '@progress/kendo-theme-default/dist/all.css';

interface Session {
  id: number;
  start: number; 
  end: number;   
  status: 'upcoming' | 'reminder' | 'ongoing' | 'completed' | 'skipped';
  remindersCount: number;
}

const STORAGE_KEY = 'studySessions';

const combineWithToday = (time: Date): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    time.getHours(),
    time.getMinutes(),
    time.getSeconds()
  );
};

const StudyScheduler: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newSessionStart, setNewSessionStart] = useState<Date | null>(null);
  const [newSessionEnd, setNewSessionEnd] = useState<Date | null>(null);
  const [notificationSession, setNotificationSession] = useState<Session | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (
            session.status === 'upcoming' &&
            now >= session.start - 5 * 60 * 1000 &&
            now < session.start
          ) {
            return { ...session, status: 'reminder' };
          }
          if (session.status === 'ongoing' && now >= session.end) {
            return { ...session, status: 'completed' };
          }
          return session;
        })
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = Date.now();
    const sessionForReminder = sessions.find(
      (session) =>
        session.status === 'reminder' && now >= session.start - 5 * 60 * 1000
    );
    setNotificationSession(sessionForReminder || null);
  }, [sessions]);

  const handleAddSession = () => {
    if (!newSessionStart || !newSessionEnd) return;
    const now = Date.now();
    const today = new Date();
    const startDate = combineWithToday(newSessionStart);
    const endDate = combineWithToday(newSessionEnd);

    if (startDate.getTime() <= now) {
      alert("Error: Session start time must be in the future (at least 1 minute from now).");
      return;
    }
    if (startDate.toDateString() !== today.toDateString()) {
      alert("Error: Session must be scheduled for today.");
      return;
    }

    const duration = endDate.getTime() - startDate.getTime();
    if (duration < 30 * 60 * 1000 || duration > 120 * 60 * 1000) {
      alert("Error: Session duration must be between 30 and 120 minutes.");
      return;
    }

    const overlappingSession = sessions.find((session) => {
      return !(endDate.getTime() <= session.start || startDate.getTime() >= session.end);
    });
    if (overlappingSession) {
      alert("Error: The new session overlaps with an existing session. Please choose a different time.");
      return;
    }

    const newSession: Session = {
      id: sessions.length ? sessions[sessions.length - 1].id + 1 : 1,
      start: startDate.getTime(),
      end: endDate.getTime(),
      status: 'upcoming',
      remindersCount: 0,
    };

    setSessions([...sessions, newSession]);
    scheduleNotification(newSession);
    setShowDialog(false);
    setNewSessionStart(null);
    setNewSessionEnd(null);
  };

  const scheduleNotification = (session: Session) => {
    const now = Date.now();
    const timeUntilStart = session.start - now;
    if (timeUntilStart > 5 * 60 * 1000) {
      setTimeout(() => setNotificationSession(session), timeUntilStart - 5 * 60 * 1000);
    }
  };

  const handleNotificationOk = (sessionId: number) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, status: 'ongoing' } : session
      )
    );
    setNotificationSession(null);
  };

  const handleNotificationDismiss = (sessionId: number) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const newCount = session.remindersCount + 1;
          if (newCount >= 10 || Date.now() >= session.start + 5 * 60 * 1000) {
            return { ...session, status: 'skipped', remindersCount: newCount };
          }
          return { ...session, remindersCount: newCount };
        }
        return session;
      })
    );
    setNotificationSession(null);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all session history?")) {
      setSessions([]);
    }
  };

  const getSessionColor = (status: Session['status']): string => {
    switch (status) {
      case 'completed':
        return '#43a047'; // green
      case 'skipped':
        return '#e53935'; // red
      case 'ongoing':
        return '#1e88e5'; // blue
      case 'reminder':
        return '#ffa726'; // orange
      case 'upcoming':
      default:
        return '#cddc39'; // lime
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Roboto, sans-serif',
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-color)'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        color: 'var(--header-text)', 
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Study Scheduler
      </h1>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Button
          onClick={() => setShowDialog(true)}
          style={{
            backgroundColor: 'var(--button-bg)',
            border: 'none',
            color: 'var(--button-text)',
            fontWeight: 'bold',
            marginRight: '1rem'
          }}
        >
          Schedule New Session
        </Button>
        <Button
          onClick={handleClearHistory}
          style={{
            backgroundColor: 'var(--primary-color)',
            border: 'none',
            color: '#fff',
            fontWeight: 'bold'
          }}
        >
          Clear Session History
        </Button>
      </div>

      {showDialog && (
        <Dialog
          title="Schedule Session (Today Only)"
          onClose={() => setShowDialog(false)}
          style={{
            minWidth: '400px',
            
            fontFamily: 'Roboto, sans-serif',
            margin: '0 auto',
            backgroundColor: 'var(--window-bg)',
            border: `1px solid var(--window-border)`
          }}
        >
          <div style={{ marginBottom: '1rem', color: 'green', textAlign: 'left' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select start time (must be future today):
            </p>
            <div style={{ 
              width: '100%',
              border: `1px solid var(--window-border)`,
              backgroundColor: 'var(--bg-color)',
              borderRadius: '4px',
              padding: '0.5rem',
              boxSizing: 'border-box'
            }}>
              <TimePicker
                value={newSessionStart}
                onChange={(e) => setNewSessionStart(e.value as Date)}
                format="HH:mm"
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem', color: 'green', textAlign: 'left' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select end time (30 to 120 minutes later):
            </p>
            <div style={{ 
              width: '100%',
              border: `1px solid var(--window-border)`,
              backgroundColor: 'var(--bg-color)',
              borderRadius: '4px',
              padding: '0.5rem',
              boxSizing: 'border-box'
            }}>
              <TimePicker
                value={newSessionEnd}
                onChange={(e) => setNewSessionEnd(e.value as Date)}
                format="HH:mm"
              />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <DialogActionsBar>
              <Button
                onClick={handleAddSession}
                style={{
                  backgroundColor: 'var(--button-bg)',
                  border: 'none',
                  color: 'var(--button-text)',
                  fontWeight: 'bold',
                  marginRight: '1rem'
                }}
              >
                Add Session
              </Button>
              <Button
                onClick={() => setShowDialog(false)}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </Button>
            </DialogActionsBar>
          </div>
        </Dialog>
      )}

      {notificationSession && (
        <Notification
          type={{ style: 'warning', icon: true }}
          closable={true}
          onClose={() => setNotificationSession(null)}
          style={{
            position: 'fixed',
            top: '12rem',
            right: '1rem',
            zIndex: 3000,
            width: '300px',
            borderRadius: '8px',
            backgroundColor: 'var(--notification-bg)',
            border: `1px solid var(--notification-border)`
          }}
        >
          <p style={{ margin: 0, color: 'var(--header-text)' }}>
            <strong>Session {notificationSession.id}</strong> starts at{' '}
            {new Date(notificationSession.start).toLocaleTimeString()}.
          </p>
          <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
            <Button
              onClick={() => handleNotificationOk(notificationSession.id)}
              style={{
                backgroundColor: 'var(--button-bg)',
                border: 'none',
                color: 'var(--button-text)',
                fontWeight: 'bold',
                marginRight: '0.5rem'
              }}
            >
              OK, Start
            </Button>
            <Button
              onClick={() => handleNotificationDismiss(notificationSession.id)}
              style={{
                backgroundColor: '#ffd54f',
                border: 'none',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              Dismiss
            </Button>
          </div>
        </Notification>
      )}

      <div style={{
        marginTop: '2rem',
        backgroundColor: 'var(--window-bg)',
        border: `1px solid var(--window-border)`,
        borderRadius: '8px',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          color: 'var(--header-text)', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          Your Sessions
        </h2>
        {sessions.length === 0 ? (
          <p style={{ color: 'var(--text-color)', textAlign: 'center' }}>No sessions scheduled yet.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              style={{
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                backgroundColor: getSessionColor(session.status),
                color: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ margin: 0, fontWeight: 'bold' }}>
                Session {session.id}: {new Date(session.start).toLocaleTimeString()} -{' '}
                {new Date(session.end).toLocaleTimeString()}
              </p>
              <p style={{ margin: 0 }}>Status: {session.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudyScheduler;
