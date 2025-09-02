import { toast } from "react-toastify";
import { BASE_URL } from "../utils";
import { Trash2 } from "lucide-react";

export default function DeleteTask({ task, onTaskDeleted }) {
  const token = localStorage.getItem("token");

  const deleteTask = async () => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");
      onTaskDeleted(task.id); // ✅ update parent state to remove task
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete?</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => {
                deleteTask();
                closeToast();
              }}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              No
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <button
      onClick={confirmDelete}
      className="text-red-600 hover:text-red-800"
      title="Delete task"
    >
      <Trash2 size={20} />
    </button>
  );
}
