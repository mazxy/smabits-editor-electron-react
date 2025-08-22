import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  projectName: string;
  isModified: boolean;
  shortcodeCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ 
  projectName, 
  isModified, 
  shortcodeCount 
}) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          📁 {projectName}
          {isModified && <span className="modified-indicator">●</span>}
        </span>
        <span className="status-separator">|</span>
        <span className="status-item">
          📝 {shortcodeCount} shortcode{shortcodeCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="status-center">
        <span className="status-item status-ready">
          ✅ Pronto
        </span>
      </div>
      
      <div className="status-right">
        <span className="status-item">
          ⚛️ React + Electron
        </span>
        <span className="status-separator">|</span>
        <span className="status-item">
          v1.0.0
        </span>
      </div>
    </div>
  );
};

export default StatusBar;