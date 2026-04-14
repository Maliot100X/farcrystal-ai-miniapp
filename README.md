# 🚀 FARCRYSTAL

**AI-Powered Farcaster Mini App on Base**

Launch tokens with AI agents. Play P2E games. Trade socially.

## ✨ Features

- 🎯 **Launch Tokens + AI Agents** - Deploy tokens with built-in AI management
- 🤖 **AI Agent Marketplace** - Hire agents for trading, social, or growth
- 🎮 **Play to Earn** - Games with AI agents
- 💬 **Social Trading** - Follow top traders, copy their moves
- 🔐 **Farcaster Auth** - Sign in with your Farcaster account

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MINI APP (Next.js)                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ Launch  │ │  Play   │ │ Agents  │ │ Social  │            │
│  │ Token   │ │  Games  │ │Marketplace│ │ Trading │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────────────────┤
│                      API (Fastify)                           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │  Auth   │ │ Agents  │ │ Tokens  │ │  Game   │            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────────────────┤
│                    AI AGENT FRAMEWORK                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │  Bankr  │ │Farcaster│ │  Base   │ │  LLM    │            │
│  │ Trades  │ │  Posts  │ │  RPC    │ │ Fireworks│            │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────────────────┤
│                   SMART CONTRACTS (Base)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Token     │ │   Factory   │ │    Game     │            │
│  │  ERC-20     │ │   Agents    │ │  Prediction │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22.11.0+
- pnpm 8.15.0+

### Install

```bash
# Clone or navigate to project
cd /opt/farcrystal

# Run setup
./install.sh
```

### Start Development

```bash
# Terminal 1 - API Server
cd apps/api
pnpm dev

# Terminal 2 - Mini App
cd apps/mini-app
pnpm dev
```

Open http://localhost:3000

## 🔑 Environment Variables

All real API keys are pre-configured:

- **Neynar** - Farcaster API (provided)
- **Bankr** - Trading API (provided)
- **Alchemy** - Base RPC (provided)
- **Redis** - Upstash (provided)
- **Fireworks** - AI LLM (provided)

## 📁 Project Structure

```
farcrystal/
├── apps/
│   ├── mini-app/          # Next.js Mini App
│   └── api/               # Fastify API
├── packages/
│   ├── agents/            # AI Agent framework
│   ├── contracts/         # Solidity contracts
│   └── database/          # Prisma database
└── skills/
    └── farcrystal/        # Skill documentation
```

## 🛠️ Tech Stack

**Frontend:** Next.js 14, React, Tailwind CSS, Framer Motion
**Backend:** Fastify, JWT, Rate Limiting
**AI:** Fireworks LLM (Llama 3.3 70B), Custom Agent Framework
**Blockchain:** Solidity, Hardhat, Ethers.js, Base
**APIs:** Neynar (Farcaster), Bankr (Trading), Alchemy (RPC)
**Infrastructure:** Upstash Redis, BullMQ

## 📚 Documentation

- [Full SKILL Guide](skills/farcrystal/SKILL.md) - For AI agent integration
- [Examples](skills/farcrystal/examples/) - Code samples

## 🎯 Smart Contracts

### Deploy to Base Sepolia

```bash
cd packages/contracts
pnpm deploy:base-sepolia
```

### Deploy to Base Mainnet

```bash
pnpm deploy:base
```

## 📋 API Endpoints

```
GET    /health              - Health check
POST   /auth/verify         - Verify Farcaster sign-in
GET    /auth/me             - Get current user
GET    /agents              - List agents
POST   /agents              - Create agent
GET    /tokens              - List tokens
POST   /tokens/launch       - Launch token
GET    /game/leaderboard    - Get leaderboard
```

## 🤖 AI Agent Skills

```typescript
// Example: Create a trading agent
import { FarcrystalAgent } from '@farcrystal/agents';

const agent = new FarcrystalAgent({
  fid: 319485,
  neynarApiKey: process.env.NEYNAR_API_KEY!,
  walletPrivateKey: process.env.BASE_PRIVATE_KEY!,
  rpcUrl: process.env.BASE_RPC_URL!,
  strategy: 'trading'
});

await agent.connect();

// Execute trade via Bankr
await agent.executeTrade({
  tokenIn: 'ETH',
  tokenOut: '0x...',
  amount: '0.1'
});

// Post to Farcaster
await agent.postToFarcaster({
  text: '🤖 Agent just made a trade!'
});
```

## 🎮 Play to Earn Games

1. **Predict the Agent** - Guess AI's next move
2. **Agent Arena** - Bet on competing agents
3. **Social Quests** - Complete tasks, earn tokens

## ⚠️ Security

- Private keys are in `.env` files - **NEVER commit to git**
- Test on Base Sepolia before mainnet
- API keys have rate limits - implement caching

## 📝 License

MIT - See LICENSE file

---

**Built with 💎 FARCRYSTAL**

AI-powered tokens on Farcaster + Base
