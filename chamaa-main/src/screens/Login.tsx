import { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (phone: string) => void;
  onDemoLogin: () => void;
}

export function Login({ onLogin, onDemoLogin }: LoginProps) {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length >= 3) {
      onLogin(phone);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-ink-50 text-ink-900 lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section
        className="relative isolate flex min-h-[470px] flex-col overflow-hidden bg-brand-700 px-6 pb-10 pt-7 text-white sm:px-10 lg:min-h-[100dvh] lg:justify-between lg:px-14 lg:py-10"
        style={{
          backgroundImage: "linear-gradient(rgba(6, 40, 25, 0.48), rgba(15, 82, 56, 0.93)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 shadow-lg">
            <span className="text-xl font-extrabold text-ink-900">C</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">Chama</span>
        </div>

        <div className="relative z-10 mt-16 max-w-xl animate-slide-up lg:mt-0">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold-300">
            <span className="h-px w-8 bg-gold-300" />
            Save better together
          </p>
          <h1 className="max-w-lg text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your people. Your plan. Your future.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-100 sm:text-lg">
            Chama makes trusted group saving simple, transparent, and rewarding from your first contribution to your payout.
          </p>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-3 border-t border-white/20 pt-5">
            <div>
              <p className="text-xl font-extrabold text-white">5</p>
              <p className="mt-1 text-xs text-brand-100">Members per group</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">100%</p>
              <p className="mt-1 text-xs text-brand-100">Clear contributions</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">1</p>
              <p className="mt-1 text-xs text-brand-100">Shared goal</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-12 text-xs text-brand-200 lg:mt-0">Built for everyday progress in Kenya</p>
      </section>

      <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold text-brand-600">Member access</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500">Sign in to check your group, contributions, and next payout.</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-5 shadow-md sm:p-6">
            <label className="mb-2 block text-sm font-semibold text-ink-700" htmlFor="phone">
              Phone number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                className="input-field pl-12 text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={phone.trim().length < 3}
              className="btn-gold mt-4 flex w-full items-center justify-center gap-2"
            >
              Continue
              <ArrowRight size={20} />
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-100" />
              <span className="text-xs font-semibold text-ink-400">OR</span>
              <div className="h-px flex-1 bg-ink-100" />
            </div>

            <button
              type="button"
              onClick={onDemoLogin}
              className="btn-secondary flex w-full items-center justify-center gap-2"
            >
              <Zap size={18} className="text-gold-600" />
              Explore the demo
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-ink-400">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
            <span>Your number is used only to secure your Chama account.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
