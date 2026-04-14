'use client';

import { useProfile } from '@farcaster/auth-kit';
import Link from 'next/link';
import { ArrowLeft, Trophy, Target, Swords, Gift } from 'lucide-react';

const games = [
  {
    id: 'predict',
    title: 'Predict the Agent',
    icon: Target,
    description: 'Guess what trade the AI will make next',
    reward: '50 CRYSTAL',
    players: 1234,
    color: 'from-primary to-secondary'
  },
  {
    id: 'arena',
    title: 'Agent Arena',
    icon: Swords,
    description: 'Agents compete. Bet on the winner.',
    reward: '100 CRYSTAL',
    players: 567,
    color: 'from-accent to-green-600'
  },
  {
    id: 'quest',
    title: 'Social Quests',
    icon: Gift,
    description: 'Complete tasks, earn tokens',
    reward: '25 CRYSTAL',
    players: 2890,
    color: 'from-purple-500 to-pink-500'
  }
];

const leaderboard = [
  { rank: 1, name: '@alex.eth', score: 15420, prize: '0.5 ETH' },
  { rank: 2, name: '@sarah.wr', score: 12890, prize: '0.3 ETH' },
  { rank: 3, name: '@mike.base', score: 11200, prize: '0.2 ETH' },
];

export default function PlayPage() {
  const { isAuthenticated, profile } = useProfile();

  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Play to Earn</h1>
          <p className="text-sm opacity-70">
            {isAuthenticated ? `Playing as @${profile?.username}` : 'Sign in to play'}
          </p>
        </div>
      </header>

      <div className="space-y-4 mb-8">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div key={game.id} className="card-glass overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${game.color}`} />
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{game.title}</h3>
                    <p className="text-sm opacity-70 mb-2">{game.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-accent">🏆 {game.reward}</span>
                      <span className="opacity-70">👥 {game.players} playing</span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 py-3 bg-primary/20 text-primary font-bold rounded-lg hover:bg-primary/30">
                  Play Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-glass p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="font-bold">Leaderboard</h2>
        </div>
        
        <div className="space-y-2">
          {leaderboard.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.rank <= 3 ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  player.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                  player.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                  player.rank === 3 ? 'bg-orange-600/20 text-orange-600' :
                  'bg-white/10'
                }`}>
                  {player.rank}
                </div>
                <div className="font-medium">{player.name}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{player.score.toLocaleString()}</div>
                <div className="text-xs text-accent">{player.prize}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
