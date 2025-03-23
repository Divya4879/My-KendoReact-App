// src/components/AboutModal.tsx
import React from "react";
import { Window } from "@progress/kendo-react-dialogs";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <Window
      title="About Academic Muse"
      onClose={onClose}
      resizable={false}
      modal={true}
      initialWidth={600}
      initialHeight={400}
      style={{
        position: "fixed",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "var(--window-bg)",
        color: "var(--text-color)",
        border: `1px solid var(--window-border)`
      }}
    >
      <div style={{ padding: "0.5rem" }}>
      <p>
  Unleash your learning potential with this 24 * 7 study companion! Elevate your academic journey with intuitive tools and captivating insights.
</p>
<h2>Key Features</h2>
<ul>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Dynamic Topic Explanations</strong> 📚 – Custom explanations for your level.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Interactive Tests & SWOT Analysis</strong> 📝 – Engaging tests with clear SWOT feedback.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Key Takeaways</strong> ✨ – Concise, essential insights.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Custom Pomodoro Timer</strong> ⏱️ – Focused sessions with audio alerts.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Smart Reminders</strong> ⏰ – Daily notifications to keep you on track.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Weekly Progress Chart</strong> 📊 – Visualize your study sessions.
  </li>
  <li>
    <strong style={{ color: "var(--primary-color)" }}>Daily Session Scheduler</strong> 🔥 – Schedule current day’s sessions with timely reminders, marking them as missed or completed.
  </li>
</ul>
<p>
  Step into a realm where productivity meets innovation – your journey to <strong style={{ color: "var(--primary-color)" }}>excellence</strong> begins now! 🚀💫
</p>
      </div>
    </Window>
  );
};

export default AboutModal;
