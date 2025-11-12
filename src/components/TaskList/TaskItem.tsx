import { useState } from "react";
import type { Task, Status } from "../../types";
import { formatDate } from "../../utils/taskUtils";

const DEBUG = true;
const log = (...a: unknown[]) => DEBUG && console.log("[TaskItem]", ...a);

export interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onRemove?: (id: string) => void;
}

function TaskItem({ task, onUpdate, onRemove }: TaskItemProps) {
  const [currentStatus, setCurrentStatus] = useState<Status>(task.status);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const next = e.target.value as Status;
    setCurrentStatus(next);
    log("status change", { id: task.id, from: task.status, to: next });
    onUpdate(task.id, { status: next });
  };

  return (
    <div className="flex flex-col gap-3 text-base border p-3 rounded-lg bg-white dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{task.title}</h3>
        {onRemove && (
          <button
            className="text-sm px-2 py-1 rounded border hover:bg-red-50 text-red-600 border-red-200"
            onClick={() => {
              log("remove clicked", task.id);
              onRemove(task.id);
            }}
          >
            Delete
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-slate-600 dark:text-slate-300">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1">
          <span className="text-slate-500">Priority:</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
            {task.priority}
          </span>
        </span>

        <span className="inline-flex items-center gap-1">
          <span className="text-slate-500">Due:</span>
          <span>{formatDate(task.dueDate)}</span>
        </span>

        <label className="inline-flex items-center gap-2 ml-auto">
          <span className="text-slate-500">Status:</span>
          <select
            className="border rounded px-2 py-1"
            value={currentStatus}
            onChange={handleChange}
            aria-label="Change task status"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default TaskItem;