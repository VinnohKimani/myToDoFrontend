import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils";
import { useAuth } from "../Components/context/AuthContext";

export default function AdminPage() {
  const { token, user } = useAuth(); // ✅ from context
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${BASE_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data.reverse());
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (token) fetchUsers();
  }, [token]);

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return toast.error("Task cannot be empty");

    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: newTask }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();
      setTasks((prev) => [data.task, ...prev]);
      setNewTask("");
      toast.success("✅ Task added successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  
  const ConfirmDelete = ({ userId, onConfirm, onCancel }) => (
    <div className="flex flex-col space-y-2">
      <p>Are you sure you want to delete this user?</p>
      <div className="flex space-x-2">
        <button
          onClick={() => onConfirm(userId)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Yes, delete
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const handleDeleteUser = (userId) => {
    toast.info(
      <ConfirmDelete
        userId={userId}
        onConfirm={async (id) => {
          try {
            const res = await fetch(`${BASE_URL}/users/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete user");
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.dismiss();
            toast.success(" User deleted successfully!");
          } catch (err) {
            toast.dismiss();
            toast.error(err.message);
          }
        }}
        onCancel={() => toast.dismiss()}
      />,
      { autoClose: false }
    );
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-10 px-4">
        {/* Add Task Form */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Task</h2>
          <form onSubmit={handleAddTask} className="flex space-x-2 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
              className="flex-1 px-3 py-2 border rounded text-black"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Add
            </button>
          </form>
        </section>

        {/* Tasks Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-blue-700">No tasks available.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-4 bg-white rounded shadow"
                >
                  <span
                    className={
                      task.completed ? "line-through text-gray-400" : ""
                    }
                  >
                    {task.task}
                  </span>
                  <span className="text-sm text-gray-500">
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Users Section */}
        <section>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Users</h2>
          {users.length === 0 ? (
            <p className="text-blue-700">No users found.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center p-4 bg-white rounded shadow"
                >
                  <div>
                    <p className="font-semibold">
                      {u.first_name} {u.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                  {u.id !== user?.id && (
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
