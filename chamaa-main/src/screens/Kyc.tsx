import { useState } from 'react';
import { Upload, IdCard, FileText, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface KycProps {
  onComplete: (name: string) => void;
}

export function Kyc({ onComplete }: KycProps) {
  const [step, setStep] = useState<'intro' | 'id' | 'income' | 'review'>('intro');
  const [fullName, setFullName] = useState('');
  const [idUploaded, setIdUploaded] = useState(false);
  const [incomeUploaded, setIncomeUploaded] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50 flex flex-col">
      <div className="bg-brand-700 pt-12 pb-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 text-brand-100 text-sm mb-2">
            <ShieldCheck size={16} />
            <span>Identity Verification</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold">
            {step === 'intro' && 'Verify your identity'}
            {step === 'id' && 'Upload your ID'}
            {step === 'income' && 'Proof of income'}
            {step === 'review' && 'Almost done'}
          </h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {step === 'intro' && (
            <div className="animate-fade-in">
              <p className="text-ink-600 text-base mb-8">
                Before joining a savings group, every member must verify their identity. This protects everyone in your future group.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 card">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                    <IdCard className="text-brand-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">National ID or Passport</p>
                    <p className="text-sm text-ink-400">A clear photo of your document</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 card">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
                    <FileText className="text-brand-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-900">Proof of income</p>
                    <p className="text-sm text-ink-400">Payslip, business records, or M-Pesa statement</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-ink-700 mb-2 block">Full name (as on your ID)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Wanjiru Kamau"
                  className="input-field"
                />
              </div>
              <button
                onClick={() => setStep('id')}
                disabled={fullName.trim().length < 3}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 'id' && (
            <div className="animate-fade-in">
              <p className="text-ink-600 mb-6">Take a clear photo of the front of your National ID or Passport.</p>
              <button
                onClick={() => setIdUploaded(true)}
                className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all ${idUploaded ? 'border-brand-400 bg-brand-50' : 'border-ink-200 bg-white hover:border-brand-400'}`}
              >
                {idUploaded ? (
                  <>
                    <CheckCircle2 className="text-brand-600" size={40} />
                    <p className="font-semibold text-brand-700">ID uploaded</p>
                    <p className="text-sm text-ink-400">Tap to retake</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-ink-100 rounded-xl flex items-center justify-center">
                      <Upload className="text-ink-400" size={28} />
                    </div>
                    <p className="font-semibold text-ink-700">Tap to upload ID photo</p>
                    <p className="text-sm text-ink-400">JPG or PNG, max 5MB</p>
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('income')}
                disabled={!idUploaded}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 'income' && (
            <div className="animate-fade-in">
              <p className="text-ink-600 mb-6">Upload a payslip, business record, or M-Pesa statement showing your income.</p>
              <button
                onClick={() => setIncomeUploaded(true)}
                className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all ${incomeUploaded ? 'border-brand-400 bg-brand-50' : 'border-ink-200 bg-white hover:border-brand-400'}`}
              >
                {incomeUploaded ? (
                  <>
                    <CheckCircle2 className="text-brand-600" size={40} />
                    <p className="font-semibold text-brand-700">Document uploaded</p>
                    <p className="text-sm text-ink-400">Tap to replace</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-ink-100 rounded-xl flex items-center justify-center">
                      <Upload className="text-ink-400" size={28} />
                    </div>
                    <p className="font-semibold text-ink-700">Tap to upload document</p>
                    <p className="text-sm text-ink-400">PDF, JPG, or PNG</p>
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('review')}
                disabled={!incomeUploaded}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-brand-600" size={44} />
              </div>
              <h2 className="text-xl font-bold text-ink-900 mb-3">Documents submitted</h2>
              <p className="text-ink-500 mb-8 max-w-xs mx-auto">
                Your account is now <span className="font-semibold text-gold-600">Pending</span> verification. Our team will review your documents shortly.
              </p>
              <div className="card p-5 text-left mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ink-500">Name</span>
                  <span className="font-semibold text-ink-900">{fullName}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-ink-500">National ID</span>
                  <span className="font-semibold text-brand-600 flex items-center gap-1">
                    <CheckCircle2 size={16} /> Uploaded
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-500">Proof of income</span>
                  <span className="font-semibold text-brand-600 flex items-center gap-1">
                    <CheckCircle2 size={16} /> Uploaded
                  </span>
                </div>
              </div>
              <button
                onClick={() => onComplete(fullName)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Continue to plans
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
