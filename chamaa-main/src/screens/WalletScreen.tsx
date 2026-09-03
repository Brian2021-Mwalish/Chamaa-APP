import { Wallet, TrendingUp, TrendingDown, ArrowDownToLine, ArrowUpFromLine, CreditCard } from 'lucide-react';
import { type User, formatKES, type WalletTransaction } from '@/types';

interface WalletScreenProps {
  user: User;
}

export function WalletScreen({ user }: WalletScreenProps) {
  return (
    <div className="animate-fade-in">
      <div className="bg-brand-700 px-6 pt-8 pb-10 rounded-b-3xl lg:px-10 lg:pt-10 lg:rounded-b-none">
        <div className="flex items-center gap-2 text-brand-100 text-sm mb-2">
          <Wallet size={16} />
          <span>My Wallet</span>
        </div>
        <h1 className="text-white text-3xl font-extrabold mb-1">{formatKES(user.walletBalance)}</h1>
        <p className="text-brand-200 text-sm">Available balance</p>

        <div className="flex gap-3 mt-5">
          <button className="flex-1 bg-gold-400 text-ink-900 font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all hover:bg-gold-500 active:scale-95">
            <ArrowDownToLine size={18} />
            <span className="text-sm">Top Up</span>
          </button>
          <button className="flex-1 bg-brand-800/50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all hover:bg-brand-800 active:scale-95 border border-brand-500">
            <ArrowUpFromLine size={18} />
            <span className="text-sm">Withdraw</span>
          </button>
        </div>
      </div>

      <div className="px-6 -mt-4 lg:px-10 lg:-mt-6">
        {user.creditBalance > 0 && (
          <div className="card p-4 mb-4 bg-gold-50 border-gold-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
                <CreditCard size={20} className="text-ink-900" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink-900 text-sm">Credit balance</p>
                <p className="text-xs text-ink-500">
                  Will be deducted from your next payout automatically
                </p>
              </div>
              <p className="font-bold text-gold-700">{formatKES(user.creditBalance)}</p>
            </div>
          </div>
        )}

        <div className="card p-5 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-ink-400 mb-1">Total received</p>
              <p className="font-bold text-brand-700 flex items-center gap-1">
                <TrendingUp size={16} />
                {formatKES(user.transactions.filter((t) => t.positive).reduce((s, t) => s + t.amount, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-400 mb-1">Total contributed</p>
              <p className="font-bold text-ink-600 flex items-center gap-1">
                <TrendingDown size={16} />
                {formatKES(user.transactions.filter((t) => !t.positive).reduce((s, t) => s + t.amount, 0))}
              </p>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-ink-900 mb-3 px-1">Transaction History</h3>
        <div className="space-y-2 mb-6">
          {user.transactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: WalletTransaction }) {
  const iconMap: Record<WalletTransaction['type'], { icon: typeof Wallet; color: string; bg: string }> = {
    contribution: { icon: ArrowUpFromLine, color: 'text-ink-600', bg: 'bg-ink-100' },
    payout: { icon: TrendingUp, color: 'text-brand-700', bg: 'bg-brand-100' },
    membership: { icon: CreditCard, color: 'text-gold-700', bg: 'bg-gold-100' },
    credit: { icon: CreditCard, color: 'text-gold-700', bg: 'bg-gold-100' },
    repayment: { icon: ArrowDownToLine, color: 'text-brand-700', bg: 'bg-brand-100' },
    topup: { icon: ArrowDownToLine, color: 'text-brand-700', bg: 'bg-brand-100' },
  };
  const { icon: Icon, color, bg } = iconMap[tx.type];

  return (
    <div className="card p-3.5 flex items-center gap-3">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
        <Icon size={18} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink-900 text-sm truncate">{tx.label}</p>
        <p className="text-xs text-ink-400">{tx.date}</p>
      </div>
      <p className={`font-bold text-sm ${tx.positive ? 'text-brand-700' : 'text-ink-700'}`}>
        {tx.positive ? '+' : '-'}{formatKES(tx.amount)}
      </p>
    </div>
  );
}
