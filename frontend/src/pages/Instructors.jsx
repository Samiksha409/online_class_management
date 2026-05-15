import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { instructorsAPI } from "../services/api";

function normalizeList(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.results)) return d.results;
  return [];
}

function fullName(user) {
  if (!user) return "—";
  const n = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return n || user.username || "—";
}

function Instructors() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await instructorsAPI.getAll();
        setRows(normalizeList(res));
      } catch (e) {
        setError("Could not load teachers. Check API and login.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
      <PageHeader
        eyebrow="Faculty"
        title="Teachers"
        subtitle="Faculty profiles with employee IDs and departments — aligned with your Django Teacher model."
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{rows.length}</span>{" "}
              teacher{rows.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading faculty…</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No teachers yet. Register with role Teacher (employee ID required) or run seed data.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Employee ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Specialization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-800">
                        {t.employee_id}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {fullName(t.user)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{t.user?.username ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{t.user?.email ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{t.department}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {t.specialization || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Instructors;
