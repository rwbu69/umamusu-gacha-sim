'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGacha } from './context/GachaContext';

export default function Home() {
  const { getCollectionStats, characters } = useGacha();
  const stats = getCollectionStats();
  
  const [dadJokes, setDadJokes] = useState([]);
  const [currentJoke, setCurrentJoke] = useState(null);

  useEffect(() => {
    fetch('/data/dad_jokes.json')
      .then(response => response.json())
      .then(data => {
        setDadJokes(data.dad_jokes);
        if (data.dad_jokes && data.dad_jokes.length > 0) {
          setCurrentJoke(data.dad_jokes[Math.floor(Math.random() * data.dad_jokes.length)]);
        }
      })
      .catch(error => {
        console.error('Error loading dad jokes:', error);
      });
  }, []);

  const getNewJoke = () => {
    if (dadJokes.length > 0) {
      setCurrentJoke(dadJokes[Math.floor(Math.random() * dadJokes.length)]);
    }
  };

  const rarityDistribution = {
    SSR: characters.filter(c => c.rarity === 'SSR').length,
    SR: characters.filter(c => c.rarity === 'SR').length,
    R: characters.filter(c => c.rarity === 'R').length
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8F3CE', color: '#57564F' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Header - Asymmetric Design */}
        <div className="mb-16 relative">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* Title Section */}
            <div className="lg:w-2/3">
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: '#57564F' }}>
                Uma Musume<br />
                <span className="text-4xl lg:text-5xl opacity-80">Gacha Simulator</span>
              </h1>
              <div className="max-w-lg">
                <p className="text-lg mb-6 opacity-90 leading-relaxed">
                  Step into the world of horse girl racing and build your dream stable. 
                  This isn't your typical gacha—we've implemented a sophisticated RNG system 
                  that actually feels rewarding.
                </p>
                <p className="text-base opacity-70 mb-8">
                  No pity system, but hidden lucky streaks that make every pull exciting.
                </p>
              </div>
            </div>

            {/* Quick Stats - Floating Right */}
            <div className="lg:w-1/3 lg:pt-8">
              <div 
                className="p-6 rounded-2xl transform rotate-1"
                style={{ 
                  backgroundColor: 'rgba(87, 86, 79, 0.08)',
                  border: '2px solid rgba(87, 86, 79, 0.15)'
                }}
              >
                <h3 className="text-lg font-bold mb-4 opacity-90">Your Progress</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Characters</span>
                    <span className="text-xl font-bold">{stats.totalOwned}/{characters.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Pulls</span>
                    <span className="text-lg font-semibold">{stats.totalPulls}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current SSR Rate</span>
                    <span className="text-lg font-semibold text-blue-600">{stats.currentSSRRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Base Rate</span>
                    <span className="text-sm opacity-70">{stats.baseSSRRate}%</span>
                  </div>
                  
                  {/* Enhanced Streak Display */}
                  {stats.consecutiveRStreak > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-red-700">Suffering Streak</span>
                        <span className="text-lg font-bold text-red-600">{stats.consecutiveRStreak}R</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-red-600">Rate Multiplier</span>
                        <span className="text-sm font-semibold text-red-600">×{stats.streakMultiplier.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  {stats.consecutiveSRStreak > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-700">SR Streak</span>
                        <span className="text-lg font-bold text-purple-600">{stats.consecutiveSRStreak}</span>
                      </div>
                    </div>
                  )}
                  
                  {stats.nearMiss > 0 && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-yellow-700">Near Misses</span>
                        <span className="text-lg font-bold text-yellow-600">{stats.nearMiss}</span>
                      </div>
                      <p className="text-xs text-yellow-600 mt-1">You were so close to SSR!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Organic Placement */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start">
            <Link
              href="/gacha"
              className="button-press card-hover px-10 py-4 text-lg font-bold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: '#57564F', 
                color: '#F8F3CE',
                boxShadow: '0 8px 25px rgba(87, 86, 79, 0.25)'
              }}
            >
              Start Rolling
            </Link>
            <Link
              href="/collection"
              className="button-press card-hover px-8 py-4 text-lg font-semibold rounded-xl border-2 transition-all duration-200 transform hover:scale-105"
              style={{ 
                borderColor: '#57564F',
                color: '#57564F',
                backgroundColor: 'rgba(87, 86, 79, 0.02)'
              }}
            >
              Browse Collection
            </Link>
          </div>
        </div>

        {/* Content Sections - Irregular Layout */}
        <div className="space-y-16">
          {/* About the System */}
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold mb-6">What Makes This Different</h2>
              <div className="space-y-4 text-base leading-relaxed opacity-90">
                <p>
                  Most gacha simulators use boring flat probability. We don't. 
                  Our system features a smart pity system with fail streaks, lucky streaks, and surprise upgrades.
                </p>
                <p>
                  Experience genuine excitement with our 3% base SSR rate that increases by 0.2% with each failed pull. 
                  Lucky streaks add even more bonus rates, and special mechanics like SR→SSR upgrades keep you on your toes.
                </p>
                <p className="font-medium">
                  Guaranteed SSR at 100 pulls, but you'll likely get one much sooner thanks to smart rate scaling.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div 
                className="p-6 rounded-xl transform -rotate-1"
                style={{ backgroundColor: 'rgba(87, 86, 79, 0.06)' }}
              >
                <h4 className="font-bold mb-4">Character Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-yellow-400 mr-3"></div>
                      <span className="font-medium">SSR</span>
                    </div>
                    <span className="text-lg font-bold">{rarityDistribution.SSR}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-purple-400 mr-3"></div>
                      <span className="font-medium">SR</span>
                    </div>
                    <span className="text-lg font-bold">{rarityDistribution.SR}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded bg-blue-400 mr-3"></div>
                      <span className="font-medium">R</span>
                    </div>
                    <span className="text-lg font-bold">{rarityDistribution.R}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features - Staggered Layout */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div 
                className="p-6 rounded-lg transform rotate-1"
                style={{ 
                  backgroundColor: 'rgba(87, 86, 79, 0.05)',
                  border: '1px solid rgba(87, 86, 79, 0.1)'
                }}
              >
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#57564F' }}>
                  <div className="w-6 h-6 border-2 border-[#F8F3CE] rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Smart RNG</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Hidden lucky and normal modes create natural streaks. 
                  You'll feel the difference between hot and cold periods.
                </p>
              </div>

              {/* Feature 2 */}
              <div 
                className="p-6 rounded-lg transform -rotate-1 md:mt-8"
                style={{ 
                  backgroundColor: 'rgba(87, 86, 79, 0.05)',
                  border: '1px solid rgba(87, 86, 79, 0.1)'
                }}
              >
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#57564F' }}>
                  <div className="w-6 h-6 border-2 border-[#F8F3CE] rounded-sm transform rotate-45"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Fair Rates</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Shuffle bag system prevents terrible luck streaks. 
                  You're guaranteed to see SSRs at a reasonable frequency.
                </p>
              </div>

              {/* Feature 3 */}
              <div 
                className="p-6 rounded-lg transform rotate-1 md:col-span-2 lg:col-span-1"
                style={{ 
                  backgroundColor: 'rgba(87, 86, 79, 0.05)',
                  border: '1px solid rgba(87, 86, 79, 0.1)'
                }}
              >
                <div className="w-12 h-12 mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#57564F' }}>
                  <div className="w-6 h-6 border-2 border-[#F8F3CE] rounded-full border-b-transparent transform rotate-45"></div>
                </div>
                <h3 className="text-xl font-bold mb-3">Collection Focus</h3>
                <p className="text-sm opacity-80 leading-relaxed">
                  Characters you haven't collected get slightly better odds. 
                  Your collection will grow more naturally.
                </p>
              </div>
            </div>
          </div>

          {/* Dajare Corner */}
          <div className="mt-16 mb-8">
            <div 
              className="p-8 rounded-2xl transform rotate-1"
              style={{ 
                backgroundColor: 'rgba(87, 86, 79, 0.06)',
                border: '2px solid rgba(87, 86, 79, 0.15)'
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/data/images/symboli_rudolf.png"
                  alt="Symboli Rudolf"
                  width={80}
                  height={80}
                  className="rounded-full border-4"
                  style={{ borderColor: '#57564F' }}
                />
                <div className="ml-4">
                  <h2 className="text-3xl font-bold mb-2" style={{ color: '#57564F' }}>
                    だじゃれコーナー
                  </h2>
                  <p className="text-lg opacity-70">Dajare Corner</p>
                </div>
              </div>
              
              {currentJoke && (
                <div className="text-center mb-6">
                  <div 
                    className="inline-block p-6 rounded-xl transform -rotate-1 max-w-md"
                    style={{ backgroundColor: 'rgba(248, 243, 206, 0.8)' }}
                  >
                    <p className="text-xl font-bold mb-2" style={{ color: '#57564F' }}>
                      {currentJoke.jp}
                    </p>
                    <p className="text-lg mb-2 opacity-80" style={{ color: '#57564F' }}>
                      {currentJoke.romaji}
                    </p>
                    <p className="text-sm opacity-70" style={{ color: '#57564F' }}>
                      {currentJoke.en}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={getNewJoke}
                  className="button-press card-hover px-6 py-3 font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
                  style={{ 
                    backgroundColor: '#57564F', 
                    color: '#F8F3CE',
                    boxShadow: '0 4px 15px rgba(87, 86, 79, 0.3)'
                  }}
                  disabled={dadJokes.length === 0}
                >
                  新しいだじゃれ！ (New Dajare!)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-8">
            <div 
              className="inline-block p-8 rounded-2xl transform -rotate-1"
              style={{ backgroundColor: 'rgba(87, 86, 79, 0.08)' }}
            >
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Stable?</h3>
              <p className="mb-6 opacity-80 max-w-md">
                Jump in and start collecting. Your data saves automatically, 
                so you can always come back to continue your journey.
              </p>
              <Link
                href="/gacha"
                className="button-press card-hover inline-block px-8 py-3 font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
                style={{ 
                  backgroundColor: '#57564F', 
                  color: '#F8F3CE',
                  boxShadow: '0 4px 15px rgba(87, 86, 79, 0.3)'
                }}
              >
                Let's Go Rolling
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
