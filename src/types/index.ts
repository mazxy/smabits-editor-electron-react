


// =====================================
// TIPI PER GLI SHORTCODE WIKI.JS
// =====================================

/**
 * Tipi di shortcode disponibili nel sistema.
 * Rappresentano diversi blocchi custom per Wiki.js.
 * 
 * @example
 * 'def' -> Box definizioni colorati stile Notion/Obsidian
 * 'eq' -> Blocchi equazioni con KaTeX/MathJax
 * 'theorem' -> Blocchi teoremi con numerazione automatica
 */
export type ShortcodeType = 
  | 'def'         // Definizioni - box colorati con varianti (info, warning, tip, etc)
  | 'eq'          // Equazioni - blocchi matematici con rendering KaTeX
  | 'section'     // NUOVO: Sezioni con titoli numerati e stilizzati
  | 'theorem'     // Teoremi - blocchi formali numerati
  | 'example'     // Esempi - box per casi pratici
  | 'proof'       // Dimostrazioni - blocchi con QED finale
  | 'nota'        // Note - callout per annotazioni
  | 'corollary'   // Corollari - conseguenze di teoremi
  | 'lemma'       // Lemmi - risultati preliminari
  | 'proposition' // Proposizioni - enunciati formali
  | 'remark'      // Osservazioni - note a margine
  | 'exercise';   // Esercizi - box per problemi

/**
 * Configurazione completa per ogni tipo di shortcode.
 * Definisce come ogni shortcode si comporta e viene visualizzato nell'UI.
 */
export interface ShortcodeConfig {
  type: ShortcodeType;        // Tipo di shortcode
  label: string;               // Nome visualizzato nell'UI (es: "Definizione")
  icon: string;                // Emoji/icona per rappresentarlo visualmente
  color: string;               // Colore del tema (per UI e preview)
  hasTitle: boolean;           // Se richiede un titolo obbligatorio
  hasLabel?: boolean;          // Se supporta label per ancore/link interni Wiki.js
  hasContent: boolean;         // Se ha un campo contenuto principale
  template: string;            // Template dello shortcode Wiki.js generato
  description: string;         // Descrizione per tooltip/help
  category: 'definition' | 'theorem' | 'example' | 'other'; // Categoria per raggruppamento UI
  active?: boolean;            // Se è attualmente attivato/visibile nell'UI
}

// ---------------------------
/**
 * Dati del form compilati dall'utente per generare uno shortcode.
 * Contiene tutti i campi e le opzioni inserite nel pannello di input.
 */
export interface ShortcodeFormData {
  type: ShortcodeType;         // Tipo selezionato
  title?: string;              // Titolo del blocco (opzionale per alcuni tipi)
  label?: string;              // ID per link interni Wiki.js (es: "#convergenza")
  content: string;             // Contenuto principale (Markdown + KaTeX)
  options?: {
    // Opzioni specifiche per DEF
    variant?: string;
    customKicker?: string;
    
    // Opzioni specifiche per EQ  
    align?: string;            // Allineamento formula: 'left', 'center', 'right', 'default'

    // Opzioni specifiche per SECTION
    number?: string;          // Numerazione personalizzata (es: "1.2", "A", "III")
    level?: '1' | '2' | '3' | '4' | '5' | '6'; // Livello gerarchico (default: '1')
    width?: 'auto' | 'full' | 'half' | 'third' | 'two-thirds' | 'three-quarters' | string;
    margintop?: 'none' | 'small' | 'medium' | 'normal' | 'large' | 'xLarge' | string;
    marginbottom?: 'none' | 'small' | 'medium' | 'normal' | 'large' | 'xLarge' | string;
    style?: 'fullbg' | 'default';
  };
}
// ---------------------------

/**
 * Shortcode completo generato dal sistema.
 * Contiene sia il codice che i metadati per editing e preview.
 */
export interface GeneratedShortcode {
  code: string;                // Codice shortcode Wiki.js [def variant="info"]...[/def]
  preview: string;             // HTML di anteprima renderizzato
  timestamp: number;           // Data/ora di generazione (per ordinamento)
  formData: ShortcodeFormData; // Dati originali del form (per re-editing)
}

// =====================================
// TIPI PER LA GESTIONE PROGETTI
// =====================================

