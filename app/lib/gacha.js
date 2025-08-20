class GachaSystem {
  constructor() {
    this.userCollection = new Set();
    this.totalPulls = 0;
    this.streak = 0;
    this.lastRarity = null;
    this.nearMiss = 0; // Track near misses for psychological effect
    
    // Load from localStorage if available
    this.loadFromCache();
  }

  loadFromCache() {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('uma_gacha_data');
        if (cached) {
          const data = JSON.parse(cached);
          this.userCollection = new Set(data.userCollection || []);
          this.totalPulls = data.totalPulls || 0;
          this.streak = data.streak || 0;
          this.lastRarity = data.lastRarity || null;
          this.nearMiss = data.nearMiss || 0;
          
          console.log('Loaded gacha data from cache:', {
            totalPulls: this.totalPulls,
            collectionSize: this.userCollection.size,
            streak: this.streak,
            nearMiss: this.nearMiss
          });
        }
      } catch (error) {
        console.error('Failed to load gacha data from cache:', error);
        this.resetData();
      }
    }
  }

  saveToCache() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          userCollection: Array.from(this.userCollection),
          totalPulls: this.totalPulls,
          streak: this.streak,
          lastRarity: this.lastRarity,
          nearMiss: this.nearMiss,
          lastSaved: Date.now()
        };
        localStorage.setItem('uma_gacha_data', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save gacha data to cache:', error);
      }
    }
  }

  resetData() {
    this.userCollection = new Set();
    this.totalPulls = 0;
    this.streak = 0;
    this.lastRarity = null;
    this.nearMiss = 0;
    this.saveToCache();
  }

  rollGacha() {
    // Harsh but addictive rates
    const baseSSR = 0.007; // 0.7% - much lower
    const baseSR = 0.08;   // 8% - reduced
    const baseR = 0.913;   // 91.3% - majority
    
    // Psychological manipulation: tiny increases after consecutive Rs
    let ssrBonus = 0;
    if (this.lastRarity === 'R') {
      this.streak++;
      // Very small bonus that feels bigger than it is
      ssrBonus = Math.min(this.streak * 0.0005, 0.003); // Max 0.3% bonus
    } else {
      this.streak = 0;
    }

    // Near miss system - makes you feel "close"
    const roll = Math.random();
    const ssrThreshold = baseSSR + ssrBonus;
    const srThreshold = ssrThreshold + baseSR;

    // Track near misses for psychological effect
    if (roll > ssrThreshold - 0.01 && roll <= ssrThreshold + 0.01) {
      this.nearMiss++;
    }

    if (roll < ssrThreshold) {
      this.lastRarity = 'SSR';
      this.streak = 0;
      this.nearMiss = 0;
      return {
        rarity: "SSR",
        isNearMiss: false,
        streak: this.streak,
        nearMiss: this.nearMiss
      };
    } else if (roll < srThreshold) {
      this.lastRarity = 'SR';
      this.streak = 0;
      return {
        rarity: "SR",
        isNearMiss: false,
        streak: this.streak,
        nearMiss: this.nearMiss
      };
    } else {
      this.lastRarity = 'R';
      // Check if this was a "near miss" SSR
      const wasNearMiss = roll < ssrThreshold + 0.02;
      return {
        rarity: "R",
        isNearMiss: wasNearMiss,
        streak: this.streak,
        nearMiss: this.nearMiss
      };
    }
  }

  selectCharacterFromRarity(rarity, characters) {
    const availableChars = characters.filter(char => char.rarity === rarity);
    
    if (availableChars.length === 0) return null;

    // Slightly favor new characters but don't make it obvious
    const weightedChars = availableChars.map(char => ({
      ...char,
      weight: this.userCollection.has(char.id) ? 1 : 1.15
    }));

    // Calculate total weight
    const totalWeight = weightedChars.reduce((sum, char) => sum + char.weight, 0);
    
    // Select character based on weight
    let random = Math.random() * totalWeight;
    for (const char of weightedChars) {
      random -= char.weight;
      if (random <= 0) {
        return char;
      }
    }
    
    // Fallback to last character
    return weightedChars[weightedChars.length - 1];
  }

  performPull(characters) {
    this.totalPulls++;

    // Get rarity from gacha roll
    const rollResult = this.rollGacha();
    
    // Select character from rarity pool
    const character = this.selectCharacterFromRarity(rollResult.rarity, characters);
    
    if (character) {
      const isNew = !this.userCollection.has(character.id);
      
      // Add to collection
      this.userCollection.add(character.id);
      
      // Save to cache after successful pull
      this.saveToCache();
      
      return {
        character,
        rarity: rollResult.rarity,
        isNew,
        isNearMiss: rollResult.isNearMiss,
        pullNumber: this.totalPulls,
        timestamp: Date.now(),
        streak: rollResult.streak,
        nearMiss: rollResult.nearMiss
      };
    }
    
    return null;
  }

  performMultiPull(characters, count = 10) {
    const results = [];
    for (let i = 0; i < count; i++) {
      const result = this.performPull(characters);
      if (result) {
        results.push(result);
      }
    }
    return results;
  }

  getCollectionStats() {
    const baseSSR = 0.007;
    const ssrBonus = this.lastRarity === 'R' ? Math.min(this.streak * 0.0005, 0.003) : 0;
    const currentSSRRate = baseSSR + ssrBonus;
    
    return {
      totalOwned: this.userCollection.size,
      totalPulls: this.totalPulls,
      streak: this.streak,
      lastRarity: this.lastRarity,
      nearMiss: this.nearMiss,
      currentSSRRate: (currentSSRRate * 100).toFixed(3),
      isPityless: true // No pity system
    };
  }

  getOwnedCharacters() {
    return Array.from(this.userCollection);
  }

  isCharacterOwned(characterId) {
    return this.userCollection.has(characterId);
  }

  // Method to export data for backup
  exportData() {
    return {
      userCollection: Array.from(this.userCollection),
      totalPulls: this.totalPulls,
      streak: this.streak,
      lastRarity: this.lastRarity,
      nearMiss: this.nearMiss,
      exportedAt: Date.now()
    };
  }

  // Method to import data from backup
  importData(data) {
    try {
      this.userCollection = new Set(data.userCollection || []);
      this.totalPulls = data.totalPulls || 0;
      this.streak = data.streak || 0;
      this.lastRarity = data.lastRarity || null;
      this.nearMiss = data.nearMiss || 0;
      this.saveToCache();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export default GachaSystem;
