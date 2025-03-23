// src/components/NavigationPanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { Popup } from "@progress/kendo-react-popup";
import { Button, ButtonHandle } from "@progress/kendo-react-buttons";

interface NavigationPanelProps {
  selectedView: string;
  onSelectView: (view: string) => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ selectedView, onSelectView }) => {
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef<ButtonHandle>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Define the sections corresponding to your App.tsx
  const views = [
    { id: "topicGuide", label: "Topic Guide" },
    { id: "understandingTest", label: "Test & Thrive" },
    { id: "keyPointsSummary", label: "Key Takeaways" },
    { id: "pomodoroTimer", label: "Pomodoro Timer" },
    { id: "studyReminder", label: "Daily Study Cue" },
    { id: "progressChart", label: "Weekly Study Pulse" },
    { id: "studyScheduler", label: "Day's Focus Tracker" }
  ];

  const togglePopup = () => {
    console.log("Hamburger clicked. Toggling popup.");
    setShowPopup((prev) => !prev);
  };

  const handleSelect = (viewId: string) => {
    console.log("Selected view:", viewId);
    onSelectView(viewId);
    setShowPopup(false);
  };

  // Close popup if clicking outside of the popup or the hamburger button.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const buttonElement = buttonRef.current?.element;
      if (
        showPopup &&
        buttonElement &&
        popupRef.current &&
        !buttonElement.contains(target) &&
        !popupRef.current.contains(target)
      ) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Hamburger button displaying three horizontal lines */}
      <Button
        ref={buttonRef}
        onClick={togglePopup}
        style={{
          margin: "1rem",
          fontSize: "2rem",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        ☰
      </Button>
      {showPopup && buttonRef.current && buttonRef.current.element && (
        <Popup
          anchor={buttonRef.current.element}
          show={showPopup}
          popupAlign={{ vertical: "bottom", horizontal: "left" }}
          style={{
            zIndex: 2000,
            marginTop: "15rem", // Adjust this value to change vertical spacing
          }}
        >
          <div
            ref={popupRef}
            style={{
              backgroundColor: "var(--bg-color)",
              border: "1px solid #ccc",
              padding: "0.5rem",
              minWidth: "150px",
              color: "var(--text-color)"
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0, fontWeight: "bold" }}>
              {views.map((view) => (
                <li
                  key={view.id}
                  onClick={() => handleSelect(view.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    backgroundColor: selectedView === view.id ? "#33cc33" : "transparent",
                    
                  }}
                >
                  {view.label}
                </li>
              ))}
            </ul>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default NavigationPanel;
