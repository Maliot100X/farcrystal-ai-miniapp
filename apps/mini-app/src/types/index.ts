export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl?: string;
  custodyAddress: string;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  totalSupply: string;
  creatorFid: number;
  createdAt: string;
  price?: number;
  marketCap?: number;
}

export interface Agent {
  id: string;
  name: string;
  type: 'trading' | 'social' | 'liquidity' | 'game';
  status: 'active' | 'paused' | 'stopped';
  tokenAddress?: string;
  strategy: string;
  performance: {
    trades: number;
    profitLoss: number;
    winRate: number;
  };
  createdAt: string;
}

export interface Game {
  id: string;
  type: 'predict' | 'arena' | 'quest';
  title: string;
  description: string;
  reward: number;
  endTime: string;
  participants: number;
}
