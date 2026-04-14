'use client';

import { useProfile } from '@farcaster/auth-kit';
import Link from 'next/link';
import { ArrowLeft, Bot, TrendingUp, Star } from 'lucide-react';

const mockAgents = [
  {
    id: '1',
    name: 'Alpha Trader',
    type: 'trading',
    status: 'active',
    strategy: 'Momentum trading with AI predictions',
    performance: { trades: 156, profitLoss: 23.5, winRate: 68 },
    price: 0.1,
  },
  {
    id: '2',
    name: 'Social Maxi',
    type: 'social',
    status: 'active',
    strategy: 'Community growth through engagement',
    performance: { trades: 89, profitLoss: 45.2, winRate: 82 },
    price: 0.05,
  },
];

export default function AgentsPage() {
  const { isAuthenticated, profile } = useProfile();

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">AI Agent Marketplace</h1>
          <p className="text-sm opacity-70">
            {isAuthenticated ? `Signed in as @${profile?.username}` : 'Sign in to hire agents'}
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="card-glass p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {agent.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">{agent.price} ETH</div>
                    <div className="text-xs opacity-70">to hire</div>
                  </div>
                </div>

                <p className="text-sm opacity-80 mb-3">{agent.strategy}</p>

                <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-white/10">
                  <div>
                    <div className="text-lg font-bold text-primary">{agent.performance.trades}</div>
                    <div className="text-xs opacity-70">Trades</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">+{agent.performance.profitLoss}%</div>
                    <div className="text-xs opacity-70">P&L</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{agent.performance.winRate}%</div>
                    <div className="text-xs opacity-70">Win Rate</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-primary text-black font-bold rounded-lg text-sm">
                    Hire Agent
                  </button>
                  <button className="p-2 border border-white/20 rounded-lg">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
