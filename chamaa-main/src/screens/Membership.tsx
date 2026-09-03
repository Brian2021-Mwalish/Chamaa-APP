import { useState } from 'react';
import { Check, ArrowRight, Crown, ShieldCheck } from 'lucide-react';
import { MEMBERSHIP_FEE, formatKES, type Plan } from '@/types';

interface MembershipProps {
  plan: Plan;
  onComplete: () => void;
}

export function Membership({ plan, onComplete }: MembershipProps) {
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <div className="min-h-screen bg-ink-50 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-brand-600" size={52} />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-900 mb-3">Membership active!</h1>
          <p className="text-ink-500 mb-8 max-w-xs mx-auto">
            You're now an official Chama member. Let's find your savings group.
          </p>
          <button onClick={onComplete} className="btn-primary w-full flex items-center justify-center gap-2">
            Find my group
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <div className="bg-brand-700 pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-brand-100 text-sm mb-2">
            <Crown size={16} />
            <span>Chama Membership</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold">
            Activate your membership
          </h1>
          <p className="text-brand-100 text-sm mt-2">
            A one-time fee to join the Chama platform. This is separate from your monthly group contribution.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="card overflow-hidden mb-6">
            <div className="bg-brand-700 p-6 text-center">
              <p className="text-brand-100 text-sm mb-1">Membership Fee</p>
              <p className="text-white text-4xl font-extrabold">{formatKES(MEMBERSHIP_FEE)}</p>
              <p className="text-brand-200 text-sm mt-1">One-time payment</p>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <Check size={16} className="text-brand-500" />
                  Official platform membership
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <Check size={16} className="text-brand-500" />
                  Eligible to join savings groups
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <Check size={16} className="text-brand-500" />
                  Access to group chat and payouts
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-700">
                  <Check size={16} className="text-brand-500" />
                  Built-in credit safety net
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5 mb-6">
            <p className="text-sm text-ink-500 mb-3">Payment summary</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-ink-700">Membership fee</span>
              <span className="font-semibold text-ink-900">{formatKES(MEMBERSHIP_FEE)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-ink-700">Your plan</span>
              <span className="font-semibold text-ink-900">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-ink-100">
              <span className="text-ink-700">Monthly contribution (paid later)</span>
              <span className="font-semibold text-ink-900">{formatKES(plan.monthly)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-ink-400 mb-6 justify-center">
            <ShieldCheck size={16} />
            <span>Secured payment via M-Pesa</span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 px-6 py-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setPaid(true)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Pay {formatKES(MEMBERSHIP_FEE)} via M-Pesa
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
