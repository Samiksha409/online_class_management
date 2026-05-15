import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { classesAPI, coursesAPI } from "../services/api";

const emptyForm = {
  title: "",
  course: "",
  scheduled_date: "",
  start_time: "",
  end_time: "",
  room: "",
};

function Classes() {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data?.results || response.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data?.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, course: Number(formData.course) };
      if (editingId) {
        await classesAPI.update(editingId, data);
      } else {
        await classesAPI.create(data);
      }
      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const handleEdit = (cls) => {
    setFormData({
      title: cls.title || "",
      course: cls.course || "",
      scheduled_date: cls.scheduled_date || "",
      start_time: cls.start_time || "",
      end_time: cls.end_time || "",
      room: cls.room || "",
    });
    setEditingId(cls.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class session?")) return;
    try {
      await classesAPI.delete(id);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? `${course.code} · ${course.name}` : "—";
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
      <PageHeader
        eyebrow="Operations"
        title="Class sessions"
        subtitle="Schedule teaching blocks: link each session to a course, set date, time window, and optional room."
        actions={
          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData(emptyForm);
                setEditingId(null);
              }
            }}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
          >
            {showForm ? "Close form" : "Add session"}
          </button>
        }
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
          >
            <p className="mb-4 text-sm font-medium text-slate-700">
              {editingId ? "Edit session" : "New session"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="text"
                name="title"
                placeholder="Session title *"
                value={formData.title}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-indigo-500/0 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              >
                <option value="">Select course *</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} — {course.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="scheduled_date"
                value={formData.scheduled_date}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <input
                type="text"
                name="room"
                placeholder="Room / link (optional)"
                value={formData.room}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              type="submit"
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {editingId ? "Save changes" : "Create session"}
            </button>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading sessions…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Session</th>
                    <th className="px-6 py-3">Course</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No sessions yet. Create a course first, then add a session.
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls) => (
                      <tr key={cls.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 font-medium text-slate-900">{cls.title}</td>
                        <td className="px-6 py-4 text-slate-600">{getCourseName(cls.course)}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {cls.scheduled_date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {cls.start_time} – {cls.end_time}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleEdit(cls)}
                            className="mr-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cls.id)}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classes;
