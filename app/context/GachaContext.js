'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import GachaSystem from '../lib/gacha';

const GachaContext = createContext();

export function GachaProvider({ children }) {
  const [gachaSystem, setGachaSystem] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [pullHistory, setPullHistory] = useState([]);

  useEffect(() => {
    // Initialize gacha system
    const system = new GachaSystem();
    setGachaSystem(system);

    // Load pull history from localStorage
    loadPullHistory();

    // Load characters data
    const loadCharacters = async () => {
      try {
        const response = await fetch('/data/characters.json');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Failed to load characters:', error);
      }
    };

    loadCharacters();
  }, []);

  const loadPullHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('uma_pull_history');
        if (cached) {
          const history = JSON.parse(cached);
          setPullHistory(history.slice(0, 100)); // Keep last 100 pulls
        }
      } catch (error) {
        console.error('Failed to load pull history from cache:', error);
      }
    }
  };

  const savePullHistory = (newHistory) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('uma_pull_history', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save pull history to cache:', error);
      }
    }
  };

  const performPull = () => {
    if (!gachaSystem || characters.length === 0) return null;
    
    const result = gachaSystem.performPull(characters);
    if (result) {
      const newHistory = [result, ...pullHistory].slice(0, 100); // Keep last 100 pulls
      setPullHistory(newHistory);
      savePullHistory(newHistory);
    }
    return result;
  };

  const performMultiPull = (count = 10) => {
    if (!gachaSystem || characters.length === 0) return [];
    
    const results = gachaSystem.performMultiPull(characters, count);
    if (results.length > 0) {
      const newHistory = [...results.reverse(), ...pullHistory].slice(0, 100);
      setPullHistory(newHistory);
      savePullHistory(newHistory);
    }
    return results;
  };

  const getCollectionStats = () => {
    if (!gachaSystem) return { totalOwned: 0, totalPulls: 0, currentMode: 'normal' };
    return gachaSystem.getCollectionStats();
  };

  const getOwnedCharacters = () => {
    if (!gachaSystem) return [];
    return gachaSystem.getOwnedCharacters();
  };

  const isCharacterOwned = (characterId) => {
    if (!gachaSystem) return false;
    return gachaSystem.isCharacterOwned(characterId);
  };

  const resetAllData = () => {
    if (gachaSystem) {
      gachaSystem.resetData();
      setPullHistory([]);
      savePullHistory([]);
      
      // Clear localStorage completely
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uma_gacha_data');
        localStorage.removeItem('uma_pull_history');
      }
    }
  };

  const exportData = () => {
    if (!gachaSystem) return null;
    
    return {
      gachaData: gachaSystem.exportData(),
      pullHistory: pullHistory,
      exportedAt: Date.now(),
      version: '1.0'
    };
  };

  const importData = (data) => {
    if (!gachaSystem || !data) return false;
    
    try {
      // Import gacha system data
      const success = gachaSystem.importData(data.gachaData);
      
      if (success && data.pullHistory) {
        // Import pull history
        setPullHistory(data.pullHistory.slice(0, 100));
        savePullHistory(data.pullHistory.slice(0, 100));
      }
      
      return success;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const getCacheInfo = () => {
    if (typeof window === 'undefined') return null;
    
    try {
      const gachaData = localStorage.getItem('uma_gacha_data');
      const pullHistoryData = localStorage.getItem('uma_pull_history');
      
      return {
        gachaDataSize: gachaData ? (gachaData.length / 1024).toFixed(2) + ' KB' : '0 KB',
        pullHistorySize: pullHistoryData ? (pullHistoryData.length / 1024).toFixed(2) + ' KB' : '0 KB',
        totalSize: ((gachaData?.length || 0) + (pullHistoryData?.length || 0)) / 1024,
        lastSaved: gachaData ? JSON.parse(gachaData).lastSaved : null
      };
    } catch (error) {
      return null;
    }
  };

  const value = {
    characters,
    pullHistory,
    performPull,
    performMultiPull,
    getCollectionStats,
    getOwnedCharacters,
    isCharacterOwned,
    resetAllData,
    exportData,
    importData,
    getCacheInfo
  };

  return (
    <GachaContext.Provider value={value}>
      {children}
    </GachaContext.Provider>
  );
}

export function useGacha() {
  const context = useContext(GachaContext);
  if (!context) {
    throw new Error('useGacha must be used within a GachaProvider');
  }
  return context;
}
