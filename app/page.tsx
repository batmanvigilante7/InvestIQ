import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-4 py-1.5 text-sm text-slate-400">
          <span className="h-2 w-2 rounded-full bg-brand-green" />
          Now in early access
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Investing with
          <br />
          <span className="text-brand-green">structured conviction</span>
        </h1>

        <p className="mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
          FolioAI turns investment ideas into structured theses. Track
          assumptions, measure confidence, and build conviction — all in one
          intelligent workspace.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-brand-green/25 transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-brand-green/30 hover:-translate-y-0.5"
          >
            <span>📊</span>
            Open Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-green/40 bg-brand-green/5 px-8 py-3.5 text-sm font-bold text-brand-green shadow-lg shadow-brand-green/10 transition-all hover:border-brand-green hover:bg-brand-green/10 hover:shadow-xl hover:shadow-brand-green/20 hover:-translate-y-0.5"
          >
            <span>🚀</span>
            Get Started
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-white hover:-translate-y-0.5">
            <span>▶</span>
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800 bg-slate-950/50 px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            Why FolioAI?
          </h2>
          <p className="mb-12 text-slate-400">
            Everything you need to invest with conviction, not speculation.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          <div className="group rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-slate-900/50 p-6 transition-all hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
              🎯
            </div>
            <h3 className="mb-2 font-semibold text-white">Thesis Tracking</h3>
            <p className="text-sm text-slate-400">
              Structure every investment idea as a thesis with clear assumptions
              and measurable confidence.
            </p>
          </div>
          <div className="group rounded-xl border border-brand-green/20 bg-gradient-to-br from-brand-green/5 to-slate-900/50 p-6 transition-all hover:border-brand-green/40 hover:shadow-lg hover:shadow-brand-green/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-2xl">
              🤖
            </div>
            <h3 className="mb-2 font-semibold text-white">AI Insights</h3>
            <p className="text-sm text-slate-400">
              Get AI-powered analysis on your assumptions. Surface risks and
              opportunities you might have missed.
            </p>
          </div>
          <div className="group rounded-xl border border-brand-yellow/20 bg-gradient-to-br from-brand-yellow/5 to-slate-900/50 p-6 transition-all hover:border-brand-yellow/40 hover:shadow-lg hover:shadow-brand-yellow/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/10 text-2xl">
              📈
            </div>
            <h3 className="mb-2 font-semibold text-white">
              Portfolio Conviction
            </h3>
            <p className="text-sm text-slate-400">
              Move from speculation to conviction. Track how your theses evolve
              over time with real data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
