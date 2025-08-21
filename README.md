<picture>
  <source
    width="100%"
    srcset="./assets/thumbnail.png"
    media="(prefers-color-scheme: dark)"
  />
  <source
    width="100%"
    srcset="./assets/thumbnail.png"
    media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)"
  />
  <img width="100%" src="./assets/thumbnail.png" />
</picture>

<h1 align="center">🐎 Uma Musume Gacha Simulator</h1>

<p align="center">An advanced gacha simulation system featuring sophisticated probability engines with psychological mechanics and enhanced user experience.</p>

<p align="center">
  [<a href="https://umamusu-gacha-sim.vercel.app">Live Demo</a>] [<a href="#setup-instructions">Setup Guide</a>] [<a href="#ai-support-explanation">IBM Granite AI</a>]
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js&labelColor=000000">
  <img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react&labelColor=61DAFB">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css&labelColor=06B6D4">
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel&labelColor=000000">
</p>

<div align="center">
  <img src="./assets/gifs/goldship.gif" alt="Gold Ship Animation 1" width="45%" />
  <img src="./assets/gifs/golship2.gif" alt="Gold Ship Animation 2" width="45%" />
</div>

---

> Inspired by Uma Musume Pretty Derby with brutal yet engaging gacha mechanics

> [!NOTE]
> This project showcases advanced probability algorithms and psychological engagement systems developed with **IBM Granite AI** for educational and demonstration purposes.

Built with cutting-edge web technologies, this simulator features a **brutal yet fair gacha system** with no traditional pity mechanics, instead relying on intelligent probability scaling and psychological feedback systems to maintain player engagement while preserving the authentic thrill of gacha gaming.

## ✨ What's Special About This Project?

Unlike traditional flat-rate gacha simulators, our system implements **sophisticated psychological mechanics** commonly found in commercial gacha games. The system uses advanced probability algorithms, streak-based multipliers, and near-miss detection to create an engaging and realistic gacha experience.

> [!TIP]
> **Enhanced Algorithm Features:**
> 
> The simulator goes beyond simple probability rolls by implementing cumulative probability distribution, dual streak tracking, pattern analysis, and psychological manipulation techniques that mirror real-world gacha systems.

This means the **Uma Musume Gacha Simulator** provides an authentic gacha experience with mathematical precision, featuring brutal base rates (0.7% SSR) while maintaining psychological engagement through intelligent rate scaling and visual feedback systems.

## 🎯 Current Features

<div align="center">
  <img src="./assets/gifs/gacha-pull-demo.gif" alt="Gacha System Demo" width="80%" />
</div>

**Capable of:**

- [x] **🎰 Advanced Gacha System**
  - [x] Brutal Base Rates: 0.7% SSR, 8% SR, 91.3% R
  - [x] Dynamic Streak Multipliers: 1.05x to 1.45x SSR rate bonuses
  - [x] Cumulative Probability Distribution
  - [x] **Guaranteed SR System**: Every 10-pull guarantees at least one SR
  - [x] Near-Miss Psychology Detection
- [x] **🧠 Psychological Engagement**
  - [x] Dual Streak Tracking (R and SR streaks)
  - [x] Pattern Analysis of last 10 pulls
  - [x] Real-time Rate Display
  - [x] Near-Miss Counter and feedback
- [x] **🎨 Premium User Experience**
  - [x] Responsive Design (Mobile & Desktop)
  - [x] Smooth Card Reveal Animations
  - [x] Dynamic Quotes System
  - [x] **Japanese Dad Jokes Corner** (だじゃれコーナー with Symboli Rudolf)
  - [x] Collection Progress Tracking
- [x] **📊 Enhanced Statistics**
  - [x] Collection Progress Monitoring
  - [x] Pull History & Analytics
  - [x] Rate Monitoring & Multiplier Tracking
  - [x] Streak Analytics with Psychological Insights
- [x] **🔧 Quality of Life**
  - [x] Data Persistence (LocalStorage)
  - [x] Export/Import System
  - [x] Single & Multi-Pull Options
  - [x] Mobile-Optimized Interface

## 🚀 Setup Instructions

> For detailed setup instructions and deployment guides, follow the steps below

> [!NOTE]
> **Prerequisites:** Node.js 18+ and npm/yarn package manager required

```shell
# Clone the repository
git clone https://github.com/rwbu69/umamusu-gacha-sim.git
cd umamusu-gacha-sim

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🌐 Production Deployment (Vercel Recommended)

```shell
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod
```

### 📁 Project Structure

```
├── app/
│   ├── gacha/           # Main gacha interface
│   ├── lib/             # Core gacha logic and algorithms
│   └── globals.css      # Global styling
├── data/
│   ├── characters.json  # Character database
│   ├── gacha_quotes.json # Dynamic quote system
│   └── dad_jokes.json   # Japanese humor collection
└── assets/              # Visual assets and GIFs
    └── gifs/           # Demonstration GIFs
