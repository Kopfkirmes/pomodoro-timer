const React = window.React;
const ReactDOM = window.ReactDOM;

// Test-Komponente zum Überprüfen der Funktionalität
function TestComponent() {
    return (
        <div className="p-4 bg-blue-500 text-white">
            Der Timer wird gleich geladen!
        </div>
    );
}

// Rendering
const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<TestComponent />);
