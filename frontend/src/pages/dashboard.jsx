import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authAPI, dashboardAPI } from "../services/api";
import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaTasks,
  FaGraduationCap,
  FaClipboardCheck,
  FaBell,
  FaCalendarAlt,
  FaChevronRight,
  FaClock,
  FaLayerGroup,
} from "react-icons/fa";

const emptySummary = {
  students: 0,
  teachers: 0,
  courses: 0,
  classes_today: 0,
  classes_total: 0,
  assignments: 0,
  submissions: 0,
  attendance_records: 0,
  study_materials_count: 0,
  latest_notices: [],
  upcoming_sessions: [],
  upcoming_assignments: [],
};

function Dashboard() {
  const [stats, setStats] = useState(emptySummary);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [summaryRes, profileRes] = await Promise.all([
          dashboardAPI.summary(),
          authAPI.profile(),
        ]);
        setStats({ ...emptySummary, ...summaryRes.data });
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Dashboard Error:", err.response?.data || err.message);
        setError("Failed to load dashboard. Check if the server is running.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayName =
    profile?.first_name?.trim() ||
    profile?.username ||
    "there";

  const roleLabel =
    profile?.role === "admin"
      ? "Administrator"
      : profile?.role === "teacher"
        ? "Teacher"
        : profile?.role === "student"
          ? "Student"
          : "User";

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
        <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Overview</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              <span className="hidden sm:inline">{roleLabel}</span>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                Live
              </span>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-6 py-8 pb-16">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Hero */}
          <section className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-indigo-500/20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div>
                <p className="text-sm font-medium text-indigo-100">
                  Online Class Management
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                  Welcome back, {displayName}
                </h2>
                <p className="mt-3 max-w-xl text-base text-indigo-100/95">
                  Track classes, assignments, notices, and attendance — all in
                  one place. Use the shortcuts below to jump into common tasks.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/classes"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-md transition hover:bg-indigo-50"
                  >
                    Manage classes <FaChevronRight className="text-xs opacity-70" />
                  </Link>
                  <Link
                    to="/types"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Courses
                  </Link>
                  <Link
                    to="/schedule"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    Schedule
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                  Snapshot
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-indigo-100">Courses</span>
                    <span className="font-semibold">
                      {loading ? "…" : stats.courses}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-indigo-100">Total class sessions</span>
                    <span className="font-semibold">
                      {loading ? "…" : stats.classes_total}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-indigo-100">Submissions received</span>
                    <span className="font-semibold">
                      {loading ? "…" : stats.submissions}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* KPI cards */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl bg-slate-200/80"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Students"
                value={stats.students}
                hint="Distinct enrollments"
                icon={<FaUsers className="text-xl" />}
                accent="bg-blue-500"
              />
              <StatCard
                title="Teachers"
                value={stats.teachers}
                hint="With assigned courses"
                icon={<FaChalkboardTeacher className="text-xl" />}
                accent="bg-violet-500"
              />
              <StatCard
                title="Classes today"
                value={stats.classes_today}
                hint="Sessions scheduled"
                icon={<FaCalendarAlt className="text-xl" />}
                accent="bg-emerald-500"
              />
              <StatCard
                title="Assignments"
                value={stats.assignments}
                hint="Across all courses"
                icon={<FaTasks className="text-xl" />}
                accent="bg-amber-500"
              />
              <StatCard
                title="Submissions"
                value={stats.submissions}
                hint="Student uploads"
                icon={<FaClipboardCheck className="text-xl" />}
                accent="bg-teal-500"
              />
              <StatCard
                title="Study materials"
                value={stats.study_materials_count}
                hint="Links & resources"
                icon={<FaBook className="text-xl" />}
                accent="bg-rose-500"
              />
              <StatCard
                title="Courses"
                value={stats.courses}
                hint="Active catalog"
                icon={<FaGraduationCap className="text-xl" />}
                accent="bg-sky-500"
              />
              <StatCard
                title="Attendance rows"
                value={stats.attendance_records}
                hint="Marked records"
                icon={<FaLayerGroup className="text-xl" />}
                accent="bg-indigo-500"
              />
            </div>
          )}

          {/* Two columns */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Notices */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <FaBell />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Notices & announcements
                    </h3>
                    <p className="text-sm text-slate-500">
                      Latest updates from admins and faculty
                    </p>
                  </div>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-slate-100">
                {(stats.latest_notices || []).length === 0 && !loading ? (
                  <li className="py-10 text-center text-sm text-slate-500">
                    No notices yet. Post one from admin or notices API.
                  </li>
                ) : (
                  (stats.latest_notices || []).map((n) => (
                    <li key={n.id} className="flex gap-4 py-4 first:pt-0">
                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">{n.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {n.content}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDateTime(n.posted_at)}
                          {n.course_name && (
                            <span className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                              {n.course_name}
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>

            {/* Upcoming sessions */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <FaClock />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Upcoming class sessions
                    </h3>
                    <p className="text-sm text-slate-500">
                      Next sessions on the calendar
                    </p>
                  </div>
                </div>
                <Link
                  to="/schedule"
                  className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-800 sm:inline"
                >
                  View schedule →
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {(stats.upcoming_sessions || []).length === 0 && !loading ? (
                  <li className="py-10 text-center text-sm text-slate-500">
                    No upcoming sessions. Add class sessions under Classes.
                  </li>
                ) : (
                  (stats.upcoming_sessions || []).map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {s.title}
                        </p>
                        <p className="text-slate-500">
                          {s.course_code} · {s.course_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-800">
                          {formatShortDate(s.scheduled_date)}
                        </p>
                        <p className="text-slate-500">
                          {s.start_time}–{s.end_time} · {s.room}
                        </p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>

          {/* Assignments row */}
          <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                  <FaTasks />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Upcoming assignment deadlines
                  </h3>
                  <p className="text-sm text-slate-500">
                    Stay ahead of due dates across courses
                  </p>
                </div>
              </div>
              <Link
                to="/classes"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Open classes →
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="py-3 pr-4">Assignment</th>
                    <th className="py-3 pr-4">Course</th>
                    <th className="py-3 pr-4">Due</th>
                    <th className="py-3">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.upcoming_assignments || []).length === 0 && !loading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-slate-500"
                      >
                        No upcoming deadlines. Create assignments from the API
                        or admin.
                      </td>
                    </tr>
                  ) : (
                    (stats.upcoming_assignments || []).map((a) => (
                      <tr
                        key={a.id}
                        className="border-b border-slate-50 last:border-0"
                      >
                        <td className="py-3 pr-4 font-medium text-slate-900">
                          {a.title}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {a.course_code}
                        </td>
                        <td className="py-3 pr-4 text-slate-600">
                          {formatDateTime(a.due_date)}
                        </td>
                        <td className="py-3 text-slate-600">{a.max_marks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick footer strip */}
          <section className="mt-10 grid gap-4 sm:grid-cols-3">
            <QuickTile
              to="/members"
              title="Students"
              subtitle="Roster & profiles"
            />
            <QuickTile
              to="/instructors"
              title="Teachers"
              subtitle="Faculty directory"
            />
            <QuickTile to="/types" title="Courses" subtitle="Programs & codes" />
          </section>
        </main>
    </div>
  );
}

function StatCard({ title, value, hint, icon, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-1 w-full ${accent} opacity-90`}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-slate-900">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          )}
        </div>
        <span className="rounded-xl bg-slate-50 p-3 text-slate-600 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
          {icon}
        </span>
      </div>
    </div>
  );
}

function QuickTile({ to, title, subtitle }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <FaChevronRight className="text-slate-400" />
    </Link>
  );
}

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatShortDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default Dashboard;
