import { useState, useRef, useEffect } from 'react';
import { Send, Users, Bot } from 'lucide-react';
import { type User, type ChatMessage } from '@/types';

interface ChatScreenProps {
  user: User;
  onSend: (text: string) => void;
}

export function ChatScreen({ user, onSend }: ChatScreenProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [user.chatMessages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] min-h-0 lg:h-[calc(100dvh-6rem)]">
      <div className="bg-brand-700 px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base">Standard Group #4821</h1>
            <p className="text-brand-200 text-xs">5 members · Private chat</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-ink-50">
        <div className="flex flex-col items-center gap-1 py-4">
          <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
            <Bot size={24} className="text-brand-600" />
          </div>
          <p className="text-xs text-ink-400">Chama Bot joined the chat</p>
          <p className="text-xs text-ink-300">Messages are private to your group</p>
        </div>

        {user.chatMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      <div className="bg-white border-t border-ink-100 px-3 sm:px-4 py-3 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-ink-50 border border-ink-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-11 h-11 bg-brand-600 rounded-full flex items-center justify-center transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40"
        >
          <Send size={18} className="text-white" />
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.isSystem) {
    return (
      <div className="flex justify-center animate-slide-up">
        <div className="bg-brand-100 text-brand-800 rounded-xl px-4 py-2.5 text-sm max-w-[85%] flex items-start gap-2">
          <Bot size={16} className="text-brand-600 mt-0.5 shrink-0" />
          <div>
            <p>{msg.text}</p>
            <p className="text-[10px] text-brand-500 mt-1">{msg.timestamp}</p>
          </div>
        </div>
      </div>
    );
  }

  const isMe = msg.authorName === 'You';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 ${msg.authorColor} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
          {msg.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div className={`rounded-2xl px-3.5 py-2.5 ${isMe ? 'bg-brand-600 text-white' : 'bg-white border border-ink-100 text-ink-900'}`}>
            <p className="text-sm">{msg.text}</p>
          </div>
          <p className={`text-[10px] text-ink-400 mt-1 ${isMe ? 'text-right' : ''}`}>
            {msg.authorName} · {msg.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
