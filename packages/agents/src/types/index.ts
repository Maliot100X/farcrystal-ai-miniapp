export interface AgentConfig {
  id: string;
  name: string;
  type: 'trading' | 'social' | 'liquidity' | 'game' | 'custom';
  strategy: string;
  tokenAddress?: string;
  ownerFid: number;
  parameters: Record<string, any>;
}

export interface Skill {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

export interface AgentMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AgentState {
  status: 'idle' | 'working' | 'paused' | 'error';
  lastAction: string;
  lastActionTime: string;
  performance: {
    trades: number;
    profitLoss: number;
    winRate: number;
  };
  memory: AgentMessage[];
}

export interface BankrSkillParams {
  action: 'swap' | 'liquidity' | 'stake' | 'balance';
  tokenIn?: string;
  tokenOut?: string;
  amount?: string;
  pool?: string;
}

export interface FarcasterSkillParams {
  action: 'cast' | 'reply' | 'like' | 'timeline';
  text?: string;
  castHash?: string;
  embeds?: string[];
}

export interface SafetyLimits {
  maxDailyTrades: number;
  maxPositionSize: string;
  requireConfirmationAbove: string;
  stopLossPercentage: number;
  maxSlippage: number;
}
