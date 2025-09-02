import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils";
import AddTask from "../Components/addTask";
import TaskItem from "./updateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTasks();
    else {
      toast.error("You must log in first!");
      setLoading(false);
    }
  }, [token]);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]); // new task first
  };
  const handleTaskUpdated = (updated) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const handleTaskDeleted = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));
  if (loading) return <p className="text-center mt-6">Loading tasks...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6  bg-amber-200 shadow-lg rounded-2xl">
      <h1 className="text-2xl text-black font-bold mb-4 text-center">My Tasks</h1>
      <AddTask onTaskAdded={handleTaskAdded} />

      {tasks.length === 0 ? (
        <p className="text-black text-center">No tasks found</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
