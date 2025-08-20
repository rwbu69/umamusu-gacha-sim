'use client';

import { useState } from 'react';
import { useGacha } from '../context/GachaContext';
import Image from 'next/image';

function CharacterCard({ character, isOwned }) {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'SSR': return 'border-yellow-400 bg-yellow-50';
      case 'SR': return 'border-purple-400 bg-purple-50';
      case 'R': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 card-hover ${
        isOwned 
          ? getRarityColor(character.rarity) 
          : 'border-gray-300 bg-gray-100 opacity-50'
      }`}
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {isOwned ? (
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
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl font-bold">
              ?
            </div>
          )}
        </div>
        
        <h3 className={`font-bold text-sm mb-1 ${isOwned ? '' : 'text-gray-500'}`}>
          {isOwned ? character.name : '???'}
        </h3>
        
        <div className={`text-xs font-bold px-2 py-1 rounded ${
          !isOwned ? 'bg-gray-300 text-gray-600' :
          character.rarity === 'SSR' ? 'bg-yellow-200 text-yellow-800' :
          character.rarity === 'SR' ? 'bg-purple-200 text-purple-800' :
          'bg-blue-200 text-blue-800'
        }`}>
          {isOwned ? character.rarity : '?'}
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const { characters, getOwnedCharacters, isCharacterOwned, getCollectionStats } = useGacha();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  const stats = getCollectionStats();
  const ownedCharacterIds = getOwnedCharacters();

  // Filter characters
  const filteredCharacters = characters.filter(character => {
    if (filter === 'all') return true;
    if (filter === 'owned') return isCharacterOwned(character.id);
    if (filter === 'missing') return !isCharacterOwned(character.id);
    return character.rarity === filter;
  });

  // Sort characters
  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        const rarityOrder = { 'SSR': 3, 'SR': 2, 'R': 1 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case 'id':
      default:
        return a.id - b.id;
    }
  });

  // Calculate collection stats by rarity
  const collectionByRarity = {
    SSR: {
      owned: characters.filter(c => c.rarity === 'SSR' && isCharacterOwned(c.id)).length,
      total: characters.filter(c => c.rarity === 'SSR').length
    },
    SR: {
      owned: characters.filter(c => c.rarity === 'SR' && isCharacterOwned(c.id)).length,
      total: characters.filter(c => c.rarity === 'SR').length
    },
    R: {
      owned: characters.filter(c => c.rarity === 'R' && isCharacterOwned(c.id)).length,
      total: characters.filter(c => c.rarity === 'R').length
    }
  };

  const completionPercentage = characters.length > 0 
    ? Math.round((stats.totalOwned / characters.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen" style={{ background: '#F8F3CE', color: '#57564F' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Character Collection</h1>
          <p className="text-lg opacity-80 mb-6">
            Track your progress and view all available Uma Musume characters
          </p>
        </div>

        {/* Collection Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div 
            className="p-6 rounded-lg text-center border-2"
            style={{ 
              backgroundColor: 'rgba(87, 86, 79, 0.05)',
              borderColor: 'rgba(87, 86, 79, 0.2)'
            }}
          >
            <div className="text-3xl font-bold mb-2">{completionPercentage}%</div>
            <div className="text-sm opacity-80">Collection Complete</div>
            <div className="text-xs mt-1">{stats.totalOwned}/{characters.length}</div>
          </div>

          {Object.entries(collectionByRarity).map(([rarity, data]) => (
            <div 
              key={rarity}
              className="p-6 rounded-lg text-center border-2"
              style={{ 
                backgroundColor: 'rgba(87, 86, 79, 0.05)',
                borderColor: 'rgba(87, 86, 79, 0.2)'
              }}
            >
              <div className="flex justify-center items-center mb-2">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  rarity === 'SSR' ? 'bg-yellow-400' :
                  rarity === 'SR' ? 'bg-purple-400' : 'bg-blue-400'
                }`}></span>
                <span className="font-bold text-lg">{rarity}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{data.owned}/{data.total}</div>
              <div className="text-xs opacity-80">
                {data.total > 0 ? Math.round((data.owned / data.total) * 100) : 0}% Complete
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 justify-between items-center mb-8 p-4 rounded-lg"
          style={{ backgroundColor: 'rgba(87, 86, 79, 0.05)' }}
        >
          <div className="flex flex-wrap gap-2">
            <span className="font-medium mr-2">Filter:</span>
            {['all', 'owned', 'missing', 'SSR', 'SR', 'R'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`button-press px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-[#57564F] text-[#F8F3CE]'
                    : 'bg-[#F8F3CE] text-[#57564F] border border-[#57564F] hover:bg-[#57564F] hover:text-[#F8F3CE]'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 rounded border bg-[#F8F3CE] text-[#57564F] border-[#57564F]"
            >
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="rarity">Rarity</option>
            </select>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {sortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isOwned={isCharacterOwned(character.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {sortedCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(87, 86, 79, 0.1)' }}>
              <div className="w-8 h-8 border-2 border-[#57564F] rounded opacity-50"></div>
            </div>
            <h3 className="text-xl font-bold mb-2">No characters found</h3>
            <p className="opacity-80">Try adjusting your filters</p>
          </div>
        )}

        {/* Collection Tips */}
        <div 
          className="mt-12 p-6 rounded-lg"
          style={{ backgroundColor: 'rgba(87, 86, 79, 0.05)' }}
        >
          <h3 className="text-xl font-bold mb-4">Collection Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm opacity-80">
            <div>
              <strong>Lucky Mode:</strong> The system occasionally enters lucky mode, 
              increasing your chances of rare pulls for a few rolls.
            </div>
            <div>
              <strong>Duplicate Avoidance:</strong> Characters you don't own have 
              slightly higher pull chances to help complete your collection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
