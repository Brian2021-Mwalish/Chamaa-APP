import { Home, Users, MessageCircle, Wallet, User } from 'lucide-react';
import type { Screen } from '@/types';

interface AppShellProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
  unreadCount: number;
  children: React.ReactNode;
}

export function AppShell({ active, onNavigate, unreadCount, children }: AppShellProps) {
  const items: { id: Screen; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'group', label: 'Group', icon: Users },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col max-w-md mx-auto relative">
      <div className="flex-1 pb-20">{children}</div>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-ink-100 px-2 z-50">
        <div className="flex items-center justify-around">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-item flex-1 ${isActive ? 'nav-item-active' : 'nav-item-inactive'} hover:text-brand-500`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.id === 'chat' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gold-400 text-ink-900 text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
