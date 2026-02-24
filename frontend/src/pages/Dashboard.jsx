import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { dashboard as dashboardApi, followUps, whatsappUrl } from "../api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DEFAULT_MESSAGE = "Hi! This is a follow-up from LeadSathi. How can we help you today?";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dueToday, setDueToday] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([dashboardApi.stats(), followUps.dueToday()])
      .then(([s, list]) => {
        setStats(s);
        setDueToday(Array.isArray(list) ? list : []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      </AppLayout>
    );
  }

  const cards = [
    { label: "Total leads", value: stats?.total_leads ?? 0, color: "primary" },
    { label: "Follow-ups due today", value: stats?.follow_ups_due_today ?? 0, color: "accent" },
    { label: "Converted", value: stats?.converted ?? 0, color: "green" },
    { label: "New leads", value: stats?.new_leads ?? 0, color: "gray" },
  ];

  return (
    <AppLayout>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-600">Overview of your leads and follow-ups.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, color }) => (
          <div
            key={label}
            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${
              color === "primary" ? "border-primary-200 bg-primary-50/30" : ""
            }`}
          >
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`mt-2 text-3xl font-bold ${
              color === "primary" ? "text-primary-600" : color === "accent" ? "text-accent-600" : "text-gray-900"
            }`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {dueToday.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Follow-ups due today</h2>
          <p className="text-sm text-gray-600">Click WhatsApp to send a message.</p>
          <ul className="mt-4 space-y-3">
            {dueToday.map((fu) => (
              <li
                key={fu.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">{fu.lead_name}</p>
                  <p className="text-sm text-gray-600">{fu.lead_phone}</p>
                  {fu.notes && <p className="mt-1 text-sm text-gray-500">{fu.notes}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={whatsappUrl(fu.lead_phone, DEFAULT_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                  <Link
                    to="/leads"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View lead
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dueToday.length === 0 && (stats?.follow_ups_due_today ?? 0) === 0 && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No follow-ups due today. Great job!</p>
          <Link to="/follow-ups" className="mt-4 inline-block text-primary-600 hover:underline">
            Schedule a follow-up →
          </Link>
        </div>
      )}

      {user?.role === "owner" && user?.id && (
        <div className="mt-10 rounded-xl border border-primary-200 bg-primary-50/30 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Website form capture</h2>
          <p className="mt-1 text-sm text-gray-600">
            Use this Organization ID in your website form to auto-capture leads into LeadSathi.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="rounded bg-white px-3 py-2 text-sm font-mono text-primary-700 ring-1 ring-primary-200">
              {user.id}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(user.id)}
              className="rounded-lg border border-primary-300 bg-white px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
            >
              Copy
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            POST {API_BASE}/api/lead-capture with body: {"{ \"organization_id\": \"...\", \"name\": \"...\", \"phone\": \"...\" }"}
          </p>
        </div>
      )}
    </AppLayout>
  );
}
