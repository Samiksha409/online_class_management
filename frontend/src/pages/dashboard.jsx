import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  membersAPI,
  classesAPI,
  instructorsAPI,
  schedulesAPI,
} from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    classes: 0,
    instructors: 0,
    schedules: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const getCount = (res) => {
    const data = res?.data;

    if (Array.isArray(data)) return data.length;
    if (Array.isArray(data?.results)) return data.results.length;

    return 0;
  };

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [m, c, i, s] = await Promise.all([
        membersAPI.getAll(),
        classesAPI.getAll(),
        instructorsAPI.getAll(),
        schedulesAPI.getAll(),
      ]);

      setStats({
        members: getCount(m),
        classes: getCount(c),
        instructors: getCount(i),
        schedules: getCount(s),
      });

    } catch (err) {
      console.error("Dashboard Error:", err.response?.data || err.message);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 p-8 w-full">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card title="Members" value={stats.members} color="text-blue-600" />
            <Card title="Classes" value={stats.classes} color="text-green-600" />
            <Card title="Instructors" value={stats.instructors} color="text-purple-600" />
            <Card title="Schedules" value={stats.schedules} color="text-orange-600" />

          </div>
        )}
      </div>
    </div>
  );
}

// ✅ reusable card component
function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className={`text-3xl mt-4 ${color}`}>{value}</p>
    </div>
  );
}

export default Dashboard;