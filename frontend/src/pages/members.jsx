import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { membersAPI } from "../services/api";

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

function Members() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await membersAPI.getAll();
        setRows(normalizeList(res));
      } catch (e) {
        setError("Could not load students. Ensure you are signed in and the API is running.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
      <PageHeader
        eyebrow="Directory"
        title="Students"
        subtitle="Official roster from the database — linked to user accounts, roll numbers, and program details."
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
              student{rows.length === 1 ? "" : "s"} in directory
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading roster…</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No students yet. Register student accounts or run{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">seed_data</code>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Roll no.</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Username</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Program</th>
                    <th className="px-6 py-3">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-800">
                        {s.roll_number}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {fullName(s.user)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{s.user?.username ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{s.user?.email ?? "—"}</td>
                      <td className="px-6 py-4 text-slate-600">{s.program}</td>
                      <td className="px-6 py-4 text-slate-600">{s.semester}</td>
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

export default Members;
