import { SERVER_PORT, SERVER_URL } from "@ecl1ps/dreamcatcher-shared";
import React, { useState, useEffect } from "react";
import "./App.css";

interface AppInfo {
  name: string;
  version: string;
  electronVersion: string;
  nodeVersion: string;
}

function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        const response = await fetch(
          new URL(
            "/api/app-info",
            `http://${window.location.hostname}:${SERVER_PORT}`,
          ),
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAppInfo(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch app info",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppInfo();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Dreamcatcher Web Interface</h1>
        <p>Welcome to the Dreamcatcher web interface!</p>

        {loading && <div className="loading">Loading app information...</div>}

        {error && <div className="error">Error: {error}</div>}

        {appInfo && (
          <div className="app-info">
            <h2>Application Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>App Name:</strong> {appInfo.name}
              </div>
              <div className="info-item">
                <strong>Version:</strong> {appInfo.version}
              </div>
              <div className="info-item">
                <strong>Electron:</strong> {appInfo.electronVersion}
              </div>
              <div className="info-item">
                <strong>Node.js:</strong> {appInfo.nodeVersion}
              </div>
            </div>
          </div>
        )}

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>🖥️ Image sharing and mirroring</li>
            <li>🌐 Web-based control interface</li>
            <li>⚡ Built with Electron + React + Fastify</li>
            <li>🎛️ Real-time control panel</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
