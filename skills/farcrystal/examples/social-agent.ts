/**
 * Social Agent Example
 * 
 * AI agent that grows community on Farcaster
 */

import { FarcrystalAgent } from '@farcrystal/agents';

async function main() {
  const agent = new FarcrystalAgent({
    fid: 319485,
    neynarApiKey: process.env.NEYNAR_API_KEY!,
    walletPrivateKey: process.env.BASE_PRIVATE_KEY!,
    rpcUrl: process.env.BASE_RPC_URL!,
    strategy: 'social'
  });

  await agent.connect();

  // Auto-reply to mentions
  agent.onMention(async (cast) => {
    console.log(`💬 Mentioned by @${cast.author.username}: ${cast.text}`);
    
    // Generate response
    const response = await agent.think(
      `Reply to this mention: "${cast.text}"`
    );
    
    // Reply on Farcaster
    await agent.replyToCast({
      castHash: cast.hash,
      text: response
    });
  });

  // Daily content
  setInterval(async () => {
    const content = await agent.think(
      'Generate engaging crypto/farcaster content'
    );
    
    await agent.postToFarcaster({ text: content });
  }, 24 * 60 * 60 * 1000); // Every 24 hours
}

main().catch(console.error);
