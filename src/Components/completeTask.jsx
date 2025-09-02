import { toast } from "react-toastify";
import { BASE_URL } from "../utils";
import { CheckSquare, Square } from "lucide-react";

export default function MarkTask({ task, onTaskUpdated }) {
  const token = localStorage.getItem("token");

  const markComplete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updatedData = await res.json();
      if (!res.ok)
        throw new Error(updatedData.message || "Failed to update task");
      onTaskUpdated(updatedData.task);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={markComplete}
        className="text-red-600 hover:text-blue-800"
        title="Toggle complete"
      >
        {/* <CheckSquare size={18} /> */}
        {task.completed ? (
          <CheckSquare size={20} className="text-blue-600" />
        ) : (
          <Square size={20} /> 
        )}
      </button>
    </div>
  );
}
