import { useEffect, useState, type FormEvent } from 'react';
import { Activity, CalendarDays, Clock3, Plus } from 'lucide-react';
import {
  createManagedCircle,
  getAdminGroupOverview,
  type AdminCircle,
  type AdminGroupActivity,
} from '@/api';
import { formatKES } from '@/types';

type PlanTier = 'starter' | 'standard' | 'premium';
type Cadence = 'weekly' | 'monthly';

const planAmounts: Record<PlanTier, number> = {
  starter: 2000,
  standard: 5000,
  premium: 10000,
};

const planLabels: Record<PlanTier, string> = {
  starter: 'Starter',
  standard: 'Standard',
  premium: 'Premium',
};

const activityLabels: Record<string, string> = {
  circle_created: 'Circle created',
  member_joined: 'Member joined',
  contribution_pending: 'Contribution pending',
  contribution_paid: 'Contribution paid',
  contribution_missed: 'Contribution missed',
  payout_queued: 'Payout queued',
  payout_processing: 'Payout processing',
  payout_paid: 'Payout paid',
};

export function AdminGroupsPanel() {
  const [groups, setGroups] = useState<AdminCircle[]>([]);
  const [activity, setActivity] = useState<AdminGroupActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [planTier, setPlanTier] = useState<PlanTier>('starter');
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const [capacity, setCapacity] = useState<4 | 5>(5);

  useEffect(() => {
    let current = true;
    getAdminGroupOverview()
      .then((overview) => {
        if (!current) return;
        setGroups(overview.groups);
        setActivity(overview.activity);
        setError('');
      })
      .catch((requestError: unknown) => {
        if (current) setError(requestError instanceof Error ? requestError.message : 'Could not load group operations.');
      })
      .finally(() => {
        if (current) setIsLoading(false);
      });
    return () => { current = false; };
  }, []);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsCreating(true);
    const groupName = name.trim();
    try {
      const created = await createManagedCircle({
        name: groupName,
        plan_tier: planTier,
        contribution_amount: planAmounts[planTier],
        cadence,
        max_members: capacity,
      });
      const newGroup: AdminCircle = { ...created, members: [] };
      setGroups((current) => [newGroup, ...current]);
      setActivity((current) => [{
        id: `circle-${created.id}`,
        kind: 'circle_created',
        group_id: created.id,
        group_name: created.name,
        description: `${created.name} was created`,
        occurred_at: created.created_at,
      }, ...current]);
      setName('');
      setSuccess(`${created.name} was created as a forming ${planLabels[planTier]} circle.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not create the circle.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
        <form onSubmit={handleCreate} className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><Plus size={19} /></span>
            <div>
              <h2 className="font-bold">Create managed circle</h2>
              <p className="mt-1 text-xs text-ink-500">Public circles follow the member plan amount.</p>
            </div>
          </div>

          <label className="mt-5 block text-sm font-semibold" htmlFor="managed-circle-name">Circle name</label>
          <input
            id="managed-circle-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            placeholder="e.g. Nairobi Starter 01"
            className="input-field mt-2"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor="managed-circle-plan">Member plan</label>
          <select id="managed-circle-plan" value={planTier} onChange={(event) => setPlanTier(event.target.value as PlanTier)} className="input-field mt-2">
            {(Object.keys(planAmounts) as PlanTier[]).map((tier) => (
              <option key={tier} value={tier}>{planLabels[tier]} · {formatKES(planAmounts[tier])} / cycle</option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <fieldset>
              <legend className="text-sm font-semibold">Capacity</legend>
              <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Circle capacity">
                {([4, 5] as const).map((size) => (
                  <button key={size} type="button" role="radio" aria-checked={capacity === size} onClick={() => setCapacity(size)} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold ${capacity === size ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-600'}`}>
                    {size} members
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold">Cadence</legend>
              <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Contribution cadence">
                {(['weekly', 'monthly'] as const).map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={cadence === value} onClick={() => setCadence(value)} className={`rounded-lg border px-3 py-2.5 text-sm font-semibold capitalize ${cadence === value ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-ink-200 text-ink-600'}`}>
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-5 rounded-lg bg-ink-50 p-3 text-xs leading-5 text-ink-600">
            {formatKES(planAmounts[planTier])} contribution · 1% impact membership fee · one-cycle security buffer · public matching
          </div>
          {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
          {success && <p className="mt-4 text-sm text-brand-700" role="status">{success}</p>}
          <button type="submit" disabled={isCreating || !name.trim()} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
            <Plus size={17} /> {isCreating ? 'Creating circle...' : 'Create circle'}
          </button>
        </form>

        <section className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold">All circles</h2>
              <p className="mt-1 text-xs text-ink-500">Live group and member status from the database</p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{groups.length} groups</span>
          </div>
          {isLoading ? <p className="p-6 text-sm text-ink-500" role="status">Loading circles...</p> : groups.length === 0 ? <p className="p-6 text-sm text-ink-500">No circles have been created yet.</p> : (
            <div className="divide-y divide-ink-100">
              {groups.map((group) => (
                <details key={group.id} className="group">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 hover:bg-ink-50 sm:px-6">
                    <span className="min-w-40 flex-1">
                      <span className="block font-semibold">{group.name}</span>
                      <span className="mt-1 block text-xs text-ink-500">{group.plan_tier ? planLabels[group.plan_tier] : 'Private'} · {group.cadence} · {formatKES(group.contribution_amount)}</span>
                    </span>
                    <span className="text-sm font-semibold">{group.member_count} / {group.max_members || '∞'}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${group.status === 'active' ? 'bg-brand-100 text-brand-800' : group.status === 'paused' ? 'bg-red-100 text-red-700' : 'bg-gold-100 text-gold-800'}`}>{group.status}</span>
                    <span className="text-xs text-ink-400">{group.circle_type === 'managed' ? 'Managed' : 'Private'}</span>
                  </summary>
                  <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-4 sm:px-6">
                    <div className="grid gap-3 text-xs text-ink-600 sm:grid-cols-3">
                      <p><span className="text-ink-400">Created:</span> {new Date(group.created_at).toLocaleString()}</p>
                      <p><span className="text-ink-400">Impact fee:</span> {group.membership_fee_percent}%</p>
                      <p><span className="text-ink-400">Security buffer:</span> {group.security_buffer_months} cycle</p>
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[500px] text-left text-xs">
                        <thead className="text-ink-400"><tr><th className="py-2">Member</th><th className="py-2">Contact</th><th className="py-2">Turn</th><th className="py-2">Joined</th></tr></thead>
                        <tbody className="divide-y divide-ink-200">
                          {group.members.filter((member) => member.is_active).map((member) => <tr key={member.id}><td className="py-2 font-semibold">{member.name || 'Member'}</td><td className="py-2">{member.email}<br />{member.phone}</td><td className="py-2">{member.rotation_order ?? '—'}</td><td className="py-2">{new Date(member.joined_at).toLocaleDateString()}</td></tr>)}
                          {group.member_count === 0 && <tr><td colSpan={4} className="py-3 text-ink-400">No members have joined.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4 sm:px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-100 text-gold-800"><Activity size={18} /></span>
          <div><h2 className="font-bold">Group activity</h2><p className="mt-1 text-xs text-ink-500">Circle formation, joins, contributions, and payouts</p></div>
        </div>
        {isLoading ? <p className="p-5 text-sm text-ink-500">Loading group activity...</p> : activity.length === 0 ? <p className="p-5 text-sm text-ink-500">No group activity has been recorded yet.</p> : (
          <div className="divide-y divide-ink-100">
            {activity.map((event) => (
              <div key={event.id} className="flex items-start gap-3 px-5 py-3.5 sm:px-6">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600"><CalendarDays size={16} /></span>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{activityLabels[event.kind] ?? event.kind.replaceAll('_', ' ')}</p><p className="mt-0.5 text-xs text-ink-500">{event.description} · {event.group_name}</p></div>
                <time className="flex shrink-0 items-center gap-1 text-xs text-ink-400"><Clock3 size={13} />{new Date(event.occurred_at).toLocaleString()}</time>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
