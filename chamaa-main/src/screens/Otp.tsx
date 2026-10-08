import { useState, useEffect, useRef } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface OtpProps {
  phone: string;
  debugCode?: string;
  onVerified: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

const OTP_WINDOW_SECONDS = 180;

export function Otp({ phone, debugCode, onVerified, onResend, onBack }: OtpProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(OTP_WINDOW_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    setIsVerifying(true);
    setError('');
    try {
      await onVerified(digits.join(''));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'The verification code could not be checked.');
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    setResendTimer(OTP_WINDOW_SECONDS);
    setDigits(['', '', '', '']);
    setError('');
    inputsRef.current[0]?.focus();
    try {
      await onResend();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not request another code.');
    }
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
            onClick={() => void verify()}
            disabled={digits.join('').length < 4 || isVerifying}
            className="w-full bg-gold-400 text-ink-900 font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-all hover:bg-gold-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
            <ArrowRight size={20} />
          </button>
          {error && <p className="mt-3 text-sm text-red-200" role="alert">{error}</p>}

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
            {debugCode
              ? <>Development code: <span className="font-bold text-gold-300">{debugCode}</span></>
              : 'Enter the verification code sent to your phone.'}
          </p>
        </div>
      </div>
    </div>
  );
}
