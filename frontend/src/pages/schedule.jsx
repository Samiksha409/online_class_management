import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { schedulesAPI, classesAPI, instructorsAPI } from "../services/api";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class_obj: "",
    instructor: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
    fetchInstructors();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await schedulesAPI.getAll();
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await instructorsAPI.getAll();
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        class_obj: parseInt(formData.class_obj),
        instructor: parseInt(formData.instructor),
      };
      if (editingId) {
        await schedulesAPI.update(editingId, data);
      } else {
        await schedulesAPI.create(data);
      }
      setFormData({ class_obj: "", instructor: "", start_time: "", end_time: "" });
      setShowForm(false);
      setEditingId(null);
      fetchSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await schedulesAPI.delete(id);
        fetchSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
      }
    }
  };

  const getClassName = (classId) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.class_name : "N/A";
  };

  const getInstructorName = (instructorId) => {
    const instructor = instructors.find((i) => i.id === instructorId);
    return instructor ? instructor.name : "N/A";
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData({ class_obj: "", instructor: "", start_time: "", end_time: "" });
                setEditingId(null);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Schedule"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-2 gap-4">
              <select
                name="class_obj"
                value={formData.class_obj}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
              <select
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {editingId ? "Update" : "Save"}
            </button>
          </form>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Class</th>
                  <th className="p-4 text-left">Instructor</th>
                  <th className="p-4 text-left">Start Time</th>
                  <th className="p-4 text-left">End Time</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{getClassName(schedule.class_obj)}</td>
                    <td className="p-4">{getInstructorName(schedule.instructor)}</td>
                    <td className="p-4">{new Date(schedule.start_time).toLocaleString()}</td>
                    <td className="p-4">{new Date(schedule.end_time).toLocaleString()}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedule;