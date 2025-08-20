'use client';

import { useState, useEffect } from 'react';
import { useGacha } from '../context/GachaContext';
import Image from 'next/image';

function getRandomQuote(results, gachaQuotes) {
  if (!gachaQuotes || !gachaQuotes.gacha_quotes) return null;
  
  const quotes = gachaQuotes.gacha_quotes;
  const hasSSR = results.some(r => r.rarity === 'SSR');
  const hasSR = results.some(r => r.rarity === 'SR');
  const hasNearMiss = results.some(r => r.isNearMiss);
  
  if (hasSSR) {
    const selectedQuotes = quotes.encouraging;
    return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
  } else if (hasSR) {
    // Mix of encouraging and mocking for SR
    const selectedQuotes = [...quotes.encouraging.slice(0, 5), ...quotes.mocking.slice(0, 3)];
    return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
  } else {
    // Mostly mocking for R pulls, especially if no near miss
    const selectedQuotes = hasNearMiss ? 
      [...quotes.encouraging.slice(0, 3), ...quotes.mocking] :
      quotes.mocking;
    return selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
  }
}


function FloatingCard({ character, rarity, delay = 0, onComplete }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete]);

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'SSR': return 'animate-glow shadow-2xl shadow-yellow-400/60';
      case 'SR': return 'shadow-2xl shadow-purple-400/50';
      case 'R': return 'shadow-xl shadow-blue-400/40';
      default: return 'shadow-lg shadow-gray-400/30';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'SSR': return 'border-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200';
      case 'SR': return 'border-purple-400 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200';
      case 'R': return 'border-blue-400 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div 
      className={`fixed z-50 animate-float ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 40}%`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div 
        className={`relative p-4 rounded-xl border-4 ${getRarityColor(rarity)} ${getRarityGlow(rarity)}`}
      >
        {/* Sparkle effects for SSR */}
        {rarity === 'SSR' && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0s' }}></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-sparkle" style={{ animationDelay: '1.5s' }}></div>
          </>
        )}
        
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src={`/data/${character.image}`}
              alt={character.name}
              width={80}
              height={80}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = '/placeholder-character.svg';
              }}
            />
          </div>
          
          <h3 className="font-bold text-xs mb-1" style={{ color: '#57564F' }}>
            {character.name}
          </h3>
          
          <div className={`text-xs font-bold px-2 py-1 rounded ${
            rarity === 'SSR' ? 'bg-yellow-200 text-yellow-800' :
            rarity === 'SR' ? 'bg-purple-200 text-purple-800' :
            'bg-blue-200 text-blue-800'
          }`}>
            {rarity}
          </div>
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ character, rarity, isNew, isNearMiss, showAnimation = true }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'SSR': return 'border-yellow-400 bg-yellow-50';
      case 'SR': return 'border-purple-400 bg-purple-50';
      case 'R': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getSpecialBadge = () => {
    if (isNearMiss) return { text: 'SO CLOSE!', style: 'bg-orange-500 text-white animate-pulse' };
    if (isNew) return { text: 'NEW!', style: 'bg-blue-500 text-white animate-pulse' };
    return null;
  };

  const specialBadge = getSpecialBadge();

  return (
    <div 
      className={`relative p-4 rounded-lg border-4 transition-all duration-300 card-hover ${
        showAnimation ? 'animate-pulse' : ''
      } ${getRarityColor(rarity)} ${
        isNearMiss ? 'animate-shake' : ''
      }`}
    >
      {specialBadge && (
        <div className={`absolute -top-2 -right-2 text-xs px-2 py-1 rounded-full font-bold z-10 ${specialBadge.style}`}>
          {specialBadge.text}
        </div>
      )}
      
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          <Image
            src={`/data/${character.image}`}
            alt={character.name}
            width={96}
            height={96}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = '/placeholder-character.svg';
            }}
          />
        </div>
        
        <h3 className="font-bold text-sm mb-1" style={{ color: '#57564F' }}>
          {character.name}
        </h3>
        
        <div className={`text-xs font-bold px-2 py-1 rounded ${
          rarity === 'SSR' ? 'bg-yellow-200 text-yellow-800' :
          rarity === 'SR' ? 'bg-purple-200 text-purple-800' :
          'bg-blue-200 text-blue-800'
        }`}>
          {rarity}
        </div>
      </div>
    </div>
  );
}

