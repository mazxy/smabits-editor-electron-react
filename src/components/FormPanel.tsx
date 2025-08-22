import React, { useState, useEffect } from 'react';
import { ShortcodeType, ShortcodeFormData, GeneratedShortcode } from '../types';
import { shortcodeConfigs, defVariants, validateShortcode } from '../config/shortcodes';
import './FormPanel.css';

interface FormPanelProps {
  shortcodeType: ShortcodeType;
  onGenerate: (formData: ShortcodeFormData) => void;
  editingShortcode?: GeneratedShortcode;
}

const FormPanel: React.FC<FormPanelProps> = ({ shortcodeType, onGenerate, editingShortcode }) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('def');
  const [formData, setFormData] = useState<ShortcodeFormData>({
    type: shortcodeType,
    title: '',
    label: '',
    content: '',
    options: {
      numbered: true,
      starred: false,
      variant: 'def'
    }
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const config = shortcodeConfigs[shortcodeType];

  useEffect(() => {
    if (editingShortcode) {
      setFormData(editingShortcode.formData);
      setSelectedVariant(editingShortcode.formData.options?.variant || 'def');
    } else {
      // Reset completo quando cambia il tipo di shortcode
      setFormData({
        type: shortcodeType,  // Usa sempre il tipo corrente dalla sidebar
        title: '',
        label: '',
        content: '',
        options: {
          numbered: true,
          starred: false,
          variant: shortcodeType === 'def' ? 'def' : undefined,
          align: shortcodeType === 'eq' ? 'default' : undefined
        }
      });
      setSelectedVariant('def');
    }
    setErrors([]);
  }, [shortcodeType, editingShortcode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateShortcode(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Crea i dati corretti basandosi sul tipo attuale
    const dataToGenerate = {
      ...formData,
      type: shortcodeType,  // Assicurati che il tipo sia sempre quello corrente
      options: {
        ...formData.options,
        variant: shortcodeType === 'def' ? selectedVariant : undefined,
        align: shortcodeType === 'eq' ? (formData.options?.align || 'default') : undefined
      }
    };
    
    onGenerate(dataToGenerate);
    
    // Reset form after generation
    setFormData({
      type: shortcodeType,
      title: '',
      label: '',
      content: '',
      options: {
        numbered: true,
        starred: false,
        variant: shortcodeType === 'def' ? selectedVariant : undefined,
        align: shortcodeType === 'eq' ? 'default' : undefined
      }
    });
    setErrors([]);
  };

  const handleFieldChange = (field: keyof ShortcodeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      type: shortcodeType,  // Mantieni sempre il tipo corrente
      [field]: value
    }));
    setErrors([]); // Clear errors on change
  };

  const handleOptionChange = (option: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      type: shortcodeType,  // Mantieni sempre il tipo corrente
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };

  return (
    <div className="form-panel">
      <div className="panel-header">
        <h3>
          <span className="icon">{config.icon}</span>
          {config.label}
        </h3>
        <span className="panel-subtitle">{config.description}</span>
      </div>
      
      {/* Se è DEF, mostra i pulsanti per scegliere il tipo */}
      {shortcodeType === 'def' && (
        <div className="variant-selector">
          <label className="form-label">Scegli il tipo di box:</label>
          <div className="variant-grid">
            {Object.entries(defVariants).map(([key, variant]) => (
              <button
                key={key}
                type="button"
                className={`variant-btn ${selectedVariant === key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedVariant(key);
                  handleOptionChange('variant', key);
                }}
                style={{
                  '--variant-color': variant.color
                } as React.CSSProperties}
              >
                <span className="variant-icon">{variant.icon}</span>
                <span className="variant-label">{variant.label}</span>
                <span className="variant-desc">{variant.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Se è EQ, mostra le opzioni per l'allineamento */}
      {shortcodeType === 'eq' && (
        <div className="eq-options">
          <label className="form-label">Opzioni Equazione:</label>
          <div className="align-options">
            <label className="radio-label">
              <input
                type="radio"
                name="align"
                value="default"
                checked={!formData.options?.align || formData.options.align === 'default'}
                onChange={() => handleOptionChange('align', 'default')}
              />
              <span>Default</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="align"
                value="left"
                checked={formData.options?.align === 'left'}
                onChange={() => handleOptionChange('align', 'left')}
              />
              <span>Sinistra</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="align"
                value="center"
                checked={formData.options?.align === 'center'}
                onChange={() => handleOptionChange('align', 'center')}
              />
              <span>Centro</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="align"
                value="right"
                checked={formData.options?.align === 'right'}
                onChange={() => handleOptionChange('align', 'right')}
              />
              <span>Destra</span>
            </label>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="shortcode-form">
        {config.hasTitle && (
          <div className="form-group">
            <label htmlFor="title">
              Titolo
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Es: Convergenza uniforme"
              className="form-input"
            />
          </div>
        )}
        
        {config.hasLabel && (
          <div className="form-group">
            <label htmlFor="label">
              Label (per riferimenti)
              <span className="optional">opzionale</span>
            </label>
            <input
              type="text"
              id="label"
              value={formData.label || ''}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              placeholder="Es: convergenza_uniforme"
              className="form-input"
              pattern="[a-zA-Z0-9_]+"
            />
            <span className="form-hint">
              Solo lettere, numeri e underscore. Usato per \ref{'{'}label{'}'}
            </span>
          </div>
        )}
        
        {config.hasContent && (
          <div className="form-group">
            <label htmlFor="content">
              Contenuto
              <span className="required">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              placeholder="Inserisci il contenuto LaTeX..."
              className="form-textarea"
              rows={8}
            />
            <span className="form-hint">
              Supporta formule LaTeX: $...$, $$...$$, \begin{'{'}equation{'}'}...
            </span>
          </div>
        )}
        
        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.options?.starred || false}
              onChange={(e) => handleOptionChange('starred', e.target.checked)}
            />
            <span>Versione non numerata (*)</span>
          </label>
        </div>
        
        {errors.length > 0 && (
          <div className="form-errors">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                ⚠️ {error}
              </div>
            ))}
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingShortcode ? '💾 Aggiorna' : '✨ Genera Shortcode'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => {
            setFormData({
              type: shortcodeType,
              title: '',
              label: '',
              content: '',
              options: { numbered: true, starred: false }
            });
            setErrors([]);
          }}>
            🔄 Reset
          </button>
        </div>
      </form>
      
      <div className="form-tips">
        <h4>💡 Suggerimenti</h4>
        {shortcodeType === 'eq' ? (
          <ul>
            <li>Formula inline: <code>x^2 + y^2 = z^2</code></li>
            <li>Frazione: <code>\frac{'{'}a{'}'}{'{'}b{'}'}</code></li>
            <li>Integrale: <code>\int_0^1 f(x)dx</code></li>
            <li>Sommatoria: <code>\sum_{'{'}i=1{'}'}^n x_i</code></li>
            <li>Matrice: <code>\begin{'{'}matrix{'}'} a & b \\ c & d \end{'{'}matrix{'}'}</code></li>
          </ul>
        ) : (
          <ul>
            <li>Usa <code>\ref{'{'}label{'}'}</code> per riferimenti incrociati</li>
            <li>Formule inline: <code>$x^2 + y^2$</code></li>
            <li>Formule display: <code>$\int_0^1 f(x)dx$</code></li>
            <li>Ambiente equation: <code>\begin{'{'}equation{'}'} ... \end{'{'}equation{'}'}</code></li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default FormPanel;