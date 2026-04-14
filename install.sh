#!/bin/bash

# FARCRYSTAL Installation Script
# This script sets up the entire FARCRYSTAL platform

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                FARCRYSTAL PLATFORM SETUP                          ║"
echo "║        AI-Powered Farcaster Mini App on Base                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js version
echo "[1/6] Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo "❌ Node.js 22.11.0+ required. Current: $(node --version)"
    echo "Please upgrade Node.js first."
    exit 1
fi
echo "✅ Node.js $(node --version) OK"

# Install pnpm if not exists
echo ""
echo "[2/6] Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@8.15.0
fi
echo "✅ pnpm $(pnpm --version) OK"

# Install dependencies
echo ""
echo "[3/6] Installing dependencies..."
pnpm install

# Build packages
echo ""
echo "[4/6] Building packages..."
pnpm run build --filter=@farcrystal/agents --filter=@farcrystal/database

# Setup database
echo ""
echo "[5/6] Setting up database..."
cd packages/database
cp .env.example .env 2>/dev/null || true
pnpm prisma generate
echo "✅ Database client generated"

# Compile contracts
echo ""
echo "[6/6] Compiling smart contracts..."
cd ../contracts
pnpm compile 2>/dev/null || echo "⚠️  Contract compilation skipped (Hardhat not installed yet)"

# Final message
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "✅ FARCRYSTAL SETUP COMPLETE!"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Copy .env.master to .env and fill in your API keys:"
echo "   cp .env.master .env"
echo ""
echo "2. Start the API server:"
echo "   cd apps/api && pnpm dev"
echo ""
echo "3. Start the Mini App (new terminal):"
echo "   cd apps/mini-app && pnpm dev"
echo ""
echo "4. Open browser to http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - API: http://localhost:3001/health"
echo "   - Mini App: http://localhost:3000"
echo "   - Skills: ./skills/farcrystal/SKILL.md"
echo ""
echo "🚀 Ready to launch tokens with AI agents!"
echo ""