function PullResult({ results, onClose, gachaQuotes }) {
  if (!results || results.length === 0) return null;

  const hasSSR = results.some(r => r.rarity === 'SSR');
  const hasSR = results.some(r => r.rarity === 'SR');
  const hasNearMiss = results.some(r => r.isNearMiss);

  const quote = getRandomQuote(results, gachaQuotes);

  const getTitle = () => {
    if (hasSSR) return 'Incredible Luck!';
    if (hasSR) return 'Not Bad!';
    if (hasNearMiss) return 'So Close...';
    return 'Another Day, Another Pull';
  };

  const getTitleColor = () => {
    if (hasSSR) return 'text-yellow-600';
    if (hasSR) return 'text-purple-600';
    if (hasNearMiss) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div 
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6"
        style={{ backgroundColor: '#F8F3CE' }}
      >
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold mb-2 ${getTitleColor()}`}>
            {getTitle()}
          </h2>
          <p className="opacity-80 mb-4">
            {results.length} character{results.length > 1 ? 's' : ''} obtained
          </p>
          
          {/* Streak Information */}
          {results.length > 0 && results[0].consecutiveRStreak !== undefined && (
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="opacity-70">R Streak:</span>
                <span className="font-bold text-red-600">{results[0].consecutiveRStreak}</span>
              </div>
              {results[0].streakMultiplier && (
                <div className="flex items-center gap-1">
                  <span className="opacity-70">Multiplier:</span>
                  <span className="font-bold text-green-600">×{results[0].streakMultiplier.toFixed(2)}</span>
                </div>
              )}
              {results[0].appliedSSRRate && (
                <div className="flex items-center gap-1">
                  <span className="opacity-70">Applied SSR Rate:</span>
                  <span className="font-bold text-blue-600">{(results[0].appliedSSRRate * 100).toFixed(3)}%</span>
                </div>
              )}
            </div>
          )}
          
          {/* Quote Section */}
          <div 
            className="p-4 rounded-lg mx-auto max-w-md mb-4"
            style={{ backgroundColor: 'rgba(87, 86, 79, 0.1)' }}
          >
            <p className="text-lg font-bold mb-1" style={{ color: '#57564F' }}>
              {quote.jp}
            </p>
            <p className="text-sm italic opacity-70 mb-1">
              {quote.romaji}
            </p>
            <p className="text-sm opacity-80">
              {quote.en}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {results.map((result, index) => (
            <CharacterCard
              key={`${result.character.id}-${index}`}
              character={result.character}
              rarity={result.rarity}
              isNew={result.isNew}
              isNearMiss={result.isNearMiss}
              showAnimation={false}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            style={{ 
              backgroundColor: '#57564F', 
              color: '#F8F3CE' 
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GachaPage() {
  const { performPull, performMultiPull, getCollectionStats, pullHistory } = useGacha();
  const [pullResults, setPullResults] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [floatingCards, setFloatingCards] = useState([]);
  const [gachaQuotes, setGachaQuotes] = useState(null);

  const stats = getCollectionStats();

  // Load gacha quotes
  useEffect(() => {
    fetch('/data/gacha_quotes.json')
      .then(response => response.json())
      .then(data => {
        setGachaQuotes(data);
      })
      .catch(error => {
        console.error('Error loading gacha quotes:', error);
      });
  }, []);

  const handleSinglePull = async () => {
    setIsRolling(true);
    
    setTimeout(() => {
      const result = performPull();
      if (result) {
        // Add floating card animation
        const cardId = Date.now();
        setFloatingCards(prev => [...prev, { ...result, id: cardId }]);
        
        // Remove floating card after animation
        setTimeout(() => {
          setFloatingCards(prev => prev.filter(card => card.id !== cardId));
          setPullResults([result]);
          setIsRolling(false);
        }, 3000);
      } else {
        setIsRolling(false);
      }
    }, 500);
  };

  const handleMultiPull = async () => {
    setIsRolling(true);
    
    setTimeout(() => {
      const results = performMultiPull(10);
      if (results.length > 0) {
        // Add multiple floating cards with staggered delays
        results.forEach((result, index) => {
          const cardId = Date.now() + index;
          setTimeout(() => {
            setFloatingCards(prev => [...prev, { ...result, id: cardId }]);
            
            // Remove this specific card after its animation
            setTimeout(() => {
              setFloatingCards(prev => prev.filter(card => card.id !== cardId));
            }, 3000);
          }, index * 200);
        });
        
        // Show results modal after all animations start
        setTimeout(() => {
          setPullResults(results);
          setIsRolling(false);
        }, results.length * 200 + 2000);
      } else {
        setIsRolling(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8F3CE', color: '#57564F' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Floating Cards */}
        {floatingCards.map((card) => (
          <FloatingCard
            key={card.id}
            character={card.character}
            rarity={card.rarity}
            delay={0}
          />
        ))}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Gacha Roll</h1>
          <p className="text-lg opacity-80 mb-6">
            Test your luck and collect Uma Musume characters
          </p>
          
          {/* Stats Bar */}
          <div 
            className="flex flex-wrap justify-center gap-6 p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(87, 86, 79, 0.1)' }}
          >
            <div className="text-center">
              <div className="text-lg font-bold">{stats.totalOwned}</div>
              <div className="text-sm opacity-80">Collected</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.totalPulls}</div>
              <div className="text-sm opacity-80">Total Pulls</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.consecutiveRStreak}</div>
              <div className="text-sm opacity-80">R Streak</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{stats.currentSSRRate}%</div>
              <div className="text-sm opacity-80">SSR Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">×{stats.streakMultiplier ? stats.streakMultiplier.toFixed(2) : '1.00'}</div>
              <div className="text-sm opacity-80">Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{stats.nearMiss}</div>
              <div className="text-sm opacity-80">Near Misses</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">No Pity</div>
              <div className="text-sm opacity-80">Pure RNG</div>
            </div>
          </div>
        </div>

        {/* Pull Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button
            onClick={handleSinglePull}
            disabled={isRolling}
            className="button-press px-8 py-4 text-xl font-bold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none card-hover"
            style={{ 
              backgroundColor: '#57564F', 
              color: '#F8F3CE',
              boxShadow: '0 4px 15px rgba(87, 86, 79, 0.3)'
            }}
          >
            {isRolling ? 'Rolling...' : 'Single Pull'}
          </button>
          
          <button
            onClick={handleMultiPull}
            disabled={isRolling}
            className="button-press px-8 py-4 text-xl font-bold rounded-lg border-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none card-hover"
            style={{ 
              borderColor: '#57564F',
              color: '#57564F',
              backgroundColor: 'transparent'
            }}
          >
            {isRolling ? 'Rolling...' : '10x Pull'}
          </button>
        </div>

        {/* Pull Rates & Harsh Reality */}
        <div 
          className="max-w-md mx-auto p-6 rounded-lg mb-8"
          style={{ backgroundColor: 'rgba(87, 86, 79, 0.05)' }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">Brutal Reality</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                SSR (Base)
              </span>
              <span className="font-bold text-red-600">0.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-400 mr-2"></span>
                SR
              </span>
              <span className="font-bold">8.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                R
              </span>
              <span className="font-bold">91.3%</span>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-1 text-sm">
            <div>• No pity system - pure RNG</div>
            <div>• Tiny rate boost after R streaks</div>
            <div>• Near misses tracked for psychological effect</div>
            <div>• SSRs are genuinely rare</div>
            <div className="font-bold text-red-600">• Welcome to gacha hell</div>
          </div>
        </div>

        {/* Recent Pulls 
        {pullHistory.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Recent Pulls</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {pullHistory.slice(0, 16).map((pull, index) => (
                <CharacterCard
                  key={`${pull.character.id}-${pull.pullNumber}-${index}`}
                  character={pull.character}
                  rarity={pull.rarity}
                  isNew={false}
                  showAnimation={false}
                />
              ))}
            </div>
          </div>
        )}
          */}

        {/* Pull Results Modal */}
        {pullResults && (
          <PullResult
            results={pullResults}
            onClose={() => setPullResults(null)}
            gachaQuotes={gachaQuotes}
          />
        )}
      </div>
    </div>
  );
}
