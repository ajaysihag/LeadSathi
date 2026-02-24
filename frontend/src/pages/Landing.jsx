import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  "Centralized lead management",
  "Smart follow-up reminders",
  "One-click WhatsApp messaging",
  "Simple dashboard for owners & teams",
];

const who = [
  "Real estate agents",
  "Coaching institutes",
  "Service businesses",
  "Agencies & MSMEs",
];

const problems = [
  "Leads get forgotten",
  "No follow-up reminders",
  "No visibility for business owners",
  "Lost revenue every month",
];

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/home" replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="LeadSathi" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-primary-600">LeadSathi</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
            <Link
              to="/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Never miss a lead again.
          </h1>
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            LeadSathi helps Indian businesses manage leads, track follow-ups, and close more deals — all in one simple dashboard.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700"
            >
              Start Free Trial
            </Link>
            <a
              href="#demo"
              className="rounded-xl border-2 border-gray-300 px-8 py-4 text-lg font-medium text-gray-700 hover:border-primary-500 hover:text-primary-600"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-gray-100 bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Still tracking leads on WhatsApp and Excel?
          </h2>
          <ul className="mt-8 space-y-3 text-left">
            {problems.map((p) => (
              <li key={p} className="flex items-center gap-3 text-gray-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600">!</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            LeadSathi keeps your sales on track
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-accent-600">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-gray-100 bg-primary-50/50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Who it's for</h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-4">
            {who.map((w) => (
              <li
                key={w}
                className="rounded-full bg-white px-6 py-3 text-gray-700 shadow-sm ring-1 ring-gray-200"
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-gray-900">Simple pricing</h2>
          <p className="mt-2 text-center text-gray-600">7-day free trial. No card required.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
              <p className="mt-4 text-3xl font-bold text-primary-600">₹999 <span className="text-base font-normal text-gray-500">/ month</span></p>
              <ul className="mt-6 space-y-2 text-gray-600">
                <li>Up to 500 leads</li>
                <li>Follow-up reminders</li>
                <li>WhatsApp one-click</li>
                <li>1 user</li>
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-lg bg-primary-600 py-3 text-center font-medium text-white hover:bg-primary-700"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-primary-500 bg-primary-50/30 p-8 shadow-sm">
              <span className="rounded-full bg-primary-600 px-3 py-1 text-sm text-white">Popular</span>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Team</h3>
              <p className="mt-4 text-3xl font-bold text-primary-600">₹1,999 <span className="text-base font-normal text-gray-500">/ month</span></p>
              <ul className="mt-6 space-y-2 text-gray-600">
                <li>Unlimited leads</li>
                <li>Team roles (Owner + Sales)</li>
                <li>All Basic features</li>
                <li>Up to 20 users</li>
              </ul>
              <Link
                to="/register"
                className="mt-8 block rounded-lg bg-primary-600 py-3 text-center font-medium text-white hover:bg-primary-700"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="border-t border-gray-100 bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold">Ready to close more deals?</h2>
          <p className="mt-2 text-gray-300">Try LeadSathi free for 7 days.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-accent-500 px-8 py-4 font-medium text-white hover:bg-accent-600"
            >
              Start Free Trial
            </Link>
            <a
              href="mailto:demo@leadsathi.com"
              className="rounded-xl border border-gray-500 px-8 py-4 font-medium hover:bg-gray-800"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LeadSathi. Never miss a lead again.
        </div>
      </footer>
    </div>
  );
}
