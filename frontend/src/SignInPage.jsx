import React, { useState } from 'react'

const FEATURES = [
  'Real-Time AI Audits',
  'Voice + Document Compliance',
  'Circle Escrow Enforcement',
  'Regulatory Risk Scoring',
  'Autonomous Compliance Agents',
]

function NetworkVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        viewBox="0 0 800 1000"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: 'blur(0.5px)' }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#6C63FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="glowAccent" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowTeal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glowAmber" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background gradient mesh */}
        <rect width="800" height="1000" fill="url(#glowAccent)" opacity="0.15" />

        {/* Horizontal/vertical subtle grid */}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(x => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="1000" stroke="#6C63FF" strokeOpacity="0.02" strokeWidth="0.5" />
        ))}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(y => (
          <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#6C63FF" strokeOpacity="0.02" strokeWidth="0.5" />
        ))}

        {/* Connecting lines */}
        <g stroke="#6C63FF" strokeOpacity="0.12" strokeWidth="1" fill="none">
          <path d="M400,480 L200,200 M400,480 L600,220 M400,480 L680,480 M400,480 L200,750 M400,480 L600,720 M400,480 L400,850 M400,480 L280,620 M200,200 L600,220 M600,220 L680,480 M200,750 L400,850 M400,850 L600,720 M200,200 L200,750 M600,220 L600,720" />
          <path d="M280,620 L200,750 M280,620 L400,850 M680,480 L600,720" strokeOpacity="0.06" />
          <path d="M100,400 L200,200 M100,400 L200,750 M100,400 L280,620" strokeOpacity="0.06" />
        </g>

        {/* Glow circles */}
        <circle cx="200" cy="200" r="60" fill="url(#glowAccent)" className="node-pulse" />
        <circle cx="600" cy="220" r="50" fill="url(#glowTeal)" className="node-pulse-delayed" />
        <circle cx="680" cy="480" r="55" fill="url(#glowAmber)" className="node-pulse" />
        <circle cx="200" cy="750" r="50" fill="url(#glowAccent)" className="node-pulse-delayed" />
        <circle cx="400" cy="850" r="45" fill="url(#glowTeal)" className="node-pulse" />
        <circle cx="600" cy="720" r="40" fill="url(#glowAccent)" />
        <circle cx="100" cy="400" r="35" fill="url(#glowAmber)" className="node-pulse-delayed" />
        <circle cx="280" cy="620" r="30" fill="url(#glowTeal)" />

        {/* Center glow */}
        <circle cx="400" cy="480" r="90" fill="url(#glowAccent)" opacity="0.4" className="node-pulse" />

        {/* Nodes */}
        <g filter="url(#nodeGlow)">
          <circle cx="400" cy="480" r="28" fill="#0D1117" stroke="#6C63FF" strokeWidth="2" />
          <path d="M400,462 L400,498 M382,480 L418,480" stroke="#6C63FF" strokeWidth="2.5" strokeLinecap="round" />

          <circle cx="200" cy="200" r="8" fill="#6C63FF" stroke="#6C63FF" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="600" cy="220" r="7" fill="#2DD4BF" stroke="#2DD4BF" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="680" cy="480" r="8" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="200" cy="750" r="7" fill="#6C63FF" stroke="#6C63FF" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="400" cy="850" r="7" fill="#2DD4BF" stroke="#2DD4BF" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="600" cy="720" r="6" fill="#6C63FF" stroke="#6C63FF" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="100" cy="400" r="5" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.3" />
          <circle cx="280" cy="620" r="6" fill="#2DD4BF" stroke="#2DD4BF" strokeWidth="2" strokeOpacity="0.3" />
        </g>

        {/* Labels */}
        <g fill="rgba(148,163,184,0.5)" fontSize="8" fontFamily="DM Sans, sans-serif" letterSpacing="3">
          <text x="200" y="225" textAnchor="middle" className="uppercase">AI Agents</text>
          <text x="600" y="245" textAnchor="middle" className="uppercase">Documents</text>
          <text x="680" y="505" textAnchor="middle" className="uppercase">Voice</text>
          <text x="200" y="775" textAnchor="middle" className="uppercase">Blockchain</text>
          <text x="400" y="875" textAnchor="middle" className="uppercase">Wallet</text>
          <text x="600" y="745" textAnchor="middle" className="uppercase">Enforcement</text>
          <text x="280" y="645" textAnchor="middle" className="uppercase">Regulatory</text>
        </g>

        {/* Shield detail lines */}
        <g stroke="#6C63FF" strokeOpacity="0.08" strokeWidth="0.5">
          <line x1="370" y1="460" x2="370" y2="500" />
          <line x1="430" y1="460" x2="430" y2="500" />
          <line x1="380" y1="460" x2="420" y2="460" />
          <line x1="380" y1="500" x2="420" y2="500" />
        </g>
      </svg>
    </div>
  )
}

export default function SignInPage({ onSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignIn()
  }

  return (
    <div className="flex h-screen w-screen bg-surface-950 overflow-hidden">
      {/* Left — Brand / Hero */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <NetworkVisual />

        <div className="relative z-10 flex flex-col justify-between px-16 py-16 h-full">
          <div />

          <div className="space-y-6">
            <h1
              className="text-[5.5rem] leading-[0.9] font-display text-white tracking-tight"
              style={{ fontVariationSettings: "'wght' 400" }}
            >
              VIGILO
            </h1>
            <div className="space-y-1">
              <p className="text-[1.625rem] leading-[1.15] font-sans font-light text-slate-300 tracking-tight">
                Autonomous AI
              </p>
              <p className="text-[1.625rem] leading-[1.15] font-sans font-light text-slate-300 tracking-tight">
                Compliance Enforcement
              </p>
            </div>

            <p className="text-sm font-sans font-normal italic text-accent-400/80 tracking-wide">
              Detect. Evaluate. Enforce.
            </p>

            <p className="text-sm font-sans text-slate-500 leading-relaxed max-w-md">
              EU AI Act compliance with programmable trust enforcement.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {FEATURES.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-lg"
                >
                  <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[10px] font-sans text-slate-700 tracking-wider uppercase">
            Trusted AI Governance Infrastructure
          </p>
        </div>
      </div>

      {/* Right — Authentication Card */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-sm font-display text-white tracking-tight">VIGILO</span>
          </div>

          <div className="glass-panel-lg rounded-2xl p-8 sm:p-10 shadow-premium-lg">
            <div className="space-y-1.5 mb-8">
              <h2 className="text-2xl font-sans font-semibold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm font-sans text-slate-500">
                Secure access to AI governance infrastructure
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                  Work Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@organization.com"
                  className="input-premium"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-accent-400/60 hover:text-accent-400 transition-colors"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className="input-premium"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white
                           bg-accent-500 hover:bg-accent-600 active:bg-accent-700
                           transition-all duration-200 shadow-lg shadow-accent-500/15
                           hover:shadow-accent-500/25 focus:outline-none focus:ring-2
                           focus:ring-accent-500/40"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-[10px] font-medium text-slate-600 uppercase tracking-widest bg-surface-900 rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
                                 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08]
                                 text-sm font-medium text-slate-300 transition-all duration-200
                                 hover:border-white/[0.12]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl
                                 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08]
                                 text-sm font-medium text-slate-300 transition-all duration-200
                                 hover:border-white/[0.12]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-700 tracking-wider uppercase font-sans">
            Trusted AI Governance Infrastructure
          </p>
        </div>
      </div>
    </div>
  )
}
