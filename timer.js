window.addEventListener('load', () => {
  function PomodoroTimer() {
    const MODES = {
      FOCUS: 25 * 60,
      SHORT_BREAK: 5 * 60,
      LONG_BREAK: 10 * 60
    };

    const colorPalette = {
      bg: {
        'LM Default White': '#FFFFFF',
        'LM Off White': '#EBECED',
        'LM Notion Grey': '#E9E5E3',
        'LM Notion Brown': '#FAEBDD',
        'LM Notion Orange': '#DDEAEA',
        'LM Notion Yellow': '#FBF3D0',
        'LM Notion Green': '#DDDEEA',
        'LM Notion Blue': '#DDEAF3',
        'LM Notion Purple': '#EAE4F2',
        'LM Notion Pink': '#F4DFFB',
        'LM Notion Red': '#FBE4E4',
        'DM Default': '#191919',
        'DM Hover': '#252525',
        'DM Sidebar': '#2E2724',
        'DM Notion Brown': '#36291F',
        'DM Notion Orange': '#372E20',
        'DM Notion Yellow': '#242B26',
        'DM Notion Green': '#1F282D',
        'DM Notion Blue': '#1F282D',
        'DM Notion Purple': '#2A2436',
        'DM Notion Pink': '#222328',
        'DM Notion Red': '#332523'
      },
      text: {
        'LM Notion Default': '#373532',
        'LM Notion Grey': '#9B9A97',
        'LM Notion Brown': '#64473A',
        'LM Notion Orange': '#D9730D',
        'LM Notion Yellow': '#DFAB01',
        'LM Notion Green': '#0F7B6C',
        'LM Notion Blue': '#0B86E9',
        'LM Notion Purple': '#6940A5',
        'LM Notion Pink': '#AD1A72',
        'LM Notion Red': '#E03E3E',
        'DM White': '#D4D4D4',
        'DM Notion Grey': '#989898',
        'DM Notion Brown': '#A27763',
        'DM Notion Orange': '#CB7B37',
        'DM Notion Yellow': '#C19138',
        'DM Notion Green': '#4F9768',
        'DM Notion Blue': '#447ACB',
        'DM Notion Purple': '#865DBB',
        'DM Notion Pink': '#BA4A78',
        'DM Notion Red': '#BE524B'
      }
    };

    const getLocalStorageItem = (key, defaultValue) => {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    };

    const setLocalStorageItem = (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    };

    const savedTimeLeft = parseInt(localStorage.getItem('pomodoroTimeLeft'));
    const savedMode = localStorage.getItem('pomodoroMode');
    const savedBgColor = localStorage.getItem('pomodoroBgColor');
    const savedTextColor = localStorage.getItem('pomodoroTextColor');
    const savedStartTime = localStorage.getItem('pomodoroStartTime');
    const savedTotalDuration = parseInt(localStorage.getItem('pomodoroTotalDuration'));

    const calculateTimeLeft = () => {
      if (savedStartTime && savedTotalDuration) {
        const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        const remainingTime = savedTotalDuration - elapsedTime;
        return remainingTime > 0 ? remainingTime : 0;
      }
      return savedTimeLeft || MODES.FOCUS;
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft);
    const [isRunning, setIsRunning] = React.useState(getLocalStorageItem('pomodoroIsRunning', false));
    const [currentMode, setCurrentMode] = React.useState(savedMode || 'FOCUS');
    const [showSettings, setShowSettings] = React.useState(false);
    const [bgColor, setBgColor] = React.useState(savedBgColor || 'LM Default White');
    const [textColor, setTextColor] = React.useState(savedTextColor || 'LM Notion Default');

    React.useEffect(() => {
      let interval;
      if (isRunning && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(time => {
            const newTime = time - 1;
            setLocalStorageItem('pomodoroTimeLeft', newTime);
            return newTime;
          });
        }, 1000);
      } else if (timeLeft === 0) {
        const playBeep = () => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.5;
          
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
        };

        for (let i = 0; i < 3; i++) {
          setTimeout(playBeep, i * 500);
        }
        
        setIsRunning(false);
        localStorage.removeItem('pomodoroStartTime');
        localStorage.removeItem('pomodoroTotalDuration');
      }
      return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    React.useEffect(() => {
      setLocalStorageItem('pomodoroTimeLeft', timeLeft);
      setLocalStorageItem('pomodoroMode', currentMode);
      setLocalStorageItem('pomodoroBgColor', bgColor);
      setLocalStorageItem('pomodoroTextColor', textColor);
      setLocalStorageItem('pomodoroIsRunning', isRunning);
    }, [timeLeft, currentMode, bgColor, textColor, isRunning]);

    const toggleTimer = () => {
      const newIsRunning = !isRunning;
      setIsRunning(newIsRunning);
      
      if (newIsRunning) {
        setLocalStorageItem('pomodoroStartTime', Date.now());
        setLocalStorageItem('pomodoroTotalDuration', timeLeft);
      } else {
        localStorage.removeItem('pomodoroStartTime');
        localStorage.removeItem('pomodoroTotalDuration');
      }
    };

    const switchMode = (mode) => {
      setCurrentMode(mode);
      setTimeLeft(MODES[mode]);
      setIsRunning(false);
      localStorage.removeItem('pomodoroStartTime');
      localStorage.removeItem('pomodoroTotalDuration');
    };

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return (
        <React.Fragment>
          <span className="font-mono">
            <span className={minutes < 10 ? 'invisible' : 'hidden'}>0</span>
            {minutes}
          </span>
          <span className="font-bold mx-1">:</span>
          <span className="font-mono">{remainingSeconds.toString().padStart(2, '0')}</span>
        </React.Fragment>
      );
    };

    function SettingsModal({ showSettings, setShowSettings, bgColor, setBgColor, textColor, setTextColor }) {
      const bgOptions = Object.keys(colorPalette.bg);
      const textOptions = Object.keys(colorPalette.text);

      if (!showSettings) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Einstellungen</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hintergrundfarbe auswählen
                </label>
                <select
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {bgOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schriftfarbe auswählen
                </label>
                <select
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {textOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{ backgroundColor: colorPalette.bg[bgColor] }}
      >
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-24">
            <button
              onClick={() => switchMode('SHORT_BREAK')}
              style={{ 
                color: currentMode === 'SHORT_BREAK' ? 'white' : colorPalette.text[textColor],
                borderColor: colorPalette.text[textColor],
                backgroundColor: currentMode === 'SHORT_BREAK' ? colorPalette.text[textColor] : 'transparent'
              }}
              className="px-4 py-2 rounded-full border font-semibold hover:bg-gray-100 transition-colors"
            >
              Kurze Pause
            </button>
            <button
              onClick={() => switchMode('FOCUS')}
              style={{ 
                color: currentMode === 'FOCUS' ? 'white' : colorPalette.text[textColor],
                borderColor: colorPalette.text[textColor],
                backgroundColor: currentMode === 'FOCUS' ? colorPalette.text[textColor] : 'transparent'
              }}
              className="px-4 py-2 rounded-full border font-semibold hover:bg-gray-100 transition-colors"
            >
              Fokus
            </button>
            <button
              onClick={() => switchMode('LONG_BREAK')}
              style={{ 
                color: currentMode === 'LONG_BREAK' ? 'white' : colorPalette.text[textColor],
                borderColor: colorPalette.text[textColor],
                backgroundColor: currentMode === 'LONG_BREAK' ? colorPalette.text[textColor] : 'transparent'
              }}
              className="px-4 py-2 rounded-full border font-semibold hover:bg-gray-100 transition-colors"
            >
              Lange Pause
            </button>
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
                color: 'white'
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:opacity-80 transition-opacity"
            >
              {isRunning ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
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
              className="w-12 h-12 flex items-center justify-center rounded-full border hover:bg-gray-100 transition-colors"
            >
              <i data-feather="rotate-ccw"></i>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                borderColor: colorPalette.text[textColor],
                color: colorPalette.text[textColor]
              }}
              className="w-12 h-12 flex items-center justify-center rounded-full border hover:bg-gray-100 transition-colors"
            >
              <i data-feather="settings"></i>
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
    React.useEffect(() => {
      feather.replace();
    }, []); // Ensure this effect runs only once on mount

    return <PomodoroTimer />;
  }

  const container = document.getElementById('app');
  window.ReactDOM.createRoot(container).render(<App />);
});
