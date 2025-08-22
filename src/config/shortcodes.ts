import { ShortcodeConfig, ShortcodeType, ShortcodeFormData } from '../types';

// Configurazione principale shortcode DEF con tutte le varianti
export const defVariants = {
  // TIPO BASE: def (rosso)
  def: {
    label: 'Definizione',
    icon: '📘',
    color: '#e03131',
    kicker: 'DEFINIZIONE',
    type: 'def',
    description: 'Box rosso per definizioni'
  },
  
  // TIPO BASE: theorem (verde)
  theorem: {
    label: 'Teorema',
    icon: '📐',
    color: '#2f9e44',
    kicker: 'TEOREMA',
    type: 'theorem',
    description: 'Box verde per teoremi'
  },
  
  // TIPO BASE: note (blu)
  note: {
    label: 'Nota',
    icon: '📝',
    color: '#1c7ed6',
    kicker: 'NOTA',
    type: 'note',
    description: 'Box blu per note'
  },
  
  // VARIANTI CON TYPE="theorem" (verdi)
  lemma: {
    label: 'Lemma',
    icon: '🔧',
    color: '#2f9e44',
    kicker: 'LEMMA',
    type: 'theorem', // ✅ Corretto: box verde
    description: 'Lemma matematico (box verde)'
  },
  
  corollary: {
    label: 'Corollario',
    icon: '🔗',
    color: '#2f9e44',
    kicker: 'COROLLARIO',
    type: 'theorem', // ✅ Corretto: box verde
    description: 'Corollario di un teorema (box verde)'
  },
  
  proposition: {
    label: 'Proposizione',
    icon: '📋',
    color: '#2f9e44',
    kicker: 'PROPOSIZIONE',
    type: 'theorem', // ✅ Corretto: box verde
    description: 'Proposizione matematica (box verde)'
  },
  
  proof: {
    label: 'Dimostrazione',
    icon: '✓',
    color: '#2f9e44',
    kicker: 'DIMOSTRAZIONE',
    type: 'theorem', // ✅ Corretto: le dimostrazioni sono associate ai teoremi (verde)
    description: 'Dimostrazione matematica (box verde)'
  },
  
  // VARIANTI CON TYPE="note" (blu)
  example: {
    label: 'Esempio',
    icon: '💡',
    color: '#1c7ed6',
    kicker: 'ESEMPIO',
    type: 'note', // ✅ Corretto: box blu
    description: 'Esempio illustrativo (box blu)'
  },
  
  exercise: {
    label: 'Esercizio',
    icon: '📚',
    color: '#1c7ed6',
    kicker: 'ESERCIZIO',
    type: 'note', // ✅ Corretto: box blu
    description: 'Esercizio da svolgere (box blu)'
  },
  
  remark: {
    label: 'Osservazione',
    icon: '👁',
    color: '#1c7ed6',
    kicker: 'OSSERVAZIONE',
    type: 'note', // ✅ Corretto: box blu
    description: 'Osservazione importante (box blu)'
  }
};

export const shortcodeConfigs: Record<ShortcodeType, ShortcodeConfig> = {
  // SHORTCODE ATTIVO: DEF (con tutte le sue varianti)
  def: {
    type: 'def',
    label: 'DEF - Box Definizioni',
    icon: '📦',
    color: '#667eea',
    hasTitle: true,
    hasLabel: false,
    hasContent: true,
    category: 'definition',
    description: 'Crea box per definizioni, teoremi, note e altro',
    template: `[def{attrs}]
{content}
[/def]`,
    active: true
  },
  
  // SHORTCODE ATTIVO: EQ (equazioni)
  eq: {
    type: 'eq',
    label: 'EQ - Equazioni',
    icon: '🔢',
    color: '#10b981',
    hasTitle: false,
    hasLabel: false,
    hasContent: true,
    category: 'definition',
    description: 'Inserisci equazioni e formule matematiche',
    template: `[eq{attrs}]
{content}
[/eq]`,
    active: true
  },
  
  // SHORTCODE FUTURI (non ancora attivi)
  theorem: {
    type: 'theorem',
    label: 'TITLE - Titoli Stilizzati',
    icon: '🏷️',
    color: '#9CA3AF',
    hasTitle: true,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  example: {
    type: 'example',
    label: 'CARDS - Schede',
    icon: '🎴',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  proof: {
    type: 'proof',
    label: 'TABS - Pannelli',
    icon: '📑',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  nota: {
    type: 'nota',
    label: 'ACCORDION - Fisarmonica',
    icon: '🪗',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  corollary: {
    type: 'corollary',
    label: 'TABLE - Tabelle',
    icon: '📊',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  lemma: {
    type: 'lemma',
    label: 'MEDIA - Immagini/Video',
    icon: '🖼️',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  proposition: {
    type: 'proposition',
    label: 'CODE - Blocchi Codice',
    icon: '💻',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  remark: {
    type: 'remark',
    label: 'QUIZ - Quiz Interattivi',
    icon: '❓',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  },
  
  exercise: {
    type: 'exercise',
    label: 'TIMELINE - Timeline',
    icon: '📅',
    color: '#9CA3AF',
    hasTitle: false,
    hasLabel: false,
    hasContent: false,
    category: 'other',
    description: 'Coming soon...',
    template: '',
    active: false
  }
};

export const shortcodeCategories = {
  definition: {
    label: 'Shortcode Attivi',
    color: '#3B82F6'
  },
  theorem: {
    label: 'Coming Soon',
    color: '#9CA3AF'
  },
  example: {
    label: 'In Sviluppo',
    color: '#9CA3AF'
  },
  other: {
    label: 'Prossimamente',
    color: '#9CA3AF'
  }
};

// Helper functions
export function generateShortcode(formData: ShortcodeFormData): string {
  // Se è un EQ (equazione)
  if (formData.type === 'eq') {
    let attrs = '';
    
    // Aggiungi align se specificato
    if (formData.options?.align && formData.options.align !== 'default') {
      attrs += ` align="${formData.options.align}"`;
    }
    
    return `[eq${attrs}]\n${formData.content || ''}\n[/eq]`;
  }
  
  // Se è un DEF con variante
  if (formData.type === 'def' && formData.options?.variant) {
    const variant = defVariants[formData.options.variant as keyof typeof defVariants];
    let attrs = '';
    
    // Aggiungi type se diverso da def
    if (variant.type !== 'def') {
      attrs += ` type="${variant.type}"`;
    }
    
    // Aggiungi kicker personalizzato se diverso dal default
    if (formData.options.customKicker) {
      attrs += ` kicker="${formData.options.customKicker}"`;
    } else if (variant.kicker !== 'DEFINIZIONE' && variant.type === 'def') {
      attrs += ` kicker="${variant.kicker}"`;
    }
    
    // Aggiungi title se presente
    if (formData.title) {
      attrs += ` title="${formData.title}"`;
    }
    
    return `[def${attrs}]\n${formData.content || ''}\n[/def]`;
  }
  
  // Altri shortcode (per il futuro)
  const config = shortcodeConfigs[formData.type];
  return config.template.replace('{content}', formData.content || '');
}

export function validateShortcode(formData: ShortcodeFormData): string[] {
  const errors: string[] = [];
  const config = shortcodeConfigs[formData.type];
  
  if (config.hasContent && !formData.content?.trim()) {
    errors.push('Il contenuto è obbligatorio');
  }
  
  return errors;
}