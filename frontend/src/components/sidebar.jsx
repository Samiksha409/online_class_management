import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaCalendar,
  FaTags,
  FaSignOutAlt,
  FaThLarge,
} from "react-icons/fa";

const linkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-indigo-50 text-indigo-700 shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("ocms:auth"));
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-slate-100 bg-white shadow-lg shadow-slate-200/40">
      <div className="border-b border-slate-100 px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-500">
          ClassHub
        </p>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
          Class Management
        </h1>
        <p className="mt-1 text-xs leading-snug text-slate-500">
          Courses, attendance & assignments
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main
        </p>
        <NavLink to="/dashboard" className={linkClass} end>
          <FaThLarge className="opacity-80" />
          Dashboard
        </NavLink>
        <NavLink to="/members" className={linkClass}>
          <FaUsers className="opacity-80" />
          Students
        </NavLink>
        <NavLink to="/instructors" className={linkClass}>
          <FaChalkboardTeacher className="opacity-80" />
          Teachers
        </NavLink>
        <NavLink to="/types" className={linkClass}>
          <FaTags className="opacity-80" />
          Courses
        </NavLink>
        <NavLink to="/classes" className={linkClass}>
          <FaBook className="opacity-80" />
          Class sessions
        </NavLink>
        <NavLink to="/schedule" className={linkClass}>
          <FaCalendar className="opacity-80" />
          Timetable
        </NavLink>
      </nav>

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <FaSignOutAlt />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
