import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { classesAPI, typesAPI } from "../services/api";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    class_name: "",
    type: "",
    duration_mins: "",
  });

  useEffect(() => {
    fetchClasses();
    fetchTypes();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await classesAPI.getAll();
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await typesAPI.getAll();
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
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
        type: parseInt(formData.type),
        duration_mins: parseInt(formData.duration_mins),
      };
      if (editingId) {
        await classesAPI.update(editingId, data);
      } else {
        await classesAPI.create(data);
      }
      setFormData({ class_name: "", type: "", duration_mins: "" });
      setShowForm(false);
      setEditingId(null);
      fetchClasses();
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  const handleEdit = (cls) => {
    setFormData(cls);
    setEditingId(cls.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await classesAPI.delete(id);
        fetchClasses();
      } catch (error) {
        console.error("Error deleting class:", error);
      }
    }
  };

  const getTypeName = (typeId) => {
    const type = types.find((t) => t.id === typeId);
    return type ? type.type_name : "N/A";
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Classes</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData({ class_name: "", type: "", duration_mins: "" });
                setEditingId(null);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Class"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="class_name"
                placeholder="Class Name"
                value={formData.class_name}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.type_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="duration_mins"
                placeholder="Duration (mins)"
                value={formData.duration_mins}
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
                  <th className="p-4 text-left">Class Name</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Duration (mins)</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{cls.class_name}</td>
                    <td className="p-4">{getTypeName(cls.type)}</td>
                    <td className="p-4">{cls.duration_mins}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(cls)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
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

export default Classes;