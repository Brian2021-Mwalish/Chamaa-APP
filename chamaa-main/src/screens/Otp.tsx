import { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface OtpProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

export function Otp({ phone, onVerified, onBack }: OtpProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    if (next.every((d) => d) && next.join('').length === 4) {
      setTimeout(() => onVerified(), 300);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resend = () => {
    setResendTimer(30);
    setDigits(['', '', '', '']);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-brand-700 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="text-brand-100 text-sm mb-8 hover:text-white">
            ← Change number
          </button>

          <h1 className="text-white text-2xl font-extrabold mb-3">
            Enter the code
          </h1>
          <p className="text-brand-100 text-sm mb-10">
            We sent a 4-digit code to {phone}. Enter it below to continue.
          </p>

          <div className="flex gap-3 mb-8">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-16 h-16 bg-white text-ink-900 rounded-xl text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
              />
            ))}
          </div>

          <button
            onClick={onVerified}
            disabled={digits.join('').length < 4}
            className="w-full bg-gold-400 text-ink-900 font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-all hover:bg-gold-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify
            <ArrowRight size={20} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {resendTimer > 0 ? (
              <span className="text-brand-100 text-sm">
                Resend code in {resendTimer}s
              </span>
            ) : (
              <button onClick={resend} className="text-gold-300 text-sm font-medium flex items-center gap-1.5 hover:text-gold-200">
                <RotateCcw size={14} />
                Resend code
              </button>
            )}
          </div>

          <p className="text-brand-200 text-xs text-center mt-8">
            Hint: enter any 4 digits to continue
          </p>
        </div>
      </div>
    </div>
  );
}
