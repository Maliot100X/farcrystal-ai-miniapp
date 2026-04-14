'use client';

import { SignInButton } from '@farcaster/auth-kit';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <main className="min-h-screen p-6">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Sign In</h1>
      </header>

      <div className="max-w-md mx-auto text-center">
        <div className="card-glass p-8">
          <h2 className="text-2xl font-bold mb-4">Connect with Farcaster</h2>
          <p className="text-sm opacity-70 mb-6">
            Sign in with your Farcaster account to launch tokens, create agents, and play games.
          </p>
          
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
