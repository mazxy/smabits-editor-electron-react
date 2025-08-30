import React, { useState, useEffect } from 'react';
import { ShortcodeType, ShortcodeFormData, GeneratedShortcode } from '../../../types';
import { shortcodeConfigs, defVariants } from '../../../config/shortcodes';
import ShortcodeForm from './components/ShortCodeForm';
import WikiJsTips from './components/WikiJsTips';
import './FormPanel.css';

/**
 * Props per il componente FormPanel
 */
interface FormPanelProps {
  shortcodeType: ShortcodeType;
  onGenerate: (formData: ShortcodeFormData) => void;
  editingShortcode?: GeneratedShortcode;

  // onCancelEdit: funzione opzionale (?) che non accetta parametri (() => ) 
  // e non restituisce nulla (void)
  // Viene chiamata quando l'utente vuole uscire dalla modalità editing
  onCancelEdit?: () => void;
}

/**
 * FormPanel Component
 * Gestisce le opzioni UI specifiche per tipo e contiene il form
 */
function FormPanel({ 
  shortcodeType, 
  onGenerate, 
  editingShortcode,
  onCancelEdit
}: FormPanelProps) {
  
  // Stato per la variante selezionata (solo per tipo 'def')
  const [selectedVariant, setSelectedVariant] = useState<string>('def');
  
  // Recupera la configurazione per il tipo corrente
  const config = shortcodeConfigs[shortcodeType];

  /**
   * useEffect per sincronizzare le opzioni UI con l'editing
   */
  useEffect(() => {
    if (editingShortcode?.formData.options?.variant) {
      setSelectedVariant(editingShortcode.formData.options.variant);
    } else {
      setSelectedVariant('def');
    }
  }, [editingShortcode]);

  /**
   * Handler che riceve i dati dal form già completi
   */
  const handleFormSubmit = (formData: ShortcodeFormData) => {
    onGenerate(formData);
  };

  return (
    <div className="form-panel">
      {/* HEADER DEL PANNELLO */}
      <div className="panel-header">
        <div className="panel-header-content">
          <h3>
            {config.label}
          </h3>
          <span className="panel-subtitle">{config.description}</span>
        </div>

        {/* PULSANTE NUOVO - visibile solo in modalità editing */}
        { editingShortcode && onCancelEdit && (
            <button
              className="btn-new-shortcode"
              onClick={onCancelEdit}
              type="button"
            >
              Nuovo
            </button>
        )}
      </div>

      {/* INDICATORE MODALITÀ EDITING */}
      { editingShortcode && (
        <div className="editing-indicator">
          Stai modificando: <strong>{ editingShortcode.formData.title || 'Shortcode senza titolo'}</strong>
        </div>
      )}

      {/* VARIANT SELECTOR - solo per tipo 'def' */}
      {shortcodeType === 'def' && (
        <div className="variant-selector">
          <label className="form-label">Scegli il tipo di box:</label>
          <div className="variant-grid">
            {Object.entries(defVariants).map(([key, variant]) => (
              <button
                key={key}
                type="button"
                className={`variant-btn ${selectedVariant === key ? 'active' : ''}`}
                onClick={() => setSelectedVariant(key)}
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
      
      {/* FORM COMPONENT - gestisce la sua logica e l'alignment per eq */}
      <ShortcodeForm
        shortcodeType={shortcodeType}
        editingShortcode={editingShortcode}
        selectedVariant={selectedVariant}
        onSubmit={handleFormSubmit}
      />
      
      {/* SUGGERIMENTI CONTESTUALI */}
      <WikiJsTips shortcodeType={shortcodeType} />
    </div>
  );
}

export default FormPanel;