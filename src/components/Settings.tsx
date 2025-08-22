import React, { useState } from 'react';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServerConnection {
  host: string;
  port: string;
  username: string;
  password: string;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('aspetto');
  const [serverConnection, setServerConnection] = useState<ServerConnection>({
    host: '',
    port: '22',
    username: '',
    password: ''
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState<string>('');
  const [serverResponse, setServerResponse] = useState<string>('');

  if (!isOpen) return null;

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    setConnectionMessage('Connessione in corso...');
    
    // Simula la connessione SSH (in un'app reale, questo chiamerebbe l'API Electron)
    setTimeout(() => {
      if (serverConnection.host && serverConnection.username && serverConnection.password) {
        setConnectionStatus('connected');
        setConnectionMessage(`Connesso a ${serverConnection.username}@${serverConnection.host}:${serverConnection.port}`);
        setServerResponse(`SSH Connection established to ${serverConnection.host}
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.4.0-91-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

Last login: ${new Date().toLocaleString()}
${serverConnection.username}@server:~$ `);
      } else {
        setConnectionStatus('error');
        setConnectionMessage('Errore: Compila tutti i campi richiesti');
        setServerResponse('');
      }
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnectionStatus('idle');
    setConnectionMessage('');
    setServerResponse('');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'aspetto':
        return (
          <div className="settings-panel">
            <h3>Aspetto</h3>
            <p className="settings-description">
              Personalizza l'aspetto dell'editor secondo le tue preferenze.
            </p>
            
            <div className="settings-section">
              <h4>Tema</h4>
              <div className="settings-option">
                <label className="radio-option">
                  <input type="radio" name="theme" value="light" defaultChecked />
                  <span>Chiaro</span>
                </label>
                <label className="radio-option">
                  <input type="radio" name="theme" value="dark" />
                  <span>Scuro</span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h4>Dimensione Font</h4>
              <div className="settings-option">
                <input 
                  type="range" 
                  min="12" 
                  max="20" 
                  defaultValue="14"
                  className="slider"
                />
                <span className="slider-value">14px</span>
              </div>
            </div>
          </div>
        );
      
      case 'server':
        return (
          <div className="settings-panel server-panel">
            <h3>Configurazione Server</h3>
            <p className="settings-description">
              Gestisci le connessioni SSH ai tuoi server remoti.
            </p>
            
            <div className="server-container">
              {/* Pannello sinistro - Configurazione connessione */}
              <div className="server-left">
                <div className="settings-section">
                  <h4>🔒 Connessione SSH</h4>
                  
                  <div className="connection-form">
                    <div className="form-group">
                      <label className="form-label">
                        Host / IP
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="esempio.com o 192.168.1.1"
                        value={serverConnection.host}
                        onChange={(e) => setServerConnection({...serverConnection, host: e.target.value})}
                        disabled={connectionStatus === 'connected'}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Porta
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="22"
                        value={serverConnection.port}
                        onChange={(e) => setServerConnection({...serverConnection, port: e.target.value})}
                        disabled={connectionStatus === 'connected'}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Username
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="root"
                        value={serverConnection.username}
                        onChange={(e) => setServerConnection({...serverConnection, username: e.target.value})}
                        disabled={connectionStatus === 'connected'}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Password
                        <span className="required">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={serverConnection.password}
                        onChange={(e) => setServerConnection({...serverConnection, password: e.target.value})}
                        disabled={connectionStatus === 'connected'}
                      />
                    </div>

                    <div className="connection-actions">
                      {connectionStatus !== 'connected' ? (
                        <button 
                          className="btn btn-primary"
                          onClick={handleConnect}
                          disabled={connectionStatus === 'connecting'}
                        >
                          {connectionStatus === 'connecting' ? '⏳ Connessione...' : '🔌 Connetti'}
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary"
                          onClick={handleDisconnect}
                        >
                          🔌 Disconnetti
                        </button>
                      )}
                    </div>

                    {/* Status message */}
                    {connectionMessage && (
                      <div className={`connection-status ${connectionStatus}`}>
                        <span className="status-icon">
                          {connectionStatus === 'connecting' && '⏳'}
                          {connectionStatus === 'connected' && '✅'}
                          {connectionStatus === 'error' && '❌'}
                        </span>
                        <span className="status-text">{connectionMessage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pannello destro - Terminal/Response */}
              <div className="server-right">
                <div className="settings-section terminal-section">
                  <h4>📟 Terminal Response</h4>
                  <div className="terminal-window">
                    {serverResponse ? (
                      <pre className="terminal-output">{serverResponse}</pre>
                    ) : (
                      <div className="terminal-empty">
                        <span className="empty-icon">💻</span>
                        <p>In attesa di connessione...</p>
                        <span className="empty-hint">
                          Inserisci i dati del server e premi Connetti
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'editor':
        return (
          <div className="settings-panel">
            <h3>Editor</h3>
            <p className="settings-description">
              Configura le impostazioni dell'editor di codice.
            </p>
            <div className="settings-placeholder">
              <p>Opzioni editor in arrivo...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-panel">
            <h3>{activeSection}</h3>
            <div className="settings-placeholder">
              <p>Sezione in sviluppo...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="settings-overlay">
      <div className="settings-container">
        <div className="settings-header">
          <div className="settings-title">
            <span className="settings-icon">⚙️</span>
            <h2>Impostazioni</h2>
          </div>
          <button 
            className="settings-close-btn"
            onClick={onClose}
            title="Chiudi impostazioni"
          >
            ✕
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-sidebar">
            <nav className="settings-nav">
              <button 
                className={`settings-nav-item ${activeSection === 'aspetto' ? 'active' : ''}`}
                onClick={() => setActiveSection('aspetto')}
              >
                <span className="nav-icon">🎨</span>
                <span className="nav-label">Aspetto</span>
              </button>
              <button 
                className={`settings-nav-item ${activeSection === 'server' ? 'active' : ''}`}
                onClick={() => setActiveSection('server')}
              >
                <span className="nav-icon">🖥️</span>
                <span className="nav-label">Server</span>
              </button>
              <button 
                className={`settings-nav-item ${activeSection === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveSection('editor')}
              >
                <span className="nav-icon">⌨️</span>
                <span className="nav-label">Editor</span>
              </button>
              <button 
                className={`settings-nav-item ${activeSection === 'files' ? 'active' : ''}`}
                onClick={() => setActiveSection('files')}
              >
                <span className="nav-icon">📁</span>
                <span className="nav-label">File e Progetti</span>
              </button>
              <button 
                className={`settings-nav-item ${activeSection === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveSection('advanced')}
              >
                <span className="nav-icon">🔧</span>
                <span className="nav-label">Avanzate</span>
              </button>
              <button 
                className={`settings-nav-item ${activeSection === 'info' ? 'active' : ''}`}
                onClick={() => setActiveSection('info')}
              >
                <span className="nav-icon">ℹ️</span>
                <span className="nav-label">Informazioni</span>
              </button>
            </nav>
          </div>

          <div className="settings-main">
            {renderContent()}
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            ← Torna all'Editor
          </button>
          <div className="settings-footer-actions">
            <button className="btn btn-secondary">
              Ripristina Default
            </button>
            <button className="btn btn-primary">
              Salva Modifiche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;