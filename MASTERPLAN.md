# FARCRYSTAL - Complete Build Requirements
## Farcaster Mini App with AI Agents on Base

---

## 📋 PHASE 1: FOUNDATION (Week 1)

### Step 1: Environment Setup

#### Required API Keys & Credentials:

```bash
# 1. FARCASTER AUTH (Required for Mini App)
FARCASTER_NEYNAR_API_KEY=""           # Get from https://neynar.com/
FARCASTER_SIGNER_UUID=""              # From Farcaster Developer Portal
FARCASTER_APP_FID=""                  # Your Farcaster FID
FARCASTER_APP_PRIVATE_KEY=""          # App signer private key

# 2. BASE NETWORK (Required for contracts)
BASE_RPC_URL="https://mainnet.base.org"  # Or https://sepolia.base.org for testnet
BASE_PRIVATE_KEY=""                   # Wallet private key (with Base ETH)
BASE_API_KEY=""                       # From Alchemy/Infura

# 3. BANKR INTEGRATION (Required for DeFi)
BANKR_API_KEY=""                      # Get from Bankr team
BANKR_WEBHOOK_SECRET=""               # For webhook verification
BANKR_CLIENT_ID=""                    # OAuth client ID
BANKR_CLIENT_SECRET=""                # OAuth client secret

# 4. AI/LLM (Required for agents)
FIREWORKS_API_KEY="fw_AAzAHo6dxiAGkQFF2ajgDW"  # Fireworks AI
OPENAI_API_KEY=""                     # Optional backup
ANTHROPIC_API_KEY=""                  # Optional backup

# 5. DATABASE (Required for backend)
DATABASE_URL="postgresql://user:pass@host:5432/farcrystal"
REDIS_URL="redis://localhost:6379"
MONGODB_URI=""                        # Optional for agent memory

# 6. CLOUD/DEPLOYMENT
VERCEL_TOKEN=""                       # For frontend deployment
RENDER_API_KEY=""                     # For backend deployment
INFURA_IPFS_ID=""                     # For IPFS uploads
INFURA_IPFS_SECRET=""                 # For IPFS uploads

# 7. MONITORING
SENTRY_DSN=""                         # Error tracking
POSTHOG_API_KEY=""                    # Analytics
```

#### Accounts You Need to Create:

1. **Farcaster Account** - https://warpcast.com/
   - Enable Developer Mode
   - Get FID (Farcaster ID)
   - Create App in Developer Portal

2. **Neynar Account** - https://neynar.com/
   - API key for Farcaster API
   - Used for casts, frames, webhooks

3. **Base Wallet** - https://basescan.org/
   - Fund with ETH (mainnet or testnet)
   - Private key for contract deployment

4. **Bankr Developer** - https://bankr.bot/
   - Request API access
   - Get OAuth credentials

5. **Fireworks AI** - https://fireworks.ai/
   - Create API key
   - (You already have: fw_AAzAHo6dxiAGkQFF2ajgDW)

6. **Database** - https://supabase.com/ or https://render.com/
   - PostgreSQL instance
   - Redis instance

---

## 🗂️ PHASE 2: PROJECT STRUCTURE

