import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Ban,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { formatKES } from '@/types';
import { getAdminUsers, getAdminKycDocument, reviewAdminKyc, setAdminUserActive } from '@/api';
import { AdminGroupsPanel } from '@/screens/AdminGroupsPanel';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Status = 'Verified' | 'Pending' | 'Rejected' | 'Incomplete' | 'Blocked';
type KycStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted';
type Member = {
  id: number;
  name: string;
  email: string;
  phone: string;
  plan: string;
  paymentMode: 'manual' | 'direct_debit';
  status: Status;
  group: string;
  paid: boolean | null;
  isAdmin: boolean;
  kycStatus: KycStatus;
  kycFullName: string;
  kycSubmittedAt: string | null;
  idDocumentUploaded: boolean;
  incomeDocumentUploaded: boolean;
  onboardingStage: string;
  createdAt: string;
};
type ActivityItem = { id: number; text: string; group: string; time: string };

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [section, setSection] = useState('Overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState('');
  const [unpaidOnly, setUnpaidOnly] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isCurrent = true;
    getAdminUsers()
      .then((accounts) => {
        if (!isCurrent) return;
        setMembers(accounts.map((account) => ({
          id: account.id,
          name: account.name || account.email,
          email: account.email,
          phone: account.phone,
          plan: account.plan || 'Not selected',
          paymentMode: account.payment_mode,
          status: !account.is_active ? 'Blocked' : account.kyc_status === 'approved' ? 'Verified' : account.kyc_status === 'rejected' ? 'Rejected' : account.kyc_status === 'pending' ? 'Pending' : 'Incomplete',
          group: 'Unassigned',
          paid: null,
          isAdmin: account.is_admin,
          kycStatus: account.kyc_status,
          kycFullName: account.kyc_full_name,
          kycSubmittedAt: account.kyc_submitted_at,
          idDocumentUploaded: account.id_document_uploaded,
          incomeDocumentUploaded: account.income_document_uploaded,
          onboardingStage: account.onboarding_stage,
          createdAt: account.date_joined,
        })));
        setMembersError('');
      })
      .catch((error: unknown) => {
        if (isCurrent) setMembersError(error instanceof Error ? error.message : 'Could not load accounts.');
      })
      .finally(() => {
        if (isCurrent) setIsLoadingMembers(false);
      });
    return () => { isCurrent = false; };
  }, []);

  const pending = members.filter((member) => member.status === 'Pending').length;
  const unpaid = members.filter((member) => member.paid === false && member.status !== 'Blocked').length;

  const updateMember = (member: Member, update: Partial<Member>, message: string) => {
    setMembers((current) => current.map((item) => item.id === member.id ? { ...item, ...update } : item));
    setActivity((current) => [{ id: Date.now(), text: message, group: member.group, time: 'Just now' }, ...current]);
    setNotice(message);
  };

  const decideKyc = async (member: Member, decision: 'approved' | 'rejected') => {
    try {
      await reviewAdminKyc(member.id, decision);
      const nextStatus = decision === 'approved' ? 'Verified' : 'Rejected';
      updateMember(
        member,
        { status: nextStatus, kycStatus: decision },
        `KYC for ${member.name} was ${decision}`,
      );
    } catch (error) {
      setMembersError(error instanceof Error ? error.message : 'Could not update the KYC decision.');
    }
  };

  const setMemberActive = async (member: Member, isActive: boolean) => {
    try {
      await setAdminUserActive(member.id, isActive);
      const nextStatus: Status = !isActive
        ? 'Blocked'
        : member.kycStatus === 'approved'
          ? 'Verified'
          : member.kycStatus === 'rejected'
            ? 'Rejected'
            : member.kycStatus === 'pending'
              ? 'Pending'
              : 'Incomplete';
      updateMember(
        member,
        { status: nextStatus },
        isActive ? `${member.name} was restored` : `${member.name} was blocked from the system`,
      );
      setMembersError('');
    } catch (error) {
      setMembersError(error instanceof Error ? error.message : 'Could not update this account.');
    }
  };

  const menu = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Members', icon: Users },
    { label: 'Groups', icon: UserPlus },
    { label: 'Payments', icon: Wallet },
    { label: 'Activity log', icon: Activity },
  ];

  return (
    <div className="min-h-[100dvh] bg-ink-50 text-ink-900">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700"><span className="font-extrabold text-gold-400">C</span></div>
            <div><p className="font-extrabold">Chama Admin</p><p className="text-xs text-ink-400">Full system operations</p></div>
          </div>
          <div className="flex items-center gap-4"><span className="hidden items-center gap-2 text-sm text-ink-500 sm:flex"><span className="h-2.5 w-2.5 rounded-full bg-brand-500" />All systems operational</span><button onClick={onLogout} className="btn-secondary flex items-center gap-2 px-3 py-2.5 text-sm"><LogOut size={16} /><span className="hidden sm:inline">Log out</span></button></div>
        </div>
      </header>

      <div className="mx-auto flex max-w-screen-2xl items-start lg:px-8 lg:py-8 xl:px-12">
        <aside className="sticky top-6 hidden w-60 shrink-0 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm lg:block">
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">Admin controls</p>
          <nav className="space-y-1">
            {menu.map(({ label, icon: Icon }) => <button key={label} onClick={() => setSection(label)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${section === label ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'}`}><Icon size={18} /><span>{label}</span>{label === 'Members' && <span className="ml-auto rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-ink-900">{pending}</span>}{label === 'Payments' && unpaid > 0 && <span className="ml-auto rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-700">{unpaid}</span>}</button>)}
          </nav>
          <div className="mt-6 border-t border-ink-100 pt-5"><p className="px-3 text-xs font-semibold text-ink-400">System status</p><div className="mt-3 flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs font-semibold text-brand-700"><span className="h-2 w-2 rounded-full bg-brand-500" />Live monitoring on</div></div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-8 lg:py-0">
          <div className="mb-7"><p className="mb-2 text-sm font-semibold text-brand-600">Operations console · Friday, September 4, 2026</p><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, Admin</h1><p className="mt-2 text-sm text-ink-500">Manage members, groups, payments, and every activity across the platform.</p></div>
          <div className="mb-7 overflow-x-auto border-b border-ink-200 lg:hidden"><div className="flex min-w-max gap-1">{menu.map(({ label, icon: Icon }) => <button key={label} onClick={() => setSection(label)} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${section === label ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-400'}`}><Icon size={17} />{label}</button>)}</div></div>
          {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700"><span className="flex items-center gap-2"><CheckCircle2 size={17} />{notice}</span><button onClick={() => setNotice('')}>×</button></div>}
          {membersError && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">Could not load database accounts: {membersError}</div>}
          {isLoadingMembers && <p className="mb-5 text-sm text-ink-500" role="status">Loading accounts from the database...</p>}
          {section === 'Overview' && <Overview members={members} pending={pending} unpaid={unpaid} activity={activity} onNavigate={setSection} />}
          {section === 'Members' && <><Members members={members} onAccept={(member) => void decideKyc(member, 'approved')} onSetActive={(member, isActive) => void setMemberActive(member, isActive)} /><OnboardingReview members={members} onReview={(member, decision) => void decideKyc(member, decision)} /></>}
          {section === 'Groups' && <AdminGroupsPanel />}
          {section === 'Payments' && <Payments members={members} unpaidOnly={unpaidOnly} setUnpaidOnly={setUnpaidOnly} onPay={(member) => updateMember(member, { paid: true }, `Advance contribution paid for ${member.name}`)} />}
          {section === 'Activity log' && <ActivityLog activity={activity} />}
          <footer className="py-8 text-center text-xs text-ink-400">Chama Admin Console · Account records loaded from the database</footer>
        </main>
      </div>
    </div>
  );
}

function Overview({ members, pending, unpaid, activity, onNavigate }: { members: Member[]; pending: number; unpaid: number; activity: ActivityItem[]; onNavigate: (section: string) => void }) {
  return <>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total accounts" value={`${members.length}`} detail="Loaded from the database" icon={Users} tone="brand" /><Metric label="Active accounts" value={`${members.filter((member) => member.status !== 'Blocked').length}`} detail="Not currently blocked" icon={Activity} tone="gold" /><Metric label="Admin accounts" value={`${members.filter((member) => member.isAdmin).length}`} detail="Staff or superuser access" icon={ShieldCheck} tone="ink" /><Metric label="Needs attention" value={`${pending + unpaid}`} detail={`${pending} KYC pending · ${unpaid} unpaid records`} icon={AlertTriangle} tone="red" /></section>
    <section className="mt-6 grid gap-6 xl:grid-cols-2"><div className="card p-5 sm:p-6"><h2 className="font-bold">Contribution volume</h2><p className="mt-1 text-xs text-ink-400">Total contributions over the last 7 days</p><p className="mt-5 text-3xl font-extrabold">KES 1.26M</p><div className="mt-7 flex h-44 items-end gap-2 sm:gap-4">{[42, 58, 48, 76, 64, 88, 72].map((height, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2"><div className={`rounded-t-lg ${index === 5 ? 'bg-gold-400' : 'bg-brand-500'}`} style={{ height: `${height}%` }} /><span className="text-center text-[10px] text-ink-400">{['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][index]}</span></div>)}</div></div><div className="card p-5 sm:p-6"><h2 className="font-bold">Quick actions</h2><p className="mt-1 text-xs text-ink-400">Jump into daily operations</p><div className="mt-5 space-y-3"><Quick label="Review members" count={`${pending} pending approvals`} icon={Users} onClick={() => onNavigate('Members')} /><Quick label="Monitor contributions" count={`${unpaid} unpaid this month`} icon={Wallet} onClick={() => onNavigate('Payments')} /><Quick label="View group activity" count="Live platform events" icon={Activity} onClick={() => onNavigate('Activity log')} /></div></div></section>
    <section className="mt-6 grid gap-6 lg:grid-cols-2"><div className="card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Unpaid contributions</h2><p className="mt-1 text-xs text-ink-400">Members needing a monthly payment</p></div><button onClick={() => onNavigate('Payments')} className="text-sm font-semibold text-brand-600">Manage</button></div><div className="mt-4 space-y-3">{members.filter((member) => !member.paid).map((member) => <div key={member.id} className="flex justify-between"><div><p className="text-sm font-semibold">{member.name}</p><p className="text-xs text-ink-400">{member.group}</p></div><span className="badge bg-gold-100 text-gold-700">Unpaid</span></div>)}</div></div><div className="card p-5 sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Latest activity</h2><p className="mt-1 text-xs text-ink-400">What is happening across groups</p></div><button onClick={() => onNavigate('Activity log')} className="text-sm font-semibold text-brand-600">View all</button></div><div className="mt-4 space-y-3">{activity.slice(0, 3).map((item) => <ActivityRow key={item.id} item={item} />)}</div></div></section>
  </>;
}

function Members({ members, onAccept, onSetActive }: { members: Member[]; onAccept: (member: Member) => void; onSetActive: (member: Member, isActive: boolean) => void }) {
  return <section className="card overflow-hidden"><PanelHeader title="Member management" description="Accounts retrieved from the platform database" icon={Users} /><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400"><tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Circle</th><th className="px-5 py-3">Controls</th></tr></thead><tbody className="divide-y divide-ink-100">{members.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-400">No member accounts were found.</td></tr> : members.map((member) => <tr key={member.id} className="hover:bg-ink-50"><td className="px-5 py-4"><p className="font-semibold">{member.name}</p><p className="text-xs text-ink-500">{member.email}</p><p className="text-xs text-ink-400">{member.phone || 'No phone number'}</p></td><td className="px-5 py-4 text-ink-600">{member.plan}</td><td className="px-5 py-4"><StatusBadge status={member.status} /></td><td className="px-5 py-4 text-ink-500">{member.group}</td><td className="px-5 py-4"><div className="flex items-center gap-2">{member.status === 'Pending' && <button onClick={() => onAccept(member)} className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white"><Check size={14} />Accept</button>}{member.status !== 'Blocked' && <button onClick={() => onSetActive(member, false)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"><Ban size={14} />Block</button>}{member.status === 'Blocked' && <button onClick={() => onSetActive(member, true)} className="flex items-center gap-1 rounded-lg border border-brand-200 px-3 py-2 text-xs font-bold text-brand-700"><Check size={14} />Restore</button>}</div></td></tr>)}</tbody></table></div></section>;
}

function OnboardingReview({ members, onReview }: { members: Member[]; onReview: (member: Member, decision: 'approved' | 'rejected') => void }) {
  const [documentUrls, setDocumentUrls] = useState<Record<string, { url: string; contentType: string }>>({});
  const [loadingDocument, setLoadingDocument] = useState('');
  const [documentError, setDocumentError] = useState('');
  const documentUrlsRef = useRef<{ url: string; contentType: string }[]>([]);

  useEffect(() => () => documentUrlsRef.current.forEach((document) => URL.revokeObjectURL(document.url)), []);

  const loadDocument = async (member: Member, type: 'id' | 'income') => {
    const key = `${member.id}-${type}`;
    setLoadingDocument(key);
    setDocumentError('');
    try {
      const document = await getAdminKycDocument(member.id, type);
      documentUrlsRef.current.push(document);
      setDocumentUrls((current) => ({ ...current, [key]: document }));
    } catch (error) {
      setDocumentError(error instanceof Error ? error.message : 'Could not load the document.');
    } finally {
      setLoadingDocument('');
    }
  };

  const submissions = members.filter((member) => member.kycStatus !== 'not_submitted');

  return <section className="mt-6 card overflow-hidden">
    <PanelHeader title="Onboarding review" description="Review submitted identity and income documents before approving KYC" icon={ShieldCheck} />
    {documentError && <p className="mx-5 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{documentError}</p>}
    {submissions.length === 0 ? <p className="p-6 text-sm text-ink-400">No KYC submissions are waiting for review.</p> : <div className="divide-y divide-ink-100">{submissions.map((member) => <article key={member.id} className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-ink-900">{member.kycFullName || member.name}</h3>
          <p className="mt-1 text-sm text-ink-500">{member.email} · {member.phone || 'No phone number'}</p>
          <p className="mt-1 text-xs text-ink-400">Account created {new Date(member.createdAt).toLocaleDateString()} · Onboarding: {member.onboardingStage}</p>
        </div>
        <StatusBadge status={member.status} />
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div><dt className="text-xs text-ink-400">Selected plan</dt><dd className="mt-1 text-sm font-semibold">{member.plan}</dd></div>
        <div><dt className="text-xs text-ink-400">Payment mode</dt><dd className="mt-1 text-sm font-semibold">{member.paymentMode === 'direct_debit' ? 'Automatic direct debit (opt-in)' : 'Manual processing'}</dd></div>
        <div><dt className="text-xs text-ink-400">KYC submitted</dt><dd className="mt-1 text-sm font-semibold">{member.kycSubmittedAt ? new Date(member.kycSubmittedAt).toLocaleString() : 'Not available'}</dd></div>
        <div><dt className="text-xs text-ink-400">Review status</dt><dd className="mt-1 text-sm font-semibold capitalize">{member.kycStatus.replace('_', ' ')}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {([['id', 'ID document', member.idDocumentUploaded], ['income', 'Income document', member.incomeDocumentUploaded]] as const).map(([type, label, uploaded]) => {
          const key = `${member.id}-${type}`;
          const document = documentUrls[key];
          return <div key={key} className="w-full sm:w-[calc(50%-0.375rem)]">
            {uploaded ? document ? <div className="mb-2 flex items-center justify-between"><span className="text-sm font-semibold text-ink-700">{label}</span><a href={document.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-700 underline">Open separately</a></div> : <button type="button" onClick={() => void loadDocument(member, type)} className="mb-2 rounded-lg border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-700" disabled={loadingDocument === key}>{loadingDocument === key ? 'Loading...' : `Preview ${label.toLowerCase()}`}</button> : <span className="text-sm text-red-600">{label} missing</span>}
            {document && (document.contentType.startsWith('image/') ? <img src={document.url} alt={`${label} preview`} className="max-h-96 w-full rounded-lg border border-ink-200 bg-ink-50 object-contain" /> : <iframe src={document.url} title={`${label} preview`} className="h-96 w-full rounded-lg border border-ink-200 bg-white" />)}
          </div>;
        })}
      </div>
      {member.kycStatus === 'pending' && (!documentUrls[`${member.id}-id`] || !documentUrls[`${member.id}-income`]) && <p className="mt-4 text-sm text-ink-500">Preview both submitted documents to enable the KYC decision.</p>}
      {member.kycStatus === 'pending' && member.idDocumentUploaded && member.incomeDocumentUploaded && documentUrls[`${member.id}-id`] && documentUrls[`${member.id}-income`] && <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onReview(member, 'approved')} className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-bold text-white"><Check size={16} />Approve KYC</button>
        <button type="button" onClick={() => onReview(member, 'rejected')} className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700"><Ban size={16} />Reject</button>
      </div>}
    </article>)}</div>}
  </section>;
}

function Payments({ members, unpaidOnly, setUnpaidOnly, onPay }: { members: Member[]; unpaidOnly: boolean; setUnpaidOnly: (value: boolean) => void; onPay: (member: Member) => void }) { const list = members.filter((member) => !unpaidOnly || (!member.paid && member.status !== 'Blocked')); return <section className="space-y-6"><div className="grid gap-4 sm:grid-cols-3"><Metric label="Due this month" value={formatKES(members.length * 5000)} detail="Across active groups" icon={CircleDollarSign} tone="brand" /><Metric label="Collected" value={formatKES(members.filter((member) => member.paid).length * 5000)} detail="Current cycle" icon={CheckCircle2} tone="gold" /><Metric label="Unpaid members" value={`${members.filter((member) => !member.paid).length}`} detail="Needs follow-up" icon={Clock3} tone="red" /></div><div className="card overflow-hidden"><PanelHeader title="Contribution monitor" description="Track payments and cover a member in advance" icon={Wallet} action={<button onClick={() => setUnpaidOnly(!unpaidOnly)} className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-bold text-ink-600">{unpaidOnly ? 'Showing unpaid only' : 'Show unpaid only'}</button>} /><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-400"><tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Group</th><th className="px-5 py-3">Amount due</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Admin action</th></tr></thead><tbody className="divide-y divide-ink-100">{list.map((member) => <tr key={member.id}><td className="px-5 py-4"><p className="font-semibold">{member.name}</p><p className="text-xs text-ink-400">{member.phone}</p></td><td className="px-5 py-4">{member.group}</td><td className="px-5 py-4 font-bold">KES 5,000</td><td className="px-5 py-4">{member.paid ? <span className="badge bg-brand-100 text-brand-700"><CheckCircle2 size={12} />Paid</span> : <span className="badge bg-gold-100 text-gold-700"><Clock3 size={12} />Pending</span>}</td><td className="px-5 py-4">{member.paid ? <span className="text-xs text-ink-400">No action needed</span> : <button onClick={() => onPay(member)} className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white"><ArrowDownToLine size={14} />Pay in advance</button>}</td></tr>)}</tbody></table></div></div></section>; }

function ActivityLog({ activity }: { activity: ActivityItem[] }) { return <section className="card overflow-hidden"><PanelHeader title="Full activity log" description="Monitor every member, group, payment, and system event" icon={Activity} action={<span className="badge bg-brand-100 text-brand-700">Live monitoring</span>} /><div className="divide-y divide-ink-100">{activity.map((item) => <div key={item.id} className="flex items-start gap-4 p-5 hover:bg-ink-50"><div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><Activity size={18} /></div><div><p className="text-sm font-semibold">{item.text}</p><p className="mt-1 text-xs text-ink-400">{item.group} · {item.time}</p></div></div>)}</div></section>; }

function PanelHeader({ title, description, icon: Icon, action }: { title: string; description: string; icon: typeof Users; action?: React.ReactNode }) { return <div className="flex flex-col gap-4 border-b border-ink-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><Icon size={19} /></div><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-xs text-ink-400">{description}</p></div></div>{action}</div>; }
function ActivityRow({ item }: { item: ActivityItem }) { return <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-brand-500" /><div><p className="text-sm font-semibold">{item.text}</p><p className="mt-1 text-xs text-ink-400">{item.time}</p></div></div>; }
function StatusBadge({ status }: { status: Status }) { const color = status === 'Verified' ? 'bg-brand-100 text-brand-700' : status === 'Pending' ? 'bg-gold-100 text-gold-700' : status === 'Incomplete' ? 'bg-ink-100 text-ink-600' : 'bg-red-100 text-red-600'; return <span className={`badge ${color}`}>{status === 'Verified' ? <ShieldCheck size={12} /> : status === 'Blocked' || status === 'Rejected' ? <Ban size={12} /> : <Clock3 size={12} />}{status}</span>; }
function Quick({ icon: Icon, label, count, onClick }: { icon: typeof Users; label: string; count: string; onClick: () => void }) { return <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl bg-ink-50 p-3 text-left hover:bg-brand-50"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm"><Icon size={17} /></div><span className="flex-1"><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-ink-400">{count}</span></span></button>; }
function Metric({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Users; tone: 'brand' | 'gold' | 'ink' | 'red' }) { const colors = { brand: 'bg-brand-100 text-brand-700', gold: 'bg-gold-100 text-gold-700', ink: 'bg-ink-100 text-ink-700', red: 'bg-red-100 text-red-600' }; return <div className="card p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-ink-500">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p></div><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[tone]}`}><Icon size={19} /></div></div><p className="mt-4 text-xs font-semibold text-ink-400">{detail}</p></div>; }
