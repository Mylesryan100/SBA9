import type { Task } from "../../types";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ tasks }: TaskListProps) {
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
    onStatusChange(task.id, e.target.value);
  return (
    <div className="flex flex-col gap-2 text-xl bortder p-2 rounded-lg">
      <h3 className="font-bold">{tasks.title}</h3>
      <p>{tasks.description}</p>
      <p>Status: {tasks.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {task.dueDate}</p>
    </div>

    <select value={currentStatus} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
  

export default TaskItem;