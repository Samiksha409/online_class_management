import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { typesAPI } from "../services/api";

const emptyForm = { name: "", code: "", description: "" };

function Types() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await typesAPI.getAll();
      setCourses(response.data?.results || response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await typesAPI.update(editingId, formData);
      } else {
        await typesAPI.create(formData);
      }
      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      name: row.name || "",
      code: row.code || "",
      description: row.description || "",
    });
    setEditingId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? Linked sessions may be affected.")) return;
    try {
      await typesAPI.delete(id);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-slate-100">
      <PageHeader
        eyebrow="Catalog"
        title="Courses"
        subtitle="Course master data: unique codes, titles, and descriptions — used when scheduling class sessions."
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
            {showForm ? "Close form" : "Add course"}
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
              {editingId ? "Edit course" : "New course"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="name"
                placeholder="Course name *"
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <input
                type="text"
                name="code"
                placeholder="Course code * (e.g. CS301)"
                value={formData.code}
                onChange={handleChange}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-mono outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleChange}
                className="sm:col-span-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <button
              type="submit"
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {editingId ? "Save changes" : "Create course"}
            </button>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">Loading catalog…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                        No courses yet. Add your first course above.
                      </td>
                    </tr>
                  ) : (
                    courses.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-semibold text-indigo-700">
                          {c.code}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{c.name}</td>
                        <td className="max-w-md truncate px-6 py-4 text-slate-600">
                          {c.description || "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleEdit(c)}
                            className="mr-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
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

export default Types;