```
farcrystal/
├── 📁 apps/
│   ├── 📁 mini-app/               # Farcaster Mini App (Next.js 14)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/          # Next.js App Router
│   │   │   │   ├── 📁 (auth)/
│   │   │   │   │   ├── 📄 signin/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 callback/
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📁 (main)/
│   │   │   │   │   ├── 📄 dashboard/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📄 launch/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📄 agents/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   ├── 📄 play/
│   │   │   │   │   │   └── 📄 page.tsx
│   │   │   │   │   └── 📄 profile/
│   │   │   │   │       └── 📄 page.tsx
│   │   │   │   ├── 📄 layout.tsx
│   │   │   │   └── 📄 page.tsx
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 auth/
│   │   │   │   │   ├── 📄 SignInButton.tsx
│   │   │   │   │   ├── 📄 AuthProvider.tsx
│   │   │   │   │   └── 📄 UserProfile.tsx
│   │   │   │   ├── 📁 launch/
│   │   │   │   │   ├── 📄 TokenLaunchForm.tsx
│   │   │   │   │   ├── 📄 AgentSelector.tsx
│   │   │   │   │   ├── 📄 StrategyPicker.tsx
│   │   │   │   │   └── 📄 LaunchPreview.tsx
│   │   │   │   ├── 📁 agents/
│   │   │   │   │   ├── 📄 AgentCard.tsx
│   │   │   │   │   ├── 📄 AgentChat.tsx
│   │   │   │   │   ├── 📄 AgentStats.tsx
│   │   │   │   │   ├── 📄 AgentControls.tsx
│   │   │   │   │   └── 📄 AgentMarketplace.tsx
│   │   │   │   ├── 📁 game/
│   │   │   │   │   ├── 📄 PlayToEarn.tsx
│   │   │   │   │   ├── 📄 Leaderboard.tsx
│   │   │   │   │   ├── 📄 PredictGame.tsx
│   │   │   │   │   ├── 📄 AgentArena.tsx
│   │   │   │   │   └── 📄 RewardsClaim.tsx
│   │   │   │   ├── 📁 social/
│   │   │   │   │   ├── 📄 ShareCast.tsx
│   │   │   │   │   ├── 📄 FollowTrader.tsx
│   │   │   │   │   ├── 📄 SocialFeed.tsx
│   │   │   │   │   └── 📄 CopyTradeButton.tsx
│   │   │   │   ├── 📁 wallet/
│   │   │   │   │   ├── 📄 BalanceCard.tsx
│   │   │   │   │   ├── 📄 TransactionHistory.tsx
│   │   │   │   │   └── 📄 ConnectWallet.tsx
│   │   │   │   └── 📁 ui/
│   │   │   │       ├── 📄 Button.tsx
│   │   │   │       ├── 📄 Card.tsx
│   │   │   │       ├── 📄 Modal.tsx
│   │   │   │       └── 📄 Loading.tsx
│   │   │   ├── 📁 hooks/
│   │   │   │   ├── 📄 useFarcasterAuth.ts
│   │   │   │   ├── 📄 useMiniApp.ts
│   │   │   │   ├── 📄 useAgent.ts
│   │   │   │   ├── 📄 useToken.ts
│   │   │   │   ├── 📄 useGame.ts
│   │   │   │   ├── 📄 useWallet.ts
│   │   │   │   └── 📄 useBankr.ts
│   │   │   ├── 📁 lib/
│   │   │   │   ├── 📄 sdk.ts              # MiniApp SDK instance
│   │   │   │   ├── 📄 contracts.ts        # Contract ABIs
│   │   │   │   ├── 📄 bankr.ts            # Bankr SDK
│   │   │   │   ├── 📄 farcaster.ts        # Farcaster API
│   │   │   │   └── 📄 utils.ts
│   │   │   ├── 📁 styles/
│   │   │   │   └── 📄 globals.css
│   │   │   └── 📁 types/
│   │   │       └── 📄 index.ts
│   │   ├── 📁 public/
│   │   │   ├── 📄 manifest.json          # Mini App manifest (CRITICAL)
│   │   │   ├── 📄 icon.png
│   │   │   └── 📄 splash.png
│   │   ├── 📄 .env.local
│   │   ├── 📄 next.config.js
│   │   ├── 📄 tailwind.config.ts
│   │   ├── 📄 tsconfig.json
│   │   └── 📄 package.json
│   │
│   └── 📁 api/                     # Backend API (Fastify)
│       ├── 📁 src/
│       │   ├── 📁 routes/
│       │   │   ├── 📄 auth.ts
│       │   │   ├── 📄 agents.ts
│       │   │   ├── 📄 tokens.ts
│       │   │   ├── 📄 game.ts
│       │   │   ├── 📄 social.ts
│       │   │   └── 📄 bankr.ts
│       │   ├── 📁 services/
│       │   │   ├── 📄 AgentService.ts
│       │   │   ├── 📄 TokenService.ts
│       │   │   ├── 📄 GameService.ts
│       │   │   ├── 📄 FarcasterService.ts
│       │   │   └── 📄 BankrService.ts
│       │   ├── 📁 middleware/
│       │   │   ├── 📄 auth.ts
│       │   │   └── 📄 rateLimit.ts
│       │   ├── 📁 models/
│       │   │   ├── 📄 Agent.ts
│       │   │   ├── 📄 Token.ts
│       │   │   ├── 📄 User.ts
│       │   │   └── 📄 Game.ts
│       │   └── 📄 index.ts
│       ├── 📄 .env
│       ├── 📄 package.json
│       └── 📄 tsconfig.json
│
├── 📁 packages/
│   ├── 📁 agents/                  # AI Agent Framework
│   │   ├── 📁 src/
│   │   │   ├── 📁 agents/
│   │   │   │   ├── 📄 TokenManagerAgent.ts
│   │   │   │   ├── 📄 TradingAgent.ts
│   │   │   │   ├── 📄 SocialAgent.ts
│   │   │   │   ├── 📄 GameMasterAgent.ts
│   │   │   │   └── 📄 LiquidityAgent.ts
│   │   │   ├── 📁 skills/
│   │   │   │   ├── 📁 bankr/
│   │   │   │   │   ├── 📄 executeSwap.ts
│   │   │   │   │   ├── 📄 provideLiquidity.ts
│   │   │   │   │   └── 📄 stakeTokens.ts
│   │   │   │   ├── 📁 farcaster/
│   │   │   │   │   ├── 📄 publishCast.ts
│   │   │   │   │   ├── 📄 replyToCast.ts
│   │   │   │   │   └── 📄 shareFrame.ts
│   │   │   │   ├── 📁 base/
│   │   │   │   │   ├── 📄 deployContract.ts
│   │   │   │   │   └── 📄 interactContract.ts
│   │   │   │   └── 📁 game/
│   │   │   │       ├── 📄 createQuest.ts
│   │   │   │       └── 📄 distributeRewards.ts
│   │   │   ├── 📁 engine/
│   │   │   │   ├── 📄 AgentEngine.ts
│   │   │   │   ├── 📄 SkillRegistry.ts
│   │   │   │   └── 📄 MemoryManager.ts
│   │   │   └── 📁 types/
│   │   │       └── 📄 index.ts
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   └── 📁 contracts/               # Smart Contracts
│       ├── 📁 contracts/
│       │   ├── 📁 tokens/
│       │   │   ├── 📄 FarcasterToken.sol
│       │   │   ├── 📄 AgentToken.sol
│       │   │   └── 📄 GameToken.sol
│       │   ├── 📁 agents/
│       │   │   ├── 📄 AgentFactory.sol
│       │   │   ├── 📄 AgentRegistry.sol
│       │   │   └── 📄 AgentController.sol
│       │   ├── 📁 game/
│       │   │   ├── 📄 GameManager.sol
│       │   │   ├── 📄 RewardDistributor.sol
│       │   │   └── 📄 Leaderboard.sol
│       │   └── 📁 interfaces/
│       │       ├── 📄 IBankrIntegration.sol
│       │       └── 📄 IFarcasterAuth.sol
│       ├── 📁 scripts/
│       │   ├── 📄 deploy.ts
│       │   └── 📄 verify.ts
│       ├── 📄 hardhat.config.ts
│       └── 📄 package.json
│
├── 📁 skills/                      # BankrBot Skills
│   ├── 📁 bankr/
│   │   └── SKILL.md
│   ├── 📁 farcaster/
│   │   └── SKILL.md
│   └── 📁 base/
│       └── SKILL.md
│
├── 📄 .env.example
├── 📄 .env.local.example
├── 📄 turbo.json                   # Turborepo config
├── 📄 pnpm-workspace.yaml
├── 📄 package.json
└── 📄 README.md
```

