import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronDown,
  Eye,
  FileText,
  HandCoins,
  ListOrdered,
  Lock,
  Menu,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#trust', label: 'Trust & safety' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

const FEATURES = [
  {
    icon: HandCoins,
    title: 'Flexible contributions',
    description: 'Choose a contribution amount and circle size that match your goals and budget.',
  },
  {
    icon: ListOrdered,
    title: 'Visible payout order',
    description: 'Every member can see the payout schedule, so there are no surprises about who is next.',
  },
  {
    icon: CalendarCheck,
    title: 'Stay on track',
    description: 'Follow due dates and member activity from one place, so nothing slips by.',
  },
  {
    icon: ShieldCheck,
    title: 'Clear and accountable',
    description: 'Payment activity and circle rules are easy to review before and after you join.',
  },
];

const STEPS = [
  { number: '01', title: 'Create your profile', description: 'Tell us a little about yourself and complete the required checks.' },
  { number: '02', title: 'Choose your plan', description: 'Pick the contribution level and circle size that work for you.' },
  { number: '03', title: 'Join and follow along', description: 'Review the circle rules, see the schedule, and stay updated.' },
];

const TRUST_POINTS = [
  {
    icon: UserCheck,
    title: 'Verified members',
    description: 'Members complete required checks before joining, so circles are built on accountability.',
  },
  {
    icon: FileText,
    title: 'Terms you can read first',
    description: 'Contribution amounts, schedules and circle rules are shown before any payment is due.',
  },
  {
    icon: Lock,
    title: 'Your information, protected',
    description: 'Personal details are collected only for onboarding and circle management.',
  },
  {
    icon: BadgeCheck,
    title: 'Transparent activity',
    description: 'Payment activity and member updates are visible to the circle, not hidden.',
  },
];

// Hero background slideshow images. Place A1.png and A2.png in your /public folder
// (or change these to imports, e.g. import a1 from '../assets/A1.png').
const SLIDES = [
  { src: '/A1.png', alt: 'Chama members saving together' },
  { src: '/A2.png', alt: 'A Chama circle following their savings progress' },
];
const SLIDE_INTERVAL_MS = 5000;

const WHY_CHAMA = [
  'See the full contribution plan before you commit',
  'Know your exact place in the payout order',
  'Follow member activity in one place',
  'Built around how Kenyan communities already save',
];

const FAQS = [
  {
    q: 'What is a chama?',
    a: 'A chama is a group of people who pool money regularly and take turns receiving the pooled amount, or save toward a shared goal. Chama helps you organize this in one place.',
  },
  {
    q: 'Is any payment taken when I sign up?',
    a: 'No. No payment is taken during onboarding. Please review your circle terms before any contribution is due.',
  },
  {
    q: 'How do I know when I will receive my payout?',
    a: 'Each circle has a visible payout order. Once you join, you can see your place in the schedule at any time.',
  },
  {
    q: 'Why are checks required when I sign up?',
    a: 'Group saving depends on trust. Required checks help make sure every member of a circle is who they say they are.',
  },
  {
    q: 'Who do I contact if I have a question?',
    a: 'For account or circle questions, contact your circle coordinator through your group. For partnership enquiries, use the Partnerships section after signing in.',
  },
];

