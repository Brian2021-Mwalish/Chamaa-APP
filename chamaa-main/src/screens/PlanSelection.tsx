import { useState } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { PLANS, type Plan } from '@/types';

interface PlanSelectionProps {
  onSelect: (plan: Plan) => void;
}

export function PlanSelection({ onSelect }: PlanSelectionProps) {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <div className="bg-brand-700 pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-brand-100 text-sm mb-2">
            <Sparkles size={16} />
            <span>Choose your plan</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold">
            Pick a savings plan
          </h1>
          <p className="text-brand-100 text-sm mt-2">
            You'll join a group with others on the same plan. You can change this later.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {PLANS.map((plan) => {
            const isSelected = selected?.id === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan)}
                className={`w-full text-left card p-5 transition-all ${isSelected ? 'ring-2 ring-brand-500 border-brand-400' : 'hover:border-ink-200'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${plan.color} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {plan.id === 'starter' ? 'S' : plan.id === 'standard' ? 'M' : 'P'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-ink-900">{plan.name}</p>
                      <p className="text-sm text-ink-400">{plan.monthly.toLocaleString()}/month</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all ${isSelected ? 'bg-brand-600 border-brand-600' : 'border-ink-200'}`}>
                    {isSelected && <Check className="text-white" size={16} />}
                  </div>
                </div>
                <p className="text-sm text-ink-500 mb-3">{plan.description}</p>
                <div className="space-y-1.5">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink-600">
                      <Check size={14} className="text-brand-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-ink-100 flex items-center justify-between">
                  <span className="text-sm text-ink-500">Your payout on turn</span>
                  <span className="text-lg font-extrabold text-brand-700">KES {plan.payout.toLocaleString()}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t border-ink-100 px-6 py-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {selected ? `Continue with ${selected.name}` : 'Select a plan'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