---

## 🎯 KEY FILES & CONFIGS

### 1. Mini App Manifest (REQUIRED)
**File:** `apps/mini-app/public/manifest.json`
```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "frame": {
    "version": "1",
    "name": "FARCRYSTAL",
    "iconUrl": "https://farcrystal.xyz/icon.png",
    "homeUrl": "https://farcrystal.xyz",
    "imageUrl": "https://farcrystal.xyz/image.png",
    "buttonTitle": "Launch",
    "splashImageUrl": "https://farcrystal.xyz/splash.png",
    "splashBackgroundColor":="#000000",
    "webhookUrl": "https://api.farcrystal.xyz/webhook"
  }
}
```

### 2. Next.js Config
**File:** `apps/mini-app/next.config.js`
```javascript
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
}
module.exports = nextConfig
```

### 3. Environment Files

**apps/mini-app/.env.local:**
```
NEXT_PUBLIC_APP_URL=https://farcrystal.xyz
NEXT_PUBLIC_MINI_APP_NAME=FARCRYSTAL
NEXT_PUBLIC_API_URL=https://api.farcrystal.xyz

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_ALCHEMY_API_KEY=

FARCASTER_NEYNAR_API_KEY=
```

**apps/api/.env:**
```
PORT=3001
DATABASE_URL=
REDIS_URL=

FARCASTER_NEYNAR_API_KEY=
FARCASTER_SIGNER_UUID=
FARCASTER_WEBHOOK_SECRET=

BASE_RPC_URL=
BASE_PRIVATE_KEY=

BANKR_API_KEY=
BANKR_WEBHOOK_SECRET=

FIREWORKS_API_KEY=
OPENAI_API_KEY=
```

