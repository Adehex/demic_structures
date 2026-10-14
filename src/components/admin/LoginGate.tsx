import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, LockIcon } from 'lucide-react';
import { Wordmark } from '../Wordmark';

type LoginGateProps = {
  onLogin: (passcode: string) => boolean;
};

export function LoginGate({ onLogin }: LoginGateProps) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(!onLogin(passcode));
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-950 px-5 py-8 font-sans">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        <Wordmark tone="light" />
        <h1 className="mt-10 font-display text-3xl font-bold tracking-tightest text-white">Client portal</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-bone-100/70">
          Post site updates, add projects and keep your contact details current.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="passcode" className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              Passcode
            </label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
              <input
                id="passcode"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                aria-invalid={error}
                aria-describedby={error ? 'passcode-error' : undefined}
                className={`w-full rounded-md border bg-white/[0.04] py-3.5 pl-11 pr-4 text-base text-white placeholder:text-ink-400 focus:outline-none ${
                error ? 'border-red-400' : 'border-white/15 focus:border-signal'}`
                }
                placeholder="Enter your passcode" />
              
            </div>
            {error &&
            <p id="passcode-error" role="alert" className="mt-2 text-sm text-red-300">
                That passcode isn’t right. Check with your administrator.
              </p>
            }
          </div>
          <button
            type="submit"
            disabled={!passcode}
            className="w-full rounded-full bg-signal py-3.5 text-sm font-semibold text-ink-950 transition-colors duration-150 ease-out hover:bg-white disabled:opacity-50">
            
            Sign in
          </button>
        </form>
      </div>

      <Link
        to="/"
        className="mx-auto mt-8 inline-flex items-center gap-2 text-sm font-medium text-bone-100/60 hover:text-white">
        
        <ArrowLeftIcon className="h-4 w-4" />
        Back to website
      </Link>
    </div>);

}