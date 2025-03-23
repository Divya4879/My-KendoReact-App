"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@progress/kendo-react-buttons"
import "@progress/kendo-theme-default/dist/all.css"

interface Reminder {
  id: number
  time: string // in "HH:mm" format
  snoozeCount: number
}

const STORAGE_KEY = "studyReminders"
const MAX_SNOOZE_COUNT = 3
const SNOOZE_DELAY_MS = 60000 // 1 minute

const StudyReminder: React.FC = () => {
  // State for reminders
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, time: "", snoozeCount: 0 },
    { id: 2, time: "", snoozeCount: 0 },
    { id: 3, time: "", snoozeCount: 0 },
  ])
  const [showPopup, setShowPopup] = useState(false)
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null)

  // Refs to hold timer IDs so we can clear and reschedule if needed
  const reminderTimers = useRef<{ [key: number]: number }>({})

  // Load saved reminders on mount
  useEffect(() => {
    try {
      // Try to load reminder 1
      const storedTime1 = localStorage.getItem("reminderTime1")
      if (storedTime1) {
        setReminders((prev) => prev.map((r) => (r.id === 1 ? { ...r, time: storedTime1 } : r)))
      }

      // Try to load reminder 2
      const storedTime2 = localStorage.getItem("reminderTime2")
      if (storedTime2) {
        setReminders((prev) => prev.map((r) => (r.id === 2 ? { ...r, time: storedTime2 } : r)))
      }

      // Try to load reminder 3
      const storedTime3 = localStorage.getItem("reminderTime3")
      if (storedTime3) {
        setReminders((prev) => prev.map((r) => (r.id === 3 ? { ...r, time: storedTime3 } : r)))
      }
    } catch (error) {
      console.error("Failed to load stored reminders:", error)
    }
  }, [])

  // Schedule reminders whenever they change
  useEffect(() => {
    // Clear all existing timers
    Object.values(reminderTimers.current).forEach((timerId) => clearTimeout(timerId))
    reminderTimers.current = {}

    // Schedule all reminders
    reminders.forEach((reminder) => {
      if (reminder.time) {
        scheduleDailyReminder(reminder)
      }
    })

    // Cleanup on unmount: clear any scheduled timeouts
    return () => {
      Object.values(reminderTimers.current).forEach((timerId) => clearTimeout(timerId))
    }
  }, [reminders])

  // Helper: Combine today's date with the given time (HH:mm)
  const combineWithToday = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0)
  }

  // Helper: Calculate next occurrence for the given time (if today passed, schedule tomorrow)
  const getNextOccurrence = (timeStr: string): Date => {
    const reminderDate = combineWithToday(timeStr)
    const now = new Date()

    if (reminderDate <= now) {
      // If the time today has passed, add one day
      reminderDate.setDate(reminderDate.getDate() + 1)
    }

    return reminderDate
  }

  // Function to schedule a daily reminder
  const scheduleDailyReminder = (reminder: Reminder) => {
    if (!reminder.time) return

    // Clear any existing timer for this reminder
    if (reminderTimers.current[reminder.id]) {
      clearTimeout(reminderTimers.current[reminder.id])
    }

    const nextReminder = getNextOccurrence(reminder.time)
    const now = new Date()

    // Subtract 10 seconds to trigger slightly before the actual time
    const timeout = nextReminder.getTime() - now.getTime() - 10000

    if (timeout <= 0) {
      console.warn("Invalid timeout value:", timeout)
      return
    }

    // Schedule the reminder
    reminderTimers.current[reminder.id] = window.setTimeout(() => {
      setActiveReminder(reminder)
      setShowPopup(true)
    }, timeout)
  }

  // Handler for time input changes
  const handleTimeChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setReminders((prev) => prev.map((r) => (r.id === 1 ? { ...r, time: newTime } : r)))
  }

  const handleTimeChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setReminders((prev) => prev.map((r) => (r.id === 2 ? { ...r, time: newTime } : r)))
  }

  const handleTimeChange3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setReminders((prev) => prev.map((r) => (r.id === 3 ? { ...r, time: newTime } : r)))
  }

  // Handler to set/update a reminder
  const handleSetReminder = (id: number) => {
    const reminder = reminders.find((r) => r.id === id)
    if (reminder && reminder.time) {
      // Save to localStorage
      localStorage.setItem(`reminderTime${id}`, reminder.time)

      // Schedule the reminder
      scheduleDailyReminder(reminder)
    }
  }

  // Handler to delete a reminder
  const handleDeleteReminder = (id: number) => {
    if (reminderTimers.current[id]) {
      clearTimeout(reminderTimers.current[id])
    }

    // Remove from localStorage
    localStorage.removeItem(`reminderTime${id}`)

    // Update state
    setReminders((prev) => prev.map((reminder) => (reminder.id === id ? { ...reminder, time: "" } : reminder)))
  }

  // Handlers for reminder actions
  const handleStartSession = () => {
    if (!activeReminder) return

    // Close the popup
    setShowPopup(false)

    // Reset snooze count and reschedule for tomorrow
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === activeReminder.id ? { ...reminder, snoozeCount: 0 } : reminder)),
    )

    setActiveReminder(null)
  }

  const handleCancelForToday = () => {
    if (!activeReminder) return

    // Close the popup
    setShowPopup(false)

    // Reset snooze count (it will automatically reschedule for tomorrow)
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === activeReminder.id ? { ...reminder, snoozeCount: 0 } : reminder)),
    )

    setActiveReminder(null)
  }

  const handleSnooze = () => {
    if (!activeReminder) return

    // Close the popup
    setShowPopup(false)

    // Increment snooze count
    const updatedReminder = {
      ...activeReminder,
      snoozeCount: Math.min(activeReminder.snoozeCount + 1, MAX_SNOOZE_COUNT),
    }

    setReminders((prev) => prev.map((reminder) => (reminder.id === activeReminder.id ? updatedReminder : reminder)))

    // If we haven't reached max snooze count, schedule a snooze
    if (updatedReminder.snoozeCount < MAX_SNOOZE_COUNT) {
      // Schedule a new reminder in 1 minute
      setTimeout(() => {
        setActiveReminder(updatedReminder)
        setShowPopup(true)
      }, SNOOZE_DELAY_MS)
    }

    setActiveReminder(null)
  }

  // Get the time value for each reminder
  const reminderTime1 = reminders.find((r) => r.id === 1)?.time || ""
  const reminderTime2 = reminders.find((r) => r.id === 2)?.time || ""
  const reminderTime3 = reminders.find((r) => r.id === 3)?.time || ""

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        fontFamily: "Roboto, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Daily Study Cue
      </h1>

      {/* Outer container for reminders */}
      <div
        style={{
          backgroundColor: "#f1f8e9",
          border: "1px solid #b3d7b3",
          borderRadius: "8px",
          padding: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Reminder 1 */}
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <input
            type="time"
            value={reminderTime1}
            onChange={handleTimeChange1}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #b3d7b3",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              color: "#1b5e20",
              width: "120px",
              textAlign: "center",
            }}
          />
          <Button
            onClick={() => handleSetReminder(1)}
            fillMode="solid"
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "4px",
              backgroundColor: "#a5d6a7",
              color: "#1b5e20",
              width: "180px",
            }}
          >
            Set/Update Reminder
          </Button>
          {reminderTime1 && (
            <Button
              onClick={() => handleDeleteReminder(1)}
              fillMode="flat"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.9rem",
                borderRadius: "4px",
                color: "#1b5e20",
                fontWeight: "bold",
                width: "80px",
              }}
            >
              Delete
            </Button>
          )}
        </div>

        {/* Reminder 2 */}
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <input
            type="time"
            value={reminderTime2}
            onChange={handleTimeChange2}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #b3d7b3",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              color: "#1b5e20",
              width: "120px",
              textAlign: "center",
            }}
          />
          <Button
            onClick={() => handleSetReminder(2)}
            fillMode="solid"
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "4px",
              backgroundColor: "#a5d6a7",
              color: "#1b5e20",
              width: "180px",
            }}
          >
            Set/Update Reminder
          </Button>
          {reminderTime2 && (
            <Button
              onClick={() => handleDeleteReminder(2)}
              fillMode="flat"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.9rem",
                borderRadius: "4px",
                color: "#1b5e20",
                fontWeight: "bold",
                width: "80px",
              }}
            >
              Delete
            </Button>
          )}
        </div>

        {/* Reminder 3 */}
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <input
            type="time"
            value={reminderTime3}
            onChange={handleTimeChange3}
            style={{
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #b3d7b3",
              backgroundColor: "#ffffff",
              fontSize: "1rem",
              color: "#1b5e20",
              width: "120px",
              textAlign: "center",
            }}
          />
          <Button
            onClick={() => handleSetReminder(3)}
            fillMode="solid"
            style={{
              padding: "0.5rem 1.2rem",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "4px",
              backgroundColor: "#a5d6a7",
              color: "#1b5e20",
              width: "180px",
            }}
          >
            Set/Update Reminder
          </Button>
          {reminderTime3 && (
            <Button
              onClick={() => handleDeleteReminder(3)}
              fillMode="flat"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.9rem",
                borderRadius: "4px",
                color: "#1b5e20",
                fontWeight: "bold",
                width: "80px",
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* POPUP MODAL */}
      {showPopup && activeReminder && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            width: "300px",
            zIndex: 1000,
            border: "1px solid #b3d7b3",
          }}
        >
          <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#1b5e20" }}>
            It's time to study!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button
              onClick={handleStartSession}
              fillMode="solid"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "4px",
                backgroundColor: "#a5d6a7",
                color: "#1b5e20",
              }}
            >
              Start Session
            </Button>
            <Button
              onClick={handleSnooze}
              fillMode="solid"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "4px",
                backgroundColor: "#e8f5e9",
                color: "#1b5e20",
                opacity: activeReminder.snoozeCount >= MAX_SNOOZE_COUNT ? 0.5 : 1,
                cursor: activeReminder.snoozeCount >= MAX_SNOOZE_COUNT ? "not-allowed" : "pointer",
              }}
              disabled={activeReminder.snoozeCount >= MAX_SNOOZE_COUNT}
            >
              Snooze ({MAX_SNOOZE_COUNT - activeReminder.snoozeCount} left)
            </Button>
            <Button
              onClick={handleCancelForToday}
              fillMode="flat"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "4px",
                color: "#1b5e20",
              }}
            >
              Cancel For Today
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyReminder

