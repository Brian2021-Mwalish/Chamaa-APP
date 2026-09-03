import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LogOut,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { formatKES } from '@/types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const members = [
  { name: 'Wanjiru Kamau', phone: '+254 712 345 142', plan: 'Standard', status: 'Verified', joined: 'Today, 09:42' },
  { name: 'Amara Otieno', phone: '+254 712 345 883', plan: 'Premium', status: 'Verified', joined: 'Today, 08:16' },
  { name: 'Brian Kiptoo', phone: '+254 712 345 251', plan: 'Starter', status: 'Pending', joined: 'Yesterday' },
  { name: 'Fatuma Noor', phone: '+254 712 345 617', plan: 'Standard', status: 'Verified', joined: 'Yesterday' },
  { name: 'David Mwangi', phone: '+254 712 345 390', plan: 'Standard', status: 'Pending', joined: 'Sep 01, 2026' },
];

const transactions = [
  { label: 'Contribution - Group #4821', member: 'Wanjiru Kamau', amount: 5000, type: 'Contribution', time: '2 min ago', positive: true },
  { label: 'Payout - Group #4790', member: 'Mercy Akinyi', amount: 25000, type: 'Payout', time: '18 min ago', positive: false },
  { label: 'Membership fee', member: 'Amara Otieno', amount: 500, type: 'Fee', time: '42 min ago', positive: true },
  { label: 'Wallet top-up', member: 'Brian Kiptoo', amount: 10000, type: 'Top up', time: '1 hr ago', positive: true },
];

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-[100dvh] bg-ink-50 text-ink-900">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-700">
              <span className="font-extrabold text-gold-400">C</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-ink-900">Chama Admin</p>
              <p className="truncate text-xs text-ink-400">Operations overview</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-secondary flex shrink-0 items-center gap-2 px-3 py-2.5 text-sm sm:px-4">
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-600">Friday, September 4, 2026</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">Good morning, Admin</h1>
            <p className="mt-2 text-sm text-ink-500">Here is what is happening across Chama today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
            All systems operational
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total members" value="1,248" detail="+8.4% this month" icon={Users} tone="brand" />
          <MetricCard label="Active groups" value="186" detail="12 groups forming" icon={Activity} tone="gold" />
          <MetricCard label="Funds managed" value="KES 8.4M" detail="+12.6% this month" icon={CircleDollarSign} tone="ink" />
          <MetricCard label="Pending reviews" value="24" detail="Needs attention" icon={Clock3} tone="red" />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="card min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-ink-100 p-5 sm:p-6">
              <div>
                <h2 className="font-bold text-ink-900">Contribution volume</h2>
                <p className="mt-1 text-xs text-ink-400">Total contributions over the last 7 days</p>
              </div>
              <span className="badge shrink-0 bg-brand-100 text-brand-700">This week</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-extrabold text-ink-900">KES 1.26M</p>
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-brand-600"><ArrowUpRight size={14} /> 18.2%</p>
              </div>
              <div className="mt-7 flex h-44 items-end gap-2 sm:gap-4">
                {[42, 58, 48, 76, 64, 88, 72].map((height, index) => (
                  <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div className={`rounded-t-lg ${index === 5 ? 'bg-gold-400' : 'bg-brand-500'}`} style={{ height: `${height}%` }} />
                    <span className="text-center text-[10px] text-ink-400">{['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-ink-900">Action centre</h2>
                <p className="mt-1 text-xs text-ink-400">Items that need your review</p>
              </div>
              <span className="badge bg-gold-100 text-gold-700">6 open</span>
            </div>
            <div className="space-y-3">
              <ActionItem icon={ShieldCheck} label="KYC applications" count="24 pending" />
              <ActionItem icon={Users} label="Group matching" count="12 waiting" />
              <ActionItem icon={Wallet} label="Payout exceptions" count="3 to review" />
            </div>
            <button className="mt-5 flex w-full items-center justify-between rounded-xl border border-ink-100 px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
              View all actions <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="card min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-ink-100 p-5 sm:p-6">
              <div>
                <h2 className="font-bold text-ink-900">Recent members</h2>
                <p className="mt-1 text-xs text-ink-400">Latest registrations and verification status</p>
              </div>
              <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400">
                  <tr><th className="px-5 py-3 font-semibold sm:px-6">Member</th><th className="px-5 py-3 font-semibold">Plan</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Joined</th></tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {members.map((member) => (
                    <tr key={member.phone} className="hover:bg-ink-50">
                      <td className="whitespace-nowrap px-5 py-4 sm:px-6"><p className="font-semibold text-ink-900">{member.name}</p><p className="mt-1 text-xs text-ink-400">{member.phone}</p></td>
                      <td className="whitespace-nowrap px-5 py-4 text-ink-600">{member.plan}</td>
                      <td className="whitespace-nowrap px-5 py-4"><span className={`badge ${member.status === 'Verified' ? 'bg-brand-100 text-brand-700' : 'bg-gold-100 text-gold-700'}`}>{member.status}</span></td>
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-ink-400">{member.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-ink-100 p-5 sm:p-6">
              <div><h2 className="font-bold text-ink-900">Latest activity</h2><p className="mt-1 text-xs text-ink-400">Live platform transactions</p></div>
              <Activity size={18} className="text-brand-600" />
            </div>
            <div className="divide-y divide-ink-100">
              {transactions.map((transaction) => (
                <div key={`${transaction.label}-${transaction.time}`} className="flex items-center gap-3 p-4 sm:p-5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${transaction.positive ? 'bg-brand-100 text-brand-700' : 'bg-gold-100 text-gold-700'}`}>
                    {transaction.positive ? <ArrowDownToLine size={17} /> : <ArrowUpRight size={17} />}
                  </div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink-900">{transaction.label}</p><p className="mt-1 truncate text-xs text-ink-400">{transaction.member} · {transaction.time}</p></div>
                  <p className={`shrink-0 text-sm font-bold ${transaction.positive ? 'text-brand-700' : 'text-ink-700'}`}>{transaction.positive ? '+' : '-'}{formatKES(transaction.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-ink-400">Chama Admin Console · Demo data</footer>
      </main>
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Users; tone: 'brand' | 'gold' | 'ink' | 'red' }) {
  const styles = { brand: 'bg-brand-100 text-brand-700', gold: 'bg-gold-100 text-gold-700', ink: 'bg-ink-100 text-ink-700', red: 'bg-red-100 text-red-600' };
  return <div className="card p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-ink-500">{label}</p><p className="mt-2 text-2xl font-extrabold text-ink-900">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone]}`}><Icon size={19} /></div></div><p className="mt-4 text-xs font-semibold text-ink-400">{detail}</p></div>;
}

function ActionItem({ icon: Icon, label, count }: { icon: typeof Users; label: string; count: string }) {
  return <button className="flex w-full items-center gap-3 rounded-xl bg-ink-50 p-3 text-left hover:bg-brand-50"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm"><Icon size={17} /></div><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink-800">{label}</span><span className="block text-xs text-ink-400">{count}</span></span><ChevronRight size={16} className="shrink-0 text-ink-300" /></button>;
}
