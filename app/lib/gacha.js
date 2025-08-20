class GachaSystem {
  constructor() {
    this.userCollection = new Set();
    this.totalPulls = 0;
    this.consecutiveRStreak = 0;
    this.consecutiveSRStreak = 0;
    this.lastRarity = null;
    this.nearMiss = 0;
    this.streakMultipliers = new Array(10).fill(0); // Track last 10 pulls for pattern analysis
    this.streakIndex = 0;
    this.pullsSinceGuaranteed = 0; // Track pulls since last SR or higher for 10-pull guarantee
    
    // Enhanced rarity probabilities with psychological tuning
    this.baseRarityProbabilities = {
      'SSR': 0.007,  // 0.7% - brutal base rate
      'SR': 0.08,    // 8% - moderate
      'R': 0.913     // 91.3% - majority (suffering)
    };

    // Streak bonus multipliers (applied to SSR rate only)
    this.streakBonusMultipliers = {
      0: 1.0,     // No bonus
      1: 1.05,    // 5% increase (tiny psychological boost)
      2: 1.12,    // 12% increase
      3: 1.20,    // 20% increase  
      4: 1.30,    // 30% increase
      5: 1.45,    // 45% increase (max practical bonus)
    };
    
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
          this.consecutiveRStreak = data.consecutiveRStreak || 0;
          this.consecutiveSRStreak = data.consecutiveSRStreak || 0;
          this.lastRarity = data.lastRarity || null;
          this.nearMiss = data.nearMiss || 0;
          this.streakMultipliers = data.streakMultipliers || new Array(10).fill(0);
          this.streakIndex = data.streakIndex || 0;
          this.pullsSinceGuaranteed = data.pullsSinceGuaranteed || 0;
          
          console.log('Loaded enhanced gacha data:', {
            totalPulls: this.totalPulls,
            collectionSize: this.userCollection.size,
            consecutiveRStreak: this.consecutiveRStreak,
            pullsSinceGuaranteed: this.pullsSinceGuaranteed,
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
          consecutiveRStreak: this.consecutiveRStreak,
          consecutiveSRStreak: this.consecutiveSRStreak,
          lastRarity: this.lastRarity,
          nearMiss: this.nearMiss,
          streakMultipliers: this.streakMultipliers,
          streakIndex: this.streakIndex,
          pullsSinceGuaranteed: this.pullsSinceGuaranteed,
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
    this.consecutiveRStreak = 0;
    this.consecutiveSRStreak = 0;
    this.lastRarity = null;
    this.nearMiss = 0;
    this.streakMultipliers = new Array(10).fill(0);
    this.streakIndex = 0;
    this.pullsSinceGuaranteed = 0;
    this.saveToCache();
  }

  // Enhanced probability calculation with cumulative distribution
  calculateModifiedProbabilities() {
    const base = { ...this.baseRarityProbabilities };
    
    // Apply streak bonuses (only to SSR, keep it brutal but fair)
    const streakLevel = Math.min(this.consecutiveRStreak, 5);
    const streakMultiplier = this.streakBonusMultipliers[streakLevel];
    
    // Calculate modified SSR rate
    let modifiedSSR = base.SSR * streakMultiplier;
    
    // Cap the maximum possible SSR rate to prevent it from getting too generous
    modifiedSSR = Math.min(modifiedSSR, 0.025); // Max 2.5% SSR rate
    
    // Adjust other probabilities to maintain total = 1.0
    const remainingProb = 1.0 - modifiedSSR;
    const originalRemaining = base.SR + base.R;
    
    return {
      'SSR': modifiedSSR,
      'SR': base.SR * (remainingProb / originalRemaining),
      'R': base.R * (remainingProb / originalRemaining)
    };
  }

  // Improved cumulative probability roll system
  rollGachaWithCumulative(forceRarity = null) {
    // If we're forcing a rarity (for guaranteed pulls), use that
    if (forceRarity) {
      return {
        rarity: forceRarity,
        isNearMiss: false,
        consecutiveRStreak: this.consecutiveRStreak,
        consecutiveSRStreak: this.consecutiveSRStreak,
        nearMiss: this.nearMiss,
        appliedSSRRate: 0, // Forced pull, not based on probability
        streakMultiplier: this.streakBonusMultipliers[Math.min(this.consecutiveRStreak, 5)],
        isGuaranteed: true
      };
    }

    const probabilities = this.calculateModifiedProbabilities();
    const roll = Math.random();
    
    // Build cumulative probability thresholds
    const thresholds = {
      SSR: probabilities.SSR,
      SR: probabilities.SSR + probabilities.SR,
      R: 1.0 // Everything else is R
    };

    // Near miss detection (psychological manipulation)
    const ssrNearMissThreshold = 0.015; // 1.5% window after SSR threshold
    
    // Determine rarity using cumulative distribution
    let resultRarity;
    let isNearMiss = false;
    
    if (roll < thresholds.SSR) {
      // Successful SSR pull
      resultRarity = 'SSR';
      this.consecutiveRStreak = 0;
      this.consecutiveSRStreak = 0;
      this.nearMiss = 0; // Reset near miss counter on SSR
      this.pullsSinceGuaranteed = 0; // Reset guaranteed counter on SSR
    } else if (roll < thresholds.SR) {
      // SR pull
      resultRarity = 'SR';
      this.consecutiveRStreak = 0;
      this.consecutiveSRStreak++;
      this.pullsSinceGuaranteed = 0; // Reset guaranteed counter on SR
    } else {
      // R pull - check if it was a near miss
      resultRarity = 'R';
      this.consecutiveRStreak++;
      this.consecutiveSRStreak = 0;
      this.pullsSinceGuaranteed++; // Increment guaranteed counter on R
      
      // Near miss: roll was just outside SSR threshold
      if (roll <= thresholds.SSR + ssrNearMissThreshold) {
        isNearMiss = true;
        this.nearMiss++; // Increment near miss counter
      }
    }

    // Update streak tracking pattern
    this.updateStreakPattern(resultRarity);
    this.lastRarity = resultRarity;

    return {
      rarity: resultRarity,
      isNearMiss: isNearMiss,
      consecutiveRStreak: this.consecutiveRStreak,
      consecutiveSRStreak: this.consecutiveSRStreak,
      nearMiss: this.nearMiss,
      appliedSSRRate: probabilities.SSR,
      streakMultiplier: this.streakBonusMultipliers[Math.min(this.consecutiveRStreak, 5)],
      isGuaranteed: false
    };
  }

  // Track rolling pattern for additional psychological effects
  updateStreakPattern(rarity) {
    const rarityValue = rarity === 'SSR' ? 3 : rarity === 'SR' ? 2 : 1;
    this.streakMultipliers[this.streakIndex] = rarityValue;
    this.streakIndex = (this.streakIndex + 1) % 10;
  }

  // Enhanced character selection with improved weighting
  selectCharacterFromRarity(rarity, characters) {
    const availableChars = characters.filter(char => char.rarity === rarity);
    
    if (availableChars.length === 0) return null;

    // Enhanced weighting system
    const weightedChars = availableChars.map(char => {
      let weight = 1.0;
      
      // New character bonus (encourage collection completion)
      if (!this.userCollection.has(char.id)) {
        weight *= 1.2; // 20% boost for new characters
      }
      
      // Rarity-based adjustment for psychological satisfaction
      if (rarity === 'SSR') {
        weight *= 1.1; // Slight boost to make SSR feel more special
      }
      
      return { ...char, weight };
    });

    // Improved weighted random selection
    const totalWeight = weightedChars.reduce((sum, char) => sum + char.weight, 0);
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

  performPull(characters, forceRarity = null) {
    this.totalPulls++;

    // Get enhanced rarity roll
    const rollResult = this.rollGachaWithCumulative(forceRarity);
    
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
        consecutiveRStreak: rollResult.consecutiveRStreak,
        consecutiveSRStreak: rollResult.consecutiveSRStreak,
        nearMiss: rollResult.nearMiss,
        appliedSSRRate: rollResult.appliedSSRRate,
        streakMultiplier: rollResult.streakMultiplier,
        isGuaranteed: rollResult.isGuaranteed || false,
        pullsSinceGuaranteed: this.pullsSinceGuaranteed
      };
    }
    
    return null;
  }

  performMultiPull(characters, count = 10) {
    const results = [];
    let hasGuaranteedSR = false;
    
    // First, perform regular pulls
    for (let i = 0; i < count; i++) {
      const result = this.performPull(characters);
      if (result) {
        results.push(result);
        
        // Check if we got an SR or SSR naturally
        if (result.rarity === 'SR' || result.rarity === 'SSR') {
          hasGuaranteedSR = true;
        }
      }
    }
    
    // If we didn't get any SR or higher, replace the last R with a guaranteed SR
    if (!hasGuaranteedSR && results.length > 0) {
      // Find the last R pull to replace
      for (let i = results.length - 1; i >= 0; i--) {
        if (results[i].rarity === 'R') {
          // Replace this R with a guaranteed SR
          const guaranteedSR = this.performPull(characters, 'SR');
          if (guaranteedSR) {
            guaranteedSR.isGuaranteed = true;
            guaranteedSR.pullNumber = results[i].pullNumber; // Keep original pull number
            results[i] = guaranteedSR;
          }
          break;
        }
      }
    }
    
    return results;
  }

  getCollectionStats() {
    const currentProbs = this.calculateModifiedProbabilities();
    const streakLevel = Math.min(this.consecutiveRStreak, 5);
    
    return {
      totalOwned: this.userCollection.size,
      totalPulls: this.totalPulls,
      consecutiveRStreak: this.consecutiveRStreak,
      consecutiveSRStreak: this.consecutiveSRStreak,
      lastRarity: this.lastRarity,
      nearMiss: this.nearMiss,
      currentSSRRate: (currentProbs.SSR * 100).toFixed(3),
      baseSSRRate: (this.baseRarityProbabilities.SSR * 100).toFixed(3),
      streakLevel: streakLevel,
      streakMultiplier: this.streakBonusMultipliers[streakLevel],
      isPityless: true, // NO PITY - PITY IS FOR THE WEAK
      pullsSinceGuaranteed: this.pullsSinceGuaranteed,
      guaranteedIn: Math.max(0, 10 - this.pullsSinceGuaranteed),
      averageRarityLast10: this.getRecentPullQuality()
    };
  }

  // Calculate quality of recent pulls for psychological feedback
  getRecentPullQuality() {
    const recentSum = this.streakMultipliers.reduce((sum, val) => sum + val, 0);
    return recentSum / 10; // Average rarity value (1=R, 2=SR, 3=SSR)
  }

  getOwnedCharacters() {
    return Array.from(this.userCollection);
  }

  isCharacterOwned(characterId) {
    return this.userCollection.has(characterId);
  }

  // Enhanced export with new streak data
  exportData() {
    return {
      userCollection: Array.from(this.userCollection),
      totalPulls: this.totalPulls,
      consecutiveRStreak: this.consecutiveRStreak,
      consecutiveSRStreak: this.consecutiveSRStreak,
      lastRarity: this.lastRarity,
      nearMiss: this.nearMiss,
      streakMultipliers: this.streakMultipliers,
      streakIndex: this.streakIndex,
      pullsSinceGuaranteed: this.pullsSinceGuaranteed,
      exportedAt: Date.now()
    };
  }

  // Enhanced import with new streak data
  importData(data) {
    try {
      this.userCollection = new Set(data.userCollection || []);
      this.totalPulls = data.totalPulls || 0;
      this.consecutiveRStreak = data.consecutiveRStreak || 0;
      this.consecutiveSRStreak = data.consecutiveSRStreak || 0;
      this.lastRarity = data.lastRarity || null;
      this.nearMiss = data.nearMiss || 0;
      this.streakMultipliers = data.streakMultipliers || new Array(10).fill(0);
      this.streakIndex = data.streakIndex || 0;
      this.pullsSinceGuaranteed = data.pullsSinceGuaranteed || 0;
      this.saveToCache();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export default GachaSystem;
