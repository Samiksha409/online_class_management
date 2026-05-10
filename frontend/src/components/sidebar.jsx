import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaCalendar,
  FaTags,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/');
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed">

      <div className="p-5 border-b">

        <h1 className="text-2xl font-bold text-blue-600">
          CMS
        </h1>

      </div>

      <div className="flex flex-col p-5 gap-5">

        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          📊 Dashboard
        </Link>

        <Link
          to="/members"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          <FaUsers />
          Members
        </Link>

        <Link
          to="/classes"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          <FaBook />
          Classes
        </Link>

        <Link
          to="/types"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          <FaTags />
          Types
        </Link>

        <Link
          to="/instructors"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          <FaChalkboardTeacher />
          Instructors
        </Link>

        <Link
          to="/schedule"
          className="flex items-center gap-3 hover:text-blue-600 cursor-pointer transition"
        >
          <FaCalendar />
          Schedule
        </Link>

      </div>

      <div className="absolute bottom-5 left-5 w-56">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;