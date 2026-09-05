import { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Handshake,
  Landmark,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
} from 'lucide-react';
import { formatKES, type User } from '@/types';

type ServiceTab = 'saving' | 'overdraft' | 'partnership';

interface ServicesScreenProps {
  user: User;
}

export function ServicesScreen({ user }: ServicesScreenProps) {
  const [activeTab, setActiveTab] = useState<ServiceTab>('saving');

  const tabs: { id: ServiceTab; label: string; shortLabel: string; icon: typeof Landmark }[] = [
    { id: 'saving', label: 'Savings', shortLabel: 'Save', icon: Landmark },
    { id: 'overdraft', label: 'Overdraft', shortLabel: 'Overdraft', icon: WalletCards },
    { id: 'partnership', label: 'Partnerships', shortLabel: 'Partners', icon: Handshake },
  ];

  return (
    <div className="animate-fade-in px-4 pb-8 pt-6 sm:px-8 lg:px-10 lg:pt-8">
      <div className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
          <BriefcaseBusiness size={17} />
          <span>Member services</span>
        </div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">More ways to grow with Chama</h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">Build a personal safety net, access short-term support, or connect your business to our member community.</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-1 rounded-2xl bg-ink-100 p-1 sm:max-w-2xl sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-bold transition-all sm:text-sm ${activeTab === tab.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'}`}
            >
              <Icon size={17} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'saving' && <SavingsPage onSwitchToOverdraft={() => setActiveTab('overdraft')} />}
      {activeTab === 'overdraft' && <OverdraftPage user={user} />}
      {activeTab === 'partnership' && <PartnershipPage />}
    </div>
  );
}

function SavingsPage({ onSwitchToOverdraft }: { onSwitchToOverdraft: () => void }) {
  const [goal, setGoal] = useState(50000);
  const [saved, setSaved] = useState(18500);
  const progress = Math.min((saved / goal) * 100, 100);
  const [showDeposit, setShowDeposit] = useState(false);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <div className="space-y-5">
        <section className="overflow-hidden rounded-3xl bg-brand-700 p-6 text-white shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400 text-ink-900"><Target size={22} /></div>
              <p className="text-sm text-brand-100">Personal savings balance</p>
              <p className="mt-1 text-3xl font-extrabold">{formatKES(saved)}</p>
              <p className="mt-2 text-sm text-brand-200">Separate from your group wallet, ready when you need it.</p>
            </div>
            <div className="hidden rounded-2xl border border-brand-500 bg-brand-800/40 p-3 text-right sm:block">
              <p className="text-xs text-brand-200">Estimated annual return</p>
              <p className="mt-1 text-xl font-bold text-gold-300">8.5%</p>
            </div>
          </div>
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold">
              <span className="text-brand-100">Goal progress</span>
              <span className="text-gold-300">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-900/60"><div className="h-full rounded-full bg-gold-400 transition-all" style={{ width: `${progress}%` }} /></div>
            <div className="mt-2 flex justify-between text-xs text-brand-200"><span>Started this month</span><span>Goal {formatKES(goal)}</span></div>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><h2 className="font-bold text-ink-900">Your savings goal</h2><p className="mt-1 text-xs text-ink-400">Adjust the target you are working towards.</p></div>
            <span className="badge bg-brand-100 text-brand-700"><Sparkles size={13} /> Active</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_150px] sm:items-end">
            <label className="block"><span className="mb-2 block text-xs font-semibold text-ink-500">Goal amount</span><div className="relative"><span className="pointer-events-none absolute left-4 top-3.5 text-sm font-semibold text-ink-400">KES</span><input className="input-field pl-14" type="number" min="1000" step="1000" value={goal} onChange={(event) => setGoal(Math.max(1000, Number(event.target.value)))} /></div></label>
            <button onClick={() => setShowDeposit(true)} className="btn-primary flex items-center justify-center gap-2"><Plus size={18} /> Add money</button>
          </div>
          {showDeposit && <DepositPanel onDeposit={(amount) => { setSaved((current) => current + amount); setShowDeposit(false); }} onCancel={() => setShowDeposit(false)} />}
        </section>
      </div>

      <div className="space-y-5">
        <section className="card p-5">
          <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-100 text-gold-700"><LockKeyhole size={19} /></div><div><h2 className="font-bold text-ink-900">Your money, protected</h2><p className="text-xs text-ink-400">Built for steady progress</p></div></div>
          <div className="space-y-3 text-sm text-ink-600"><Feature text="No withdrawal fees" /><Feature text="Track every deposit" /><Feature text="Protected member funds" /></div>
          <div className="mt-5 border-t border-ink-100 pt-4"><button onClick={onSwitchToOverdraft} className="flex w-full items-center justify-between text-left text-sm font-bold text-brand-700 hover:text-brand-800"><span>Need a short-term boost?</span><ArrowRight size={17} /></button></div>
        </section>
        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5"><div className="mb-3 flex items-center gap-2 text-brand-700"><ShieldCheck size={18} /><h2 className="font-bold">Smart saving tip</h2></div><p className="text-sm leading-6 text-brand-800">Set an automatic deposit after your monthly contribution. Even KES 500 a week adds up to KES 26,000 in a year.</p></section>
      </div>
    </div>
  );
}

