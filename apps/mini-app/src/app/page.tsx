'use client';

import { useEffect } from 'react';
import { useProfile } from '@farcaster/auth-kit';
import { initMiniApp, isInMiniApp } from '@/lib/sdk';
import Link from 'next/link';
import { Sparkles, Rocket, Gamepad2, Users, Bot } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, profile } = useProfile();

  useEffect(() => {
    // Initialize Mini App if running in Farcaster
    if (isInMiniApp()) {
      initMiniApp();
    }
  }, []);

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-glow">FARCRYSTAL</h1>
        </div>
        <p className="text-lg opacity-80">
          Launch tokens with AI agents. Play to earn. Trade socially.
        </p>
        
        {/* Auth Status */}
        <div className="mt-4">
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/50">
              <img 
                src={profile?.pfpUrl} 
                alt={profile?.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium">@{profile?.username}</span>
              <span className="text-xs text-primary">FID: {profile?.fid}</span>
            </div>
          ) : (
            <Link 
              href="/signin"
              className="inline-block px-6 py-2 bg-primary text-black font-bold rounded-full hover:bg-primary/80"
            >
              Sign in with Farcaster
            </Link>
          )}
        </div>
      </header>

      {/* Feature Grid */}
      <div className="grid gap-4 max-w-md mx-auto">
        {/* Launch Token */}
        <Link href="/launch" className="card-glass p-6 hover:bg-opacity-90 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Launch Token</h2>
              <p className="text-sm opacity-70">Deploy with AI agent</p>
            </div>
          </div>
        </Link>

        {/* Play to Earn */}
        <Link href="/play" className="card-glass p-6 hover:bg-opacity-90 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Play to Earn</h2>
              <p className="text-sm opacity-70">Games with AI agents</p>
            </div>
          </div>
        </Link>

        {/* Agent Marketplace */}
        <Link href="/agents" className="card-glass p-6 hover:bg-opacity-90 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Agents</h2>
              <p className="text-sm opacity-70">Browse & hire agents</p>
            </div>
          </div>
        </Link>

        {/* Social Trading */}
        <Link href="/social" className="card-glass p-6 hover:bg-opacity-90 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Social Trading</h2>
              <p className="text-sm opacity-70">Follow top traders</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Footer */}
      <footer className="mt-8 text-center text-sm opacity-60">
        <div className="flex justify-center gap-6 mb-4">
          <div>
            <div className="text-2xl font-bold text-primary">0</div>
            <div className="text-xs">Tokens Launched</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">0</div>
            <div className="text-xs">Active Agents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">$0</div>
            <div className="text-xs">Total Volume</div>
          </div>
        </div>
        <p>Powered by Farcaster + Base + AI</p>
      </footer>
    </main>
  );
}
