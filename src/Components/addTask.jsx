import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils";

export default function AddTask({ onTaskAdded }) {
  const [task, setTask] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return toast.error("Task cannot be empty");

    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json(); // full backend response
      const newTask = data.task || data; // extract if nested under 'task'
      onTaskAdded(newTask);

      setTask("");
      toast.success("Task added successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-6">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a new task..."
        className="flex-grow px-3 py-2 border border-blue-600 rounded-lg"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 shadow"
      >
        Add
      </button>
    </form>
  );
}
