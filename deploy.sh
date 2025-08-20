#!/bin/bash

# Uma Musume Gacha Simulator - Deployment Script
# This script prepares and deploys the project to Vercel

echo "🐎 Uma Musume Gacha Simulator - Deployment Script"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Clean and install dependencies
echo "🧹 Cleaning and installing dependencies..."
rm -rf node_modules/.cache
npm ci

# Run tests and build
echo "🔍 Running linter..."
npm run lint || echo "⚠️ Linting completed with warnings"

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🌐 Your Uma Musume Gacha Simulator is now live!"
    echo ""
    echo "📊 Monitor your deployment:"
    echo "• Vercel Dashboard: https://vercel.com/dashboard"
    echo "• Health Check: [your-domain]/api/health"
    echo ""
    echo "🔗 Don't forget to:"
    echo "• Update your domain in README.md"
    echo "• Set up custom domain if needed"
    echo "• Configure monitoring alerts"
else
    echo "❌ Deployment failed! Check the logs above."
    exit 1
fi