---

## 🔌 ALL API ENDPOINTS NEEDED

### Farcaster APIs:
```
GET  https://api.neynar.com/v2/farcaster/user/bulk
POST https://api.neynar.com/v2/farcaster/cast
POST https://api.neynar.com/v2/farcaster/frame/action
POST https://api.neynar.com/v2/farcaster/webhook
```

### Bankr APIs:
```
POST https://api.bankr.bot/v1/swap
POST https://api.bankr.bot/v1/liquidity
POST https://api.bankr.bot/v1/stake
GET  https://api.bankr.bot/v1/balance
```

### Base Network:
```
https://mainnet.base.org
https://sepolia.base.org
```

---

## 📦 ALL PACKAGES TO INSTALL

### Root:
```bash
npm install -g pnpm
pnpm init
echo '{"name":"farcrystal","private":true}' > package.json
```

### Mini App:
```bash
cd apps/mini-app
npm install @farcaster/miniapp-sdk
npm install @farcaster/auth-kit
npm install @rainbow-me/rainbowkit wagmi viem
npm install @tanstack/react-query zustand
npm install tailwindcss postcss autoprefixer
npm install lucide-react framer-motion
npm install next@14 react react-dom
```

### API:
```bash
cd apps/api
npm install fastify @fastify/cors @fastify/jwt
npm install @fastify/rate-limit @fastify/websocket
npm install prisma @prisma/client
npm install ioredis bullmq
npm install ethers @ethersproject/providers
npm install axios dotenv
```

### Agents:
```bash
cd packages/agents
npm install openai axios
npm install @types/node typescript
```

### Contracts:
```bash
cd packages/contracts
npm install hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
npm install ethers dotenv
```

---

## 🎨 UI COMPONENTS NEEDED

### From shadcn/ui:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add skeleton
```

---

## ✅ BUILD CHECKLIST

### Week 1: Foundation
- [ ] Create monorepo structure
- [ ] Install all dependencies
- [ ] Configure Mini App SDK
- [ ] Setup Farcaster Auth
- [ ] Create basic UI layout
- [ ] Deploy test manifest

### Week 2: Smart Contracts
- [ ] Write token contracts
- [ ] Write agent contracts
- [ ] Write game contracts
- [ ] Deploy to Base testnet
- [ ] Verify contracts
- [ ] Create contract ABIs

### Week 3: Backend
- [ ] Setup Fastify API
- [ ] Connect database
- [ ] Implement auth endpoints
- [ ] Create agent service
- [ ] Integrate Bankr
- [ ] Add Farcaster webhooks

### Week 4: AI Agents
- [ ] Build agent engine
- [ ] Create skill registry
- [ ] Implement memory system
- [ ] Add Bankr skills
- [ ] Add Farcaster skills
- [ ] Test agent workflows

### Week 5: Frontend & Games
- [ ] Build launch UI
- [ ] Create agent marketplace
- [ ] Implement P2E games
- [ ] Add social features
- [ ] Connect wallet
- [ ] Test full flow

---

## 🚀 DEPLOYMENT

### Frontend (Vercel):
```bash
cd apps/mini-app
vercel --prod
```

### API (Render/Railway):
```bash
cd apps/api
# Push to GitHub, connect to Render
```

### Contracts (Base):
```bash
cd packages/contracts
npx hardhat run scripts/deploy.ts --network base
```

---

## 📞 SUPPORT & RESOURCES

### Documentation:
- Mini Apps: https://miniapps.farcaster.xyz
- Auth Kit: https://docs.farcaster.xyz/auth-kit
- Base: https://docs.base.org
- Bankr: https://docs.bankr.bot

### Communities:
- Farcaster Dev Chat: warpcast.com/~/channel/farcaster-dev
- Base Discord: discord.gg/base

---

## ✅ WHAT YOU NEED TO PROVIDE NOW:

1. **Farcaster Developer Account** (FID + API keys)
2. **Base Wallet** (with ETH for gas)
3. **Bankr API Access** (request from team)
4. **Database URLs** (Supabase/Render)
5. **AI API Keys** (Fireworks/OpenAI)

**Once you provide these, I start building immediately.**

**Ready to build?**
