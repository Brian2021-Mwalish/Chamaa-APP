import { ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { formatKES, type Plan } from '@/types';

interface MembershipProps {
  plan: Plan;
  onComplete: () => void;
}

export function Membership({ plan, onComplete }: MembershipProps) {
  return (
    <div className="min-h-screen bg-ink-50 text-ink-900">
      <header className="bg-brand-800 px-5 pb-24 pt-8 text-white sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-semibold text-brand-100">
              <ShieldCheck size={17} /> Chama Membership
            </span>
            <span className="text-xs font-semibold text-brand-200">Membership setup</span>
          </div>
          <h1 className="mt-7 text-3xl font-extrabold">Review your membership setup</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-brand-100">
            Confirm your plan before we look for a circle that fits.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-14 max-w-3xl px-4 pb-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Your selected plan</p>
            <h2 className="mt-2 text-xl font-extrabold">{plan.name}</h2>
            <p className="mt-1 text-sm text-ink-500">{formatKES(plan.monthly)} per cycle · {formatKES(plan.payout)} payout</p>
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
              <Info size={18} className="mt-0.5 shrink-0" />
              <p>No payment is collected during onboarding. Contributions only begin after your circle is ready and its cycle starts.</p>
            </div>
            <button onClick={onComplete} className="btn-primary mt-5 flex w-full items-center justify-center gap-2">
              Continue to circle matching <ArrowRight size={18} />
            </button>
          </section>

          <aside className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-ink-900"><ShieldCheck size={18} className="text-brand-700" /> Before you join</div>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              You can review your circle rules and payment schedule before any contribution is due. No card is charged and no money moves on this screen.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}
