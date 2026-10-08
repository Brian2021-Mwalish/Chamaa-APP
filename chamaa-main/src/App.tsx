import { useEffect, useState } from 'react';
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
import { advanceOnboarding, clearAuthToken, getCurrentUser, logoutAccount, requestOtp, signupAccount, submitKyc, updateCurrentUser, verifyOtp } from '@/api';
import { createInitialUser, createDemoUser, PLANS, type AppStage, type Screen, type Plan, type User, type ChatMessage } from '@/types';

function App() {
  const [stage, setStage] = useState<AppStage>('login');
  const [screen, setScreen] = useState<Screen>('home');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [user, setUser] = useState<User>(createInitialUser);
  const [restoringSession, setRestoringSession] = useState(true);
  const [onboardingError, setOnboardingError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then((profile) => {
        if (!profile || cancelled) return;
        setPhone(profile.phone);
        setUser((currentUser) => ({
          ...currentUser,
          name: profile.name,
          phone: profile.phone,
          plan: PLANS.find((plan) => plan.id === profile.selected_plan) ?? currentUser.plan,
        }));
        setStage(profile.is_staff ? 'admin' : profile.onboarding_stage);
      })
      .catch(clearAuthToken)
      .finally(() => {
        if (!cancelled) setRestoringSession(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleLogin = async (p: string) => {
    const result = await requestOtp(p);
    setPhone(p);
    setOtpCode(result.debug_code ?? '');
    setStage('otp');
  };

  const handleSignUp = async (name: string, email: string, p: string) => {
    const profile = await signupAccount(name, email, p);
    setPhone(profile.phone);
    setUser((currentUser) => ({
      ...currentUser,
      name: profile.name,
      phone: profile.phone,
    }));
    setOnboardingError('');
    setStage(profile.onboarding_stage);
  };

  const handleDemoLogin = () => {
    clearAuthToken();
    setUser(createDemoUser());
    setStage('app');
    setScreen('home');
  };

  const handleOtpVerified = async (code: string) => {
    const profile = await verifyOtp(phone, code);
    setUser((currentUser) => ({
      ...currentUser,
      name: profile.name,
      phone: profile.phone,
    }));
    setStage(profile.is_staff ? 'admin' : profile.onboarding_stage);
  };

  const handleResendOtp = async () => {
    const result = await requestOtp(phone);
    setOtpCode(result.debug_code ?? '');
  };

  const handleKycComplete = async (data: { fullName: string; idDocument: File; incomeDocument: File }) => {
    const profile = await submitKyc(data);
    setUser((u) => ({ ...u, name: profile.name, phone: profile.phone, verification: 'pending' }));
    setStage(profile.onboarding_stage);
  };

  const handlePlanSelect = async (plan: Plan) => {
    try {
      await updateCurrentUser({ selected_plan: plan.id });
      const profile = await advanceOnboarding();
      setUser((u) => ({ ...u, plan }));
      setOnboardingError('');
      setStage(profile.onboarding_stage);
    } catch (error) {
      setOnboardingError(error instanceof Error ? error.message : 'Could not save onboarding progress.');
    }
  };

  const handleMembershipComplete = async () => {
    try {
      const profile = await advanceOnboarding();
      setUser((u) => ({ ...u, membershipPaid: true, verification: 'verified' }));
      setOnboardingError('');
      setStage(profile.onboarding_stage);
    } catch (error) {
      setOnboardingError(error instanceof Error ? error.message : 'Could not save onboarding progress.');
    }
  };

  const handleMatched = async () => {
    try {
      const profile = await advanceOnboarding();
      setUser((u) => ({ ...u, groupId: 'standard-group-4821' }));
      setOnboardingError('');
      setStage(profile.onboarding_stage);
      setScreen('home');
    } catch (error) {
      setOnboardingError(error instanceof Error ? error.message : 'Could not save onboarding progress.');
    }
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
    void logoutAccount().catch(() => clearAuthToken());
    setUser(createInitialUser());
    setStage('login');
    setPhone('');
  };

  const onboardingAlert = onboardingError ? (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-lg bg-red-700 px-4 py-3 text-sm font-medium text-white shadow-lg" role="alert">
      {onboardingError}
    </div>
  ) : null;

  const handleAdminLogout = () => {
    void logoutAccount().catch(() => clearAuthToken());
    setStage('login');
    setPhone('');
  };

  if (restoringSession) {
    return <div className="min-h-screen bg-ink-50 flex items-center justify-center text-ink-500">Loading account...</div>;
  }

  if (stage === 'admin') return <AdminDashboard onLogout={handleAdminLogout} />;
  if (stage === 'login') return <Login onLogin={handleLogin} onSignUp={handleSignUp} onDemoLogin={handleDemoLogin} />;
  if (stage === 'otp') return <Otp phone={phone} debugCode={otpCode} onVerified={handleOtpVerified} onResend={handleResendOtp} onBack={() => setStage('login')} />;
  if (stage === 'kyc') return <Kyc initialName={user.name} onComplete={handleKycComplete} />;
  if (stage === 'plan') return <><PlanSelection onSelect={handlePlanSelect} />{onboardingAlert}</>;
  if (stage === 'membership') return <><Membership plan={user.plan} onComplete={handleMembershipComplete} />{onboardingAlert}</>;
  if (stage === 'waiting') return <><WaitingRoom plan={user.plan} onMatched={handleMatched} />{onboardingAlert}</>;

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
