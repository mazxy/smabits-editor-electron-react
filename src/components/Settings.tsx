import React from 'react';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <button className="settings-nav-item active">
                <span className="nav-icon">🎨</span>
                <span className="nav-label">Aspetto</span>
              </button>
              <button className="settings-nav-item">
                <span className="nav-icon">⌨️</span>
                <span className="nav-label">Editor</span>
              </button>
              <button className="settings-nav-item">
                <span className="nav-icon">📁</span>
                <span className="nav-label">File e Progetti</span>
              </button>
              <button className="settings-nav-item">
                <span className="nav-icon">🔧</span>
                <span className="nav-label">Avanzate</span>
              </button>
              <button className="settings-nav-item">
                <span className="nav-icon">ℹ️</span>
                <span className="nav-label">Informazioni</span>
              </button>
            </nav>
          </div>

          <div className="settings-main">
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

              {/* Placeholder per altre opzioni */}
              <div className="settings-placeholder">
                <p>Altre opzioni saranno aggiunte qui...</p>
              </div>
            </div>
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