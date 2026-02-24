import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { followUps, leads as leadsApi, whatsappUrl } from "../api";

const DEFAULT_MSG = "Hi! Following up from LeadSathi. How can we help you today?";

export default function FollowUps() {
  const [list, setList] = useState([]);
  const [leadOptions, setLeadOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    lead_id: "",
    follow_up_at: "",
    notes: "",
  });

  const load = () => {
    setLoading(true);
    followUps.list({ completed: false })
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const fetchLeadOptions = () => {
    leadsApi.list().then(setLeadOptions).catch(() => setLeadOptions([]));
  };

  useEffect(() => {
    load();
    fetchLeadOptions();
  }, []);

  useEffect(() => {
    if (showForm) leadsApi.list().then(setLeadOptions).catch(() => setLeadOptions([]));
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await followUps.create({
        lead_id: form.lead_id,
        follow_up_at: new Date(form.follow_up_at).toISOString(),
        notes: form.notes || undefined,
      });
      setForm({ lead_id: "", follow_up_at: "", notes: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const markCompleted = async (id) => {
    try {
      await followUps.update(id, { completed: true });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this follow-up?")) return;
    try {
      await followUps.delete(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (d) => {
    const dt = new Date(d);
    return dt.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
          <p className="mt-1 text-gray-600">Never forget a lead again. Set reminders and complete them.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
        >
          + Schedule follow-up
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Schedule follow-up</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Lead *</label>
              <select
                value={form.lead_id}
                onChange={(e) => setForm((f) => ({ ...f, lead_id: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              >
                <option value="">Select lead</option>
                {leadOptions.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} – {l.phone}</option>
                ))}
              </select>
              {leadOptions.length === 0 && (
                <p className="mt-2 text-sm text-amber-700">
                  No leads yet. <Link to="/leads" className="font-medium text-primary-600 underline hover:no-underline">Add leads from the Leads page</Link> first, then come back to schedule a follow-up.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date & time *</label>
              <input
                type="datetime-local"
                value={form.follow_up_at}
                onChange={(e) => setForm((f) => ({ ...f, follow_up_at: e.target.value }))}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={leadOptions.length === 0}
                className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="mt-8 flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((fu) => (
            <li
              key={fu.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{fu.lead_name}</p>
                <p className="text-sm text-gray-600">{fu.lead_phone}</p>
                <p className="mt-1 text-sm text-gray-500">{formatDate(fu.follow_up_at)}</p>
                {fu.notes && <p className="mt-1 text-sm text-gray-500">{fu.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappUrl(fu.lead_phone, DEFAULT_MSG)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => markCompleted(fu.id)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Done
                </button>
                <button
                  onClick={() => handleDelete(fu.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
              No upcoming follow-ups. Schedule one above.
            </div>
          )}
        </ul>
      )}
    </AppLayout>
  );
}
