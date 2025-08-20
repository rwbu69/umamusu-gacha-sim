'use client';

import { useState } from 'react';
import { useGacha } from '../context/GachaContext';

export default function SettingsPage() {
  const { resetAllData, exportData, importData, getCacheInfo } = useGacha();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [message, setMessage] = useState('');

  const cacheInfo = getCacheInfo();

  const handleExport = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uma_gacha_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('Data exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImport = () => {
    if (!importFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const success = importData(data);
        
        if (success) {
          setMessage('Data imported successfully! Please refresh the page.');
          setImportFile(null);
        } else {
          setMessage('Failed to import data. Please check the file format.');
        }
      } catch (error) {
        setMessage('Invalid file format. Please select a valid backup file.');
      }
      
      setTimeout(() => setMessage(''), 5000);
    };
    
    reader.readAsText(importFile);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    setMessage('All data has been reset!');
    setTimeout(() => {
      setMessage('');
      window.location.reload(); // Refresh to show reset state
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8F3CE', color: '#57564F' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Settings & Data Management</h1>
          <p className="text-lg opacity-80">
            Manage your gacha data, export backups, and view cache information
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div 
            className="mb-6 p-4 rounded-lg text-center font-medium"
            style={{ 
              backgroundColor: message.includes('Failed') || message.includes('Invalid') 
                ? 'rgba(239, 68, 68, 0.1)' 
                : 'rgba(34, 197, 94, 0.1)',
              color: message.includes('Failed') || message.includes('Invalid') 
                ? '#dc2626' 
                : '#16a34a',
              border: message.includes('Failed') || message.includes('Invalid') 
                ? '1px solid rgba(239, 68, 68, 0.2)' 
                : '1px solid rgba(34, 197, 94, 0.2)'
            }}
          >
            {message}
          </div>
        )}

        {/* Cache Information */}
        <div 
          className="mb-8 p-6 rounded-lg border-2"
          style={{ 
            backgroundColor: 'rgba(87, 86, 79, 0.05)',
            borderColor: 'rgba(87, 86, 79, 0.2)'
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Cache Information</h2>
          {cacheInfo ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Gacha Data Size:</span>
                  <span className="font-semibold">{cacheInfo.gachaDataSize}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Pull History Size:</span>
                  <span className="font-semibold">{cacheInfo.pullHistorySize}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Total Cache Size:</span>
                  <span className="font-semibold">{cacheInfo.totalSize.toFixed(2)} KB</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span>Last Saved:</span>
                  <span className="font-semibold">
                    {cacheInfo.lastSaved 
                      ? new Date(cacheInfo.lastSaved).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Browser Storage:</span>
                  <span className="font-semibold text-green-600">Available</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Cache information not available</p>
          )}
        </div>

        {/* Data Management Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Export Data */}
          <div 
            className="p-6 rounded-lg border-2"
            style={{ 
              backgroundColor: 'rgba(87, 86, 79, 0.05)',
              borderColor: 'rgba(87, 86, 79, 0.2)'
            }}
          >
            <h3 className="text-xl font-bold mb-4">Export Data</h3>
            <p className="mb-4 opacity-80 text-sm">
              Download a backup of your collection, pull history, and gacha progress.
            </p>
            <button
              onClick={handleExport}
              className="w-full button-press px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{ 
                backgroundColor: '#57564F', 
                color: '#F8F3CE' 
              }}
            >
              Export Backup
            </button>
          </div>

          {/* Import Data */}
          <div 
            className="p-6 rounded-lg border-2"
            style={{ 
              backgroundColor: 'rgba(87, 86, 79, 0.05)',
              borderColor: 'rgba(87, 86, 79, 0.2)'
            }}
          >
            <h3 className="text-xl font-bold mb-4">Import Data</h3>
            <p className="mb-4 opacity-80 text-sm">
              Restore your data from a previously exported backup file.
            </p>
            <div className="space-y-3">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files[0])}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: 'rgba(87, 86, 79, 0.3)',
                  backgroundColor: '#F8F3CE'
                }}
              />
              <button
                onClick={handleImport}
                disabled={!importFile}
                className="w-full button-press px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#57564F', 
                  color: '#F8F3CE' 
                }}
              >
                Import Backup
              </button>
            </div>
          </div>
        </div>

        {/* Reset Data */}
        <div 
          className="p-6 rounded-lg border-2"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
            borderColor: 'rgba(239, 68, 68, 0.2)'
          }}
        >
          <h3 className="text-xl font-bold mb-4 text-red-600">Reset All Data</h3>
          <p className="mb-4 opacity-80 text-sm">
            This will permanently delete your collection, pull history, and all progress. 
            This action cannot be undone.
          </p>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="button-press px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
            >
              Reset All Data
            </button>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-red-600">
                Are you sure? This action cannot be undone!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="button-press px-6 py-3 rounded-lg font-semibold transition-all duration-200 bg-red-500 text-white hover:bg-red-600"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="button-press px-6 py-3 rounded-lg font-semibold transition-all duration-200 border-2"
                  style={{ 
                    borderColor: '#57564F',
                    color: '#57564F',
                    backgroundColor: 'transparent'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div 
          className="mt-8 p-6 rounded-lg"
          style={{ backgroundColor: 'rgba(87, 86, 79, 0.05)' }}
        >
          <h3 className="text-xl font-bold mb-4">How Data Caching Works</h3>
          <div className="space-y-2 text-sm opacity-80">
            <p>• Your collection and progress are automatically saved to your browser's local storage</p>
            <p>• Data persists between browser sessions and page refreshes</p>
            <p>• Export regular backups to protect against data loss</p>
            <p>• Clearing browser data will remove your progress unless you have a backup</p>
            <p>• Data is stored locally and never sent to external servers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
