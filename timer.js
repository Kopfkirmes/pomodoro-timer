// timer.js
const React = window.React;
const ReactDOM = window.ReactDOM;

window.addEventListener('load', () => {
    // ... (vorheriger Code bleibt gleich bis zu den Button-Komponenten)

    // Neue Komponente für die Modus-Buttons
    const ModeButton = ({ mode, currentMode, onClick, children }) => {
      const isActive = mode === currentMode;
      const buttonStyle = {
        color: isActive ? colorPalette.bg[bgColor] : colorPalette.text[textColor],
        borderColor: colorPalette.text[textColor],
        backgroundColor: isActive ? colorPalette.text[textColor] : 'transparent',
      };

      return (
        <button
          onClick={() => onClick(mode)}
          style={buttonStyle}
          className="px-4 py-2 rounded-full border font-semibold transition-colors hover:opacity-80"
        >
          {children}
        </button>
      );
    };

    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{ backgroundColor: colorPalette.bg[bgColor] }}
      >
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-24">
            <ModeButton mode="SHORT_BREAK" currentMode={currentMode} onClick={switchMode}>
              Kurze Pause
            </ModeButton>
            <ModeButton mode="FOCUS" currentMode={currentMode} onClick={switchMode}>
              Fokus
            </ModeButton>
            <ModeButton mode="LONG_BREAK" currentMode={currentMode} onClick={switchMode}>
              Lange Pause
            </ModeButton>
          </div>

          <div 
            className="text-9xl font-bold mb-24"
            style={{ color: colorPalette.text[textColor] }}
          >
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              style={{
                backgroundColor: colorPalette.text[textColor],
                color: colorPalette.bg[bgColor]
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
            >
              {isRunning ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/>
                  <rect x="14" y="4" width="4" height="16"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            <button
              onClick={() => {
                setTimeLeft(MODES[currentMode]);
                setIsRunning(false);
                localStorage.removeItem('pomodoroStartTime');
                localStorage.removeItem('pomodoroTotalDuration');
              }}
              style={{
                borderColor: colorPalette.text[textColor],
                color: colorPalette.text[textColor]
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full border hover:opacity-80 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                borderColor: colorPalette.text[textColor],
                color: colorPalette.text[textColor]
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full border hover:opacity-80 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>

          <SettingsModal
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            bgColor={bgColor}
            setBgColor={setBgColor}
            textColor={textColor}
            setTextColor={setTextColor}
          />
        </div>
      </div>
    );
  }

  function App() {
    return <PomodoroTimer />;
  }

  const container = document.getElementById('app');
  if (container) {
    ReactDOM.createRoot(container).render(<App />);
  } else {
    console.error('No container found for rendering the App');
  }
});
