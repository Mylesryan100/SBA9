import type { Task } from "../../types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

function TaskList({ tasks }: TaskListProps) {
  return (
    <div className=" my-5">
      <h2 className="text-3xl my-5">Task List</h2>

      <div className="flex flex-col gap-5">
        {tasks.map((task) => (
          <TaskItem task={task} key={task.id}/>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(+d) ? iso : d.toLocaleDateString();
}

function isOverdue(task: Task) {
  const due = new Date(task.dueDate);
  return task.status !== "completed" && !Number.isNaN(+due) && due < new Date();
}

export default TaskList;