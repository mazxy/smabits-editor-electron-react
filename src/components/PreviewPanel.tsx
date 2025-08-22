import React, { useState, useEffect } from 'react';
import { GeneratedShortcode } from '../types';
import { defVariants } from '../config/shortcodes';
import './PreviewPanel.css';

interface PreviewPanelProps {
  shortcode: GeneratedShortcode | null;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ shortcode }) => {
  const [viewMode, setViewMode] = useState<'code' | 'render'>('code');
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const [wrapped, setWrapped] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [shortcode]);

  const handleCopy = () => {
    if (shortcode) {
      navigator.clipboard.writeText(shortcode.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleExport = () => {
    if (!shortcode) return;
    
    const blob = new Blob([shortcode.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${shortcode.formData.type}_${Date.now()}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderWikiPreview = () => {
    if (!shortcode) return null;
    
    const { formData } = shortcode;
    
    // Se è un EQ, renderizza diversamente
    if (formData.type === 'eq') {
      const align = formData.options?.align || 'default';
      const alignStyle: Record<string, 'left' | 'center' | 'right'> = {
        left: 'left',
        center: 'center', 
        right: 'right',
        default: 'center'
      };
      
      return (
        <div className="wiki-preview">
          <div className="wikijs-page">
            <h1 className="wikijs-title">Esempio Pagina Wiki.js</h1>
            
            <p className="preview-text">
              Ecco come apparirà la tua equazione nella pagina Wiki.js:
            </p>
            
            <p className="preview-text">
              Le equazioni matematiche sono fondamentali per descrivere le leggi della fisica. 
              Ad esempio, la famosa equazione di Einstein:
            </p>
            
            {/* Equazione renderizzata */}
            <div 
              className="sm-eq-wrapper"
              style={{ 
                textAlign: alignStyle[align] || 'center' as const,
                margin: '2rem 0',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px'
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                color: '#2d3748'
              }}>
                {formData.content || 'E = mc²'}
              </div>
            </div>
            
            <p className="preview-text">
              Questa equazione stabilisce l'equivalenza tra massa ed energia, 
              dove E è l'energia, m è la massa e c è la velocità della luce.
            </p>
          </div>
        </div>
      );
    }
    
    // Altrimenti renderizza DEF come prima
    const variant = formData.options?.variant ? 
      defVariants[formData.options.variant as keyof typeof defVariants] : 
      defVariants.def;
    
    // Determina il kicker (etichetta) da mostrare
    let kicker = variant.kicker;
    if (formData.options?.customKicker) {
      kicker = formData.options.customKicker;
    }
    
    // Determina la classe CSS per il colore
    const typeClass = variant.type || 'def';
    
    // Determina i colori in base al tipo
    const colors = {
      def: { accent: '#e03131', bg: '#f3efe6' },     // rosso
      theorem: { accent: '#2f9e44', bg: '#f3efe6' }, // verde
      note: { accent: '#1c7ed6', bg: '#f3efe6' }     // blu
    };
    
    const currentColors = colors[typeClass as keyof typeof colors] || colors.def;
    
    return (
      <div className="wiki-preview">
        <div className="wikijs-page">
          <h1 className="wikijs-title">Esempio Pagina Wiki.js</h1>
          
          <p className="preview-text">
            Ecco come apparirà il tuo shortcode nella pagina Wiki.js:
          </p>
          
          {/* Box DEF renderizzato come su Wiki.js */}
          <div 
            className="sm-callout"
            style={{
              '--sm-accent': currentColors.accent,
              '--sm-bg': currentColors.bg
            } as React.CSSProperties}
          >
            <div className="sm-strip"></div>
            <div className="sm-head">
              <div className="sm-kicker">{kicker}</div>
              {formData.title && <h3 className="sm-title">{formData.title}</h3>}
            </div>
            <div className="sm-body">
              <div dangerouslySetInnerHTML={{ 
                __html: formatContent(formData.content || 'Il contenuto apparirà qui...') 
              }} />
            </div>
          </div>
          
          <p className="preview-text">
            Il box sopra è renderizzato con gli stili esatti di Wiki.js.
          </p>
        </div>
      </div>
    );
  };
  
  // Helper per formattare il contenuto (supporto markdown base)
  const formatContent = (content: string) => {
    let formatted = content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **grassetto**
      .replace(/\*(.+?)\*/g, '<em>$1</em>')              // *corsivo*
      .replace(/\n\n/g, '</p><p>')                       // paragrafi
      .replace(/\n/g, '<br>');                           // a capo
    
    // Wrap in paragrafo se necessario
    if (!formatted.includes('<p>')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    // Formule matematiche (visualizzazione base)
    formatted = formatted.replace(/\$\$(.+?)\$\$/g, '<div class="math-block">$1</div>');
    formatted = formatted.replace(/\$(.+?)\$/g, '<code class="math-inline">$1</code>');
    
    return formatted;
  };

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>👁️ Anteprima</h3>
        
        {shortcode && (
          <div className="preview-controls">
            <div className="view-mode-toggle">
              <button
                className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`}
                onClick={() => setViewMode('code')}
              >
                Codice
              </button>
              <button
                className={`toggle-btn ${viewMode === 'render' ? 'active' : ''}`}
                onClick={() => setViewMode('render')}
              >
                Render
              </button>
            </div>
            
            <div className="preview-actions">
              {viewMode === 'code' && (
                <>
                  <button
                    className="action-btn"
                    onClick={() => setWrapped(!wrapped)}
                    title={wrapped ? 'Unwrap' : 'Wrap'}
                  >
                    {wrapped ? '↔️' : '↩️'}
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                    title="Riduci font"
                  >
                    🔍−
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    title="Aumenta font"
                  >
                    🔍+
                  </button>
                </>
              )}
              <button
                className="action-btn"
                onClick={handleCopy}
                title="Copia"
              >
                {copied ? '✅' : '📋'}
              </button>
              <button
                className="action-btn"
                onClick={handleExport}
                title="Esporta"
              >
                💾
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="preview-content">
        {!shortcode ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>Seleziona uno shortcode</p>
            <span className="empty-hint">
              Clicca su uno shortcode nella lista per visualizzarlo
            </span>
          </div>
        ) : viewMode === 'code' ? (
          <div className="code-preview">
            <pre 
              style={{ 
                fontSize: `${fontSize}px`,
                whiteSpace: wrapped ? 'pre-wrap' : 'pre',
                wordBreak: wrapped ? 'break-word' : 'normal'
              }}
            >
              <code className="language-latex">
                {shortcode.code}
              </code>
            </pre>
            
            <div className="code-info">
              <div className="info-item">
                <span className="info-label">Tipo:</span>
                <span className="info-value">
                  {shortcode.formData.options?.variant || shortcode.formData.type}
                </span>
              </div>
              {shortcode.formData.title && (
                <div className="info-item">
                  <span className="info-label">Titolo:</span>
                  <span className="info-value">{shortcode.formData.title}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Caratteri:</span>
                <span className="info-value">{shortcode.code.length}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Righe:</span>
                <span className="info-value">{shortcode.code.split('\n').length}</span>
              </div>
            </div>
          </div>
        ) : (
          renderWikiPreview()
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;