export function LandingPage({ onLogin, onSignUp }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [slide, setSlide] = useState(0);

  // Slideshow advances automatically (skipped if the visitor prefers reduced motion)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-[100dvh] scroll-smooth bg-white text-ink-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-700"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="Chama home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-lg font-extrabold text-gold-400">
              C
            </span>
            <span className="text-lg font-extrabold tracking-tight">Chama</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-ink-600 xl:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.href} className="hover:text-brand-700" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogin}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 sm:px-4"
            >
              Login
            </button>
            <button type="button" onClick={onSignUp} className="btn-primary px-4 py-2.5 text-sm">
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="ml-1 rounded-xl p-2 text-ink-700 hover:bg-ink-50 xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" className="border-t border-ink-100 bg-white px-5 py-3 xl:hidden" aria-label="Mobile navigation">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main">
        {/* Hero: slideshow is the full-width background, content sits in front */}
        <section id="home" className="relative isolate overflow-hidden bg-brand-800 text-white">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            {SLIDES.map((item, index) => (
              <img
                key={item.src}
                src={item.src}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  index === slide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>

          <div className="mx-auto flex min-h-[600px] max-w-7xl items-center px-5 py-16 sm:px-8 sm:py-24 lg:min-h-[680px]">
            <div className="max-w-2xl [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-bold text-gold-300">
                <Users size={16} /> Save better, together
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Small steps. Shared goals. Stronger futures.
              </h1>
              <p className="mt-6 max-w-xl text-base font-medium leading-7 text-white sm:text-lg">
                Chama helps friends, families, and communities organize group savings with clear contributions, a
                visible payout order, and tools that make it easier to stay on track.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={onSignUp} className="btn-gold inline-flex items-center gap-2">
                  Get started <ArrowRight size={18} />
                </button>
                <a
                  href="#about"
                  className="inline-flex items-center rounded-xl border-2 border-white px-5 py-3.5 font-bold text-white hover:bg-brand-800"
                >
                  Learn about Chama
                </a>
              </div>
              <p className="mt-5 text-xs font-medium leading-5 text-white">
                No payment is taken during onboarding. Review your circle terms before any contribution is due.
              </p>
            </div>
          </div>

          {/* Slide indicator (automatic, display only) */}
          <div
            className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow sm:right-8"
            aria-hidden="true"
          >
            {SLIDES.map((item, index) => (
              <span
                key={item.src}
                className={`h-2.5 rounded-full transition-all ${index === slide ? 'w-7 bg-brand-700' : 'w-2.5 bg-ink-300'}`}
              />
            ))}
          </div>
        </section>

        {/* Value bar */}
        <section className="border-b border-ink-100 bg-white">
          <ul className="mx-auto grid max-w-7xl gap-px bg-ink-100 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: HandCoins, text: 'Save together' },
              { icon: ListOrdered, text: 'Know your payout order' },
              { icon: CalendarCheck, text: 'Follow every due date' },
              { icon: ShieldCheck, text: 'Transparent by design' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 bg-white px-6 py-5 text-sm font-bold text-ink-700">
                <Icon size={20} className="text-brand-600" /> {text}
              </li>
            ))}
          </ul>
        </section>

        {/* About + Mission/Vision */}
        <section id="about" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">About Chama</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Make group saving easier to understand and manage.
              </h2>
              <p className="mt-5 text-base leading-7 text-ink-600">
                Chama is a group savings platform built for everyday progress in Kenya. Members can find a circle that
                fits, understand the contribution plan and payout schedule, and keep up with group activity from one
                place.
              </p>
            </div>
            <div className="rounded-3xl bg-ink-50 p-6 sm:p-8">
              <h3 className="text-lg font-extrabold">Why members choose Chama</h3>
              <ul className="mt-4 space-y-3">
                {WHY_CHAMA.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
                      <Check size={12} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="mission" className="mt-12 grid scroll-mt-24 gap-5 md:grid-cols-2">
            <article className="card p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <Target size={23} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Our mission</h3>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                To make trusted, community-based saving more accessible by helping people plan together, understand
                their commitments, and follow each step transparently.
              </p>
            </article>
            <article className="card p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700">
                <Eye size={23} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Our vision</h3>
              <p className="mt-3 text-sm leading-6 text-ink-600">
                A future where communities can build financial resilience together through clear, responsible, and
                dependable group savings.
              </p>
            </article>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 bg-brand-50">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">Features</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Everything your circle needs in one place.</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-brand-100 bg-white p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                    <Icon size={21} />
                  </div>
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">A clear path from signup to your circle.</h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.number} className="rounded-2xl border border-ink-100 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 text-sm font-extrabold text-white">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-500">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <button type="button" onClick={onSignUp} className="btn-primary inline-flex items-center gap-2">
              Create your profile <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Trust & safety */}
        <section id="trust" className="scroll-mt-20 bg-brand-800 text-white">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-300">Trust &amp; safety</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Built on accountability and clarity.</h2>
              <p className="mt-4 text-base leading-7 text-brand-100">
                Group saving works when everyone knows what to expect. Chama puts the details in front of you before
                you commit.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-2xl border border-brand-600 bg-brand-700 p-6">
                  <Icon size={26} className="text-gold-300" />
                  <h3 className="mt-5 font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-brand-100">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">FAQ</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Common questions</h2>
          <div className="mt-8 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className="bg-white">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold hover:bg-ink-50"
                    >
                      {item.q}
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-brand-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <p id={`faq-panel-${index}`} className="px-5 pb-5 text-sm leading-6 text-ink-600">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA + contact */}
        <section id="contact" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-16 sm:px-8">
          <div className="flex flex-col gap-6 rounded-3xl bg-brand-700 p-6 text-white sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold-300">Contact</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">We&apos;re here to help you get started.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-100">
                For account or circle questions, contact your circle coordinator through your group. For partnership
                enquiries, use the Partnerships section after signing in.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onSignUp} className="btn-gold inline-flex items-center justify-center gap-2">
                Join Chama <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="inline-flex items-center justify-center rounded-xl border border-brand-500 px-5 py-3.5 font-semibold text-white hover:bg-brand-800"
              >
                Login
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-ink-900 text-ink-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#home" className="flex items-center gap-3" aria-label="Chama home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-lg font-extrabold text-gold-400">
                C
              </span>
              <span className="text-lg font-extrabold text-white">Chama</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6">
              Group savings, built around community. Helping friends, families and communities in Kenya save with
              clarity.
            </p>
          </div>
          <nav aria-label="Explore">
            <h3 className="text-sm font-bold text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="#mission" className="hover:text-white">Our mission</a></li>
            </ul>
          </nav>
          <nav aria-label="Support">
            <h3 className="text-sm font-bold text-white">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#trust" className="hover:text-white">Trust &amp; safety</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-ink-700">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs sm:px-8 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Chama. All rights reserved.</p>
            <p>No payment is taken during onboarding. Review your circle terms before any contribution is due.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}