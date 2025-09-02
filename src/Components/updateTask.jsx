import MarkTask from "./completeTask";
import DeleteTask from "./deleteTask";
import EditTask from "./editTask";

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  return (
    <li className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-md transition">
      {/* Left side: MarkTask + Task text */}
      <div className="flex items-center space-x-3">
        <MarkTask task={task} onTaskUpdated={onTaskUpdated} />
        <span
          className={`${
            task.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.task}
        </span>
      </div>

      {/* Right side: Edit + Delete */}
      <div className="flex items-center space-x-2">
        <EditTask task={task} onTaskUpdated={onTaskUpdated} />
        <DeleteTask task={task} onTaskDeleted={onTaskDeleted} />
      </div>
    </li>
  );
}
