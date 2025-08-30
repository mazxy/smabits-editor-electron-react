import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';

import OutputPanel from './components/OutputPanel';
import PreviewPanel from './components/PreviewPanel';
import StatusBar from './components/StatusBar';
import Settings from './components/Settings';
import { ShortcodeType, ShortcodeFormData, GeneratedShortcode, Project } from './types';
import { generateShortcode } from './config/shortcodes';

import FormPanel from './components/editor/FormPanel/FormPanel';

function App() {
  const [selectedType, setSelectedType] = useState<ShortcodeType>('def');
  const [generatedShortcodes, setGeneratedShortcodes] = useState<GeneratedShortcode[]>([]);
  const [selectedShortcodeIndex, setSelectedShortcodeIndex] = useState<number | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

   // isModified: booleano che indica se ci sono modifiche non salvate
  // setIsModified: funzione per aggiornare il valore di isModified
  // useState(false): valore iniziale false (nessuna modifica all'avvio)
  const [isModified, setIsModified] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);



  // Initialize electron menu listeners
  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onMenuAction((event, data) => {
        switch (event) {
          case 'menu-new-project':
            handleNewProject();
            break;
          case 'menu-open-project':
            handleOpenProject(data);
            break;
          case 'menu-save':
            handleSave();
            break;
          case 'menu-save-as':
            handleSaveAs();
            break;
          case 'menu-export-html':
            handleExportHTML();
            break;
        }
      });
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject, generatedShortcodes]);

  // Load recent projects on startup
  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    if (window.electronAPI) {
      const recent = await window.electronAPI.getStoreValue('recentProjects');
      if (recent && recent.length > 0) {
        // Optionally auto-load the most recent project
        // handleOpenProject(recent[0]);
      }
    }
  };

  const handleNewProject = () => {
    if (isModified) {
      if (!window.confirm('Hai modifiche non salvate. Vuoi continuare?')) {
        return;
      }
    }
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Nuovo Progetto',
      created: Date.now(),
      modified: Date.now(),
      shortcodes: [],
      settings: {
        theme: 'light',
        fontSize: 14,
        autoSave: true,
        previewEnabled: true
      }
    };
    
    setCurrentProject(newProject);
    setGeneratedShortcodes([]);
    setIsModified(false);
  };

  const handleOpenProject = async (filepath: string) => {
    if (window.electronAPI) {
      const result = await window.electronAPI.readFile(filepath);
      if (result.success && result.content) {
        try {
          const project = JSON.parse(result.content) as Project;
          setCurrentProject(project);
          setGeneratedShortcodes(project.shortcodes);
          setIsModified(false);
          
          // Update recent projects
          await updateRecentProjects(filepath);
        } catch (error) {
          alert('Errore nel caricamento del progetto');
        }
      }
    }
  };

  const handleSave = async () => {
    if (!currentProject) {
      handleSaveAs();
      return;
    }
    
    if (window.electronAPI && currentProject) {
      const projectData = {
        ...currentProject,
        shortcodes: generatedShortcodes,
        modified: Date.now()
      };
      
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: `${currentProject.name}.json`,
        filters: [
          { name: 'JSON Files', extensions: ['json'] }
        ]
      });
      
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electronAPI.saveFile({
          path: result.filePath,
          content: JSON.stringify(projectData, null, 2)
        });
        
        if (saveResult.success) {
          setIsModified(false);
          await updateRecentProjects(result.filePath);
        }
      }
    }
  };

  const handleSaveAs = async () => {
    if (window.electronAPI) {
      const projectData: Project = currentProject || {
        id: Date.now().toString(),
        name: 'Nuovo Progetto',
        created: Date.now(),
        modified: Date.now(),
        shortcodes: generatedShortcodes,
        settings: {
          theme: 'light',
          fontSize: 14,
          autoSave: true,
          previewEnabled: true
        }
      };
      
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: `${projectData.name}.json`,
        filters: [
          { name: 'JSON Files', extensions: ['json'] }
        ]
      });
      
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electronAPI.saveFile({
          path: result.filePath,
          content: JSON.stringify(projectData, null, 2)
        });
        
        if (saveResult.success) {
          setCurrentProject(projectData);
          setIsModified(false);
          await updateRecentProjects(result.filePath);
        }
      }
    }
  };

  const handleExportHTML = async () => {
    const html = generateHTMLExport();
    
    if (window.electronAPI) {
      const result = await window.electronAPI.showSaveDialog({
        defaultPath: 'shortcodes.html',
        filters: [
          { name: 'HTML Files', extensions: ['html'] }
        ]
      });
      
      if (!result.canceled && result.filePath) {
        await window.electronAPI.saveFile({
          path: result.filePath,
          content: html
        });
      }
    }
  };

  const generateHTMLExport = () => {
    const codes = generatedShortcodes.map(s => s.code).join('\n\n');
    return `<!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <title>SMABITS Shortcodes Export</title>
                  <style>
                      body { font-family: 'Courier New', monospace; padding: 20px; background: #f5f5f5; }
                      pre { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                      h1 { color: #333; }
                      .timestamp { color: #666; font-size: 0.9em; }
                  </style>
              </head>
              <body>
                  <h1>SMABITS Shortcodes Export</h1>
                  <p class="timestamp">Esportato il: ${new Date().toLocaleString('it-IT')}</p>
                  <pre>${codes}</pre>
              </body>
              </html>`;
  };

  const updateRecentProjects = async (filepath: string) => {
    if (window.electronAPI) {
      const recent = await window.electronAPI.getStoreValue('recentProjects') || [];
      const updated = [filepath, ...recent.filter((p: string) => p !== filepath)].slice(0, 5);
      await window.electronAPI.setStoreValue('recentProjects', updated);
    }
  };

  const handleGenerate = useCallback((formData: ShortcodeFormData) => {
    console.log('handleGenerate chiamato');
    console.log('selectedShortcodeIndex:', selectedShortcodeIndex);
    console.log('generatedShortcodes:', generatedShortcodes);
    
    const code = generateShortcode(formData);
    const shortcode: GeneratedShortcode = {
      code,
      preview: code,
      timestamp: Date.now(),
      formData
    };
    
    const editingShortcode = selectedShortcodeIndex !== null 
      ? generatedShortcodes[selectedShortcodeIndex] 
      : undefined;
    
    console.log('editingShortcode:', editingShortcode);
    
    if (selectedShortcodeIndex !== null && editingShortcode) {
      console.log('MODALITÀ EDITING');
      setGeneratedShortcodes(prev => {
        const updated = [...prev];
        updated[selectedShortcodeIndex] = shortcode;
        return updated;
      });
    } else {
      console.log('MODALITÀ CREAZIONE');
      setGeneratedShortcodes(prev => [...prev, shortcode]);
      setSelectedShortcodeIndex(generatedShortcodes.length);
    }
    
    setIsModified(true);
  }, [generatedShortcodes, selectedShortcodeIndex]);

  const handleDeleteShortcode = (index: number) => {
    setGeneratedShortcodes(prev => prev.filter((_, i) => i !== index));
    setSelectedShortcodeIndex(null);
    setIsModified(true);
  };

  const handleEditShortcode = (index: number) => {
    const shortcode = generatedShortcodes[index];
    setSelectedType(shortcode.formData.type);
    setSelectedShortcodeIndex(index);
  };

  const handleCancelEdit = () => {
    setSelectedShortcodeIndex(null);
  };

  return (
    <div className="app">
      {/* Zona trascinabile per macOS */}
      <div className="app-titlebar" />
      
      {/* Settings Overlay */}
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      {/* Main Application */}
      {!isSettingsOpen && (
        <div className="app-container">
          <Sidebar 
            selectedType={selectedType}
            onSelectType={setSelectedType}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          
          <div className="main-content">
            <div className="panels-container">
              <FormPanel
                shortcodeType={selectedType}
                onGenerate={handleGenerate}
                editingShortcode={selectedShortcodeIndex !== null ? generatedShortcodes[selectedShortcodeIndex] : undefined}
                onCancelEdit={handleCancelEdit}
              />
              
              <OutputPanel
                shortcodes={generatedShortcodes}
                selectedIndex={selectedShortcodeIndex}
                onSelect={setSelectedShortcodeIndex}
                onDelete={handleDeleteShortcode}
                onEdit={handleEditShortcode}
              />
              
              <PreviewPanel
                shortcode={selectedShortcodeIndex !== null ? generatedShortcodes[selectedShortcodeIndex] : null}
              />
            </div>
            
            <StatusBar
              projectName={currentProject?.name || 'Nessun progetto'}
              isModified={isModified}
              shortcodeCount={generatedShortcodes.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;