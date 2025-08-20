# 🐎 Uma Musume Gacha Simulator

A **brutal but addictive** gacha simulation inspired by Uma Musume Pretty Derby, featuring an unforgiving algorithm designed to test your luck and persistence. Built with Next.js 15 and React 19.

## 🎯 Overview

This gacha simulator implements a **no-pity, low-rate system** that uses psychological manipulation techniques commonly found in mobile gacha games. The system is designed to be harsh yet compelling, creating the authentic gacha experience without the financial cost.

## 🧮 The Algorithm

### Base Rates (Unforgiving System)
```
SSR (Super Super Rare): 0.7%  (0.007)
SR  (Super Rare):       8.0%  (0.08) 
R   (Rare):            91.3%  (0.913)
```

### Mathematical Formula

The probability calculation follows this formula:

```
P(SSR) = base_ssr + streak_bonus
where:
- base_ssr = 0.007 (0.7%)
- streak_bonus = min(consecutive_R_pulls × 0.0005, 0.003)
- max_bonus = 0.3% (bringing max SSR rate to 1.0%)
```

### Psychological Manipulation Mechanics

#### 1. **Near-Miss System**
```javascript
near_miss_threshold = ±0.01 around SSR threshold
if (roll ∈ [SSR_rate - 0.01, SSR_rate + 0.01]) {
    increment_near_miss_counter()
    trigger_"almost_got_it"_feeling()
}
```

#### 2. **Microscopic Rate Improvements**
- **Consecutive R pulls**: +0.05% SSR rate per pull
- **Maximum bonus**: 0.3% (appears significant but statistically minimal)
- **Reset condition**: Any non-R pull resets the bonus

#### 3. **Weighted Character Selection**
```javascript
character_weight = user_owns_character ? 1.0 : 1.15
// Slightly favors new characters (15% weight boost)
```

### Algorithm Flow

```
1. Generate random number [0,1)
2. Calculate current SSR rate with bonuses
3. Apply thresholds:
   - [0, SSR_rate) → SSR
   - [SSR_rate, SSR_rate + SR_rate) → SR  
   - [SSR_rate + SR_rate, 1) → R
4. Check for near-miss psychological trigger
5. Select character using weighted random
6. Update user collection and statistics
7. Save to localStorage for persistence
```

## 🎮 Features

### Core Gacha System
- **🚫 No Pity System**: Pure RNG with minimal rate improvements
- **📊 Real-time Statistics**: Track your luck and spending
- **💾 Auto-save Progress**: LocalStorage persistence
- **🎯 Collection Tracking**: Monitor owned vs missing characters

### Interactive Elements
- **🎲 Single Pull**: Test your luck one roll at a time
- **💰 Multi-Pull (10x)**: Batch rolling for efficiency
- **✨ Floating Card Animations**: Visual feedback for pulls
- **🌟 Rarity-based Visual Effects**: 
  - SSR: Golden glow with pulse animation
  - SR: Purple aura effect
  - R: Standard card appearance

### Quote System
Dynamic post-pull feedback based on results:

#### Quote Categories
- **🎊 Encouraging**: For SSR pulls and good luck
- **😤 Mocking**: For bad streaks and R sprees
- **🎭 Mixed**: For near-misses and SR pulls

#### Quote Structure
```json
{
  "jp": "Japanese text",
  "romaji": "Romanized pronunciation", 
  "en": "English translation"
}
```

### だじゃれコーナー (Dajare Corner)
Japanese dad jokes section featuring:
- **🤣 Random Dad Jokes**: Button-triggered joke rotation
- **🐎 Symboli Rudolf**: Character mascot for the section
- **🗾 Cultural Elements**: Authentic Japanese wordplay with translations

### Visual Design
- **🎨 Uma Musume Theme**: Inspired color palette (#F8F3CE, #57564F)
- **📱 Responsive Design**: Mobile-friendly interface
- **🎭 Asymmetric Layout**: Organic, non-grid positioning
- **⚡ Smooth Animations**: CSS transitions and transforms

## 📁 Project Structure

```
umamusu-gacha-sim/
├── app/
│   ├── page.js              # Home page with stats & dajare corner
│   ├── gacha/page.js        # Main gacha interface
│   ├── collection/page.js   # Character collection viewer
│   ├── lib/gacha.js         # Core algorithm implementation
│   └── context/GachaContext.js # React context for state management
├── public/data/
│   ├── characters.json      # Character database
│   ├── gacha_quotes.json    # Post-pull quote system
│   └── dad_jokes.json       # Japanese dad jokes
└── public/data/images/      # Character artwork
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **Build Tool**: Turbopack (Next.js native)
- **State Management**: React Context + useState/useEffect
- **Persistence**: Browser localStorage
- **Deployment Ready**: Vercel/Netlify compatible

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd umamusu-gacha-sim

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

## 🎯 Game Strategy Tips

### Maximizing SSR Chances
1. **Understand the Streak System**: Consecutive R pulls provide tiny bonuses
2. **Monitor Near-Miss Counter**: High counts indicate you're "close"
3. **Collection Focus**: New characters have slightly better odds
4. **Patience is Key**: With 0.7% base rate, expect ~143 pulls per SSR

### Statistical Expectations
```
Expected pulls for first SSR: ~143 pulls
Expected pulls for 50% SSR chance: ~99 pulls  
Expected pulls for 90% SSR chance: ~329 pulls
Expected cost per SSR (if monetized): Astronomical 💸
```

## 🤝 Contributing

This is a personal project showcasing gacha algorithm design and React development. Feel free to:
- Report bugs via issues
- Suggest new features
- Submit pull requests for improvements

## ⚠️ Disclaimer

This simulator is for **educational and entertainment purposes only**. It demonstrates the psychological mechanics used in actual gacha games. Please gamble responsibly in real games and be aware of the statistical disadvantages inherent in gacha systems.

## 📄 License

This project is open source and available under the MIT License.

---

*Built with ❤️ and a deep understanding of gacha psychology*