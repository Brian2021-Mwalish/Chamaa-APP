export type PlanTier = 'starter' | 'standard' | 'premium';

export type VerificationStatus = 'pending' | 'verified';

export type AppStage =
  | 'login'
  | 'admin'
  | 'otp'
  | 'kyc'
  | 'plan'
  | 'membership'
  | 'waiting'
  | 'app';

export type Screen = 'home' | 'group' | 'chat' | 'wallet' | 'services' | 'profile';

export interface Plan {
  id: PlanTier;
  name: string;
  monthly: number;
  payout: number;
  description: string;
  features: string[];
  color: string;
}

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  avatarColor: string;
  initials: string;
  hasPaid: boolean;
  payoutMonth: number | null;
  isMe: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'member';
  authorName: string;
  authorColor: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'contribution' | 'payout' | 'membership' | 'credit' | 'repayment' | 'topup';
  label: string;
  amount: number;
  date: string;
  positive: boolean;
}

export interface User {
  name: string;
  phone: string;
  plan: Plan;
  verification: VerificationStatus;
  membershipPaid: boolean;
  walletBalance: number;
  creditBalance: number;
  groupId: string | null;
  groupMembers: GroupMember[];
  currentMonth: number;
  cycleMonth: number;
  transactions: WalletTransaction[];
  chatMessages: ChatMessage[];
  waitingPosition: number;
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    monthly: 2000,
    payout: 10000,
    description: 'Best for members new to group saving or who want to start small.',
    features: ['KES 2,000 monthly contribution', 'KES 10,000 payout on your turn', '5-member group', 'Group chat included'],
    color: 'bg-brand-600',
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    monthly: 5000,
    payout: 25000,
    description: 'A moderate contribution for members ready for a bigger payout.',
    features: ['KES 5,000 monthly contribution', 'KES 25,000 payout on your turn', '5-member group', 'Group chat included'],
    color: 'bg-gold-400',
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    monthly: 10000,
    payout: 50000,
    description: 'The largest contribution for the biggest possible lump sum.',
    features: ['KES 10,000 monthly contribution', 'KES 50,000 payout on your turn', '5-member group', 'Group chat included'],
    color: 'bg-ink-800',
  },
];

export const MEMBERSHIP_FEE = 500;

const SAMPLE_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'You', phone: '+254 7•• ••• 142', avatarColor: 'bg-brand-600', initials: 'You', hasPaid: true, payoutMonth: 1, isMe: true },
  { id: 'm2', name: 'Amara O.', phone: '+254 7•• ••• 883', avatarColor: 'bg-gold-400', initials: 'AO', hasPaid: true, payoutMonth: 2, isMe: false },
  { id: 'm3', name: 'Brian K.', phone: '+254 7•• ••• 251', avatarColor: 'bg-ink-700', initials: 'BK', hasPaid: true, payoutMonth: 3, isMe: false },
  { id: 'm4', name: 'Fatuma N.', phone: '+254 7•• ••• 617', avatarColor: 'bg-brand-400', initials: 'FN', hasPaid: false, payoutMonth: 4, isMe: false },
  { id: 'm5', name: 'David M.', phone: '+254 7•• ••• 390', avatarColor: 'bg-gold-500', initials: 'DM', hasPaid: false, payoutMonth: 5, isMe: false },
];

