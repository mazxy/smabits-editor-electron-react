


import React, { useState, useEffect } from 'react';
import { ShortcodeType, ShortcodeFormData, GeneratedShortcode } from '../../../../types';
import { shortcodeConfigs, validateShortcode } from '../../../../config/shortcodes';

/**
 * Props per il componente ShortcodeForm
 */
interface ShortcodeFormProps {
  shortcodeType: ShortcodeType;
  editingShortcode?: GeneratedShortcode;
  selectedVariant?: string;
  onSubmit: (formData: ShortcodeFormData) => void;
}

/**
 * ShortcodeForm Component
 * Gestisce il form e la sua logica di validazione/submit
 */
function ShortcodeForm({ 
  shortcodeType,
  editingShortcode,
  selectedVariant = 'def',
  onSubmit
}: ShortcodeFormProps) {
  
  // Stato principale del form che contiene tutti i dati
  const [formData, setFormData] = useState<ShortcodeFormData>({
    type: shortcodeType,
    title: '',
    label: '',
    content: '',
    options: {
      align: 'default'
    }
  });
  
  // Array di messaggi di errore per la validazione
  const [errors, setErrors] = useState<string[]>([]);
  
  // Recupera la configurazione per il tipo corrente
  const config = shortcodeConfigs[shortcodeType];

  /**
   * useEffect separato per tracciare i cambi di variant
   * Solo per dare feedback visivo all'utente che la variant è cambiata
   */
  useEffect(() => {
    // Potresti mostrare un indicatore visivo che la variant è cambiata
    // o aggiornare qualche stato UI se necessario
  }, [selectedVariant]);
  useEffect(() => {
    if (editingShortcode) {
      // MODALITÀ EDITING: popola il form con dati esistenti
      setFormData(editingShortcode.formData);
    } else {
      // MODALITÀ CREAZIONE: reset completo del form
      resetForm();
    }
    // Pulisce errori quando cambia modalità o tipo
    setErrors([]);
  }, [shortcodeType, editingShortcode]);

  /**
   * Funzione di reset del form
   */
  const resetForm = () => {
    setFormData({
      type: shortcodeType,
      title: '',
      label: '',
      content: '',
      options: {
        align: shortcodeType === 'eq' ? 'default' : undefined
      }
    });
    setErrors([]);
  };

  /**
   * Handler per il submit del form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione dei campi required
    const validationErrors = validateShortcode(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Prepara i dati integrando la variant dal parent
    const dataToSubmit = {
      ...formData,
      type: shortcodeType,
      options: {
        ...formData.options,
        ...(shortcodeType === 'def' && { variant: selectedVariant }),
        ...(shortcodeType === 'eq' && { align: formData.options?.align || 'default' })
      }
    };
    
    // Invia i dati al componente parent
    onSubmit(dataToSubmit);
    
    // Reset del form dopo generazione riuscita (solo se non in editing)
    if (!editingShortcode) {
      resetForm();
    }
  };

  /**
   * Handler generico per aggiornare un campo del form
   */
  const handleFieldChange = (field: keyof ShortcodeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Pulisce gli errori quando l'utente modifica un campo
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  /**
   * Handler specifico per le opzioni
   */
  const handleOptionChange = (option: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="shortcode-form">
      {/* ALIGNMENT OPTIONS - solo per tipo 'eq' */}
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
      
      {/* CAMPO TITLE */}
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
            autoFocus={!editingShortcode}
          />
        </div>
      )}
      
      {/* CAMPO LABEL */}
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
      
      {/* CAMPO CONTENT */}
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
            placeholder="Inserisci il contenuto per il componente WikiJs"
            className="form-textarea"
            rows={8} 
          />
          <span className="form-hint">
            Supporta formule LaTeX: $...$, $$...$$, \begin{'{'}equation{'}'}...
          </span>
        </div>
      )}
      
      {/* DISPLAY ERRORI */}
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}
      
      {/* BOTTONI AZIONE */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingShortcode ? 'Aggiorna' : 'Genera Shortcode'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={resetForm}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default ShortcodeForm;