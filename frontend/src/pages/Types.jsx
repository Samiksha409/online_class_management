import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { typesAPI } from "../services/api";

function Types() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type_name: "",
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await typesAPI.getAll();
      setTypes(response.data);
    } catch (error) {
      console.error("Error fetching types:", error);
    } finally {
      setLoading(false);
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
      if (editingId) {
        await typesAPI.update(editingId, formData);
      } else {
        await typesAPI.create(formData);
      }
      setFormData({ type_name: "" });
      setShowForm(false);
      setEditingId(null);
      fetchTypes();
    } catch (error) {
      console.error("Error saving type:", error);
    }
  };

  const handleEdit = (type) => {
    setFormData(type);
    setEditingId(type.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await typesAPI.delete(id);
        fetchTypes();
      } catch (error) {
        console.error("Error deleting type:", error);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Class Types</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setFormData({ type_name: "" });
                setEditingId(null);
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Type"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="type_name"
                placeholder="Type Name"
                value={formData.type_name}
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
                  <th className="p-4 text-left">Type Name</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{type.type_name}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(type)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
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

export default Types;
