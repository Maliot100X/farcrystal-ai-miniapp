'use client';

import { useState } from 'react';
import { useProfile } from '@farcaster/auth-kit';
import Link from 'next/link';
import { ArrowLeft, Rocket, Bot, TrendingUp, MessageCircle, Target } from 'lucide-react';

const strategies = [
  { id: 'hodl', name: 'HODL Master', icon: TrendingUp, desc: 'Long-term holding strategy' },
  { id: 'trader', name: 'Day Trader', icon: Target, desc: 'Active trading bot' },
  { id: 'social', name: 'Social Growth', icon: MessageCircle, desc: 'Community building' },
  { id: 'growth', name: 'Growth Hacker', icon: Rocket, desc: 'Aggressive marketing' },
];

export default function LaunchPage() {
  const { isAuthenticated, profile } = useProfile();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    supply: '1000000',
    strategy: 'hodl'
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen p-6">
        <header className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Launch Token</h1>
        </header>
        <div className="text-center py-12">
          <p className="text-lg opacity-70 mb-4">Please sign in first</p>
          <Link href="/signin" className="px-6 py-2 bg-primary text-black font-bold rounded-full">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Launch Token + AI Agent</h1>
          <p className="text-sm opacity-70">Signed in as @{profile?.username}</p>
        </div>
      </header>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              s <= step ? 'bg-primary' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Token Details */}
      {step === 1 && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Token Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Token Name</label>
              <input
                type="text"
                placeholder="e.g., Crystal Token"
                className="w-full p-3 bg-black/50 border border-primary/30 rounded-lg text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Symbol</label>
              <input
                type="text"
                placeholder="e.g., CRYSTAL"
                className="w-full p-3 bg-black/50 border border-primary/30 rounded-lg text-white"
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Total Supply</label>
              <input
                type="number"
                className="w-full p-3 bg-black/50 border border-primary/30 rounded-lg text-white"
                value={formData.supply}
                onChange={(e) => setFormData({...formData, supply: e.target.value})}
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-6 p-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/80"
          >
            Next: Choose Agent
          </button>
        </div>
      )}

      {/* Step 2: Agent Strategy */}
      {step === 2 && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Choose AI Agent</h2>
          
          <div className="space-y-3">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <button
                  key={strategy.id}
                  onClick={() => setFormData({...formData, strategy: strategy.id})}
                  className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 text-left ${
                    formData.strategy === strategy.id
                      ? 'border-primary bg-primary/20'
                      : 'border-white/20 hover:border-primary/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold">{strategy.name}</div>
                    <div className="text-sm opacity-70">{strategy.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 p-4 border border-white/20 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 p-4 bg-primary text-black font-bold rounded-lg"
            >
              Next: Preview
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Deploy */}
      {step === 3 && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Launch Preview</h2>
          
          <div className="card-glass p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent" />
              <div>
                <div className="font-bold text-lg">{formData.name || 'Token Name'}</div>
                <div className="text-sm opacity-70">${formData.symbol || 'SYMBOL'}</div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">Supply:</span>
                <span>{Number(formData.supply).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">AI Agent:</span>
                <span>{strategies.find(s => s.id === formData.strategy)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Network:</span>
                <span className="text-accent">Base</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Creator:</span>
                <span>@{profile?.username}</span>
              </div>
            </div>
          </div>

          <div className="card-glass p-4 mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              <div>
                <div className="font-bold">AI Agent Included</div>
                <div className="text-sm opacity-70">
                  Agent will auto-trade, post to Farcaster, manage liquidity
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 p-4 border border-white/20 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => alert('Deploying to Base...')}
              className="flex-1 p-4 bg-accent text-black font-bold rounded-lg hover:bg-accent/80"
            >
              🚀 Launch Token
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