```

## 🛠️ Technologies Used

- [x] **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- [x] **[React 19](https://react.dev/)** - Latest React with enhanced concurrent features  
- [x] **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- [x] **JavaScript ES6+** - Modern JavaScript with advanced probability algorithms
- [x] **[Vercel](https://vercel.com/)** - Deployment platform optimized for Next.js
- [x] **JSON** - Data management for characters and dynamic content

## 🤖 AI Support Explanation

This project was developed with the exceptional assistance of **IBM Granite AI**, which proved instrumental in creating the sophisticated gacha mechanics and RNG systems that power this simulator. IBM Granite's advanced language understanding and code generation capabilities enabled the development of complex probability algorithms, psychological engagement systems, and mathematical models that would have taken significantly longer to implement manually.

**Key Contributions from IBM Granite AI:**

- **🎲 Advanced RNG Logic**: IBM Granite helped design and implement the sophisticated cumulative probability distribution system, ensuring mathematically sound yet engaging gacha mechanics
- **📈 Streak-Based Algorithms**: The complex streak multiplier system and psychological feedback mechanisms were developed through iterative collaboration with IBM Granite's analytical capabilities
- **🧮 Mathematical Modeling**: Granite's computational understanding enabled the creation of precise probability calculations and rate adjustment formulas
- **🎯 Feature Integration**: Seamless integration of multiple complex systems (near-miss detection, guaranteed pulls, streak tracking) was achieved through Granite's architectural insights
- **🔄 Code Optimization**: IBM Granite provided valuable suggestions for performance optimization and code structure improvements throughout the development process

**IBM Granite's Impact on Development Efficiency:**

- **🚀 Rapid Prototyping**: Complex algorithms that would typically require days of research and implementation were developed in hours with Granite's assistance
- **🎯 Mathematical Precision**: Granite ensured all probability calculations were mathematically sound and properly normalized
- **🧠 Psychological Insights**: The AI helped implement advanced psychological engagement techniques based on established gacha game principles
- **🔧 Code Quality**: Granite's suggestions led to cleaner, more maintainable code architecture with proper separation of concerns

The sophisticated nature of this gacha simulator - from its psychological manipulation techniques to its advanced statistical tracking - demonstrates **IBM Granite AI's remarkable capability** to understand complex gaming mechanics and translate them into robust, production-ready code. The AI's ability to maintain context across multiple interconnected systems while ensuring mathematical accuracy and user experience optimization showcases the true power of IBM's Granite technology in real-world application development.

> [!IMPORTANT]
> **Future Enhancements Planned with IBM Granite:**
> - Machine learning-based player behavior analysis
> - Dynamic difficulty adjustment algorithms  
> - Advanced anti-cheat pattern detection
> - Real-time engagement optimization systems

This project serves as a testament to how **IBM Granite AI can elevate development workflows**, enabling the creation of feature-rich, mathematically complex applications that would traditionally require extensive specialized knowledge in probability theory and behavioral psychology.

## 🌟 Sub-projects and Inspirations

- **[Uma Musume Pretty Derby](https://umamusume.jp/)**: The original inspiration for character designs and gacha mechanics
- **IBM Granite AI Integration**: Advanced AI-assisted development showcasing modern AI capabilities
- **Mathematical Gacha Research**: Implementation of real-world psychological manipulation techniques
- **Next.js 15 Showcase**: Demonstration of latest React and Next.js features

## 📊 Project Status

![GitHub Stars](https://img.shields.io/github/stars/rwbu69/umamusu-gacha-sim?style=social)
![GitHub Forks](https://img.shields.io/github/forks/rwbu69/umamusu-gacha-sim?style=social)
![GitHub Issues](https://img.shields.io/github/issues/rwbu69/umamusu-gacha-sim)

## 🙏 Acknowledgements

- **[IBM Granite AI](https://www.ibm.com/granite)**: For exceptional AI assistance in developing complex probability algorithms and psychological engagement systems
- **[Uma Musume Pretty Derby](https://umamusume.jp/)**: Original inspiration for character designs and gacha mechanics
- **[Next.js Team](https://nextjs.org/)**: For the amazing React framework and development experience
- **[Vercel](https://vercel.com/)**: For seamless deployment and hosting solutions
- **Open Source Community**: For the incredible tools and libraries that made this project possible

---

**Built with ❤️ and IBM Granite AI assistance**
