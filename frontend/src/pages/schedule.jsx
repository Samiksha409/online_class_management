import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { schedulesAPI, coursesAPI } from "../services/api";

function normalizeList(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.results)) return d.results;
  return [];
}

function Schedule() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const [sRes, cRes] = await Promise.all([
          schedulesAPI.getAll(),
          coursesAPI.getAll(),
        ]);
        setSessions(normalizeList(sRes));
        setCourses(normalizeList(cRes));
      } catch (e) {
        setError("Could not load timetable data.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));

  const sorted = [...sessions].sort((a, b) => {
    const da = (a.scheduled_date || "").localeCompare(b.scheduled_date || "");
    if (da !== 0) return da;
    return (a.start_time || "").localeCompare(b.start_time || "");
  });

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
      <PageHeader
        eyebrow="Calendar"
        title="Timetable"
        subtitle="Upcoming and scheduled class sessions from the ClassSession API — same data used for attendance."
        actions={
          <Link
            to="/classes"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            Manage sessions
          </Link>
        }
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading timetable…</div>
          ) : sorted.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No sessions scheduled. Add class sessions under{" "}
              <Link to="/classes" className="font-semibold text-indigo-600 hover:underline">
                Class sessions
              </Link>
              .
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Session</th>
                    <th className="px-6 py-3">Course</th>
                    <th className="px-6 py-3">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((s) => {
                    const c = courseById[s.course];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                          {s.scheduled_date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {s.start_time} – {s.end_time}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{s.title}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {c ? (
                            <span>
                              <span className="font-mono text-xs text-slate-500">{c.code}</span>{" "}
                              {c.name}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{s.room || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
