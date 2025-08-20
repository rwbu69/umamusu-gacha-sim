// Quick test to verify guaranteed SR logic
import GachaSystem from './app/lib/gacha.js';

// Mock characters data
const mockCharacters = [
  { id: 'char1', name: 'Test R1', rarity: 'R' },
  { id: 'char2', name: 'Test R2', rarity: 'R' },
  { id: 'char3', name: 'Test R3', rarity: 'R' },
  { id: 'char4', name: 'Test SR1', rarity: 'SR' },
  { id: 'char5', name: 'Test SR2', rarity: 'SR' },
  { id: 'char6', name: 'Test SSR1', rarity: 'SSR' }
];

const gacha = new GachaSystem();

console.log('Testing guaranteed SR in 10-pulls...\n');

// Test multiple 10-pulls to verify guarantee
for (let session = 1; session <= 5; session++) {
  console.log(`=== Session ${session} ===`);
  
  const results = gacha.performMultiPull(mockCharacters, 10);
  
  // Count rarities
  const counts = { R: 0, SR: 0, SSR: 0 };
  let hasGuaranteed = false;
  
  results.forEach((result, index) => {
    counts[result.rarity]++;
    if (result.isGuaranteed) {
      hasGuaranteed = true;
      console.log(`  Pull ${index + 1}: ${result.rarity} ${result.character.name} [GUARANTEED]`);
    } else {
      console.log(`  Pull ${index + 1}: ${result.rarity} ${result.character.name}`);
    }
  });
  
  console.log(`Counts: ${counts.R}R, ${counts.SR}SR, ${counts.SSR}SSR`);
  console.log(`Has SR+: ${counts.SR + counts.SSR > 0 ? 'YES' : 'NO'}`);
  console.log(`Guaranteed triggered: ${hasGuaranteed ? 'YES' : 'NO'}`);
  
  const stats = gacha.getCollectionStats();
  console.log(`Pulls since guaranteed: ${stats.pullsSinceGuaranteed}`);
  console.log(`Guaranteed in: ${stats.guaranteedIn}\n`);
}

console.log('Test completed! Every 10-pull should have at least 1 SR.');
