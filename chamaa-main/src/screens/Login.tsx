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
    <div className="min-h-screen bg-brand-700 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg animate-slide-up">
          <span className="text-brand-700 font-extrabold text-3xl">C</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-3 text-center animate-slide-up">
          Welcome to Chama
        </h1>
        <p className="text-brand-100 text-center text-base mb-12 max-w-xs animate-slide-up">
          Save together with a trusted 5-person group. Get your lump sum when it's your turn.
        </p>

        <div className="w-full max-w-sm animate-slide-up">
          <label className="text-brand-100 text-sm font-medium mb-2 block">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={20} />
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712 345 678"
              className="w-full bg-white rounded-xl pl-12 pr-4 py-4 text-ink-900 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all text-lg"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={phone.trim().length < 3}
            className="w-full bg-gold-400 text-ink-900 font-bold rounded-xl py-4 mt-4 flex items-center justify-center gap-2 transition-all hover:bg-gold-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={20} />
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-brand-600" />
            <span className="text-brand-300 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-brand-600" />
          </div>

          <button
            onClick={onDemoLogin}
            className="w-full bg-brand-600 border border-brand-500 text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-all hover:bg-brand-500 active:scale-[0.98]"
          >
            <Zap size={20} className="text-gold-400" />
            Demo Login — Skip to Dashboard
          </button>
        </div>
      </div>

      <div className="px-6 pb-10">
        <div className="flex items-center justify-center gap-2 text-brand-100 text-sm">
          <ShieldCheck size={16} />
          <span>Enter any phone number and any 4-digit code to log in</span>
        </div>
      </div>
    </div>
  );
}
