/**
 * Trading Agent Example
 * 
 * AI agent that trades based on market conditions
 */

import { FarcrystalAgent } from '@farcrystal/agents';

const TRADING_THRESHOLD = 0.05; // 5% price change

async function main() {
  const agent = new FarcrystalAgent({
    fid: 319485,
    neynarApiKey: process.env.NEYNAR_API_KEY!,
    walletPrivateKey: process.env.BASE_PRIVATE_KEY!,
    rpcUrl: process.env.BASE_RPC_URL!,
    strategy: 'trading',
    safetyLimits: {
      maxDailyTrades: 10,
      maxPositionSize: '1000',
      requireConfirmationAbove: '500',
      stopLossPercentage: 10,
      maxSlippage: 2.0
    }
  });

  await agent.connect();

  // Monitor price and trade
  agent.onPriceChange(async (token, price, change24h) => {
    console.log(`Price changed: ${token} = $${price} (${change24h}%)`);
    
    if (Math.abs(change24h) > TRADING_THRESHOLD * 100) {
      const action = change24h > 0 ? 'buy' : 'sell';
      console.log(`🤖 Agent decides to ${action}`);
      
      // Execute trade via Bankr
      const trade = await agent.executeTrade({
        tokenIn: action === 'buy' ? 'ETH' : token,
        tokenOut: action === 'buy' ? token : 'ETH',
        amount: '0.1',
        slippage: 1.0
      });
      
      // Post to Farcaster
      await agent.postToFarcaster({
        text: `🤖 Agent just ${action === 'buy' ? 'bought' : 'sold'} ${token} at $${price}`
      });
    }
  });
}

main().catch(console.error);
