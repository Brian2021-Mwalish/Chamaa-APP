import { Users, CheckCircle2, Clock, Calendar, Crown, ArrowRight } from 'lucide-react';
import { type User, formatKES } from '@/types';
import type { Screen } from '@/types';

interface GroupScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

export function GroupScreen({ user, onNavigate }: GroupScreenProps) {
  const paidCount = user.groupMembers.filter((m) => m.hasPaid).length;
  const poolTotal = user.plan.monthly * paidCount;

  return (
    <div className="animate-fade-in">
      <div className="bg-brand-700 px-6 pt-8 pb-8 rounded-b-3xl lg:px-10 lg:pt-10 lg:rounded-b-none">
        <div className="flex items-center gap-2 text-brand-100 text-sm mb-2">
          <Users size={16} />
          <span>Your Savings Group</span>
        </div>
        <h1 className="text-white text-2xl font-extrabold mb-1">Standard Group #4821</h1>
        <p className="text-brand-200 text-sm">{user.plan.name} · Cycle Month {user.cycleMonth} of 5</p>

        <div className="flex gap-4 mt-5">
          <div className="bg-brand-800/50 rounded-xl px-4 py-3 flex-1">
            <p className="text-brand-100 text-xs">Pool this month</p>
            <p className="text-white font-bold">{formatKES(poolTotal)}</p>
          </div>
          <div className="bg-brand-800/50 rounded-xl px-4 py-3 flex-1">
            <p className="text-brand-100 text-xs">Members paid</p>
            <p className="text-white font-bold">{paidCount} / 5</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 lg:px-10 lg:-mt-6">
        <div className="card p-5 mb-4">
          <h3 className="font-bold text-ink-900 mb-4">Payout Schedule</h3>
          <p className="text-sm text-ink-400 mb-4">
            Each member receives the full pool on their assigned month. Turns rotate across all 5 members.
          </p>
          <div className="space-y-2">
            {user.groupMembers.map((m) => {
              const pm = m.payoutMonth ?? 0;
              const isCurrent = pm === user.currentMonth;
              const isPast = pm < user.currentMonth;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrent ? 'bg-gold-50 border border-gold-200' : isPast ? 'bg-brand-50' : 'bg-ink-50'
                  }`}
                >
                  <div className={`w-10 h-10 ${m.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {m.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink-900 text-sm">{m.name}</p>
                    <p className="text-xs text-ink-400">Month {pm}</p>
                  </div>
                  {isPast ? (
                    <span className="badge bg-brand-100 text-brand-700">
                      <CheckCircle2 size={12} /> Received
                    </span>
                  ) : isCurrent ? (
                    <span className="badge bg-gold-400 text-ink-900">
                      <Crown size={12} /> This month
                    </span>
                  ) : (
                    <span className="badge bg-ink-100 text-ink-500">
                      <Clock size={12} /> Upcoming
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-brand-600" />
            <h3 className="font-bold text-ink-900">This Month's Contributions</h3>
          </div>
          <div className="space-y-3">
            {user.groupMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${m.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {m.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900 text-sm">{m.name}</p>
                    <p className="text-xs text-ink-400">{m.phone}</p>
                  </div>
                </div>
                {m.hasPaid ? (
                  <div className="text-right">
                    <p className="font-semibold text-brand-700 text-sm">{formatKES(user.plan.monthly)}</p>
                    <span className="badge bg-brand-100 text-brand-700 text-[10px]">
                      <CheckCircle2 size={10} /> Paid
                    </span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="font-semibold text-ink-400 text-sm">{formatKES(user.plan.monthly)}</p>
                    <span className="badge bg-gold-100 text-gold-700 text-[10px]">
                      <Clock size={10} /> Waiting
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 mb-6">
          <h3 className="font-bold text-ink-900 mb-3">Group Rules</h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2 text-sm text-ink-600">
              <CheckCircle2 size={16} className="text-brand-500 mt-0.5 shrink-0" />
              All 5 members contribute {formatKES(user.plan.monthly)} each month
            </div>
            <div className="flex items-start gap-2 text-sm text-ink-600">
              <CheckCircle2 size={16} className="text-brand-500 mt-0.5 shrink-0" />
              Payout rotates — everyone gets {formatKES(user.plan.payout)} once per cycle
            </div>
            <div className="flex items-start gap-2 text-sm text-ink-600">
              <CheckCircle2 size={16} className="text-brand-500 mt-0.5 shrink-0" />
              If you're short, the app covers your contribution automatically
            </div>
            <div className="flex items-start gap-2 text-sm text-ink-600">
              <CheckCircle2 size={16} className="text-brand-500 mt-0.5 shrink-0" />
              Credit is repaid automatically from your next payout
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('chat')}
          className="w-full card p-4 flex items-center justify-between hover:border-brand-300 transition-all mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-brand-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-ink-900 text-sm">Open group chat</p>
              <p className="text-xs text-ink-400">2 unread messages</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-ink-400" />
        </button>
      </div>
    </div>
  );
}
