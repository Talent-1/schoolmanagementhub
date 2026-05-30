import Image from "next/image";
import Link from "next/link";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),transparent_40%)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl animate-float" />

      <main className="relative mx-auto max-w-6xl space-y-12 rounded-[2rem] border border-white/10 bg-slate-900/95 px-6 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:px-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-end">
          <section className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]">
                New schools welcome
              </span>
              <p className="rounded-full bg-white/5 px-4 py-2 text-xs text-slate-300 shadow-inner">
                Smart onboarding + multi-campus support
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">HillCity Portal</p>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                The premium school platform for registration, operations, and growth.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                HillCity brings together school registration, class management, and analytics in a beautiful portal. Add new schools faster, give staff the tools they need, and keep every student record secure.
              </p>
            </div>

            <div className="space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
              <Link
                href="/school-onboard"
                className="inline-flex h-14 items-center justify-center rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-600 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-[1.03] hover:shadow-cyan-500/30"
              >
                Register School
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white transition duration-300 hover:border-cyan-300 hover:bg-white/10"
              >
                Explore Dashboard
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Quick setup</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Complete school onboarding and staff configuration in minutes, not days.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Secure by design</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Keep student and staff records protected with modern cloud security patterns.
                </p>
              </div>
            </div>
          </section>

          <aside className="animate-fade-in-up rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.9)]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-cyan-400 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
                <Image src="/HillCity-logo.svg" alt="HillCity logo" width={56} height={56} priority />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Trusted network</p>
                <p className="text-2xl font-semibold text-white">Built for school teams</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Trusted by</p>
                <p className="mt-2 text-3xl font-semibold text-white">78 schools</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/5">
                  <p className="text-sm text-slate-400">Student profiles</p>
                  <p className="mt-2 text-xl font-semibold text-white">24k+</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 border border-white/5">
                  <p className="text-sm text-slate-400">Platform uptime</p>
                  <p className="mt-2 text-xl font-semibold text-white">99.98%</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <article className="group rounded-[2rem] border border-white/10 bg-slate-950/85 p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-slate-900/95">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Onboarding</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Fast school rollout</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Launch new school accounts, assign admin roles, and configure classrooms in one elegant flow.
            </p>
          </article>
          <article className="group rounded-[2rem] border border-white/10 bg-slate-950/85 p-7 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/20 hover:bg-slate-900/95">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-300">Growth</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Scale across campuses</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Unify operations for multiple locations while preserving the flexibility every school needs.
            </p>
          </article>
          <article className="group rounded-[2rem] border border-white/10 bg-slate-950/85 p-7 transition duration-300 hover:-translate-y-1 hover:border-amber-300/20 hover:bg-slate-900/95">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Insight</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Actionable analytics</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Monitor attendance, progress, and staffing health from one beautiful portal experience.
            </p>
          </article>
        </section>

        {/* Testimonial carousel */}
        <div className="mt-6">
          <TestimonialCarousel />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Ready to launch</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Let HillCity help new schools register and thrive.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/school-onboard"
                className="inline-flex h-14 items-center justify-center rounded-full bg-linear-to-r from-cyan-400 via-sky-500 to-indigo-600 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition duration-300 hover:scale-[1.03]"
              >
                Register School
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-semibold text-white transition duration-300 hover:border-cyan-300 hover:bg-white/10"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
