import { AgentEngine, SkillRegistry, skillRegistry } from '../engine';
import { BankrSkill, FarcasterSkill, BaseSkill } from '../skills';
import { AgentConfig, AgentMessage, User } from '../types';
import axios from 'axios';

// Ensure skills are registered
skillRegistry.register(BankrSkill);
skillRegistry.register(FarcasterSkill);
skillRegistry.register(BaseSkill);

interface FarcrystalAgentConfig {
  fid: number;
  neynarApiKey: string;
  walletPrivateKey: string;
  rpcUrl: string;
  strategy: 'trading' | 'social' | 'liquidity' | 'game' | 'custom';
  safetyLimits?: {
    maxDailyTrades: number;
    maxPositionSize: string;
    requireConfirmationAbove: string;
    stopLossPercentage: number;
    maxSlippage: number;
  };
  memory?: {
    enabled: boolean;
    size: number;
    persist: boolean;
  };
}

export class FarcrystalAgent {
  private config: FarcrystalAgentConfig;
  private engine: AgentEngine | null = null;
  private user: User | null = null;
  private neynarApiKey: string;

  constructor(config: FarcrystalAgentConfig) {
    this.config = config;
    this.neynarApiKey = config.neynarApiKey;
  }

  async connect(): Promise<void> {
    // Get user info from Farcaster
    const response = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${this.config.fid}`,
      { headers: { 'api_key': this.neynarApiKey } }
    );

    const userData = response.data.users[0];
    this.user = {
      fid: userData.fid,
      username: userData.username,
      displayName: userData.display_name,
      pfpUrl: userData.pfp_url,
      custodyAddress: userData.custody_address
    };

    // Initialize agent engine
    this.engine = new AgentEngine(
      {
        id: `agent-${this.config.fid}`,
        name: `${userData.username}'s Agent`,
        type: this.config.strategy,
        strategy: this.config.strategy,
        ownerFid: this.config.fid,
        parameters: this.config.safetyLimits || {}
      },
      skillRegistry
    );

    await this.engine.initialize();

    console.log(`✅ Agent connected for @${this.user.username} (FID: ${this.user.fid})`);
  }

  async getProfile(): Promise<User | null> {
    return this.user;
  }

  async think(input: string): Promise<string> {
    if (!this.engine) throw new Error('Agent not connected');
    return await this.engine.think(input);
  }

  async postToFarcaster(params: { text: string; embeds?: string[] }): Promise<any> {
    if (!this.engine) throw new Error('Agent not connected');
    
    return await this.engine.executeSkill('farcaster', {
      action: 'cast',
      text: params.text,
      embeds: params.embeds
    });
  }

  async replyToCast(params: { castHash: string; text: string }): Promise<any> {
    if (!this.engine) throw new Error('Agent not connected');
    
    return await this.engine.executeSkill('farcaster', {
      action: 'reply',
      castHash: params.castHash,
      text: params.text
    });
  }

  async executeTrade(params: {
    tokenIn: string;
    tokenOut: string;
    amount: string;
    slippage?: number;
  }): Promise<any> {
    if (!this.engine) throw new Error('Agent not connected');
    
    return await this.engine.executeSkill('bankr', {
      action: 'swap',
      tokenIn: params.tokenIn,
      tokenOut: params.tokenOut,
      amount: params.amount,
      slippage: params.slippage || 0.5
    });
  }

  async getBalance(): Promise<any> {
    if (!this.engine) throw new Error('Agent not connected');
    
    return await this.engine.executeSkill('bankr', {
      action: 'balance'
    });
  }

  async provideLiquidity(params: {
    pool: string;
    amount: string;
  }): Promise<any> {
    if (!this.engine) throw new Error('Agent not connected');
    
    return await this.engine.executeSkill('bankr', {
      action: 'liquidity',
      pool: params.pool,
      amount: params.amount
    });
  }

  onPriceChange(callback: (token: string, price: number, change24h: number) => void): void {
    // TODO: Implement price monitoring
    console.log('Price monitoring not yet implemented');
  }

  onMention(callback: (cast: any) => void): void {
    // TODO: Implement mention monitoring
    console.log('Mention monitoring not yet implemented');
  }

  getState() {
    return this.engine?.getState();
  }
}
