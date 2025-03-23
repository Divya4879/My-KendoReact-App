// src/App.tsx
import React, { useState, useEffect } from "react";
import TopNavigation from "./components/NavigationPanel";
import ThemeToggle from "./components/ThemeToggle";
import AboutModal from "./components/AboutModal";
import "./App.scss";
import TopicGuide from "./components/TopicGuide";
import UnderstandingTest from "./components/UnderstandingTest";
import KeyPointsSummary from "./components/KeyPointsSummary";
import PomodoroTimer from "./components/PomodoroTimer";
import StudyReminder from "./components/StudyReminder";
import ProgressChart from "./components/ProgressChart";
import StudyScheduler from "./components/StudyScheduler";

const App: React.FC = () => {
  const [selectedView, setSelectedView] = useState<string>("topicGuide");
  const [showAbout, setShowAbout] = useState<boolean>(false);

  useEffect(() => {
    // Run only once when the component mounts
    const seenAbout = localStorage.getItem("seenAbout") === "true";
    if (!seenAbout) {
      setShowAbout(true);
      localStorage.setItem("seenAbout", "true");
    }
  }, []);

  // When selectedView changes, scroll to the corresponding section offset by the header's height.
  useEffect(() => {
    const section = document.getElementById(selectedView);
    if (section) {
      const sectionRect = section.getBoundingClientRect();
      const absoluteSectionTop = window.pageYOffset + sectionRect.top;
      // Get the header's height (which is set to 10rem; here we retrieve its actual computed height)
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      window.scrollTo({ top: absoluteSectionTop - headerHeight, behavior: "smooth" });
    }
  }, [selectedView]);

  return (
    // Outer container with a maxWidth of 800px, centered.
    <div style={{ maxWidth: "800px", margin: "0 auto", overflowX: "hidden", paddingBottom: "60px" }}>
      {/* HEADER */}
      <header
  style={{
    backgroundColor: "var(--header-bg)",
    color: "var(--header-text)",
    textAlign: "center",
    padding: "0.5rem 0", // same padding as footer
    boxSizing: "border-box",
    position: "fixed", // fixed header so it stays on top
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1200,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }}
>
  {/* Hamburger menu icon on the left */}
  <div style={{ flex: "0 0 auto", marginLeft: "1rem" }}>
    <TopNavigation selectedView={selectedView} onSelectView={setSelectedView} />
  </div>
  {/* Centered title */}
  <div style={{ flex: 1, textAlign: "center" }}>
    <h1
      style={{
        margin: 0,
        fontSize: "400%", // Adjust font size as needed
        
        textAlign: "center",
        padding:"10px"
      }}
    >
      Academic Muse
    </h1>
  </div>
  {/* Theme toggle on the far right */}
  <div style={{ flex: "0 0 auto", marginRight: "1rem" }}>
    <ThemeToggle />
  </div>
</header>

      {showAbout && (
        <AboutModal
          onClose={() => {
            console.log("Closing About Modal");
            setShowAbout(false);
            localStorage.setItem("aboutSeen", "true");
          }}
        />
      )}

      {/* Main content starts below the fixed header */}
      <div style={{ marginTop: "12rem" }}>
        <div id="topicGuide">
          <TopicGuide />
        </div>
        <div id="understandingTest">
          <UnderstandingTest />
        </div>
        <div id="keyPointsSummary">
          <KeyPointsSummary />
        </div>
        <div id="pomodoroTimer">
          <PomodoroTimer />
        </div>
        <div id="studyReminder">
          <StudyReminder />
        </div>
        <div id="progressChart">
          <ProgressChart />
        </div>
        <div id="studyScheduler">
          <StudyScheduler />
        </div>
      </div>

      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          backgroundColor: "var(--header-bg)",
          color: "var(--header-text)",
          textAlign: "center",
          padding: "1rem 0",
          boxSizing: "border-box",
          fontSize: "1rem",
          zIndex:'1000'
        }}
      >
        <p style={{ margin: 0 }}>
        Handcrafted with 💚 & powered by ☕ –  {" "}
          <a
            href="https://x.com/DivsinghDev"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", color: "var(--text-color)", fontWeight: "bold" }}
          >
            Divya
          </a>{" "}
          welcomes you in this journey ✨
        </p>
      </footer>
    </div>
  );
};

export default App;
