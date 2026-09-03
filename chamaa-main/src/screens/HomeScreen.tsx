import { TrendingUp, Calendar, Users, ArrowRight, CheckCircle2, Clock, Wallet, Sparkles } from 'lucide-react';
import { type User, formatKES } from '@/types';
import type { Screen } from '@/types';

interface HomeScreenProps {
  user: User;
  onNavigate: (screen: Screen) => void;
}

export function HomeScreen({ user, onNavigate }: HomeScreenProps) {
  const paidCount = user.groupMembers.filter((m) => m.hasPaid).length;
  const poolPercent = (paidCount / 5) * 100;
  const poolTotal = user.plan.monthly * paidCount;
  const poolGoal = user.plan.monthly * 5;
  const myPayoutMonth = user.groupMembers.find((m) => m.isMe)?.payoutMonth ?? 1;
  const monthsUntilPayout = myPayoutMonth - user.currentMonth;

  return (
    <div className="animate-fade-in">
      <div className="bg-brand-700 px-6 pt-8 pb-8 rounded-b-3xl lg:px-10 lg:pt-10 lg:rounded-b-none">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-brand-100 text-sm">Karibu,</p>
            <h1 className="text-white text-xl font-extrabold">{user.name || 'Member'}</h1>
          </div>
          <div className="w-11 h-11 bg-gold-400 rounded-full flex items-center justify-center">
            <span className="text-ink-900 font-bold text-sm">
              {(user.name || 'M').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="bg-brand-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-ink-900" />
            </div>
            <div>
              <p className="text-brand-100 text-xs">Wallet balance</p>
              <p className="text-white font-bold text-lg">{formatKES(user.walletBalance)}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('wallet')}
            className="text-gold-300 text-sm font-medium flex items-center gap-1 hover:text-gold-200"
          >
            View
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4 lg:px-10 lg:-mt-6">
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-ink-500">This month's pool</p>
              <p className="text-2xl font-extrabold text-ink-900">{formatKES(poolTotal)}</p>
              <p className="text-xs text-ink-400">of {formatKES(poolGoal)} goal</p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e3e5e9" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none" stroke="#1f855e" strokeWidth="3"
                  strokeDasharray={`${(poolPercent / 100) * 94.2} 94.2`}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-brand-700">
                {Math.round(poolPercent)}%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {user.groupMembers.map((m) => (
              <div
                key={m.id}
                className={`flex-1 h-2 rounded-full transition-all ${m.hasPaid ? 'bg-brand-500' : 'bg-ink-100'}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-ink-500">{paidCount} of 5 members paid</span>
            <button
              onClick={() => onNavigate('group')}
              className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:text-brand-700"
            >
              Details
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="card p-5 mb-4 bg-gradient-to-br from-brand-700 to-brand-800 border-0">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-gold-300" />
            <span className="text-brand-100 text-sm">Your payout turn</span>
          </div>
          <p className="text-white text-2xl font-extrabold mb-1">{formatKES(user.plan.payout)}</p>
          <p className="text-brand-200 text-sm mb-4">
            {monthsUntilPayout > 0
              ? `Month ${myPayoutMonth} — in ${monthsUntilPayout} month${monthsUntilPayout > 1 ? 's' : ''}`
              : monthsUntilPayout === 0
              ? 'This month — your turn is coming!'
              : 'You already received your payout'}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((month) => (
              <div
                key={month}
                className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  month < user.currentMonth
                    ? 'bg-brand-500 text-white'
                    : month === user.currentMonth
                    ? 'bg-gold-400 text-ink-900'
                    : month === myPayoutMonth
                    ? 'bg-brand-600 text-white ring-2 ring-gold-400'
                    : 'bg-brand-800/50 text-brand-300'
                }`}
              >
                M{month}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2">
          <button onClick={() => onNavigate('group')} className="card p-4 text-left hover:border-brand-300 transition-all">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-3">
              <Users className="text-brand-600" size={20} />
            </div>
            <p className="font-semibold text-ink-900 text-sm">Your Group</p>
            <p className="text-xs text-ink-400">5 members · Cycle {user.cycleMonth}</p>
          </button>
          <button onClick={() => onNavigate('chat')} className="card p-4 text-left hover:border-brand-300 transition-all">
            <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center mb-3">
              <MessageCircleSquare />
            </div>
            <p className="font-semibold text-ink-900 text-sm">Group Chat</p>
            <p className="text-xs text-ink-400">2 unread messages</p>
          </button>
        </div>

        <div className="card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-brand-600" />
            <h3 className="font-bold text-ink-900">Cycle progress</h3>
          </div>
          <div className="space-y-3">
            {user.groupMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${m.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                    {m.initials}
                  </div>
                  <span className="text-sm text-ink-700">{m.name}</span>
                </div>
                {m.hasPaid ? (
                  <span className="badge bg-brand-100 text-brand-700">
                    <CheckCircle2 size={12} /> Paid
                  </span>
                ) : (
                  <span className="badge bg-gold-100 text-gold-700">
                    <Clock size={12} /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageCircleSquare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a6c18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
