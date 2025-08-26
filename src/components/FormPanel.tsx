import React, { useState, useEffect } from 'react';
import { ShortcodeType, ShortcodeFormData, GeneratedShortcode } from '../types';
import { shortcodeConfigs, defVariants, validateShortcode } from '../config/shortcodes';
import './FormPanel.css';

/**
 * Props per il componente FormPanel
 * @interface FormPanelProps
 * @property {ShortcodeType} shortcodeType - Tipo di shortcode selezionato dalla sidebar
 * @property {Function} onGenerate - Callback per inviare i dati del form al parent
 * @property {GeneratedShortcode} editingShortcode - Shortcode da editare (opzionale)
 */
interface FormPanelProps {
  shortcodeType: ShortcodeType;
  onGenerate: (formData: ShortcodeFormData) => void;
  editingShortcode?: GeneratedShortcode;
}

/**
 * FormPanel Component
 * Gestisce l'input utente per la generazione di shortcode Wiki.js
 * Adatta dinamicamente i campi visualizzati in base al tipo selezionato
 */
const FormPanel: React.FC<FormPanelProps> = ({ shortcodeType, onGenerate, editingShortcode }) => {
  // Stato per la variante selezionata (solo per tipo 'def')
  const [selectedVariant, setSelectedVariant] = useState<string>('def');
  
  // Stato principale del form che contiene tutti i dati
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
  
  // Array di messaggi di errore per la validazione
  const [errors, setErrors] = useState<string[]>([]);
  
  // Recupera la configurazione per il tipo corrente
  const config = shortcodeConfigs[shortcodeType];

  /**
   * useEffect per sincronizzare il form con le props esterne
   * Scatta quando:
   * - Il tipo di shortcode cambia (user clicca nella sidebar)
   * - Si entra/esce dalla modalità editing
   */
  useEffect(() => {
    if (editingShortcode) {
      // MODALITÀ EDITING: popola il form con dati esistenti
      setFormData(editingShortcode.formData);
      setSelectedVariant(editingShortcode.formData.options?.variant || 'def');
    } else {
      // MODALITÀ CREAZIONE: reset completo del form
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
    // Pulisce errori quando cambia modalità o tipo
    setErrors([]);
  }, [shortcodeType, editingShortcode]);

  /**
   * Handler per il submit del form
   * Valida i dati, prepara il payload e chiama onGenerate
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene il refresh della pagina
    
    // Validazione dei campi required
    const validationErrors = validateShortcode(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return; // Blocca il submit se ci sono errori
    }
    
    // Prepara i dati assicurando tipo e opzioni corretti
    const dataToGenerate = {
      ...formData,
      type: shortcodeType,  // Forza il tipo corrente
      options: {
        ...formData.options,
        // Include variant solo per 'def', align solo per 'eq'
        variant: shortcodeType === 'def' ? selectedVariant : undefined,
        align: shortcodeType === 'eq' ? (formData.options?.align || 'default') : undefined
      }
    };
    
    // Invia i dati al componente parent
    onGenerate(dataToGenerate);
    
    // Reset del form dopo generazione riuscita
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

  /**
   * Handler generico per aggiornare un campo del form
   * @param field - Nome del campo da aggiornare (type-safe con keyof)
   * @param value - Nuovo valore del campo
   */
  const handleFieldChange = (field: keyof ShortcodeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      type: shortcodeType,  // Mantiene sempre il tipo corrente
      [field]: value         // Computed property per aggiornare il campo dinamicamente
    }));
    setErrors([]); // Pulisce errori quando l'utente modifica
  };

  /**
   * Handler specifico per le opzioni (nested object)
   * @param option - Nome dell'opzione (es: 'starred', 'align')
   * @param value - Nuovo valore dell'opzione
   */
  const handleOptionChange = (option: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      type: shortcodeType,  // Mantiene sempre il tipo corrente
      options: {
        ...prev.options,
        [option]: value      // Aggiorna solo l'opzione specifica
      }
    }));
  };

  return (
    <div className="form-panel">
      {/* HEADER DEL PANNELLO - sempre visibile */}
      <div className="panel-header">
        <h3>
          <span className="icon">{config.icon}</span>
          {config.label}
        </h3>
        <span className="panel-subtitle">{config.description}</span>
      </div>
      
      {/* VARIANT SELECTOR - visibile solo per tipo 'def' */}
      {shortcodeType === 'def' && (
        <div className="variant-selector">
          <label className="form-label">Scegli il tipo di box:</label>
          <div className="variant-grid">
            {/* Mappa tutte le varianti disponibili da defVariants */}
            {Object.entries(defVariants).map(([key, variant]) => (
              <button
                key={key}
                type="button"
                className={`variant-btn ${selectedVariant === key ? 'active' : ''}`}
                onClick={() => {
                  setSelectedVariant(key);        // Aggiorna stato locale
                  handleOptionChange('variant', key); // Aggiorna formData
                }}
                style={{
                  '--variant-color': variant.color  // CSS custom property per il colore
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
      
      {/* ALIGNMENT OPTIONS - visibile solo per tipo 'eq' */}
      {shortcodeType === 'eq' && (
        <div className="eq-options">
          <label className="form-label">Opzioni Equazione:</label>
          <div className="align-options">
            {/* Radio button per allineamento default */}
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
            {/* Radio button per allineamento sinistro */}
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
            {/* Radio button per allineamento centro */}
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
            {/* Radio button per allineamento destro */}
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
      
      {/* FORM PRINCIPALE con campi dinamici */}
      <form onSubmit={handleSubmit} className="shortcode-form">
        {/* CAMPO TITLE - renderizzato solo se config.hasTitle è true */}
        {config.hasTitle && (
          <div className="form-group">
            <label htmlFor="title">
              Titolo
              <span className="required">*</span> {/* Asterisco per campo required */}
            </label>
            <input
              type="text"
              id="title"
              value={formData.title || ''} {/* Fallback a stringa vuota per evitare warning */}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Es: Convergenza uniforme"
              className="form-input"
            />
          </div>
        )}
        
        {/* CAMPO LABEL - renderizzato solo se config.hasLabel è true */}
        {config.hasLabel && (
          <div className="form-group">
            <label htmlFor="label">
              Label (per riferimenti)
              <span className="optional">opzionale</span> {/* Indica campo non required */}
            </label>
            <input
              type="text"
              id="label"
              value={formData.label || ''}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              placeholder="Es: convergenza_uniforme"
              className="form-input"
              pattern="[a-zA-Z0-9_]+" {/* HTML5 pattern per validazione client-side */}
            />
            <span className="form-hint">
              Solo lettere, numeri e underscore. Usato per \ref{'{'}label{'}'}
            </span>
          </div>
        )}
        
        {/* CAMPO CONTENT - renderizzato solo se config.hasContent è true */}
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
              rows={8} {/* Altezza iniziale della textarea */}
            />
            <span className="form-hint">
              Supporta formule LaTeX: $...$, $$...$$, \begin{'{'}equation{'}'}...
            </span>
          </div>
        )}
        
        {/* OPZIONI COMUNI - sempre visibile */}
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
        
        {/* DISPLAY ERRORI - visibile solo se ci sono errori */}
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
          {/* Bottone submit - testo cambia in base a modalità edit/create */}
          <button type="submit" className="btn btn-primary">
            {editingShortcode ? '💾 Aggiorna' : '✨ Genera Shortcode'}
          </button>
          {/* Bottone reset - pulisce il form */}
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
      
      {/* SUGGERIMENTI CONTESTUALI - cambiano in base al tipo */}
      <div className="form-tips">
        <h4>💡 Suggerimenti</h4>
        {shortcodeType === 'eq' ? (
          // Suggerimenti specifici per equazioni
          <ul>
            <li>Formula inline: <code>x^2 + y^2 = z^2</code></li>
            <li>Frazione: <code>\frac{'{'}a{'}'}{'{'}b{'}'}</code></li>
            <li>Integrale: <code>\int_0^1 f(x)dx</code></li>
            <li>Sommatoria: <code>\sum_{'{'}i=1{'}'}^n x_i</code></li>
            <li>Matrice: <code>\begin{'{'}matrix{'}'} a & b \\ c & d \end{'{'}matrix{'}'}</code></li>
          </ul>
        ) : (
          // Suggerimenti generici per altri tipi
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