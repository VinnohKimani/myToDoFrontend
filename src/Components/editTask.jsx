import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils";
import { Pencil, Check, X } from "lucide-react";

export default function EditTask({ task, onTaskUpdated }) {
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(task.task);

  const handleSave = async () => {
    if (!newName || newName === task.task) {
      setIsEditing(false);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: newName }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update task");

      onTaskUpdated(data.task); // update parent with new task
      toast.success("Task updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancel = () => {
    setNewName(task.task);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
            title="Save"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
            title="Cancel"
          >
            <X size={18} />
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800"
          title="Edit task"
        >
          <Pencil size={18} />
        </button>
      )}
    </div>
  );
}
