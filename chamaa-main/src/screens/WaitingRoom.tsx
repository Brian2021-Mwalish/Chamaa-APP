import { useState, useEffect } from 'react';
import { Users, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { type Plan, formatKES } from '@/types';

interface WaitingRoomProps {
  plan: Plan;
  onMatched: () => void;
}

export function WaitingRoom({ plan, onMatched }: WaitingRoomProps) {
  const [filled, setFilled] = useState(1);

  useEffect(() => {
    if (filled < 5) {
      const t = setTimeout(() => setFilled(filled + 1), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => onMatched(), 1200);
    return () => clearTimeout(t);
  }, [filled, onMatched]);

  const isComplete = filled >= 5;

  return (
    <div className="min-h-screen bg-brand-700 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full">
        {!isComplete ? (
          <div className="text-center animate-fade-in">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-brand-600 animate-pulse-ring" />
              <div className="absolute inset-0 rounded-full bg-brand-600 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
              <div className="relative w-28 h-28 bg-brand-500 rounded-full flex items-center justify-center">
                <Users className="text-white" size={48} />
              </div>
            </div>
            <h1 className="text-white text-2xl font-extrabold mb-3">
              Finding your group
            </h1>
            <p className="text-brand-100 text-sm mb-10 max-w-xs mx-auto">
              We're matching you with 4 other members on the {plan.name}. This usually takes a few moments.
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map((spot) => (
                <div
                  key={spot}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    spot <= filled ? 'bg-gold-400 scale-100' : 'bg-brand-800 scale-90'
                  }`}
                >
                  {spot <= filled ? (
                    <CheckCircle2 className="text-ink-900" size={24} />
                  ) : (
                    <span className="text-brand-400 text-sm font-bold">{spot}</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-brand-100 text-sm">
              {filled} of 5 members matched
            </p>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-gold-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-ink-900" size={44} />
            </div>
            <h1 className="text-white text-2xl font-extrabold mb-3">
              Your group is ready!
            </h1>
            <p className="text-brand-100 text-sm mb-8 max-w-xs mx-auto">
              5 members matched on the {plan.name}. Your group chat is now open and your first contribution is due soon.
            </p>

            <div className="card p-5 text-left mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">Plan</span>
                <span className="font-semibold text-ink-900">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">Monthly contribution</span>
                <span className="font-semibold text-ink-900">{formatKES(plan.monthly)}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">Your payout</span>
                <span className="font-semibold text-brand-700">{formatKES(plan.payout)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-500">Cycle length</span>
                <span className="font-semibold text-ink-900">5 months</span>
              </div>
            </div>

            <button onClick={onMatched} className="w-full bg-gold-400 text-ink-900 font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-all hover:bg-gold-500 active:scale-[0.98]">
              Enter your group
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
