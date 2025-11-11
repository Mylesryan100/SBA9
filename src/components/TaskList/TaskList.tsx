import { useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';
import type { Task, Priority, SortKey, SortDir } from '../../types';
import { applyFilters, toTask, validateTask } from '../../utils/taskUtils';

interface Props {
  tasks: Task[];
  onAdd: (t: Task) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onRemove: (id: string) => void;
}

type LocalFilters = {
  query: string;
  sortBy: SortKey;
  sortDir: SortDir;
  status: 'all' | Task['status'];
  priority: 'all' | Priority;
};

const initialFilters: LocalFilters = {
  query: '',
  sortBy: 'order',
  sortDir: 'asc',
  status: 'all',
  priority: 'all',
};

function TaskList({ tasks, onAdd, onUpdate, onRemove }: Props) {
  const [filters, setFilters] = useState<LocalFilters>(initialFilters);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [addError, setAddError] = useState('');
  const nextOrder = tasks.length ? Math.max(...tasks.map(t => t.order)) + 1 : 1;
  const list = useMemo(() => {

    return applyFilters(tasks, {
      query: filters.query,
      status: filters.status,
      priority: filters.priority,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    });
  }, [tasks, filters]);

  function handleAdd() {
    const candidate = {
      title: newTitle,
      description: '',
      priority: newPriority,
      status: 'todo' as const,
      dueDate: '',
    };
    const errs = validateTask(candidate);
    if (errs.title) {
      setAddError(errs.title);
      return;
    }
    setAddError('');
    onAdd(toTask(candidate, nextOrder));
    setNewTitle('');
    setNewPriority('medium');
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            className="w-full pl-10 border rounded-lg px-3 py-2"
            placeholder="Search title/description"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            aria-label="Search tasks"/>
        </div>

        <select
          className="border rounded-lg px-3 py-2"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as SortKey })}
          aria-label="Sort by"
        >
          <option value="order">Sort: Manual</option>
          <option value="createdAt">Sort: Created</option>
          <option value="dueDate">Sort: Due</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={filters.sortDir}
          onChange={(e) => setFilters({ ...filters, sortDir: e.target.value as SortDir })}
          aria-label="Sort direction"
          >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 bg-white dark:bg-slate-800 rounded-2xl shadow p-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium" htmlFor="quick-title">Quick add</label>
          <input
            id="quick-title"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="e.g., Prepare sprint report"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}/>
          {addError && <p role="alert" className="text-sm text-red-600 mt-1">{addError}</p>}
        </div>
        <div className="flex items-end gap-2">
          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Priority)}
            aria-label="New task priority">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-black text-white" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="text-slate-600">No tasks found.</p>
      ) : (
        <div className="grid gap-3">
          {list.map((t) => (
            <TaskItem
              key={t.id}          
              task={t}
              onUpdate={onUpdate}  
              onRemove={onRemove}  
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;