function OverdraftPage({ user }: { user: User }) {
  const [amount, setAmount] = useState(5000);
  const [requested, setRequested] = useState(false);
  const maxAmount = 15000;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
      <section className="card overflow-hidden">
        <div className="bg-ink-900 p-6 text-white sm:p-8"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-400 text-ink-900"><WalletCards size={22} /></div><p className="text-sm text-ink-300">Available overdraft</p><p className="mt-1 text-3xl font-extrabold">{formatKES(maxAmount - user.creditBalance)}</p><p className="mt-2 max-w-lg text-sm leading-6 text-ink-300">Cover an urgent contribution or expense and repay from your wallet on your schedule.</p></div>
        <div className="p-6 sm:p-8">
          {requested ? <SuccessState title="Request received" description={`We are reviewing your ${formatKES(amount)} overdraft request. You will get an update in your notifications shortly.`} onReset={() => setRequested(false)} /> : <><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-ink-900">Request an overdraft</h2><p className="mt-1 text-xs text-ink-400">Choose how much support you need.</p></div><span className="badge bg-gold-100 text-gold-700">2% service fee</span></div><label className="block"><span className="mb-2 block text-xs font-semibold text-ink-500">Amount</span><div className="relative"><span className="pointer-events-none absolute left-4 top-3.5 text-sm font-semibold text-ink-400">KES</span><input className="input-field pl-14" type="number" min="1000" max={maxAmount} step="500" value={amount} onChange={(event) => setAmount(Math.min(maxAmount, Math.max(1000, Number(event.target.value))))} /></div></label><input className="mt-5 w-full accent-brand-600" type="range" min="1000" max={maxAmount} step="500" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /><div className="mt-2 flex justify-between text-xs text-ink-400"><span>KES 1,000</span><span>KES {maxAmount.toLocaleString()}</span></div><div className="mt-6 rounded-xl bg-ink-50 p-4"><div className="flex justify-between text-sm"><span className="text-ink-500">You receive</span><span className="font-bold text-ink-900">{formatKES(amount)}</span></div><div className="mt-2 flex justify-between text-sm"><span className="text-ink-500">Service fee</span><span className="font-semibold text-ink-700">{formatKES(amount * 0.02)}</span></div></div><button onClick={() => setRequested(true)} className="btn-primary mt-5 flex w-full items-center justify-center gap-2">Continue request <ChevronRight size={18} /></button></>}
        </div>
      </section>
      <div className="space-y-5"><section className="card p-5"><h2 className="mb-4 font-bold text-ink-900">How it works</h2><div className="space-y-4"><Step number="1" title="Choose an amount" text="Request up to your approved limit." /><Step number="2" title="Get a quick review" text="We check your Chama history and eligibility." /><Step number="3" title="Repay with ease" text="Repay in one or more wallet payments." /></div></section><section className="rounded-2xl border border-gold-200 bg-gold-50 p-5"><div className="flex items-center gap-2 text-gold-700"><Clock3 size={17} /><p className="font-bold">Typical review time</p></div><p className="mt-2 text-sm leading-6 text-gold-800">Most requests are reviewed within one business day.</p></section></div>
    </div>
  );
}

function PartnershipPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ business: '', category: '', contact: '', story: '' });

  if (submitted) return <SuccessState title="Partnership interest submitted" description="Thanks for reaching out. Our partnerships team will contact you within two business days." onReset={() => setSubmitted(false)} />;

  return <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]"><section className="card p-6 sm:p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Handshake size={22} /></div><h2 className="text-xl font-extrabold text-ink-900">Build with our community</h2><p className="mt-2 text-sm leading-6 text-ink-500">Offer a useful product or service to Chama members and grow with a trusted savings community.</p></div><span className="badge bg-brand-100 text-brand-700">For businesses</span></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Business name" value={form.business} placeholder="e.g. Wanjiru Foods" onChange={(value) => setForm({ ...form, business: value })} /><Field label="Business category" value={form.category} placeholder="e.g. Retail, farming" onChange={(value) => setForm({ ...form, category: value })} /><Field label="Your phone or email" value={form.contact} placeholder="How can we reach you?" onChange={(value) => setForm({ ...form, contact: value })} /></div><label className="mt-4 block"><span className="mb-2 block text-xs font-semibold text-ink-500">Tell us about your idea</span><textarea className="input-field min-h-28 resize-y" placeholder="What would you like to offer members?" value={form.story} onChange={(event) => setForm({ ...form, story: event.target.value })} /></label><button disabled={!form.business || !form.category || !form.contact || !form.story} onClick={() => setSubmitted(true)} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 sm:w-auto">Submit interest <ArrowRight size={17} /></button></section><div className="space-y-5"><section className="rounded-3xl bg-gold-400 p-6 text-ink-900 sm:p-8"><CircleDollarSign size={25} /><h2 className="mt-5 text-xl font-extrabold">Reach members who are ready to act</h2><p className="mt-2 text-sm leading-6 text-ink-800">Partnerships can include member discounts, group offers, financial education, or tools that make saving easier.</p></section><section className="card p-5"><h2 className="mb-4 font-bold text-ink-900">What happens next?</h2><div className="space-y-3 text-sm text-ink-600"><Feature text="We review your proposal" /><Feature text="A partnerships lead contacts you" /><Feature text="We shape the right member offer" /></div></section></div></div>;
}

function DepositPanel({ onDeposit, onCancel }: { onDeposit: (amount: number) => void; onCancel: () => void }) {
  const [amount, setAmount] = useState(500);
  return <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-4"><div className="flex items-center justify-between"><p className="text-sm font-bold text-ink-900">Add to savings</p><button onClick={onCancel} className="text-xs font-semibold text-ink-400 hover:text-ink-700">Cancel</button></div><div className="mt-3 flex gap-2"><input className="input-field bg-white" type="number" min="100" step="100" value={amount} onChange={(event) => setAmount(Math.max(100, Number(event.target.value)))} /><button onClick={() => onDeposit(amount)} className="btn-gold shrink-0">Confirm</button></div></div>;
}

function Feature({ text }: { text: string }) { return <div className="flex items-center gap-2"><Check size={16} className="text-brand-600" /><span>{text}</span></div>; }
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <div className="flex gap-3"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{number}</div><div><p className="text-sm font-semibold text-ink-800">{title}</p><p className="mt-1 text-xs leading-5 text-ink-400">{text}</p></div></div>; }
function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-xs font-semibold text-ink-500">{label}</span><input className="input-field" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
function SuccessState({ title, description, onReset }: { title: string; description: string; onReset: () => void }) { return <section className="card mx-auto max-w-2xl p-8 text-center sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700"><Check size={28} /></div><h2 className="mt-5 text-2xl font-extrabold text-ink-900">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">{description}</p><button onClick={onReset} className="btn-secondary mt-6">Back to service</button></section>; }