/**
 * Progetto completo con tutti gli shortcode generati.
 * Rappresenta un file .json salvato che può essere riaperto.
 */
export interface Project {
  id: string;                          // UUID univoco del progetto
  name: string;                        // Nome del progetto (es: "Corso Analisi")
  created: number;                     // Timestamp di creazione
  modified: number;                    // Timestamp ultima modifica
  shortcodes: GeneratedShortcode[];    // Array di tutti gli shortcode generati
  settings: ProjectSettings;           // Impostazioni specifiche del progetto
}

/**
 * Impostazioni personalizzate per ogni progetto.
 * Salvate insieme al progetto per ripristinare l'ambiente di lavoro.
 */
export interface ProjectSettings {
  theme: 'light' | 'dark';     // Tema dell'interfaccia
  fontSize: number;             // Dimensione font per preview/editor
  autoSave: boolean;            // Salvataggio automatico attivo
  previewEnabled: boolean;      // Preview live attiva
  customPreamble?: string;      // CSS/JS custom per preview avanzate
}

// =====================================
// TIPI PER LO STATO DELL'APPLICAZIONE
// =====================================

/**
 * Stato globale dell'applicazione React.
 * Gestisce il progetto corrente e lo stato dell'UI.
 */
export interface AppState {
  currentProject: Project | null;      // Progetto attualmente aperto
  recentProjects: string[];            // Lista path progetti recenti
  isModified: boolean;                 // Flag per modifiche non salvate
  activeShortcodeIndex: number | null; // Indice shortcode in editing
}

// =====================================
// TIPI PER L'API ELECTRON (IPC)
// =====================================

/**
 * Interfaccia completa per comunicare con il processo main di Electron.
 * Esposta tramite contextBridge nel preload script.
 * 
 * @description
 * Tutte le funzioni sono asincrone perché utilizzano IPC (Inter-Process Communication).
 * Il renderer process comunica con il main process che ha accesso al file system.
 */
export interface ElectronAPI {
  // --- Storage persistente (electron-store) ---
  getStoreValue: (key: string) => Promise<any>;           // Legge valore da store persistente
  setStoreValue: (key: string, value: any) => Promise<void>; // Salva valore in store
  
  // --- File system operations ---
  saveFile: (data: { 
    path: string; 
    content: string 
  }) => Promise<{ 
    success: boolean; 
    error?: string 
  }>;
  
  readFile: (path: string) => Promise<{ 
    success: boolean; 
    content?: string; 
    error?: string 
  }>;
  
  // --- Dialog nativi del sistema ---
  showSaveDialog: (options: any) => Promise<any>;  // Dialog salvataggio file
  showOpenDialog: (options: any) => Promise<any>;  // Dialog apertura file
  
  // --- Eventi menu ---
  onMenuAction: (callback: (event: string, data?: any) => void) => void; // Listener menu
  removeAllListeners: () => void;  // Cleanup listeners su unmount
  
  // --- SSH API per connessione remota ---
  /**
   * Stabilisce connessione SSH con un server remoto.
   * Usato per deploy diretto su server Wiki.js o sync contenuti.
   */
  sshConnect: (config: { 
    host: string;     // Indirizzo IP o dominio server Wiki.js
    port: string;     // Porta SSH (default: 22)
    username: string; // Username SSH
    password: string; // Password (considera key-based auth per sicurezza)
  }) => Promise<{
    success: boolean;
    message?: string;     // Messaggio di benvenuto del server
    systemInfo?: string;  // Info sistema remoto (versione Wiki.js, etc)
    error?: string;       // Errore se connessione fallita
  }>;
  
  sshDisconnect: () => Promise<{ 
    success: boolean; 
    error?: string 
  }>;
  
  sshExecute: (command: string) => Promise<{ 
    success: boolean; 
    output?: string;  // Output del comando
    error?: string    // Stderr o errore
  }>;
  
  sshCheckConnection: () => Promise<{ 
    connected: boolean  // Stato connessione attuale
  }>;
}

/**
 * Dichiarazione globale per TypeScript.
 * Informa TS che window.electronAPI esiste ed è disponibile.
 * 
 * @note
 * Viene iniettato dal preload script di Electron tramite contextBridge.
 * Disponibile solo in ambiente Electron, non in browser normale.
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}