const SAMPLE_CHAT: ChatMessage[] = [
  { id: 'c1', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Welcome to your new 5-person group! All members are on the Standard Plan (KES 5,000/month). Your cycle starts now.', timestamp: 'Mon 9:02 AM', isSystem: true },
  { id: 'c2', sender: 'member', authorName: 'Amara O.', authorColor: 'bg-gold-400', text: 'Karibu everyone! Happy to be saving together', timestamp: 'Mon 9:05 AM' },
  { id: 'c3', sender: 'member', authorName: 'Brian K.', authorColor: 'bg-ink-700', text: 'Good to meet you all. When is the first contribution due?', timestamp: 'Mon 9:12 AM' },
  { id: 'c4', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'First contribution is due by Friday this week. I will send reminders to everyone.', timestamp: 'Mon 9:13 AM', isSystem: true },
  { id: 'c5', sender: 'member', authorName: 'You', authorColor: 'bg-brand-600', text: 'Just paid my contribution!', timestamp: 'Wed 8:30 AM' },
  { id: 'c6', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'You paid KES 5,000. Pool is now 20% full (1 of 5 members paid).', timestamp: 'Wed 8:30 AM', isSystem: true },
  { id: 'c7', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Amara O. paid KES 5,000. Pool is 40% full (2 of 5).', timestamp: 'Wed 11:45 AM', isSystem: true },
  { id: 'c8', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Brian K. paid KES 5,000. Pool is 60% full (3 of 5).', timestamp: 'Thu 2:15 PM', isSystem: true },
  { id: 'c9', sender: 'member', authorName: 'Fatuma N.', authorColor: 'bg-brand-400', text: 'I will pay by tomorrow morning, sorry for the delay!', timestamp: 'Thu 5:30 PM' },
  { id: 'c10', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Reminder: 2 members have not yet contributed this month. Due date is tomorrow.', timestamp: 'Fri 8:00 AM', isSystem: true },
  { id: 'c11', sender: 'member', authorName: 'David M.', authorColor: 'bg-gold-500', text: 'Apologies, M-Pesa was down on my end. Paying now.', timestamp: 'Fri 9:20 AM' },
  { id: 'c12', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'David M. paid KES 5,000. Pool is 80% full (4 of 5). Waiting on Fatuma N.', timestamp: 'Fri 9:22 AM', isSystem: true },
  { id: 'c13', sender: 'member', authorName: 'Fatuma N.', authorColor: 'bg-brand-400', text: 'I am short this month. Can the app cover me?', timestamp: 'Fri 10:00 AM' },
  { id: 'c14', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Credit activated for Fatuma N. — KES 5,000 covered. Pool is 100% full! Payout of KES 25,000 goes to You (Month 1 turn).', timestamp: 'Fri 10:01 AM', isSystem: true },
  { id: 'c15', sender: 'member', authorName: 'You', authorColor: 'bg-brand-600', text: 'Received my payout! Thank you everyone.', timestamp: 'Fri 10:15 AM' },
  { id: 'c16', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Payout of KES 25,000 sent to You. Month 1 cycle complete. Next payout: Amara O. (Month 2).', timestamp: 'Fri 10:15 AM', isSystem: true },
  { id: 'c17', sender: 'member', authorName: 'Amara O.', authorColor: 'bg-gold-400', text: 'Congrats! Looking forward to my turn next month.', timestamp: 'Fri 10:30 AM' },
  { id: 'c18', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Month 2 contributions are now due. Pool goal: KES 25,000.', timestamp: 'Oct 1 8:00 AM', isSystem: true },
  { id: 'c19', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'You paid KES 5,000. Pool is 20% full (1 of 5).', timestamp: 'Oct 1 8:05 AM', isSystem: true },
  { id: 'c20', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Amara O. paid KES 5,000. Pool is 40% full (2 of 5).', timestamp: 'Oct 1 2:00 PM', isSystem: true },
  { id: 'c21', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Brian K. paid KES 5,000. Pool is 60% full (3 of 5).', timestamp: 'Oct 2 10:30 AM', isSystem: true },
  { id: 'c22', sender: 'member', authorName: 'Brian K.', authorColor: 'bg-ink-700', text: 'Done! Who is next?', timestamp: 'Oct 2 10:31 AM' },
  { id: 'c23', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Month 3 contributions are now due. Pool goal: KES 25,000. Payout this month goes to Brian K.', timestamp: 'Nov 1 8:00 AM', isSystem: true },
  { id: 'c24', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'You paid KES 5,000. Pool is 20% full (1 of 5).', timestamp: 'Nov 3 9:00 AM', isSystem: true },
  { id: 'c25', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Amara O. paid KES 5,000. Pool is 40% full (2 of 5).', timestamp: 'Nov 3 1:00 PM', isSystem: true },
  { id: 'c26', sender: 'bot', authorName: 'Chama Bot', authorColor: 'bg-brand-600', text: 'Brian K. paid KES 5,000. Pool is 60% full (3 of 5). Waiting on Fatuma N. and David M.', timestamp: 'Nov 4 10:00 AM', isSystem: true },
];

const SAMPLE_TRANSACTIONS: WalletTransaction[] = [
  { id: 't1', type: 'topup', label: 'Wallet Top-Up via M-Pesa', amount: 20000, date: 'Sep 1, 2026', positive: true },
  { id: 't2', type: 'membership', label: 'Membership Fee', amount: 500, date: 'Sep 1, 2026', positive: false },
  { id: 't3', type: 'contribution', label: 'Group Contribution — Month 1', amount: 5000, date: 'Sep 3, 2026', positive: false },
  { id: 't4', type: 'payout', label: 'Payout Received — Month 1', amount: 25000, date: 'Sep 5, 2026', positive: true },
  { id: 't5', type: 'topup', label: 'Wallet Top-Up via M-Pesa', amount: 10000, date: 'Sep 28, 2026', positive: true },
  { id: 't6', type: 'contribution', label: 'Group Contribution — Month 2', amount: 5000, date: 'Oct 1, 2026', positive: false },
  { id: 't7', type: 'payout', label: 'Payout Received — Month 2 (Amara O.)', amount: 0, date: 'Oct 5, 2026', positive: true },
  { id: 't8', type: 'topup', label: 'Wallet Top-Up via M-Pesa', amount: 10000, date: 'Oct 28, 2026', positive: false },
  { id: 't9', type: 'contribution', label: 'Group Contribution — Month 3', amount: 5000, date: 'Nov 3, 2026', positive: false },
];

export function createInitialUser(): User {
  return {
    name: '',
    phone: '',
    plan: PLANS[1],
    verification: 'pending',
    membershipPaid: false,
    walletBalance: 18500,
    creditBalance: 0,
    groupId: null,
    groupMembers: SAMPLE_MEMBERS,
    currentMonth: 3,
    cycleMonth: 3,
    transactions: SAMPLE_TRANSACTIONS,
    chatMessages: SAMPLE_CHAT,
    waitingPosition: 0,
  };
}

export function createDemoUser(): User {
  return {
    name: 'Wanjiru Kamau',
    phone: '+254 712 345 142',
    plan: PLANS[1],
    verification: 'verified',
    membershipPaid: true,
    walletBalance: 18500,
    creditBalance: 0,
    groupId: 'standard-group-4821',
    groupMembers: SAMPLE_MEMBERS,
    currentMonth: 3,
    cycleMonth: 3,
    transactions: SAMPLE_TRANSACTIONS,
    chatMessages: SAMPLE_CHAT,
    waitingPosition: 0,
  };
}

export function formatKES(amount: number): string {
  return 'KES ' + amount.toLocaleString('en-KE');
}
