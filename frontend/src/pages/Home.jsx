import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

const steps = [
  {
    title: "Add your leads",
    description: "Add leads manually or capture them from your website form. Store name, phone, source (WhatsApp, call, website) and status.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
    to: "/leads",
    accent: "primary",
  },
  {
    title: "Schedule follow-ups",
    description: "Set a date and time for each follow-up. Your daily reminder list shows what’s due so you never miss a lead.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    to: "/follow-ups",
    accent: "primary",
  },
  {
    title: "One-click WhatsApp",
    description: "Open a lead or follow-up and click WhatsApp to send a pre-written message. No copy-paste, no missed chats.",
    icon: (
      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    to: "/leads",
    accent: "green",
  },
  {
    title: "Track on your dashboard",
    description: "See total leads, follow-ups due today, and converted count at a glance. Full visibility for you and your team.",
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    to: "/dashboard",
    accent: "primary",
  },
];

const quickLinks = [
  { to: "/dashboard", label: "Dashboard", sub: "Stats & today’s follow-ups" },
  { to: "/leads", label: "Leads", sub: "Add and manage leads" },
  { to: "/follow-ups", label: "Follow-ups", sub: "Schedule and complete" },
];

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 px-8 py-14 text-white shadow-xl opacity-0 animate-fade-in-up md:px-12 md:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 animate-hero-glow" />
        <div className="absolute -bottom-4 right-20 h-24 w-24 rounded-full bg-accent-400/20 animate-hero-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
        <div className="relative">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-200 opacity-0 animate-fade-in-up animation-delay-100">
            Welcome to your workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl opacity-0 animate-fade-in-up animation-delay-200">
            Welcome back, <span className="font-bold capitalize">{firstName}</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-100 opacity-0 animate-fade-in-up animation-delay-300">
            Never miss a lead again. Here’s how to get the most out of LeadSathi.
          </p>
          <div className="mt-6 flex items-center gap-2 opacity-0 animate-fade-in-up animation-delay-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-sm text-primary-200">You’re all set — start below</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-14">
        <div className="mb-10 opacity-0 animate-fade-in-up animation-delay-200">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
            How it works
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            How LeadSathi works
          </h2>
          <p className="mt-2 max-w-2xl text-base text-gray-600 leading-relaxed">
            A quick demo of your workflow — from adding leads to closing deals.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Link
              key={step.title}
              to={step.to}
              className={`home-card-hover group relative overflow-hidden rounded-2xl border-2 p-7 opacity-0 shadow-lg transition-all duration-300 animate-fade-in-up hover:shadow-xl ${
                step.accent === "green"
                  ? "border-accent-200 bg-gradient-to-br from-white to-accent-50/60 hover:border-accent-300 hover:from-accent-50/50 hover:to-accent-50"
                  : "border-primary-100 bg-gradient-to-br from-white to-primary-50/50 hover:border-primary-300 hover:from-primary-50/70 hover:to-primary-50"
              }`}
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <span
                className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step.accent === "green"
                    ? "bg-accent-100 text-accent-700 group-hover:bg-accent-200 group-hover:text-accent-800"
                    : "bg-primary-100 text-primary-600 group-hover:bg-primary-200 group-hover:text-primary-700"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl transition-opacity ${
                  step.accent === "green"
                    ? "bg-gradient-to-b from-accent-400 to-accent-600 opacity-40 group-hover:opacity-100"
                    : "bg-gradient-to-b from-primary-400 to-primary-600 opacity-40 group-hover:opacity-100"
                }`}
              />
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-md ring-2 ring-white/80 transition-all group-hover:scale-105 group-hover:shadow-lg ${
                  step.accent === "green"
                    ? "bg-gradient-to-br from-accent-100 to-accent-200 text-accent-700"
                    : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600"
                }`}
              >
                {step.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-gray-900 group-hover:text-primary-700">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
              <span
                className={`mt-5 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all group-hover:gap-3 ${
                  step.accent === "green"
                    ? "border-accent-200/60 bg-accent-50 text-accent-800 group-hover:border-accent-300 group-hover:bg-accent-100"
                    : "border-primary-200/60 bg-primary-50 text-primary-700 group-hover:border-primary-300 group-hover:bg-primary-100"
                }`}
              >
                Try it
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-16">
        <div className="mb-8 opacity-0 animate-fade-in-up animation-delay-600">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
            Shortcuts
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Quick actions
          </h2>
          <p className="mt-2 max-w-xl text-base text-gray-600 leading-relaxed">
            Jump straight into your most-used sections.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {quickLinks.map((link, i) => (
            <Link
              key={link.to}
              to={link.to}
              className={`home-card-hover group relative overflow-hidden rounded-2xl border-2 p-6 opacity-0 shadow-lg transition-all duration-300 animate-fade-in-up hover:shadow-xl ${
                link.to === "/follow-ups"
                  ? "border-accent-200 bg-gradient-to-br from-white to-accent-50/60 hover:border-accent-300 hover:from-accent-50/50 hover:to-accent-50"
                  : "border-primary-100 bg-gradient-to-br from-white to-primary-50/50 hover:border-primary-300 hover:from-primary-50/70 hover:to-primary-50"
              }`}
              style={{ animationDelay: `${800 + i * 100}ms` }}
            >
              <span
                className={`absolute left-0 top-0 h-full w-1.5 rounded-l-2xl transition-opacity ${
                  link.to === "/follow-ups"
                    ? "bg-gradient-to-b from-accent-400 to-accent-600 opacity-40 group-hover:opacity-100"
                    : "bg-gradient-to-b from-primary-400 to-primary-600 opacity-40 group-hover:opacity-100"
                }`}
              />
              <div className="flex items-center gap-5">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-md ring-2 ring-white/80 transition-all group-hover:scale-105 group-hover:shadow-lg ${
                    link.to === "/follow-ups"
                      ? "bg-gradient-to-br from-accent-100 to-accent-200 text-accent-700"
                      : "bg-gradient-to-br from-primary-100 to-primary-200 text-primary-600"
                  }`}
                >
                  {link.to === "/dashboard" && (
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {link.to === "/leads" && (
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  )}
                  {link.to === "/follow-ups" && (
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-primary-700">{link.label}</p>
                  <p className="mt-1 text-sm text-gray-600">{link.sub}</p>
                </div>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all group-hover:translate-x-0.5 ${
                    link.to === "/follow-ups"
                      ? "bg-accent-100 text-accent-700 group-hover:bg-accent-200"
                      : "bg-primary-100 text-primary-600 group-hover:bg-primary-200"
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl border border-accent-200 bg-accent-50/50 px-8 py-8 text-center opacity-0 animate-fade-in animation-delay-1000">
        <p className="text-lg font-medium text-gray-800">
          Ready to get started? Add your first lead or open your dashboard.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            to="/leads"
            className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
          >
            Add a lead
          </Link>
          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Open dashboard
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
