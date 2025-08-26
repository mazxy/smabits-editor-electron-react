import React from 'react';
import { ShortcodeType } from '../types';
import { shortcodeConfigs } from '../config/shortcodes';
import './Sidebar.css';

interface SidebarProps {
  selectedType: ShortcodeType;
  onSelectType: (type: ShortcodeType) => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedType, onSelectType, onOpenSettings }) => {
  // Dividi shortcode attivi e non attivi
  const activeShortcodes = Object.entries(shortcodeConfigs).filter(([_, config]) => config.active !== false);
  const inactiveShortcodes = Object.entries(shortcodeConfigs).filter(([_, config]) => config.active === false);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>📚 SMABITS Editor</h2>
        <span className="version">v1.0.0</span>
      </div>
      
      <div className="sidebar-content">
        {/* Shortcode Attivi */}
        {activeShortcodes.length > 0 && (
          <div className="category-group">
            <div className="category-header">
              <span className="category-label">Shortcode Attivi</span>
            </div>
            
            <div className="shortcode-list">
              {activeShortcodes.map(([key, config]) => (
                <button
                  key={key}
                  className={`shortcode-item ${selectedType === config.type ? 'active' : ''}`}
                  onClick={() => onSelectType(config.type)}
                  style={{
                    '--item-color': config.color
                  } as React.CSSProperties}
                >
                  <span className="shortcode-icon">{config.icon}</span>
                  <div className="shortcode-info">
                    <span className="shortcode-label">{config.label}</span>
                    <span className="shortcode-desc">{config.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Shortcode Non Attivi (Coming Soon) */}
        {inactiveShortcodes.length > 0 && (
          <div className="category-group">
            <div className="category-header">
              <span className="category-label">Coming Soon</span>
            </div>
            
            <div className="shortcode-list">
              {inactiveShortcodes.map(([key, config]) => (
                <button
                  key={key}
                  className="shortcode-item disabled"
                  disabled
                  style={{
                    '--item-color': '#9CA3AF'
                  } as React.CSSProperties}
                >
                  <span className="shortcode-icon">{config.icon}</span>
                  <div className="shortcode-info">
                    <span className="shortcode-label">{config.label}</span>
                    <span className="shortcode-desc">{config.description}</span>
                  </div>
                  <span className="coming-soon-badge">🔒</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="sidebar-footer">
        <button className="sidebar-button" onClick={onOpenSettings}>
          ⚙️ Impostazioni
        </button>
        <button className="sidebar-button">
          ❓ Aiuto
        </button>
      </div>
    </div>
  );
};

export default Sidebar;