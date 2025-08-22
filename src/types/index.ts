// Shortcode types
export type ShortcodeType = 
  | 'def' 
  | 'eq'  // Aggiunto eq
  | 'theorem' 
  | 'example' 
  | 'proof' 
  | 'nota' 
  | 'corollary'
  | 'lemma'
  | 'proposition'
  | 'remark'
  | 'exercise';

export interface ShortcodeConfig {
  type: ShortcodeType;
  label: string;
  icon: string;
  color: string;
  hasTitle: boolean;
  hasLabel?: boolean;
  hasContent: boolean;
  template: string;
  description: string;
  category: 'definition' | 'theorem' | 'example' | 'other';
  active?: boolean;  // Nuovo campo per indicare se è attivo
}

export interface ShortcodeFormData {
  type: ShortcodeType;
  title?: string;
  label?: string;
  content: string;
  options?: {
    numbered?: boolean;
    starred?: boolean;
    customEnv?: string;
    variant?: string;  // Per DEF: tipo di variante
    customKicker?: string;  // Per DEF: kicker personalizzato
    align?: string;  // Per EQ: allineamento (left, center, right)
  };
}

export interface GeneratedShortcode {
  code: string;
  preview: string;
  timestamp: number;
  formData: ShortcodeFormData;
}

// Project types
export interface Project {
  id: string;
  name: string;
  created: number;
  modified: number;
  shortcodes: GeneratedShortcode[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  previewEnabled: boolean;
  customPreamble?: string;
}

// App state types
export interface AppState {
  currentProject: Project | null;
  recentProjects: string[];
  isModified: boolean;
  activeShortcodeIndex: number | null;
}

// Electron API types
export interface ElectronAPI {
  getStoreValue: (key: string) => Promise<any>;
  setStoreValue: (key: string, value: any) => Promise<void>;
  saveFile: (data: { path: string; content: string }) => Promise<{ success: boolean; error?: string }>;
  readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>;
  showSaveDialog: (options: any) => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  onMenuAction: (callback: (event: string, data?: any) => void) => void;
  removeAllListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}