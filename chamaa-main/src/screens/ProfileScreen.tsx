import { ShieldCheck, Crown, CreditCard, Users, ChevronRight, LogOut, Star, Bell, HelpCircle } from 'lucide-react';
import { type User, formatKES, MEMBERSHIP_FEE } from '@/types';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

export function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  return (
    <div className="animate-fade-in">
      <div className="bg-brand-700 px-6 pt-8 pb-10 rounded-b-3xl lg:px-10 lg:pt-10 lg:rounded-b-none">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center">
            <span className="text-ink-900 font-bold text-xl">
              {(user.name || 'M').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-white text-xl font-extrabold">{user.name || 'Member'}</h1>
            <p className="text-brand-200 text-sm">{user.phone || '+254 7•• ••• 142'}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="badge bg-brand-500 text-white text-[10px]">
                <ShieldCheck size={10} /> Verified
              </span>
              <span className="badge bg-gold-400 text-ink-900 text-[10px]">
                <Crown size={10} /> Member
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 lg:px-10 lg:-mt-6">
        <div className="card p-5 mb-4">
          <h3 className="font-bold text-ink-900 mb-4">My Plan</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 ${user.plan.color} rounded-xl flex items-center justify-center`}>
              <Star size={24} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-ink-900">{user.plan.name}</p>
              <p className="text-sm text-ink-400">{formatKES(user.plan.monthly)}/month · {formatKES(user.plan.payout)} payout</p>
            </div>
          </div>
          <button className="btn-secondary w-full text-sm">Change Plan</button>
        </div>

        <div className="card p-5 mb-4">
          <h3 className="font-bold text-ink-900 mb-4">Account</h3>
          <div className="space-y-1">
            <ProfileRow icon={ShieldCheck} label="Identity verification" value="Verified" valueColor="text-brand-700" />
            <ProfileRow icon={Crown} label="Membership status" value="Active" valueColor="text-brand-700" />
            <ProfileRow icon={CreditCard} label="Membership fee paid" value={formatKES(MEMBERSHIP_FEE)} valueColor="text-ink-700" />
            <ProfileRow icon={Users} label="Current group" value="Standard Group #4821" valueColor="text-ink-700" />
          </div>
        </div>

        <div className="card p-5 mb-4">
          <h3 className="font-bold text-ink-900 mb-2">Settings</h3>
          <div className="space-y-1">
            <ProfileRow icon={Bell} label="Notifications" value="On" valueColor="text-ink-700" chevron />
            <ProfileRow icon={HelpCircle} label="Help & Support" value="" valueColor="" chevron />
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full card p-4 flex items-center justify-center gap-2 text-red-600 font-semibold hover:bg-red-50 transition-all mb-6"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>

        <p className="text-center text-xs text-ink-300 mb-4">Chama v1.0.0</p>
      </div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
  valueColor,
  chevron,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  valueColor: string;
  chevron?: boolean;
}) {
  return (
    <button className="w-full flex items-center gap-3 py-3 hover:bg-ink-50 rounded-lg px-2 -mx-2 transition-colors">
      <div className="w-9 h-9 bg-ink-100 rounded-xl flex items-center justify-center">
        <Icon size={18} className="text-ink-600" />
      </div>
      <span className="flex-1 text-left text-sm font-medium text-ink-700">{label}</span>
      {value && <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>}
      {chevron && <ChevronRight size={16} className="text-ink-300" />}
    </button>
  );
}
