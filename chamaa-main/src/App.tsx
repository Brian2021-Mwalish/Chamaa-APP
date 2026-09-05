import { useState } from 'react';
import { Login } from '@/screens/Login';
import { Otp } from '@/screens/Otp';
import { Kyc } from '@/screens/Kyc';
import { PlanSelection } from '@/screens/PlanSelection';
import { Membership } from '@/screens/Membership';
import { WaitingRoom } from '@/screens/WaitingRoom';
import { AppShell } from '@/components/AppShell';
import { HomeScreen } from '@/screens/HomeScreen';
import { GroupScreen } from '@/screens/GroupScreen';
import { ChatScreen } from '@/screens/ChatScreen';
import { WalletScreen } from '@/screens/WalletScreen';
import { ServicesScreen } from '@/screens/ServicesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { AdminDashboard } from '@/screens/AdminDashboard';
import { createInitialUser, createDemoUser, type AppStage, type Screen, type Plan, type User, type ChatMessage } from '@/types';

function App() {
  const [stage, setStage] = useState<AppStage>('login');
  const [screen, setScreen] = useState<Screen>('home');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState<User>(createInitialUser);

  const handleLogin = (p: string) => {
    setPhone(p);
    setStage('otp');
  };

  const handleDemoLogin = () => {
    setUser(createDemoUser());
    setStage('app');
    setScreen('home');
  };

  const handleOtpVerified = () => {
    if (phone.replace(/\D/g, '') === '0712345678') {
      setStage('admin');
      return;
    }
    setStage('kyc');
  };

  const handleKycComplete = (name: string) => {
    setUser((u) => ({ ...u, name, phone, verification: 'pending' }));
    setStage('plan');
  };

  const handlePlanSelect = (plan: Plan) => {
    setUser((u) => ({ ...u, plan }));
    setStage('membership');
  };

  const handleMembershipComplete = () => {
    setUser((u) => ({ ...u, membershipPaid: true, verification: 'verified' }));
    setStage('waiting');
  };

  const handleMatched = () => {
    setUser((u) => ({ ...u, groupId: 'standard-group-4821' }));
    setStage('app');
    setScreen('home');
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `c${Date.now()}`,
      sender: 'member',
      authorName: 'You',
      authorColor: 'bg-brand-600',
      text,
      timestamp: 'Just now',
    };
    setUser((u) => ({ ...u, chatMessages: [...u.chatMessages, newMsg] }));

    setTimeout(() => {
      const botReply: ChatMessage = {
        id: `c${Date.now() + 1}`,
        sender: 'bot',
        authorName: 'Chama Bot',
        authorColor: 'bg-brand-600',
        text: 'Thanks for your message! I will keep the group updated.',
        timestamp: 'Just now',
        isSystem: true,
      };
      setUser((u) => ({ ...u, chatMessages: [...u.chatMessages, botReply] }));
    }, 1000);
  };

  const handleLogout = () => {
    setUser(createInitialUser());
    setStage('login');
    setPhone('');
  };

  const handleAdminLogout = () => {
    setStage('login');
    setPhone('');
  };

  if (stage === 'admin') return <AdminDashboard onLogout={handleAdminLogout} />;
  if (stage === 'login') return <Login onLogin={handleLogin} onDemoLogin={handleDemoLogin} />;
  if (stage === 'otp') return <Otp phone={phone} onVerified={handleOtpVerified} onBack={() => setStage('login')} />;
  if (stage === 'kyc') return <Kyc onComplete={handleKycComplete} />;
  if (stage === 'plan') return <PlanSelection onSelect={handlePlanSelect} />;
  if (stage === 'membership') return <Membership plan={user.plan} onComplete={handleMembershipComplete} />;
  if (stage === 'waiting') return <WaitingRoom plan={user.plan} onMatched={handleMatched} />;

  return (
    <AppShell active={screen} onNavigate={setScreen} unreadCount={2}>
      {screen === 'home' && <HomeScreen user={user} onNavigate={setScreen} />}
      {screen === 'group' && <GroupScreen user={user} onNavigate={setScreen} />}
      {screen === 'chat' && <ChatScreen user={user} onSend={handleSendMessage} />}
      {screen === 'wallet' && <WalletScreen user={user} />}
      {screen === 'services' && <ServicesScreen user={user} />}
      {screen === 'profile' && <ProfileScreen user={user} onLogout={handleLogout} />}
    </AppShell>
  );
}

export default App;
