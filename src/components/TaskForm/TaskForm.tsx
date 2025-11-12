import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Task, TaskFormData } from "../../types";
import { FieldErrors, toTask, validateTask } from "../../utils/taskUtils";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface TaskFormProps {
  nextOrder: number;
  onAdd: (t: Task) => void;
  editing?: Task | null;
  onSaveEdit?: (id: string, patch: Partial<Task>) => void;
  onCancelEdit?: () => void;
}

const EMPTY: TaskFormData = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};
function TaskForm({
  nextOrder,
  onAdd,
  editing = null,
  onSaveEdit,
  onCancelEdit,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormData>(EMPTY);

  useEffect(() => {
    if (!editing) {
      setValues(EMPTY);
      return;
    }
    setValues({
      title: editing.title,
      description: editing.description ?? "",
      priority: editing.priority,
      status: editing.status,
      dueDate: editing.dueDate?.slice(0, 10) || "",
    });
  }, [editing]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const isInvalid = useMemo(() => Boolean(errors.title), [errors]);

  function set<K extends keyof TaskFormData>(key: K, val: TaskFormData[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function handleBlurTitle() {
    const e = validateTask(values);
    setErrors((prev) => ({ ...prev, title: e.title || "" }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const vErrs = validateTask(values);
    setErrors(vErrs);
    if (Object.keys(vErrs).length) return;

    if (editing && onSaveEdit) {
      onSaveEdit(editing.id, {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        priority: values.priority,
        status: values.status,
        dueDate: values.dueDate || undefined,
      });
      onCancelEdit?.();
    } else {
      const t = toTask(values, nextOrder);
      onAdd(t);
      setValues(EMPTY);
    }
  }

  const titleId = "taskform-title";
  const descId = "taskform-desc";
  const titleErrId = "taskform-title-error";
  const descErrId = "taskform-desc-error";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4 grid gap-3"
    >
      <div>
        <label htmlFor={titleId} className="block text-sm font-medium">
          Title <span className="text-slate-400">(required)</span>
        </label>
        <div className="relative mt-1">
          <input
            id={titleId}
            className="w-full border rounded-lg px-3 py-2 pr-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            placeholder="e.g., Prepare sprint report"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={handleBlurTitle}
            aria-invalid={Boolean(errors.title) || undefined}
            aria-describedby={errors.title ? titleErrId : undefined}
          />
          {errors.title && (
            <ExclamationCircleIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-600" />
          )}
        </div>
        {errors.title && (
          <p id={titleErrId} role="alert" className="text-sm text-red-600 mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={descId} className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id={descId}
          rows={3}
          className="mt-1 w-full border rounded-lg px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          aria-describedby={errors.description ? descErrId : undefined}
        />
        {errors.description && (
          <p id={descErrId} role="alert" className="text-sm text-red-600 mt-1">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={values.priority}
            onChange={(e) =>
              set("priority", e.target.value as TaskFormData["priority"])
            }
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={values.status}
            onChange={(e) =>
              set("status", e.target.value as TaskFormData["status"])
            }
          >
            <option value="todo">to do</option>
            <option value="in_progress">in progress</option>
            <option value="done">done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={values.dueDate || ""}
            onChange={(e) => set("dueDate", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3 py-2 rounded-lg border"
          >
            Cancel
          </button>
        )}
        <button
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
          disabled={isInvalid}
        >
          {editing ? "Save" : "Add Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
