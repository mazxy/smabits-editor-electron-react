import React, { useState } from 'react';
import { GeneratedShortcode } from '../types';
import './OutputPanel.css';

interface OutputPanelProps {
  shortcodes: GeneratedShortcode[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({
  shortcodes,
  selectedIndex,
  onSelect,
  onDelete,
  onEdit
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const allCode = shortcodes.map(s => s.code).join('\n\n');
    navigator.clipboard.writeText(allCode).then(() => {
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="output-panel">
      <div className="panel-header">
        <h3>📝 Shortcodes Generati ({shortcodes.length})</h3>
        {shortcodes.length > 0 && (
          <div className="panel-actions">
            <button 
              className="btn-icon" 
              onClick={handleCopyAll}
              title="Copia tutti"
            >
              {copiedIndex === -1 ? '✅' : '📋'}
            </button>
            <button 
              className="btn-icon" 
              onClick={() => {
                if (window.confirm('Eliminare tutti gli shortcodes?')) {
                  // Clear all - needs to be implemented in parent
                }
              }}
              title="Elimina tutti"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="output-list">
        {shortcodes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Nessuno shortcode generato</p>
            <span className="empty-hint">
              Usa il form a sinistra per creare shortcodes
            </span>
          </div>
        ) : (
          shortcodes.map((shortcode, index) => (
            <div 
              key={`${shortcode.timestamp}-${index}`}
              className={`shortcode-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => onSelect(index)}
            >
              <div className="shortcode-header">
                <div className="shortcode-info">
                  <span className="shortcode-type">
                    {shortcode.formData.type.toUpperCase()}
                  </span>
                  {shortcode.formData.title && (
                    <span className="shortcode-title">
                      {shortcode.formData.title}
                    </span>
                  )}
                </div>
                <span className="shortcode-time">
                  {formatTime(shortcode.timestamp)}
                </span>
              </div>
              
              <div className="shortcode-preview">
                <code>{shortcode.code.split('\n')[0]}...</code>
              </div>
              
              <div className="shortcode-actions">
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(shortcode.code, index);
                  }}
                  title="Copia"
                >
                  {copiedIndex === index ? '✅' : '📋'}
                </button>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(index);
                  }}
                  title="Modifica"
                >
                  ✏️
                </button>
                <button
                  className="action-btn action-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Eliminare questo shortcode?')) {
                      onDelete(index);
                    }
                  }}
                  title="Elimina"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OutputPanel;