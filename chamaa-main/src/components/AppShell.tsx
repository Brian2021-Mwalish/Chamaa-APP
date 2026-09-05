import { Home, Users, MessageCircle, Wallet, User, Bell, Settings, BriefcaseBusiness } from 'lucide-react';
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
    { id: 'services', label: 'Services', icon: BriefcaseBusiness },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-ink-50 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="flex h-20 items-center gap-3 border-b border-ink-100 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 shadow-sm">
            <span className="font-extrabold text-gold-400">C</span>
          </div>
          <div>
            <p className="font-extrabold tracking-tight text-ink-900">Chama</p>
            <p className="text-[11px] text-ink-400">Member workspace</p>
          </div>
        </div>
        <div className="px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">Workspace</p>
          <div className="mt-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-900'}`}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                  {item.id === 'chat' && unreadCount > 0 && <span className="ml-auto rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-bold text-ink-900">{unreadCount}</span>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-auto border-t border-ink-100 p-5">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 text-sm font-bold text-ink-900">M</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink-800">Member account</p><p className="text-xs text-ink-400">Standard plan</p></div>
          </div>
          <button onClick={() => onNavigate('profile')} className="flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-ink-400 hover:text-brand-700"><Settings size={17} /> Account settings</button>
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-ink-100 bg-white/95 px-4 backdrop-blur sm:px-8 lg:px-10">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Member portal</p><p className="text-sm font-semibold text-ink-800">{items.find((item) => item.id === active)?.label}</p></div>
        <button className="relative rounded-xl p-2.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700" aria-label="Notifications"><Bell size={19} />{unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-400" />}</button>
      </header>

      <main className="min-w-0 w-full max-w-screen-2xl mx-auto pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-10">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-ink-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
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
